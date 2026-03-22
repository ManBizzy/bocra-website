import type { Express, Request, Response } from "express";
import { createClient } from "@supabase/supabase-js";
import { ENV } from "./env";
import { getSessionCookieOptions } from "./cookies";
import { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";
import { SignJWT, jwtVerify } from "jose";

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey =
  process.env.SUPABASE_SECRET_KEY ?? process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabasePublishableKey =
  process.env.VITE_SUPABASE_PUBLISHABLE_KEY ??
  process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error(
    "Missing Supabase configuration: VITE_SUPABASE_URL and SUPABASE_SECRET_KEY or SUPABASE_SERVICE_ROLE_KEY required"
  );
}

export const supabase = createClient(supabaseUrl!, supabaseServiceKey!, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
    detectSessionInUrl: false,
  },
});

function createSupabaseAuthClient() {
  const authClientKey = supabasePublishableKey ?? supabaseServiceKey;

  return createClient(
    supabaseUrl!,
    authClientKey!,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
      },
    }
  );
}

export type AuthenticatedUser = {
  id: string;
  email: string;
  name: string;
  role: "citizen" | "admin";
};

const isNonEmptyString = (value: unknown): value is string =>
  typeof value === "string" && value.length > 0;

const jwtSecret = new TextEncoder().encode(ENV.cookieSecret);

const normalizeName = (email: string | undefined, name: unknown) => {
  if (isNonEmptyString(name)) {
    return name;
  }

  if (isNonEmptyString(email)) {
    return email.split("@")[0] ?? "User";
  }

  return "User";
};

const normalizeRole = (role: unknown): AuthenticatedUser["role"] =>
  role === "admin" ? "admin" : "citizen";

async function upsertProfile(userId: string, email: string, name: string) {
  const { error } = await supabase.from("profiles").upsert(
    {
      user_id: userId,
      email,
      full_name: name,
    },
    {
      onConflict: "user_id",
    }
  );

  if (error) {
    console.error("Failed to upsert profile:", error);
  }
}

async function getProfile(userId: string) {
  const { data, error } = await supabase
    .from("profiles")
    .select("full_name, role")
    .eq("user_id", userId)
    .maybeSingle();

  if (error) {
    console.error("Error fetching profile:", error);
    return null;
  }

  return data;
}

/**
 * Create a session token for a user
 */
export async function createSupabaseSessionToken(
  userId: string,
  userData: { email?: string; name?: string }
) {
  const sessionToken = await new SignJWT({
    userId,
    email: userData.email,
    name: userData.name,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("7d")
    .sign(jwtSecret);

  return sessionToken;
}

/**
 * Verify and parse a session token
 */
export async function verifySupabaseSessionToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, jwtSecret, {
      algorithms: ["HS256"],
    });
    return payload as { userId: string; email?: string; name?: string };
  } catch (error) {
    console.error("Token verification failed:", error);
    return null;
  }
}

/**
 * Get user from Supabase by ID
 */
export async function getSupabaseUser(
  userId: string
): Promise<AuthenticatedUser | null> {
  try {
    const { data, error } = await supabase.auth.admin.getUserById(userId);

    if (error) {
      console.error("Error fetching user:", error);
      return null;
    }

    if (!data.user) {
      return null;
    }

    const profile = await getProfile(userId);
    const email = data.user.email ?? "";
    const metadataName = data.user.user_metadata?.name;

    return {
      id: data.user.id,
      email,
      name: normalizeName(email, profile?.full_name ?? metadataName),
      role: normalizeRole(profile?.role),
    };
  } catch (error) {
    console.error("Error in getSupabaseUser:", error);
    return null;
  }
}

export async function getAuthenticatedUserFromRequest(
  req: Pick<Request, "cookies">
) {
  const token = req.cookies?.[COOKIE_NAME];

  if (!isNonEmptyString(token)) {
    return null;
  }

  const payload = await verifySupabaseSessionToken(token);

  if (!payload?.userId) {
    return null;
  }

  return getSupabaseUser(payload.userId);
}

