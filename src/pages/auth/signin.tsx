import { trpc } from "@/utils/trpc";
import { GetServerSidePropsContext } from "next";
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

const Signin = () => {
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
    <main className='layout'>
      <h1 className='text-2xl font-bold my-8'>Sign up</h1>

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
          control={control as any}
          defaultCountry='ID'
          rules={{ required: true }}
          className='mt-8'
        />
        <button type='button' className='px-4 py-1 bg-yellow-400' onClick={onSendVerify}>
          Register
        </button>
        <div className='mt-8 flex flex-col w-32'>
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
        <button className='px-4 py-1 bg-red-400'>
          {signupStatus === "loading" ? "Verifying..." : "Verify"}
        </button>
      </form>
    </main>
  );
};

export default Signin;
Signin.hasAuth = false;
