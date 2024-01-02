"use client";
import { useState, useEffect } from 'react';
import { useRouter } from "next/navigation";
import cookie from 'js-cookie';
import './home.scss';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const isLoggedIn = cookie.get("isLoggedIn");
    if (!isLoggedIn) {
      router.push('/');
    }
  }, []);

  const logout = () => {
    cookie.remove("isLoggedIn")
    router.push('/');
  }

  return(
    <>
      <div className="navBar">
        <span className="name">SmartHome App</span>
        <a href="#" onClick={logout}>Wyloguj się</a>
      </div>
    </>
  );
}