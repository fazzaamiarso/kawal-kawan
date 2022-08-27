import { trpc } from "@/utils/trpc";
import { NextPage } from "next";
import { NextSeo } from "next-seo";
import { useRouter } from "next/router";
import { SubmitHandler, useForm } from "react-hook-form";

type FormValues = {
  title: string;
  problem: string;
};

const NewPost: NextPage = () => {
  const router = useRouter();
  const { register, handleSubmit } = useForm<FormValues>();
  const mutation = trpc.useMutation(["post.new"]);

  const onSubmit: SubmitHandler<FormValues> = data => {
    if (mutation.isLoading) return;
    mutation.mutate({ ...data }, { onSuccess: () => router.replace("/") });
  };
  return (
    <>
      <NextSeo title='New Post' />
      <main className='layout mt-12'>
        <h1 className='text-2xl'>Peer Support</h1>
        <form className='space-y-6' onSubmit={handleSubmit(onSubmit)}>
          <div className='flex flex-col gap-2'>
            <label htmlFor='title'>Title</label>
            <input type='text' id='title' {...register("title", { required: true })} />
          </div>
          <div className='flex flex-col gap-2'>
            <label htmlFor='problem'>What do you want to tell the world?</label>
            <textarea
              id='problem'
              className='resize-y'
              {...register("problem", { required: true })}
            />
          </div>

          <button className='rounded-md bg-red-700 p-1 px-4 text-white'>
            {mutation.isLoading ? "Posting..." : "Post"}
          </button>
        </form>
      </main>
    </>
  );
};

export default NewPost;
