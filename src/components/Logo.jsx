import React from 'react'
import Graduation from '../assets/graduation.png';
import styles from '../styles/Logo.module.css'
import { useNavigate, useLocation } from 'react-router-dom';
export default function Logo() {
  const navigate = useNavigate();
  const location = useLocation();
  const home = () =>{
    if(location.pathname != '/'  && location.pathname!='/home'){
      navigate('/home');
    }
  }
  return (
    <div className={`${styles.container} ${location.pathname === '/' ? styles.noPointer : ''}`} 
          onClick={home}>
      <img src={Graduation} alt="Logo" className={styles.image}/>
      <h1 className={styles.text}>Xavier's School</h1>
    </div>
  )
}
