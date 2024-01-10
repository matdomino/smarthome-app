"use client";
import { useState, useEffect, useContext } from 'react';
import { useRouter } from "next/navigation";
import axios from '@/api/axios';
import cookie from 'js-cookie';
import './home.scss';
import AuthContext from '../context/AuthProvider';
import { DevicesProvider } from '../context/DevicesProvider';
import DevicesContext from '../context/DevicesProvider';
import DevicesList from './DevicesList';
import AddDevice from './addDevice';

const USER_URL = "/userdata"
const LOGOUT_URL ="/logout"

function Home() {
  const { devices, setDevices } = useContext(DevicesContext);
  const { AddDeviceMenu, setAddDeviceMenu } = useContext(DevicesContext);
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
        setDevices(res.data.userData.devices);
      } catch (err) {
        console.log(err);
        if (err.message.includes('Network Error')) {
          alert('Brak odpowiedzi serwera. Skontaktuj się z administratorem.');
        } else {
          router.push('/');
        }
      }
    }

    dataFetch();
  }, []);
  
  useEffect(() => {
  }, [devices, AddDeviceMenu]);

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

  const showAddDeviceMenu = () => {
    setAddDeviceMenu(true);
  }

  return(
      <>
        <div className='navBar'>
          <span className="name">SmartHome App</span>
          <a href="#" onClick={logout}>Wyloguj się</a>
        </div>
        <main>
          
          <div className='menu'>
            <div className='logs'>
              <div className='past-logs'>

              </div>
              <div className='live-logs'>

              </div>
            </div>
            <div className='devices'>
              <div className='controls'>
              </div>
              <div className='list'>
                <DevicesList className='DevicesList'/>
                <button className='addDeviceButton' onClick={showAddDeviceMenu}>+</button>
              </div>
            </div>
          </div>
        </main>
        {AddDeviceMenu === true ? (
          <div className='addDeviceMenu'>
            <AddDevice />
          </div>
        ) : null}
      </>
  );
}

export default function Page() {
  return (
    <DevicesProvider>
      <Home />
    </DevicesProvider>
  );
}