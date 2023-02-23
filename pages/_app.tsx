import { AppProps } from "next/app";
import '../styles/globals.css';
import 'tailwindcss/tailwind.css'
import { SWRConfig } from "swr/_internal";
import { SessionProvider } from "next-auth/react"

const App = ({ Component, pageProps: { session, ...pageProps } }: AppProps) => {
  return (
    <SessionProvider session={session}>
      <SWRConfig value={{
        // refreshInterval: 3000,
        fetcher: (resource, init) => fetch(resource, init).then(res => res.json())
      }}>
        <Component {...pageProps} />
      </SWRConfig>
    </SessionProvider>
  );
};

export default App;
