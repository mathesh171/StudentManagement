import React from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "../styles/Home.module.css";
import Logo from "../components/Logo";


const Home = () => {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    navigate('/');
  };

  return (
    <div className={styles.centeredElement}>
      <div className={styles.topBar}>
        <Logo />
        <button onClick={handleLogout} className={styles.logout}>Logout</button>
      </div>
      <div className={styles.scrollContent}>
        <div className={styles.studentContainer}>
          <div className={styles.splitContent}>
            <div className={styles.leftSection}>
              <h1>Student Management System Dashboard</h1>
              <img
                src={"./images/dashboard-logo.png"}
                alt={"dashboard-logo"}
                className={styles.dashboardImage}
              />
            </div>
            <div className={styles.rightSection}>
              <div className={styles.linkContainer}>
                <Link className={styles.navLink} to="/submit">Submit Student</Link>
                <Link className={styles.navLink} to="/get">Get Student Details</Link>
                <Link className={styles.navLink} to="/update">Update Student Details</Link>
                <Link className={styles.navLink} to="/delete">Delete Student</Link>
                <Link className={styles.navLink} to="/score">Score Analysis</Link>
                <Link className={styles.navLink} to="/attendance">Attendace Analysis</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

  );
}

export default Home;
