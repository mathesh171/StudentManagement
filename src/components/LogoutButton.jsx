import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/LogoutButton.module.css';
export default function LogoutButton() {
    const navigate = useNavigate();
    const handleLogout = () => {
        localStorage.removeItem('isLoggedIn');
        navigate('/');
    };
  return (
    <div>
      <button onClick={handleLogout} className={styles.logout}>Logout</button>
    </div>
  )
}
