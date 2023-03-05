import { AppProps } from "next/app";
import '../styles/globals.css';
import 'tailwindcss/tailwind.css'
import { SWRConfig } from "swr/_internal";
import { SessionProvider, useSession } from "next-auth/react"
import { Spinner } from "flowbite-react";
import Layout from "../components/layout/Layout";
import LoadingPlug from "../components/layout/LoadingPlug";

const App = ({ Component, pageProps: { session, ...pageProps } }) => {
  return (

        <Component {...pageProps} />

  );
};
function Auth({ children }) {
  const { status } = useSession({ required: true })
  if (status === "loading") {
    return (
      <Layout>
        <LoadingPlug />
      </Layout>
    )
  }
  return children
}
export default App;
