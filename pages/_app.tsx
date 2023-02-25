import { AppProps } from "next/app";
import '../styles/globals.css';
import 'tailwindcss/tailwind.css'
import { SWRConfig } from "swr/_internal";
import { SessionProvider, useSession } from "next-auth/react"

const App = ({ Component, pageProps: { session, ...pageProps } }) => {
  return (
    <SessionProvider session={session}>
      <SWRConfig value={{
        // refreshInterval: 3000,
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
    return <div>Loading...</div>
  }
  return children
}
export default App;