import { trpc } from "@/utils/trpc";
import clsx from "clsx";
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
        <h1 className='mb-8 text-2xl font-bold'>New Post</h1>
        <form className='space-y-6' onSubmit={handleSubmit(onSubmit)}>
          <div className='form-control'>
            <label htmlFor='title' className='label'>
              Title
            </label>
            <input
              type='text'
              id='title'
              placeholder='Trying to deal with my loneliness'
              {...register("title", { required: true })}
              className='input input-bordered'
            />
          </div>
          <div className='form-control'>
            <label htmlFor='problem' className='label'>
              What do you want to tell the world?
            </label>
            <textarea
              id='problem'
              className='textarea textarea-bordered '
              {...register("problem", { required: true })}
            />
          </div>

          <button
            className={clsx(
              "btn btn-primary px-4  capitalize ",
              mutation.isLoading ? "loading" : "",
            )}>
            {mutation.isLoading ? "Posting..." : "Post"}
          </button>
        </form>
      </main>
    </>
  );
};

export default NewPost;
