import { useRegistrationStore } from "@/hooks/use-registration";
import { trpc } from "@/utils/trpc";
import clsx from "clsx";
import { GetServerSidePropsContext } from "next";
import { NextSeo } from "next-seo";
import Link from "next/link";
import { useRouter } from "next/router";
import { SubmitHandler, useForm } from "react-hook-form";
import PhoneInputWithCountry from "react-phone-number-input/react-hook-form";
import "react-phone-number-input/style.css";

type FormValues = {
  phoneNumber: string;
  verificationCode: string;
  password: string;
  username: string;
  name: string;
};

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

const Signup = () => {
  const router = useRouter();
  const saveFields = useRegistrationStore(state => state.setFields);
  const { control, handleSubmit, register } = useForm<FormValues>();
  const { mutate: sendVerify, isLoading } = trpc.useMutation("user.verify", {
    onSuccess: () => router.push("/auth/verify"),
  });

  const onSubmit: SubmitHandler<FormValues> = data => {
    if (isLoading) return;
    saveFields(data);
    sendVerify({ phoneNumber: data.phoneNumber });
  };
  //TODO:Validate form on errors
  return (
    <>
      <NextSeo title='Signup' />
      <main className='layout'>
        <div className='my-8 mt-20 '>
          <h1 className='text-2xl font-bold'>Sign up to Kawal Kawan</h1>
          <p className=''>
            Already have an account?{" "}
            <Link href='/auth/signin'>
              <a className='font-semibold text-blue-500 hover:underline'>Login here</a>
            </Link>
          </p>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col space-y-4'>
          <div className='form-control'>
            <label htmlFor='name' className='label'>
              Name
            </label>
            <input
              {...register("name", { required: true })}
              id='name'
              type='text'
              autoComplete='off'
              className='input input-bordered'
            />
          </div>
          <div className='form-control'>
            <label htmlFor='username' className='label'>
              Username
            </label>
            <input
              {...register("username", { required: true })}
              id='username'
              type='text'
              autoComplete='off'
              maxLength={8}
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
          <div className='form-control'>
            <label htmlFor='phoneNumber' className='label'>
              Phone number
            </label>
            <PhoneInputWithCountry
              name='phoneNumber'
              id='phoneNumber'
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              control={control as any}
              defaultCountry='ID'
              rules={{ required: true }}
              className='w-60'
            />
            <span className='label-text pt-2'>
              We need to verify your number for security purposes.
            </span>
          </div>
          <div className='divider' />
          <button className={clsx("btn btn-primary ml-auto", isLoading && "loading")}>
            Register
          </button>
        </form>
      </main>
    </>
  );
};

export default Signup;
Signup.hasAuth = false;
