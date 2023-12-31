"use client";
import { useState } from "react";
import SignIn from "./SignIn";
import SignUp from "./SignUp";
import './login.scss';

export default function Login() {
  const [ SignInForm, setSignInForm ] = useState(true);

  const handleToggleForm = () => {
    setSignInForm(!SignInForm)
  };

  return(
    <>
      <div className="navBar">
        <span className="name">SmartHome App</span>
        <a href="https://github.com/matdomino" target="_blank">Mateusz Domino 2023-2024</a>
      </div>
      <div className="form">
        { SignInForm ? <SignIn toggleForm={handleToggleForm} /> : <SignUp toggleForm={handleToggleForm} /> }
      </div>
    </>
  );
}