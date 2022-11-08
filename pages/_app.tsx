import "@styles/globals.css";
import type { AppProps } from "next/app";
import { SWRConfig } from "swr";

async function fetcher(url: string) {
  return await (await fetch(url)).json();
}
function MyApp({ Component, pageProps }: AppProps) {
  return (
    <SWRConfig value={{ fetcher }}>
      <Component {...pageProps} />
    </SWRConfig>
  );
}

export default MyApp;