/**
 * Register auth routes for Supabase
 */
export function registerSupabaseAuthRoutes(app: Express) {
  // Signup endpoint
  app.post("/api/auth/signup", async (req: Request, res: Response) => {
    try {
      const { email, password, name } = req.body;

      if (!isNonEmptyString(email) || !isNonEmptyString(password)) {
        res.status(400).json({ error: "Email and password required" });
        return;
      }

      const { data, error } = await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: {
          name: name || email.split("@")[0],
        },
      });

      if (error) {
        console.error("Signup error:", error);
        res.status(400).json({ error: error.message });
        return;
      }

      if (data.user) {
        await upsertProfile(
          data.user.id,
          email,
          normalizeName(email, name ?? data.user.user_metadata?.name)
        );
      }

      const authClient = createSupabaseAuthClient();
      const loginResult = await authClient.auth.signInWithPassword({
        email,
        password,
      });

      if (loginResult.error || !loginResult.data.user) {
        res.status(201).json({
          success: true,
          message: "Account created. Sign in with your new credentials.",
        });
        return;
      }

      const sessionToken = await createSupabaseSessionToken(
        loginResult.data.user.id,
        {
          email: loginResult.data.user.email,
          name: normalizeName(
            loginResult.data.user.email,
            loginResult.data.user.user_metadata?.name
          ),
        }
      );

      const cookieOptions = getSessionCookieOptions(req);
      res.cookie(COOKIE_NAME, sessionToken, {
        ...cookieOptions,
        maxAge: ONE_YEAR_MS,
      });

      res.json({ success: true, user: loginResult.data.user });
    } catch (error) {
      console.error("Signup failed:", error);
      res.status(500).json({ error: "Signup failed" });
    }
  });

  // Login endpoint
  app.post("/api/auth/login", async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;

      if (!isNonEmptyString(email) || !isNonEmptyString(password)) {
        res.status(400).json({ error: "Email and password required" });
        return;
      }

      const authClient = createSupabaseAuthClient();
      const { data, error } = await authClient.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error("Login error:", error);
        res.status(401).json({ error: "Invalid credentials" });
        return;
      }

      if (!data.user) {
        res.status(401).json({ error: "Login failed" });
        return;
      }

      await upsertProfile(
        data.user.id,
        data.user.email ?? email,
        normalizeName(data.user.email, data.user.user_metadata?.name)
      );

      const sessionToken = await createSupabaseSessionToken(data.user.id, {
        email: data.user.email,
        name: normalizeName(data.user.email, data.user.user_metadata?.name),
      });

      const cookieOptions = getSessionCookieOptions(req);
      res.cookie(COOKIE_NAME, sessionToken, {
        ...cookieOptions,
        maxAge: ONE_YEAR_MS,
      });

      res.json({ success: true, user: data.user });
    } catch (error) {
      console.error("Login failed:", error);
      res.status(500).json({ error: "Login failed" });
    }
  });

  // Logout endpoint
  app.post("/api/auth/logout", async (req: Request, res: Response) => {
    try {
      const cookieOptions = getSessionCookieOptions(req);
      res.clearCookie(COOKIE_NAME, {
        ...cookieOptions,
        maxAge: -1,
      });
      res.json({ success: true });
    } catch (error) {
      console.error("Logout failed:", error);
      res.status(500).json({ error: "Logout failed" });
    }
  });

  // Get current user endpoint
  app.get("/api/auth/me", async (req: Request, res: Response) => {
    try {
      const user = await getAuthenticatedUserFromRequest(req);

      if (!user) {
        res.status(401).json({ error: "User not found" });
        return;
      }

      res.json(user);
    } catch (error) {
      console.error("Get user failed:", error);
      res.status(500).json({ error: "Failed to get user" });
    }
  });
}
