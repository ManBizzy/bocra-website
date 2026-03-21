import type { Express, Request, Response } from "express";
import { createClient } from "@supabase/supabase-js";
import { ENV } from "./env";
import { getSessionCookieOptions } from "./cookies";
import { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";
import * as db from "../db";
import { SignJWT } from "jose";

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Lazily create Supabase client - will error when actually used if config missing
let supabaseClient: ReturnType<typeof createClient> | null = null;

function getSupabaseClient() {
  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error(
      "Missing Supabase configuration: VITE_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY required"
    );
  }
  if (!supabaseClient) {
    supabaseClient = createClient(supabaseUrl, supabaseServiceKey);
  }
  return supabaseClient;
}

export const supabase = new Proxy({} as any, {
  get: (target, prop) => {
    const client = getSupabaseClient();
    return (client as any)[prop];
  },
});

const isNonEmptyString = (value: unknown): value is string =>
  typeof value === "string" && value.length > 0;

const jwtSecret = new TextEncoder().encode(ENV.cookieSecret);

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
    const { jwtVerify } = await import("jose");
    const { payload } = await jwtVerify(token, jwtSecret);
    return payload as { userId: string; email?: string; name?: string };
  } catch (error) {
    console.error("Token verification failed:", error);
    return null;
  }
}

/**
 * Get user from Supabase by ID
 */
export async function getSupabaseUser(userId: string) {
  try {
    const { data, error } = await supabase.auth.admin.getUserById(userId);

    if (error) {
      console.error("Error fetching user:", error);
      return null;
    }

    return data.user;
  } catch (error) {
    console.error("Error in getSupabaseUser:", error);
    return null;
  }
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

      // Upsert user in database
      if (data.user) {
        await db.upsertUser({
          openId: data.user.id,
          name: name || undefined,
          email: email,
          loginMethod: "email",
          lastSignedIn: new Date(),
        });
      }

      res.json({ success: true, user: data.user });
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

      const { data, error } = await supabase.auth.signInWithPassword({
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

      // Update last signed in
      await db.upsertUser({
        openId: data.user.id,
        email: data.user.email,
        name: data.user.user_metadata?.name,
        loginMethod: "email",
        lastSignedIn: new Date(),
      });

      // Create session token
      const sessionToken = await createSupabaseSessionToken(data.user.id, {
        email: data.user.email,
        name: data.user.user_metadata?.name,
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
      res.clearCookie(COOKIE_NAME);
      res.json({ success: true });
    } catch (error) {
      console.error("Logout failed:", error);
      res.status(500).json({ error: "Logout failed" });
    }
  });

  // Get current user endpoint
  app.get("/api/auth/me", async (req: Request, res: Response) => {
    try {
      const token = req.cookies[COOKIE_NAME];

      if (!token) {
        res.status(401).json({ error: "Not authenticated" });
        return;
      }

      const payload = await verifySupabaseSessionToken(token);

      if (!payload) {
        res.status(401).json({ error: "Invalid token" });
        return;
      }

      const user = await getSupabaseUser(payload.userId);

      if (!user) {
        res.status(401).json({ error: "User not found" });
        return;
      }

      res.json({
        id: user.id,
        email: user.email,
        name: user.user_metadata?.name,
      });
    } catch (error) {
      console.error("Get user failed:", error);
      res.status(500).json({ error: "Failed to get user" });
    }
  });
}
