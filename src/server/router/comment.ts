import { createRouter } from "./context";

export const commentRouter = createRouter().query("all", {
  async resolve({ ctx }) {
    const comments = await ctx.prisma.comment.findMany({
      include: {
        User: true,
      },
    });
    return comments;
  },
});
