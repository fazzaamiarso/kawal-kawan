import { trpc } from "@/utils/trpc";
import { useForm } from "react-hook-form";
import PhoneInputWithCountry, { DefaultFormValues } from "react-phone-number-input/react-hook-form";
import "react-phone-number-input/style.css";

const Signin = () => {
  const { control, handleSubmit, getValues } = useForm();
  const { mutate: sendVerify } = trpc.useMutation("user.verify");

  const onSendVerify = () => {
    const phoneNumber = getValues("phoneNumber");
    console.log(phoneNumber);
    sendVerify({ phoneNumber });
  };
  return (
    <main className='layout'>
      <h1 className='text-2xl font-bold my-8'>Signin</h1>

      <form>
        <PhoneInputWithCountry
          name='phoneNumber'
          control={control}
          defaultCountry='ID'
          rules={{ required: true }}
        />
        <button type='button' className='px-4 py-1 bg-yellow-400' onClick={onSendVerify}>
          Register
        </button>
      </form>
    </main>
  );
};

export default Signin;
Signin.hasAuth = false;
