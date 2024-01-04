"use client";
import { useState, useEffect, useContext } from 'react';
import { useRouter } from "next/navigation";
import axios from '@/api/axios';
import cookie from 'js-cookie';
import './home.scss';
import AuthContext from '../context/AuthProvider';

const USER_URL = "/userdata"
const LOGOUT_URL ="/logout"

export default function Home() {
  const [ data, setData ] = useState({});
  const { auth, setAuth } = useContext(AuthContext);
  const router = useRouter();


  useEffect(() => {
    const LoggedInUser = cookie.get("LoggedInUser");
    if (!LoggedInUser) {
      router.push('/');
    }
  }, []);

  useEffect(() => { 
    const dataFetch = async () => {
      try {
        const res = await axios.get(USER_URL, { withCredentials: true });
          console.log(res.data);
      } catch {
        router.push('/');
      }
    }

    dataFetch();
  }, []);

  const logout = async () => {
    try {
      const res = await axios.delete(LOGOUT_URL, { withCredentials: true });
      if (res.data.status) {
        setAuth({});
        router.push('/');
      } else {
        alert('Wystąpił błąd podczas przetwarzania żądania.')
      }
    } catch {
      alert('Brak odpowiedzi serwera. Skontaktuj się z administratorem.')
    }
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