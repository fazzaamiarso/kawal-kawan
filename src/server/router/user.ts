import { twilioCheckVerification, twilioCreateVerification } from "@/lib/twilio";
import { z } from "zod";
import { createRouter } from "./context";
import Iron from "@hapi/iron";
import bcrypt from "bcrypt";
import { env } from "env/server.mjs";
import { setTokenCookie } from "@/lib/cookie";

const generateAvatar = (seed: string) => {
  return `https://avatars.dicebear.com/api/big-smile/${seed}.svg`;
};

export const userRouter = createRouter()
  .mutation("signup", {
    input: z.object({
      name: z.string(),
      username: z.string(),
      password: z.string(),
      phoneNumber: z.string(),
      verificationCode: z.string(),
    }),
    async resolve({ ctx, input }) {
      await twilioCheckVerification(input);

      const salt = await bcrypt.genSalt(7);
      const hashedPassword = await bcrypt.hash(input.password, salt);

      const user = await ctx.prisma.user.create({
        data: {
          passwordHash: hashedPassword,
          username: input.username,
          name: input.name,
          avatarUrl: generateAvatar(input.username),
        },
      });

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
    async resolve({ ctx, input }) {
      const authToken = ctx.req.cookies["auth_token"];
      if (!authToken) return { user: null };

      const user = (await Iron.unseal(authToken, env.AUTH_SECRET, Iron.defaults)) as {
        user: { id: string };
      };

      return user;
    },
  });
