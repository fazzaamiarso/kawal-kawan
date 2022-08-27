import { twilioCheckVerification, twilioCreateVerification } from "@/lib/twilio";
import { z } from "zod";
import { createRouter } from "./context";
import Iron from "@hapi/iron";
import { env } from "env/server.mjs";
import { setTokenCookie } from "@/lib/cookie";
import { hashPassword, verifyPassword } from "@/lib/bcrypt";

const generateAvatar = (seed: string) => {
  return `https://avatars.dicebear.com/api/big-smile/${seed}.svg`;
};

export const userRouter = createRouter()
  .mutation("signin", {
    input: z.object({
      username: z.string(),
      password: z.string(),
    }),
    async resolve({ ctx, input }) {
      const user = await ctx.prisma.user.findFirst({
        where: { username: input.username },
      });
      if (!user?.passwordHash) throw Error("Unauthorized");
      console.log(user);

      const isVerified = await verifyPassword(input.password, user?.passwordHash);
      if (!isVerified) throw Error("Unauthorized");

      const token = await Iron.seal(user, env.AUTH_SECRET, Iron.defaults);
      setTokenCookie(ctx.res, token);
    },
  })
  .mutation("signup", {
    input: z.object({
      name: z.string(),
      username: z.string(),
      password: z.string(),
      phoneNumber: z.string(),
      verificationCode: z.string(),
    }),
    async resolve({ ctx, input }) {
      const passwordHash = await hashPassword(input.password);
      await twilioCheckVerification(input);

      const user = await ctx.prisma.user.create({
        data: {
          passwordHash,
          username: input.username,
          name: input.name,
          avatarUrl: generateAvatar(input.username),
        },
      });
      if (!user) throw Error("Signup failed exist!");
      const token = await Iron.seal(user, env.AUTH_SECRET, Iron.defaults);
      setTokenCookie(ctx.res, token);
    },
  })
  .mutation("verify", {
    input: z.object({
      phoneNumber: z.string(),
    }),
    async resolve({ input }) {
      await twilioCreateVerification(input);
    },
  })
  .query("user", {
    async resolve({ ctx }) {
      const user = ctx.user;
      return { user };
    },
  })
  .query("leaderboard", {
    async resolve({ ctx }) {
      const topTenUsers = await ctx.prisma.user.findMany({
        take: 10,
        orderBy: { confidencePoint: "desc" },
      });
      return topTenUsers;
    },
  })
  .query("points", {
    async resolve({ ctx }) {
      const user = await ctx.prisma.user.findFirst({
        where: { id: ctx.user?.id },
        select: { confidencePoint: true },
      });
      if (!user) throw Error(`No user found! Which should exist.`);
      return user.confidencePoint;
    },
  });
