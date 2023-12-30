"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function App() {
  const isLoggedIn = true;
  const router = useRouter();

  if (!isLoggedIn) {
    router.push("/login");
  } else {
    router.push("/home");
  }

  return (
    <>
    </>
  );
}
