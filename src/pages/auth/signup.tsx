import { trpc } from "@/utils/trpc";
import { GetServerSidePropsContext } from "next";
import { NextSeo } from "next-seo";
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
  const { control, handleSubmit, getValues, register } = useForm<FormValues>();
  const { mutate: sendVerify } = trpc.useMutation("user.verify");
  const { mutate: signup, status: signupStatus } = trpc.useMutation("user.signup", {
    onSuccess: () => router.replace("/"),
  });

  const onSendVerify = () => {
    const phoneNumber = getValues("phoneNumber");
    sendVerify({ phoneNumber });
  };

  const onSubmit: SubmitHandler<FormValues> = data => {
    if (signupStatus === "loading") return;
    signup(data);
  };
  return (
    <>
      <NextSeo title='Signup' />
      <main className='layout'>
        <h1 className='my-8 text-2xl font-bold'>Sign up</h1>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className='flex flex-col'>
            <label htmlFor='name'>Name</label>
            <input {...register("name", { required: true })} id='name' type='text' />
          </div>
          <div className='flex flex-col'>
            <label htmlFor='username'>Username</label>
            <input {...register("username", { required: true })} id='username' type='text' />
          </div>
          <div className='flex flex-col'>
            <label htmlFor='password'>Password</label>
            <input {...register("password", { required: true })} id='password' type='password' />
          </div>

          <PhoneInputWithCountry
            name='phoneNumber'
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            control={control as any}
            defaultCountry='ID'
            rules={{ required: true }}
            className='mt-8'
          />
          <button type='button' className='bg-yellow-400 px-4 py-1' onClick={onSendVerify}>
            Register
          </button>
          <div className='mt-8 flex w-32 flex-col'>
            <label htmlFor='verificationCode'>Verification Code</label>
            <input
              {...register("verificationCode", {
                required: true,
              })}
              id='verificationCode'
              type='text'
              pattern='[0-9]{6}'
              maxLength={6}
              className='peer '
            />
          </div>
          <button className='bg-red-400 px-4 py-1'>
            {signupStatus === "loading" ? "Verifying..." : "Verify"}
          </button>
        </form>
      </main>
    </>
  );
};

export default Signup;
Signup.hasAuth = false;
