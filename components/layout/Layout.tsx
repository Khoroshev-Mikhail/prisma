import React, { ReactNode } from "react";
import Footer from "./Footer";
import Nav from "./Nav";

type Props = {
  children: ReactNode;
};

const Layout: React.FC<Props> = ({children}) => (
  <div className="flex flex-col h-screen justify-between">
    <Nav />
    <div className="mb-auto">{children}</div>
    <Footer />
  </div>
);

export default Layout;
