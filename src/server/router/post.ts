import { createRouter } from "./context";
import { z } from "zod";
import { Points } from "data/points";

export const postRouter = createRouter()
  .query("all", {
    async resolve({ ctx }) {
      const posts = await ctx.prisma.post.findMany({
        include: {
          User: true,
          _count: { select: { Comment: true } },
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
  })
  .mutation("new", {
    input: z.object({
      title: z.string(),
      problem: z.string(),
    }),
    async resolve({ input, ctx }) {
      await ctx.prisma.user.update({
        where: { id: ctx.user?.id },
        data: { confidencePoint: { increment: Points.Posting } },
      });
      await ctx.prisma.post.create({
        data: { ...input, userId: ctx.user?.id as string },
      });
    },
  });
