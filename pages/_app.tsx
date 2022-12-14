import "@styles/globals.css";
import type { AppProps } from "next/app";
import { Suspense } from "react";
import { SWRConfig } from "swr";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
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
