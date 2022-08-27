import { Reactions } from "@prisma/client";
import { NextPage } from "next";
import Image from "next/image";
import { useRouter } from "next/router";
import { SubmitHandler, useForm } from "react-hook-form";
import { trpc } from "@/utils/trpc";
import { NextSeo } from "next-seo";
import clsx from "clsx";
import { dateFormatter } from "@/lib/dayjs";

const reactions: { name: string; key: Reactions }[] = [
  { key: "RELATABLE", name: "✋ Relatable" },
  { key: "KEEP_GOING", name: "🔥 Keep going!" },
  { key: "GREAT_JOB", name: "👍 Great job!" },
];

const reactionsObj = {
  RELATABLE: "✋ Relatable",
  KEEP_GOING: "🔥 Keep going!",
  GREAT_JOB: "👍 Great job!",
};

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
      <main className='layout mt-12 space-y-8'>
        {data && (
          <div className='w-full'>
            <h1 className='text-2xl font-bold '>{data.title}</h1>
            <p className='mb-12'>{data.problem}</p>
            <UserMeta
              avatarUrl={data.User.avatarUrl}
              username={data.User.username || data.User.name}
              confidencePoint={data.User.confidencePoint}
              createdAt={data.createdAt}
            />
          </div>
        )}
        <div className='space-y-4 pt-20'>
          <h2 className='text-lg font-semibold'>Give support to {data?.User.name}</h2>
          <SupportForm postId={id} />
        </div>
        {comments && comments.length > 0 ? (
          <ul className='space-y-4'>
            {comments.map(comment => {
              const user = comment.User;
              return (
                <li key={comment.id} className='rounded-md bg-gray-100  p-4'>
                  <UserMeta
                    avatarUrl={user.avatarUrl}
                    confidencePoint={user.confidencePoint}
                    createdAt={comment.createdAt}
                    username={user.username || user.name}
                  />

                  <p>
                    <span className='font-semibold'>{reactionsObj[comment.reaction]} </span>
                    {comment.content}
                  </p>
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
      <fieldset>
        <legend className='label mt-4 mb-2'>{"How's the story?"}</legend>
        <div className=' flex flex-wrap gap-4'>
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
                className={clsx(
                  "btn btn-outline  btn-xs  sm:btn-sm",
                  "peer-checked:btn-active peer-checked:text-white",
                  "peer-focus:btn-active peer-focus:text-white",
                )}>
                {reaction.name}
              </label>
            </div>
          ))}
        </div>
      </fieldset>
      <div className='form-control w-full space-y-2'>
        <label htmlFor='content' className='label'>
          Write your support here
        </label>
        <textarea
          {...register("content", { required: true })}
          id='content'
          cols={30}
          rows={3}
          placeholder='Keep going man! I know you can do it because I go through it myself. You definitely cope with
          it better than me'
          className='textarea textarea-bordered w-full'
        />
      </div>
      <button
        className={clsx("btn btn-primary px-3 capitalize ", mutation.isLoading ? "loading" : "")}>
        {mutation.isLoading ? "Submitting..." : "Submit"}
      </button>
    </form>
  );
};

type UserMetaProps = {
  avatarUrl: string;
  username: string;
  confidencePoint: number;
  createdAt: Date;
};
const UserMeta = ({ avatarUrl, username, confidencePoint, createdAt }: UserMetaProps) => {
  return (
    <div className='mb-6 flex items-center gap-4'>
      <Image src={avatarUrl} alt={username} width='40' height='40' />
      <div className='flex flex-col items-start'>
        <div>
          <span className=''>{username}</span> -{" "}
          <span className='text-sm font-semibold text-blue-500'>{confidencePoint}</span>
        </div>
        <span className='text-xs text-gray-400'>posted {dateFormatter(createdAt).fromNow()}</span>
      </div>
    </div>
  );
};
