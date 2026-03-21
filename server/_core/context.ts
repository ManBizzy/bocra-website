import type { CreateExpressContextOptions } from "@trpc/server/adapters/express";
import type { AuthenticatedUser } from "./supabase-auth";
import { getAuthenticatedUserFromRequest } from "./supabase-auth";

export type TrpcContext = {
  req: CreateExpressContextOptions["req"];
  res: CreateExpressContextOptions["res"];
  user: AuthenticatedUser | null;
};

export async function createContext(
  opts: CreateExpressContextOptions
): Promise<TrpcContext> {
  let user: AuthenticatedUser | null = null;

  try {
    user = await getAuthenticatedUserFromRequest(opts.req);
  } catch (error) {
    // Authentication is optional for public procedures.
    user = null;
  }

  return {
    req: opts.req,
    res: opts.res,
    user,
  };
}
