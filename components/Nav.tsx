import Link from "next/link";
import React from "react";

const Nav: React.FC = () => {
  return (
    <div className="px-2 py-5 gap-2 grid grid-cols-10 border-b-2 bg-sky-100">
      <div className="p-2 col-span-2 cursor-pointer">
        <Link href='/partners'>Контрагенты</Link>
      </div>
      <div className="p-2 col-span-2 cursor-pointer">
        <Link href='/contracts'>Договора</Link>
      </div>
      <div className="p-2 col-span-2 cursor-pointer">
        <Link href='/ks3'>КС-3</Link>
      </div>
      <div className="p-2 col-start-8 cursor-pointer">
        <Link href='/ks2'>КС-2</Link>
      </div>
    </div>
  );
};
export default Nav;
