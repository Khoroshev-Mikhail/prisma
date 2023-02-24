import React, { ReactNode } from "react";
import Footer from "./Footer";
import Nav from "./Nav";

type Props = {
  children: ReactNode;
};

const Layout: React.FC<Props> = ({children}) => (
  <div>
    <Nav />
    <div className="my-3">{children}</div>
    <Footer />
  </div>
);

export default Layout;
