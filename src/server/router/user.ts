import { twilioCheckVerification, twilioCreateVerification } from "@/lib/twilio";
import { z } from "zod";
import { createRouter } from "./context";
import Iron from "@hapi/iron";
import { env } from "env/server.mjs";
import { setTokenCookie } from "@/lib/cookie";
import { hashPassword } from "@/lib/bcrypt";

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
  });
