import isUrl from "is-url";
import { enqueueSnackbar } from "notistack";
import { Geist, Geist_Mono } from "next/font/google";
import { useState } from "react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function Home() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [shortenedUrl, setShortenedUrl] = useState("");

  const onChange = (e) => {
    setUrl(e.target.value);
  }

  const onSubmit = (e) => {
    e.preventDefault();
    let trimUrl = url.trim();
    if (!isUrl(trimUrl)) {
      enqueueSnackbar("URL is not valid.", { variant: "info", autoHideDuration: 3000 });
      return;
    }

    setLoading(true);

    fetch("/api/add", {
      method: "POST",
      body: JSON.stringify({ url: trimUrl })
    }).then(res => res.json()).then(data => {
      if (data.kind === "error") {
        enqueueSnackbar(data.message, { variant: 'error', autoHideDuration: 3000 })
      } else {
        setShortenedUrl(data.message);
      }
      setLoading(false);
    }).catch(err => console.error(err))
  }

  return (
    <div
      className={`${geistSans.variable} ${geistMono.variable} grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]`}
    >
      <main className="flex flex-col gap-3 row-start-2 items-center sm:items-start">
        <h1 className="font-bold">URL Shortener</h1>
        <form onSubmit={onSubmit}>
          <input value={url} onChange={onChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="username" type="text" placeholder="https://example.com"></input>
        </form>
        {loading ? (
          <div className="flex justify-center mt-4">
            <svg
              className="animate-spin h-16 w-16 text-blue-500"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 50 50"
            >
              <circle
                className="opacity-25"
                cx="25"
                cy="25"
                r="20"
                stroke="currentColor"
                strokeWidth="5"
                fill="none"
              ></circle>
              <circle
                className="opacity-75"
                cx="25"
                cy="25"
                r="20"
                stroke="currentColor"
                strokeWidth="5"
                fill="none"
                strokeDasharray="126.92"
                strokeDashoffset="63.46"
              ></circle>
            </svg>
          </div>
        ) : ""}
        { shortenedUrl ? <div>Shortened URL is: <a rel="noopener norefferrer" className="hover:underline text-sky-400" target="__blank" href={shortenedUrl}>{shortenedUrl}</a></div> : "" }
      </main>

    </div>
  );
}
