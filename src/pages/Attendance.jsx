import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "../styles/Attendance.module.css";

const AttendancePage = ({ reg }) => {
    const [attendance, setAttendance] = useState(null);

    useEffect(() => {
        axios.get(`http://localhost:3000/students?reg=${reg}`)
            .then((res) => {
                if (res.data.length > 0) {
                    setAttendance(res.data[0].attendance);
                }
            });
    }, [reg]);

    return (
        <div className={styles.container}>
            <h1 className={styles.heading}>Attendance Record</h1>
            {attendance ? (
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Object.entries(attendance).map(([date, status]) => (
                            <tr key={date}>
                                <td>{date}</td>
                                <td className={status === "P" ? styles.present : styles.absent}>
                                    {status === "P" ? "Present" : "Absent"}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : <p>Loading attendance...</p>}
        </div>
    );
};

export default AttendancePage;
