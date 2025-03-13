import { useRouter } from "next/router";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();
  useEffect(() => {
    if (!router.isReady) return;
    let code = router.query.code

    fetch("/api/get", {
      method: "POST",
      body: JSON.stringify({ code })
    }).then(res => res.json()).then(data => router.replace(data.url))
      .catch(err => console.error(err));

  }, [router.isReady])

  return (
    <div>Redirecting...</div>
  )
}