import Image from "next/image";
import Link from "next/link";
import React from "react";

const Nav: React.FC = () => {
  return (
    <header className="w-full py-4 px-4 flex justify-between items-center z-99 shadow mb-4">
        <Link href="/osv/mrp" className="">
          <Image src={'/images/logo.png'} alt='CRCC Rus' width={50} height={50}></Image>
        </Link>
        <nav>
            <Link href="/osv/mrp" className="relative text-xs sm:text-base md:text-lg no-underline font-medium ml-10">МОЛ</Link>
            <Link href="/osv/stock" className="relative text-xs  sm:text-base md:text-lg no-underline font-medium ml-10">Склады</Link>
            <Link href="/osv/bp" className="relative text-xs sm:text-base md:text-lg no-underline font-medium ml-10">Поиск по БП</Link>
        </nav>
    </header>
  );
};
export default Nav;
