import { createRouter } from "./context";
import { z } from "zod";

export const postRouter = createRouter()
  .query("hello", {
    input: z
      .object({
        text: z.string().nullish(),
      })
      .nullish(),
    resolve({ input }) {
      return {
        greeting: `Hello ${input?.text ?? "world"}`,
      };
    },
  })
  .query("all", {
    async resolve({ ctx }) {
      const posts = await ctx.prisma.post.findMany({
        include: {
          User: true,
        },
      });
      return { posts };
    },
  });
