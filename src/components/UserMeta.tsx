import { dateFormatter } from "@/lib/dayjs";
import Image from "next/image";

type UserMetaProps = {
  avatarUrl: string;
  username: string;
  confidencePoint: number;
  createdAt: Date;
};
export const UserMeta = ({ avatarUrl, username, confidencePoint, createdAt }: UserMetaProps) => {
  return (
    <div className='flex items-center gap-4'>
      <Image src={avatarUrl} alt={username} width={40} height={40} />
      <div className='flex flex-col items-start'>
        <div>
          <span className=''>{username}</span> -{" "}
          <span className='text-sm font-semibold text-blue-500'>{confidencePoint}</span>
        </div>
        <span className='text-xs text-gray-400'>posted {dateFormatter(createdAt).fromNow()}</span>
      </div>
    </div>
  );
};
