import React from 'react';
import styles from '../styles/OutputContainer.module.css';

const OutputContainer = (props) => {
    return (
        <div>
            <h3 className={styles.text}>Reg Number : {props.reg}</h3>
            <h3 className={styles.text}>Student Name : {props.name}</h3>
            <h3 className={styles.text}>Student Address : {props.email}</h3>
            <h3 className={styles.text}>Student Contact : {props.contact}</h3>
        </div>
    );
}

export default OutputContainer;
