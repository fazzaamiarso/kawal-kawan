import { ArrowLeftIcon } from "@heroicons/react/20/solid";
import { useRouter } from "next/router";

const GoBackButton = () => {
  const router = useRouter();

  return (
    <button
      className='group flex w-max items-center gap-2 transition-all hover:text-primary'
      onClick={() => router.back()}>
      <ArrowLeftIcon className='h-5 transition-all group-hover:-translate-x-2' />
      <span className=' hover:underline'>Go back</span>
    </button>
  );
};

export default GoBackButton;
