import { Comment, Reactions, User } from "@prisma/client";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { SubmitHandler, useForm } from "react-hook-form";
import { trpc } from "@/utils/trpc";
import { NextSeo } from "next-seo";
import clsx from "clsx";
import { UserMeta } from "@/components/UserMeta";
import { ArchiveBoxXMarkIcon, HandThumbUpIcon as HandThumbUpFull } from "@heroicons/react/20/solid";
import { HandThumbUpIcon } from "@heroicons/react/24/outline";
import GoBackButton from "@/components/BackButton";
import { useAuth } from "@/hooks/use-auth";

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
  const { user } = useAuth();
  const router = useRouter();
  const { id } = router.query;
  if (typeof id !== "string") return null;

  const { data, isLoading: isHeaderLoading } = trpc.useQuery(["post.detail", { id: id as string }]);
  const { data: comments, isLoading } = trpc.useQuery(["comment.all", { postId: id as string }]);

  const isPostOwner = user?.id === data?.User.id;
  return (
    <>
      <NextSeo title={`${data?.title}`} />
      <main className='layout my-12 space-y-8 lg:grid lg:grid-cols-2 lg:gap-12'>
        <div>
          <GoBackButton />
          {isHeaderLoading && !data && <HeaderLoading />}
          {data && (
            <div className='mt-8 w-full'>
              <h1 className='mb-4 text-2xl font-bold '>{data.title}</h1>
              <p className='mb-12 text-lg'>{data.problem}</p>
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
        </div>
        <div className=''>
          {isLoading && !comments && (
            <div className='space-y-4'>
              <SupportLoading />
              <SupportLoading />
              <SupportLoading />
              <SupportLoading />
            </div>
          )}
          {comments && comments.length > 0 ? (
            <ul className='flex flex-col gap-4 md:grid md:grid-cols-2 lg:flex'>
              {comments.map(comment => {
                return (
                  <CommentCard
                    key={comment.id}
                    comment={comment}
                    user={comment.User}
                    isPostOwner={isPostOwner}
                  />
                );
              })}
            </ul>
          ) : (
            <EmptySupport />
          )}
        </div>
      </main>
    </>
  );
};

export default PostDetail;

type CommentCardProps = {
  comment: Comment;
  user: User;
  isPostOwner: boolean;
};
const CommentCard = ({ comment, user, isPostOwner }: CommentCardProps) => {
  const utils = trpc.useContext();
  const mutation = trpc.useMutation(["comment.mark-helpful"], {
    onSuccess: () => {
      utils.invalidateQueries(["comment.all"]);
      utils.invalidateQueries(["post.detail"]);
    },
  });

  const markHelpful = () => {
    if (mutation.isLoading) return;
    mutation.mutate({ commentId: comment.id });
  };
  return (
    <li key={comment.id} className='rounded-md bg-gray-50  p-4'>
      <div className='flex w-full items-center justify-between'>
        <UserMeta
          avatarUrl={user.avatarUrl}
          confidencePoint={user.confidencePoint}
          createdAt={comment.createdAt}
          username={user.username || user.name}
        />
        {isPostOwner && !comment.isHelpful ? (
          <button className='p-3 ' onClick={markHelpful}>
            <HandThumbUpIcon className='w-6' aria-label='' />
          </button>
        ) : null}
        {comment.isHelpful && (
          <button className='p-3'>
            <HandThumbUpFull className='w-6' aria-label='' />
          </button>
        )}
      </div>
      <div className='divider' />
      <p className='mt-6'>
        <span className='font-semibold'>{reactionsObj[comment.reaction]} </span>
        {comment.content}
      </p>
    </li>
  );
};

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

const EmptySupport = () => {
  return (
    <div className='mt-12 flex flex-col items-center'>
      <ArchiveBoxXMarkIcon className='aspect-square w-12' />
      <p>There are no supports yet!</p>
    </div>
  );
};

const SupportLoading = () => {
  return (
    <div className='w-full  animate-pulse space-y-3 rounded-md bg-gray-50 p-4'>
      <div className='h-4 w-5/12 bg-gray-200' />
      <div className='h-4 w-full bg-gray-200' />
      <div className='h-4 w-full bg-gray-200' />
      <div className='h-4 w-full bg-gray-200' />
    </div>
  );
};

const HeaderLoading = () => {
  return (
    <div className='w-full animate-pulse space-y-3 rounded-md  p-4'>
      <div className='mb-5 h-8 w-5/12 bg-gray-400' />
      <div className='h-4 w-10/12 bg-gray-400' />
      <div className='h-4 w-10/12 bg-gray-400' />
      <div className='h-4 w-10/12 bg-gray-400' />
      <div className='h-4 w-10/12 bg-gray-400' />
    </div>
  );
};
