import type { NextPage } from "next";
import { inferQueryOutput, trpc } from "../utils/trpc";
import Image from "next/image";
import Link from "next/link";
import dayjs from "dayjs";
import { UserIcon } from "@heroicons/react/20/solid";
import { useAuth } from "@/hooks/use-auth";

const Home: NextPage = () => {
  const { user } = useAuth();
  const { data, isLoading } = trpc.useQuery(["post.all"]);

  return (
    <main className='layout mt-12'>
      <h1 className='text-2xl'>Kawal Kawan</h1>
      <div className='grid grid-cols-3'>
        <div className='col-span-2'>
          <div className=' flex  max-w-lg items-center rounded-md bg-gray-100 p-3'>
            <Image src={user?.avatarUrl ?? ""} alt={user?.name} width='50' height='50' />
            <Link href='/post/new'>
              <a className='rounded-full px-4 py-1 ring-1 ring-black'>
                Share your worry, problems, anything
              </a>
            </Link>
          </div>
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
        <aside className='w-full'>
          <h3>Top Supporter</h3>
          <div className='w-full bg-yellow-200 p-4'>Some conten</div>
          <div className='w-full bg-yellow-200 p-4'>Some conten</div>
          <div className='w-full bg-yellow-200 p-4'>Some conten</div>
          <div className='w-full bg-yellow-200 p-4'>Some conten</div>
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
  return (
    <li className='w-full space-y-4 rounded-md bg-gray-100 p-6'>
      <div className='flex items-center gap-4'>
        <Image src={post.User.avatarUrl} alt={post.User.name} width='40' height='40' />
        <div className='flex flex-col items-start'>
          <span className='text-sm'>
            {post.User.name} - {post.User.confidencePoint}
          </span>

          <span className='text-xs'>posted at {dayjs(post.createdAt).toString()}</span>
        </div>
      </div>
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
