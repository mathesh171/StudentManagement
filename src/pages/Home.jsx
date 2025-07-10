import React from "react";
import { Link } from "react-router-dom";
import styles from "../styles/Home.module.css";

const Home = () => {
  return (
    <div className={styles.centeredElement}>
      <div className={styles.studentContainer}>
        <h1>Student Management System Dashboard</h1>
        {/* <img
          src={"./images/dashboard-logo.png"}
          alt={"dashboard-logo"}
          className={styles.dashboardImage}
        /> */}
        <div className={styles.linkContainer}>
          <Link className={styles.navLink} to="/submit">Submit Student</Link>
          <Link className={styles.navLink} to="/get">Get Student Details</Link>
          <Link className={styles.navLink} to="/update">Update Student Details</Link>
          <Link className={styles.navLink} to="/delete">Delete Student</Link>
        </div>
      </div>
    </div>
  );
}

export default Home;
