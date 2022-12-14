import { useAuth } from "@/hooks/use-auth";
import Image from "next/image";
import Link from "next/link";
import Logo from "@/assets/logo.png";

const navigation = [
  { name: "Home", href: "/" },
  // { name: "Posts", href: "#", current: true },
  { name: "Leaderboard", href: "/leaderboard" },
];

export default function Navbar() {
  const { user } = useAuth();
  return (
    <header className='w-full bg-gray-200 py-4'>
      <div className='layout flex items-center justify-between gap-10'>
        <div className='w-24'>
          <Image src={Logo} alt='Kawal Kawan Logo' objectFit='contain' />
        </div>
        <nav className='w-full'>
          <ul className='flex items-center gap-4'>
            {navigation.map(nav => {
              return (
                <li key={nav.name}>
                  <Link href={nav.href}>
                    <a className=''>{nav.name}</a>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        <div className='flex items-center gap-2'>
          <Link href='#'>
            <a className='' aria-label='go to profile'>
              <Image src={user?.avatarUrl ?? ""} alt='' width='40' height='40' />
            </a>
          </Link>
        </div>
      </div>
    </header>
  );
}
