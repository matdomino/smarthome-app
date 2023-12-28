import SignIn from "./SignIn";
import './login.scss';

export default function Login() {
  return(
    <>
      <div className="navBar">
        <span className="name">SmartHome App</span>
        <a href="https://github.com/matdomino" target="_blank">Mateusz Domino 2023-2024</a>
      </div>
      <div className="form">
        <SignIn />
      </div>
    </>
  );
}