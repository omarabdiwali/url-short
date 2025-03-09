import "@/styles/globals.css";
import Head from "next/head";
import { SnackbarProvider } from "notistack";

export default function App({ Component, pageProps }) {
  return (
    <SnackbarProvider>
      <Head>
        <title>URL Shortener</title>
      </Head>
      <Component {...pageProps} />
    </SnackbarProvider>
  );
}
