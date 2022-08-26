import Image from "next/image";
import Link from "next/link";

const navigation = [
  { name: "Home", href: "/", current: true },
  { name: "Posts", href: "#", current: true },
  { name: "Leadeboard", href: "#", current: false },
];

export default function Navbar() {
  return (
    <header className='w-full py-4 bg-gray-200'>
      <div className='layout flex items-center justify-between'>
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
        <Link href='#'>
          <a className='' aria-label='go to profile'>
            <Image
              src='https://avatars.dicebear.com/api/big-smile/random.svg'
              alt=''
              width='40'
              height='40'
            />
          </a>
        </Link>
      </div>
    </header>
  );
}
