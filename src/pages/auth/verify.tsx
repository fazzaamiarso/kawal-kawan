import { useRegistrationStore } from "@/hooks/use-registration";
import { trpc } from "@/utils/trpc";
import clsx from "clsx";
import { useRouter } from "next/router";
import { SubmitHandler, useForm } from "react-hook-form";

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
      <main className='layout'>
        <h1>Verify Phone Number</h1>
        <p>Enter the verification code we sent to</p>
        <form onSubmit={handleSubmit(onSubmit)}>
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
              autoComplete='off'
              className='peer'
            />
          </div>
          <button className={clsx("btn btn-secondary", isLoading && "loading")}>
            {isLoading ? "Verifying..." : "Verify"}
          </button>
        </form>
      </main>
    </>
  );
};

export default Verify;

Verify.hasAuth = false;
