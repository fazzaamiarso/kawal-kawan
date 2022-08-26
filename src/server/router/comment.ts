import { Reactions } from "@prisma/client";
import { Points } from "data/points";
import { z } from "zod";
import { createRouter } from "./context";

export const commentRouter = createRouter()
  .query("all", {
    async resolve({ ctx }) {
      const comments = await ctx.prisma.comment.findMany({
        include: {
          User: true,
        },
      });
      return comments;
    },
  })
  .mutation("new", {
    input: z.object({
      reaction: z.nativeEnum(Reactions),
      content: z.string(),
      userId: z.string(),
      postId: z.string(),
    }),
    async resolve({ ctx, input }) {
      await ctx.prisma.comment.create({
        data: input,
      });
      await ctx.prisma.user.update({
        where: { id: input.userId },
        data: { confidencePoint: { increment: Points.Supporting } },
      });
    },
  });
