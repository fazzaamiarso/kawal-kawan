import { createRouter } from "./context";
import { z } from "zod";

export const postRouter = createRouter()
  .query("all", {
    async resolve({ ctx }) {
      const posts = await ctx.prisma.post.findMany({
        include: {
          User: true,
        },
      });
      return posts;
    },
  })
  .query("detail", {
    input: z.object({
      id: z.string(),
    }),
    resolve({ ctx, input }) {
      const details = ctx.prisma.post.findUnique({
        where: { id: input.id },
        include: { User: true },
      });
      return details;
    },
  });
