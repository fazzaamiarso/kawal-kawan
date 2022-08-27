import { Reactions } from "@prisma/client";
import dayjs from "dayjs";
import { NextPage } from "next";
import Image from "next/image";
import { useRouter } from "next/router";
import { SubmitHandler, useForm } from "react-hook-form";
import { trpc } from "@/utils/trpc";
import { NextSeo } from "next-seo";

const reactions: { name: string; key: Reactions }[] = [
  { key: "RELATABLE", name: "✋ Relatable" },
  { key: "KEEP_GOING", name: "🔥 Keep going!" },
  { key: "GREAT_JOB", name: "👍 Great job!" },
];

type FormValues = {
  content: string;
  reaction: Reactions;
};

const PostDetail: NextPage = () => {
  const router = useRouter();
  const { id } = router.query;
  if (typeof id !== "string") return null;

  const { data } = trpc.useQuery(["post.detail", { id: id as string }]);
  const { data: comments } = trpc.useQuery(["comment.all", { postId: id as string }]);

  return (
    <>
      <NextSeo title={`${data?.title}`} />
      <main className='layout space-y-8'>
        {data && (
          <div className='w-full'>
            <h1 className='text-3xl font-bold '>{data.title}</h1>
            <div className='item-start flex'>
              <Image src={data.User.avatarUrl} alt={data.User.name} width='50' height='50' />
              <span>
                {data.User.name} - {data.User.confidencePoint}
              </span>
            </div>
            <p>{data.problem}</p>
          </div>
        )}
        <div>
          <h2 className='text-2xl'>Give support to {data?.User.name}</h2>
          <SupportForm postId={id} />
        </div>
        {comments && comments.length > 0 ? (
          <ul className='space-y-4'>
            {comments.map(comment => {
              return (
                <li key={comment.id} className='rounded-md bg-gray-200  p-4'>
                  <div className='mb-6 flex items-center gap-4'>
                    <Image
                      src={comment.User.avatarUrl}
                      alt={comment.User.name}
                      width='40'
                      height='40'
                    />
                    <div className='flex flex-col items-start'>
                      <span className='text-sm'>
                        {comment.User.name} - {comment.User.confidencePoint}
                      </span>

                      <span className='text-xs'>
                        posted at {dayjs(comment.createdAt).toString()}
                      </span>
                    </div>
                  </div>
                  <span className='rounded-md text-xs  ring-1 ring-black'>{comment.reaction}</span>
                  <p>{comment.content}</p>
                </li>
              );
            })}
          </ul>
        ) : (
          <p>No Support yet!</p>
        )}
      </main>
    </>
  );
};

export default PostDetail;

const SupportForm = ({ postId }: { postId: string }) => {
  const utils = trpc.useContext();
  const mutation = trpc.useMutation("comment.new");
  const { register, handleSubmit, reset } = useForm<FormValues>({
    defaultValues: {
      reaction: "RELATABLE",
    },
  });
  const onSubmit: SubmitHandler<FormValues> = data => {
    if (mutation.isLoading) return;
    mutation.mutate(
      { ...data, postId },
      {
        onSuccess: () => {
          utils.invalidateQueries("comment.all");
          reset();
        },
      },
    );
  };

  return (
    <form className='w-full space-y-4' onSubmit={handleSubmit(onSubmit)}>
      <div className='mt-4 flex gap-2'>
        {reactions.map(reaction => (
          <div key={reaction.key} className='relative'>
            <input
              type='radio'
              id={reaction.key}
              key={reaction.key}
              {...register("reaction", { required: true })}
              value={reaction.key}
              className='peer absolute h-0  w-0 border-none bg-transparent focus:ring-0'
            />
            <label
              htmlFor={reaction.key}
              className='rounded-md bg-yellow-300 px-2  py-1 text-sm peer-checked:bg-red-400 peer-focus:bg-red-400'>
              {reaction.name}
            </label>
          </div>
        ))}
      </div>
      <div className='w-full space-y-2'>
        <label htmlFor='content'>Write your content</label>
        <textarea
          {...register("content", { required: true })}
          id='content'
          cols={30}
          rows={5}
          className='w-full resize-y'
        />
      </div>
      <button className='rounded-sm bg-blue-500 px-3 py-1 text-white'>
        {mutation.isLoading ? "Submitting..." : "Submit"}
      </button>
    </form>
  );
};
