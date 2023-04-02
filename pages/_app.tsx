import '../styles/globals.css';
import 'tailwindcss/tailwind.css'
import { SWRConfig } from "swr/_internal";
import { SessionProvider, useSession } from "next-auth/react"
import Layout from "../components/layout/Layout";
import LoadingPlug from "../components/layout/LoadingPlug";

const App = ({ Component, pageProps: { session, ...pageProps } }) => {
  return (
    <SessionProvider session={session}>
      <SWRConfig value={{
        fetcher: (resource, init) => fetch(resource, init).then(res => res.json())
      }}>
        {Component.auth ? (
        <Auth>
          <Component {...pageProps} />
        </Auth>
      ) : (
        <Component {...pageProps} />
      )}
      </SWRConfig>
    </SessionProvider>
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
  return (
    <Layout>
      {children}
    </Layout>
  )
}
export default App;
