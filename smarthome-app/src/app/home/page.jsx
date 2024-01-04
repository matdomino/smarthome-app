"use client";
import { useState, useEffect } from 'react';
import { useRouter } from "next/navigation";
import axios from '@/api/axios';
import cookie from 'js-cookie';
import './home.scss';

const USER_URL = "/userdata"

export default function Home() {
  const [ data, setData ] = useState({});
  const router = useRouter();


  useEffect(() => {
    const LoggedInUser = cookie.get("LoggedInUser");
    if (!LoggedInUser) {
      router.push('/');
    }
  }, []);

  useEffect(() => {  // zmienic
    const dataFetch = async () => {
      const userData = await axios.get(USER_URL, { withCredentials: true });
        if (userData.data.status === "success") {
          setData(userData.data.user);
        } else {
          cookie.remove("isLoggedIn");
          router.push('/');
        }
    };

    dataFetch();
  }, []);

  console.log(data);

  const logout = () => {
    cookie.remove("isLoggedIn");
    router.push('/');
  };

  return(
    <>
      <div className="navBar">
        <span className="name">SmartHome App</span>
        <a href="#" onClick={logout}>Wyloguj się</a>
      </div>
    </>
  );
}