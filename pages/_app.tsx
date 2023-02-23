import { AppProps } from "next/app";
import '../styles/globals.css';
import 'tailwindcss/tailwind.css'
import { SWRConfig } from "swr/_internal";

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <SWRConfig value={{
      // refreshInterval: 3000,
      fetcher: (resource, init) => fetch(resource, init).then(res => res.json())
    }}>
      <Component {...pageProps} />
    </SWRConfig>
  );
};

export default App;
