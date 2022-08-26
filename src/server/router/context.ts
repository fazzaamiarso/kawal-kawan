// src/server/router/context.ts
import * as trpc from "@trpc/server";
import * as trpcNext from "@trpc/server/adapters/next";
import { prisma } from "../db/client";
import Iron from "@hapi/iron";
import { env } from "env/server.mjs";
import { User } from "@prisma/client";
/**
 * Replace this with an object if you want to pass things to createContextInner
 */
type CreateContextOptions = Record<string, never>;

/** Use this helper for:
 * - testing, where we dont have to Mock Next.js' req/res
 * - trpc's `createSSGHelpers` where we don't have req/res
 **/
export const createContextInner = async (opts: CreateContextOptions) => {
  return {
    prisma,
  };
};

/**
 * This is the actual context you'll use in your router
 * @link https://trpc.io/docs/context
 **/
export const createContext = async (opts: trpcNext.CreateNextContextOptions) => {
  const req = opts.req;
  const res = opts.res;

  let user;
  const authToken = req.cookies["auth_token"];
  if (!authToken) {
    user = null;
  } else {
    user = (await Iron.unseal(authToken, env.AUTH_SECRET, Iron.defaults)) as User;
  }

  const innerCtx = await createContextInner({});
  return { ...innerCtx, req, res, user };
};

type Context = trpc.inferAsyncReturnType<typeof createContext>;

export const createRouter = () => trpc.router<Context>();
