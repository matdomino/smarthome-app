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
import UsernameChange from './usernameChange';
import PasswordChange from './passwordChange';
import DeleteAcc from './DeleteAcc';

const USER_URL = "/userdata"
const LOGOUT_URL ="/logout"

function Home() {
  const { devices, setDevices } = useContext(DevicesContext);
  const { menu, setMenu } = useContext(DevicesContext);
  const { auth, setAuth } = useContext(AuthContext);
  const [ user, setUser ] = useState();
  const router = useRouter();


  useEffect(() => {
    const LoggedInUser = cookie.get("LoggedInUser");
    if (!LoggedInUser) {
      router.push('/');
    }

    setUser(LoggedInUser);
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
  }, [menu, setMenu]);

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
    setMenu("addDevice");
  }

  const showProfileChangeMenu = () => {
    setMenu("accChange");
  }

  const closeMenu = () => {
    setMenu(null);
  }

  return(
      <>
        <div className='navBar'>
          <span className="name">SmartHome App</span>
          <div className='options'>
            <a href="#" onClick={showProfileChangeMenu}>Konto: {user}</a>
            <a href="#" onClick={logout}>Wyloguj się</a>
          </div>
        </div>
        <main>
          
          <div className='menu'>
            <div className='logs'>
              <div className='past-logs'>
                <h3>Historia logów</h3>
              </div>
              <div className='live-logs'>
                <h3>Nowe logi</h3>
              </div>
            </div>
            <div className='devices'>
              <div className='controls'>
              <h3>Ustawienia</h3>
              </div>
              <div className='list'>
                <h3>Urządzenia</h3>
                <DevicesList className='DevicesList'/>
                <button className='addDeviceButton' onClick={showAddDeviceMenu}>+</button>
              </div>
            </div>
          </div>
        </main>
        {menu === "addDevice" ? (
          <div className='deviceMenu'>
            <AddDevice />
          </div>
        ) : null}
        {menu === "accChange" ? (
          <div className='deviceMenu'>
            <>
              <UsernameChange />
              <PasswordChange />
              <DeleteAcc />
              <button className='closeUserMenu' onClick={closeMenu}>X</button>
            </>
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