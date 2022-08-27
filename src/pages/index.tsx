import type { NextPage } from "next";
import { inferQueryOutput, trpc } from "../utils/trpc";
import Image from "next/image";
import Link from "next/link";
import { UserIcon } from "@heroicons/react/20/solid";
import { useAuth } from "@/hooks/use-auth";
import { UserMeta } from "@/components/UserMeta";

const Home: NextPage = () => {
  const { user } = useAuth();
  const { data, isLoading } = trpc.useQuery(["post.all"]);

  return (
    <main className='layout mt-12'>
      <h1 className='text-2xl'></h1>
      <div className='grid grid-cols-3'>
        <div className='col-span-2'>
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
        <aside className='w-full space-y-8'>
          <div className='stats  w-full pl-0'>
            <div className='stat pl-0'>
              <div className='stat-title'>Total Page Views</div>
              <div className='stat-value'>89,400</div>
              <div className='stat-desc'>21% more than last month</div>
            </div>
          </div>
          <div className=''>
            <h3 className='mb-4 text-lg font-semibold'>Top Supporter</h3>
            <ul>
              <div className='w-full bg-yellow-200 p-4'>Some conten</div>
              <div className='w-full bg-yellow-200 p-4'>Some conten</div>
              <div className='w-full bg-yellow-200 p-4'>Some conten</div>
              <div className='w-full bg-yellow-200 p-4'>Some conten</div>
            </ul>
          </div>
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
    <li className='w-full space-y-4 rounded-md bg-gray-100 p-6'>
      <UserMeta
        avatarUrl={user.avatarUrl}
        username={user.username || user.name}
        confidencePoint={user.confidencePoint}
        createdAt={post.createdAt}
      />
      <div className=''>
        <h2 className='text-lg font-semibold'>
          <Link href={`/post/${post.id}`}>
            <a className=' hover:text-blue-500 hover:underline'>{post.title}</a>
          </Link>
        </h2>
        <p className=''>{post.problem}</p>
      </div>
      <div className='mt-6'>
        {post._count.Comment > 0 && (
          <span className='flex items-center gap-2 text-sm'>
            <UserIcon className='w-4' /> {post._count.Comment} people supported
          </span>
        )}
      </div>
    </li>
  );
};
