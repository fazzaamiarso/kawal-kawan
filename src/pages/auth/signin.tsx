import { trpc } from "@/utils/trpc";
import clsx from "clsx";
import { GetServerSidePropsContext } from "next";
import { NextSeo } from "next-seo";
import Link from "next/link";
import { useRouter } from "next/router";
import { SubmitHandler, useForm } from "react-hook-form";

export const getServerSideProps = async ({ req }: GetServerSidePropsContext) => {
  const authToken = req.cookies["auth_token"];
  if (authToken)
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };

  return {
    props: {},
  };
};

type FormValues = {
  password: string;
  username: string;
};
const Signin = () => {
  const router = useRouter();
  const { handleSubmit, register } = useForm<FormValues>();
  const { mutate, isLoading } = trpc.useMutation(["user.signin"], {
    onSuccess: () => router.replace("/"),
    onError: () => console.error("Signin not succesful!"),
  });

  const onSubmit: SubmitHandler<FormValues> = data => {
    if (isLoading) return;
    mutate(data);
  };

  return (
    <>
      <NextSeo title='Signin' />
      <main className='layout'>
        <div className='my-8 '>
          <h1 className='text-2xl font-bold'>Sign In to Kawal Kawan</h1>
          <p className=''>
            Doesn&apos;t have an account?{" "}
            <Link href='/auth/signup'>
              <a className='font-semibold text-blue-500 hover:underline'>Signup here</a>
            </Link>
          </p>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col'>
          <div className='spacy-4 mb-8'>
            <div className='form-control'>
              <label htmlFor='username' className='label'>
                Username
              </label>
              <input
                {...register("username", { required: true })}
                id='username'
                type='text'
                autoComplete='off'
                className='input input-bordered'
              />
            </div>
            <div className='form-control'>
              <label htmlFor='password' className='label'>
                Password
              </label>
              <input
                {...register("password", { required: true })}
                id='password'
                type='password'
                autoComplete='off'
                className='input input-bordered'
              />
            </div>
          </div>
          <button className={clsx("btn btn-primary ml-auto capitalize", isLoading && "loading")}>
            {isLoading ? "Signing in..." : "Signin"}
          </button>
        </form>
      </main>
    </>
  );
};

export default Signin;

Signin.hasAuth = false;
