import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "../styles/Score.module.css";

const ScorePage = ({ reg }) => {
    const [scores, setScores] = useState(null);

    useEffect(() => {
        axios.get(`http://localhost:3000/students?reg=${reg}`)
            .then((res) => {
                if (res.data.length > 0) {
                    setScores(res.data[0].scores);
                }
            });
    }, [reg]);

    return (
        <div className={styles.container}>
            <h1 className={styles.heading}>Semester-wise Score Details</h1>
            {scores ? Object.entries(scores).map(([sem, subjects]) => (
                <div key={sem} className={styles.card}>
                    <h2>{sem.toUpperCase()}</h2>
                    <ul>
                        {Object.entries(subjects).map(([subject, mark]) => (
                            <li key={subject}>{subject}: {mark}</li>
                        ))}
                    </ul>
                </div>
            )) : <p>Loading scores...</p>}
        </div>
    );
};

export default ScorePage;
