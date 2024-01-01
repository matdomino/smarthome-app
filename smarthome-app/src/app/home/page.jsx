"use client";
import { useState, useContext } from 'react';
import { useRouter } from "next/navigation";
import AuthContext from '../context/AuthProvider';
import './home.scss';

export default function Home() {
  const router = useRouter();
  const { auth, setAuth } = useContext(AuthContext);

  if (Object.keys(auth).length === 0) {
    router.push('/');
  }

  const logout = () => {
    setAuth({});
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