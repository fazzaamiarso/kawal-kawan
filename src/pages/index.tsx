import type { NextPage } from "next";
import { inferQueryOutput, trpc } from "../utils/trpc";
import Image from "next/image";
import Link from "next/link";
import { UserIcon } from "@heroicons/react/20/solid";
import { useAuth } from "@/hooks/use-auth";
import { UserMeta } from "@/components/UserMeta";
import clsx from "clsx";

const Home: NextPage = () => {
  const { user } = useAuth();
  const { data, isLoading } = trpc.useQuery(["post.all"]);

  return (
    <main className='layout my-12'>
      <h1 className='text-2xl'></h1>
      <div className='grid grid-cols-3'>
        <div className='col-span-3 lg:col-span-2'>
          <div className=' flex max-w-lg flex-col items-start  gap-4 rounded-md  p-3'>
            <div className='flex items-center font-semibold'>
              <p className='text-3xl'>Hi, {user?.name}</p>
              <Image src={user?.avatarUrl ?? ""} alt={user?.name} width='50' height='50' />
            </div>
            <Link href='/post/new'>
              <a className='btn btn-primary btn-block rounded-full'>
                Share your worry, problems, anything
              </a>
            </Link>
          </div>
          <div className='divider max-w-lg ' />
          <div className='w-full pt-6'>
            {!isLoading && data?.length === 0 && <p>No Posts Yet</p>}
            {data ? (
              <ul className='flex w-full max-w-lg flex-col items-start space-y-6'>
                {data.map(post => (
                  <PostCard key={post.id} post={post} />
                ))}
              </ul>
            ) : (
              <p>Loading..</p>
            )}
          </div>
        </div>
        <aside className='hidden w-full space-y-8 lg:block'>
          <StatsPanel />
          <LeaderboardPanel />
        </aside>
      </div>
    </main>
  );
};

export default Home;

type PostCardProps = {
  post: inferQueryOutput<"post.all">[0];
};
const PostCard = ({ post }: PostCardProps) => {
  const user = post.User;

  return (
    <li className='w-full space-y-4 rounded-md bg-gray-50 p-6'>
      <UserMeta
        avatarUrl={user.avatarUrl}
        username={user.username || user.name}
        confidencePoint={user.confidencePoint}
        createdAt={post.createdAt}
      />
      <div className='divider' />
      <div className=''>
        <h2 className='text-lg font-semibold'>
          <Link href={`/post/${post.id}`}>
            <a className=' hover:text-blue-500 hover:underline'>{post.title}</a>
          </Link>
        </h2>
        <p className=''>{post.problem}</p>
      </div>
      <div className='pt-6'>
        {post._count.Comment > 0 && (
          <span className='flex items-center gap-2 text-sm text-accent-content'>
            <UserIcon className='w-4' /> {post._count.Comment} supporter
          </span>
        )}
      </div>
    </li>
  );
};
const LoadingSpinner = () => {
  return (
    <div role='status'>
      <svg
        aria-hidden='true'
        className='mr-2 aspect-square h-10 animate-spin fill-blue-600 text-gray-200 '
        viewBox='0 0 100 101'
        fill='none'
        xmlns='http://www.w3.org/2000/svg'>
        <path
          d='M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z'
          fill='currentColor'
        />
        <path
          d='M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z'
          fill='currentFill'
        />
      </svg>
      <span className='sr-only'>Loading...</span>
    </div>
  );
};
const StatsPanel = () => {
  const { data: confidencePoints, isLoading } = trpc.useQuery(["user.points"], {
    refetchOnWindowFocus: false,
  });

  return (
    <div className='stats w-full pl-0'>
      <div className='stat space-y-2 pl-0'>
        <div className='stat-title'>Your Confidence Points</div>
        {isLoading ? <LoadingSpinner /> : <div className='stat-value'>{confidencePoints ?? 0}</div>}
        <div className='stat-desc'>Gain more points by supporting others</div>
      </div>
    </div>
  );
};

const rankClassNames: Record<string, string> = {
  "1": "bg-[#FFD700] font-semibold",
  "2": "bg-[#C0C0C0] font-semibold text-white",
  "3": "bg-[#CD7F32] font-semibold",
};
const LeaderboardPanel = () => {
  const { data: users } = trpc.useQuery(["user.leaderboard"], { refetchOnWindowFocus: false });
  return (
    <div className=''>
      <h3 className='mb-4 text-lg font-semibold'>Top Supporter</h3>
      <ul className='space-y-2'>
        {users?.map((user, idx) => {
          return (
            <>
              <li key={user.id + Math.random()} className='flex w-full items-center'>
                <div className='flex items-center gap-4'>
                  <div
                    className={clsx(
                      "flex aspect-square w-8 items-center justify-center rounded-full",
                      rankClassNames[idx + 1],
                    )}>
                    {idx + 1}
                  </div>
                  <div>{user.username || user.name}</div>
                </div>
                <div className='ml-auto'>{user.confidencePoint}</div>
              </li>
            </>
          );
        })}
      </ul>
    </div>
  );
};
