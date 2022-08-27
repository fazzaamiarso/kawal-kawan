import Link from "next/link";

export const Footer = () => {
  return (
    <footer className='footer footer-center w-full bg-base-300 p-4 text-base-content'>
      <div>
        <p>Made for Garuda Hacks 3.0</p>
        <Link href='/attributions'>
          <a className='font-semibold hover:text-primary'>Attributions</a>
        </Link>
      </div>
    </footer>
  );
};
