import React, { ReactNode } from "react";
import Footer from "./Footer";
import Nav from "./Nav";
import Header from "./Header";

type Props = {
  children: ReactNode;
};

const Layout: React.FC<Props> = ({children}) => (
  <div className="flex flex-col h-screen justify-between">
    {/* <Nav /> */}
    <Header />
    <div className="mb-auto px-4">{children}</div>
    <Footer />
  </div>
);

export default Layout;
