import type { NextPage } from "next";
import { inferQueryOutput, trpc } from "../utils/trpc";
import Image from "next/image";
import Link from "next/link";
import { UserIcon } from "@heroicons/react/20/solid";
import { useAuth } from "@/hooks/use-auth";
import { UserMeta } from "@/components/UserMeta";
import clsx from "clsx";
import { LoadingSpinner } from "@/components/LoadingSpinner";

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
            <li key={user.id} className='flex w-full items-center'>
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
          );
        })}
      </ul>
    </div>
  );
};
