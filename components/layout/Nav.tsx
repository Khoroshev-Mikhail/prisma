import { Button, Dropdown, Navbar } from "flowbite-react";
import { DropdownItem } from "flowbite-react/lib/esm/components/Dropdown/DropdownItem";
import { useSession, signIn, signOut } from "next-auth/react"
import Image from "next/image";
import Link from "next/link";
import React from "react";
const Nav: React.FC = () => {
  const { data: session } = useSession()
  return (
    <Navbar fluid={true} rounded={true}>
      <Link href="/">
        <Image src={'/images/logo.png'} alt='CRCC Rus' width={50} height={50}></Image>
      </Link>
      <div className="flex md:order-2">
      {session 
        ?
          <Button color="light" onClick={() => signOut()}>
            Выход {session.user.email}
          </Button>
        : 
          <Button color="light" onClick={() => signIn()}>
            Войти
          </Button>
      }
        <Navbar.Toggle />
      </div>
      <Navbar.Collapse>
        <Link href='/account/10.08'>Малоценка</Link>
        <Link href='/account/mc04'>Инсутрумент</Link>
        <Link href='/account/01'>Основные средства</Link>
      </Navbar.Collapse>
    </Navbar>
  );
};
export default Nav;
