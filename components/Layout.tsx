import React, { ReactNode } from "react";
import Nav from "./Nav";

type Props = {
  children: ReactNode;
};

const Layout: React.FC<Props> = ({children}) => (
  <div>
    <Nav />
    <div className="layout border-b-1">{children}</div>
  </div>
);

export default Layout;
