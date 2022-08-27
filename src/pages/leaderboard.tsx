import GoBackButton from "@/components/BackButton";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { trpc } from "@/utils/trpc";
import clsx from "clsx";
import { NextSeo } from "next-seo";

const rankClassNames: Record<string, string> = {
  "1": "bg-[#FFD700] font-semibold",
  "2": "bg-[#C0C0C0] font-semibold text-white",
  "3": "bg-[#CD7F32] font-semibold",
};
const Leaderboard = () => {
  const { data: users, isLoading } = trpc.useQuery(["user.leaderboard"], {
    refetchOnWindowFocus: false,
  });

  return (
    <>
      <NextSeo
        title='Leaderboard'
        description='Checkout who has been the most supportive fellow of Kawal Kawan'
      />
      <main className='layout my-12 max-w-xl'>
        <GoBackButton />
        <h1 className='mb-10 mt-12  text-2xl font-bold'>Leaderboard</h1>
        <ul className='flex flex-col items-center space-y-6'>
          {isLoading && !users && (
            <div className='mb-12'>
              <LoadingSpinner />
            </div>
          )}
          {users?.map((user, idx) => {
            return (
              <li key={user.id} className='flex w-full items-center'>
                <div className='flex items-center gap-6'>
                  <div
                    className={clsx(
                      "flex aspect-square w-10 items-center justify-center rounded-full",
                      rankClassNames[idx + 1],
                    )}>
                    {idx + 1}
                  </div>
                  <div className='text-lg font-semibold'>{user.username || user.name}</div>
                </div>
                <div className='ml-auto font-semibold text-primary'>{user.confidencePoint}</div>
              </li>
            );
          })}
        </ul>
      </main>
    </>
  );
};

export default Leaderboard;
