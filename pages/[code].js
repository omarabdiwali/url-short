// import { useRouter } from "next/router";
// import { useEffect } from "react";

// export default function Home() {
//   const router = useRouter();
//   useEffect(() => {
//     if (!router.isReady) return;
//     let code = router.query.code

//     fetch("/api/get", {
//       method: "POST",
//       body: JSON.stringify({ code })
//     }).then(res => res.json()).then(data => router.replace(data.url))
//       .catch(err => console.error(err));

//   }, [router.isReady])

//   return (
//     <div>Redirecting...</div>
//   )
// }
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function Home() {
  const router = useRouter();
  const [error, setError] = useState(null);
  const [redirectUrl, setRedirectUrl] = useState(null); // Store the URL for display, if needed.

  useEffect(() => {
    if (!router.isReady) return;
    const code = router.query.code;

    if (!code) {
      setError("No code provided.");  // Handle missing code case
      return;
    }

    fetch("/api/get", {
      method: "POST",
      body: JSON.stringify({ code }),
    })
      .then(res => res.json())
      .then((data) => {
        if (!data || !data.url) {
          throw new Error("Invalid response from server: Missing URL.");
        }
        setRedirectUrl(data.url); //Optional state variable to display the URL we're redirecting to
        router.replace(data.url);
      })
      .catch((err) => {
        console.error("Redirection Error:", err);
        setError(err.message || "An unexpected error occurred."); //Consistent error message
      });
  }, [router.isReady, router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
      <div className="text-center">
        {error ? (
          <>
             <div className="mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16 mx-auto text-red-500">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
              </svg>
            </div>
            <p className="text-lg text-red-500">Error:</p>
            <p className="text-gray-300">{error}</p>
          </>
        ) : (
            <>
                <div className="mb-4">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="animate-spin h-16 w-16 mx-auto text-blue-500"  // Tailwind classes for styling
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                        />
                    </svg>
                </div>
                <p className="text-lg text-gray-300">Redirecting...</p>
                {redirectUrl && ( // Optionally display the redirect URL
                  <p className="text-sm text-gray-400 mt-2 break-all">
                    to: {redirectUrl}
                  </p>
              )}
            </>
        )}
      </div>
    </div>
  );
}
