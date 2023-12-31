"use client";

import { useEffect, useContext } from "react";
import { useRouter } from "next/navigation";
import AuthContext from './context/AuthProvider';

export default function App() {
  const { auth, setAuth } = useContext(AuthContext);
  const isLoggedIn = true;
  const router = useRouter();

  if (auth === null) {
    router.push("/login");
  } else {
    router.push("/home");
  }

  return (
    <>
    </>
  );
}
