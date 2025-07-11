import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from '../styles/Login.module.css';
import Logo from '../components/Logo';

const Login = () => {
  const [admin, setAdmin] = useState({ username: "", password: "" });
  const [errMessage, setErrMessage] = useState("");

  const navigate = useNavigate();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setAdmin(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleLogin = (event) => {
    event.preventDefault();
    if (admin.username !== "Professor X") {
      setErrMessage("Username is not correct");
      return;
    } else if (admin.password !== "charlesxavier") {
      setErrMessage("Password is not correct");
      return;
    }
    localStorage.setItem("isLoggedIn", "true");
    navigate("/home");
  };

  return (
    <div className={styles.centeredElement}>
      <Logo/>
      <div className={styles.loginContainer}>
        <div className={styles.title}>
          <img
            className={styles.loginImg}
            src={"./images/login-logo.png"}
            alt="login-logo"
          />
          <h1>Admin Login</h1>
        </div>
        <br />
        <form onSubmit={handleLogin} className={styles.loginForm}>
          <input
            onChange={handleChange}
            id="username"
            type="text"
            name="username"
            placeholder="Username"
            value={admin.username}
          />
          <input
            onChange={handleChange}
            id="password"
            type="password"
            name="password"
            placeholder="Password"
            value={admin.password}
          />
          <button type="submit">Login</button>
        </form>
        <h5 className={styles.error}>{errMessage}</h5>
      </div>
    </div>
  );
};

export default Login;
