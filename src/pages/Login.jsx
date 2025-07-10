import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from '../styles/Login.module.css';

const Login = () => {
  const [admin, setAdmin] = useState({ username: "", password: "" });
  const [errMessage, setErrMessage] = useState("");

  // New focus state
  const [focusField, setFocusField] = useState("");

  const navigate = useNavigate();

  function handleChange(event) {
    const { name, value } = event.target;
    setAdmin(prevState => ({
      ...prevState,
      [name]: value
    }));
  }

  function handleLogin(event) {
    event.preventDefault();
    if (admin.username !== "Professor X") {
      setErrMessage("Username is not correct");
      setFocusField("username"); // set focus flag
      return;
    } else if (admin.password !== "charlesxavier") {
      setErrMessage("Password is not correct");
      setFocusField("password"); // set focus flag
      return;
    }
    navigate("/home");
  }

  useEffect(() => {
    if (focusField) {
      const input = document.getElementById(focusField);
      input?.focus();
      setFocusField(""); // reset after focusing
    }
  }, [focusField]);

  return (
    <div className={styles.centeredElement}>
      <img
        className={styles.loginImg}
        src={"./images/login-logo.png"}
        alt="login-logo"
      />
      <div className={styles.loginContainer}>
        <h1>Admin Login</h1>
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
