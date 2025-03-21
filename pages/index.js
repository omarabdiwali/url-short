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
  };

  const onSubmit = (e) => {
    e.preventDefault();
    let trimUrl = url.trim();
    if (!isUrl(trimUrl)) {
      enqueueSnackbar("Please enter a valid URL.", {
        variant: "info",
        autoHideDuration: 3000,
      });
      return;
    }

    setLoading(true);

    fetch("/api/add", {
      method: "POST",
      body: JSON.stringify({ url: trimUrl }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.kind === "error") {
          enqueueSnackbar(data.message, {
            variant: "error",
            autoHideDuration: 3000,
          });
        } else {
          setShortenedUrl(data.message);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false); // Ensure loading stops on error
        enqueueSnackbar("An error occurred. Please try again.", {
          variant: "error",
          autoHideDuration: 3000,
        });
      });
  };

  const onCopy = () => {
    navigator.clipboard.writeText(shortenedUrl);
    enqueueSnackbar("Copied to clipboard!", {
      variant: "success",
      autoHideDuration: 2000,
    });
  };

  return (
    <div
      className={`${geistSans.variable} ${geistMono.variable} flex flex-col items-center justify-center min-h-screen py-12 bg-gray-900 text-gray-100 font-[family-name:var(--font-geist-sans)]`}
    >
      <main className="flex flex-col items-center w-full max-w-lg px-4">
        <h1 className="text-4xl font-bold text-gray-200 mb-6">
          URL Shortener
        </h1>

        <form onSubmit={onSubmit} className="w-full">
          <div className="flex items-center border-b border-teal-500 py-2">
            <input
              value={url}
              onChange={onChange}
              className="appearance-none bg-transparent border-none w-full text-gray-200 mr-3 py-1 px-2 leading-tight focus:outline-none"
              type="text"
              placeholder="Enter your long URL here..."
              aria-label="Long URL"
            />
            <button
              className="flex-shrink-0 bg-teal-500 hover:bg-teal-700 border-teal-500 hover:border-teal-700 text-sm border-4 text-white py-1 px-2 rounded disabled:opacity-50 disabled:cursor-not-allowed"
              type="submit"
              disabled={loading}
            >
              {loading ? "Shortening..." : "Shorten"}
            </button>
          </div>
        </form>

        {loading && (
          <div className="flex justify-center mt-4">
            <svg
              className="animate-spin -ml-1 mr-3 h-5 w-5 text-teal-500"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          </div>
        )}

        {shortenedUrl && !loading && (
          <div className="mt-6 w-full bg-gray-800 rounded-lg shadow-md p-4">
            <div className="text-gray-300">Shortened URL:</div>
            <div className="flex items-center mt-2">
              <a
                rel="noopener noreferrer"
                className="text-teal-400 hover:underline truncate"
                target="_blank"
                href={shortenedUrl}
              >
                {shortenedUrl}
              </a>
              <button
                onClick={onCopy}
                className="ml-2 flex-shrink-0 bg-gray-700 hover:bg-gray-600 border-gray-600 hover:border-gray-500 text-sm border-2 text-gray-300 py-1 px-2 rounded"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
                  />
                </svg>
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
