import { useRegistrationStore } from "@/hooks/use-registration";
import { dateFormatter } from "@/lib/dayjs";
import { trpc } from "@/utils/trpc";
import clsx from "clsx";
import { GetServerSidePropsContext } from "next";
import { useRouter } from "next/router";
import { SubmitHandler, useForm } from "react-hook-form";

const TEN_MINUTES_IN_MS = 1000 * 60 * 10;

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

type FieldsValue = {
  verificationCode: string;
};
const Verify = () => {
  const router = useRouter();
  const savedFieldsData = useRegistrationStore(state => state.fields);
  const { register, handleSubmit } = useForm<FieldsValue>({});
  const { mutate: signup, isLoading } = trpc.useMutation("user.signup", {
    onSuccess: () => router.replace("/"),
  });

  const onSubmit: SubmitHandler<FieldsValue> = ({ verificationCode }) => {
    if (isLoading) return;
    signup({ ...savedFieldsData, verificationCode });
  };
  return (
    <>
      <main className='layout mt-20 flex w-screen items-center justify-center'>
        <div className=''>
          <div className='flex flex-col items-center text-center'>
            <h1 className='text-2xl'>Verify Phone Number</h1>
            <p>
              Enter the verification code we sent to{" "}
              <span className='font-semibold'>{savedFieldsData.phoneNumber}</span>
            </p>
          </div>
          <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
            <div className='form-control mt-8 flex flex-col'>
              <label htmlFor='verificationCode' className='label'>
                Verification Code
              </label>
              <input
                {...register("verificationCode", {
                  required: true,
                })}
                id='verificationCode'
                type='text'
                pattern='[0-9]{6}'
                maxLength={6}
                autoComplete='off'
                className='peer input input-bordered'
              />
              <p className='mt-4'>
                Your verifcation code will expire at{" "}
                {dateFormatter(Date.now() + TEN_MINUTES_IN_MS).format("LT")}
              </p>
            </div>

            <button className={clsx("btn btn-secondary", isLoading && "loading")}>
              {isLoading ? "Verifying..." : "Verify"}
            </button>
          </form>
        </div>
      </main>
    </>
  );
};

export default Verify;

Verify.hasAuth = false;
