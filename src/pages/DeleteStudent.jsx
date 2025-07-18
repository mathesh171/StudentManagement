import React, { useState } from "react";
import { Link } from "react-router-dom";
import Nerd from "../assets/NerdBoy.png";
import styles from "../styles/DeleteStudent.module.css";
import axios from "axios";
import { ToastContainer, toast, Bounce } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import Logo from "../components/Logo";
import LogoutButton from "../components/LogoutButton";

function DeleteStudent() {
    const [reg, setreg] = useState("");

    const toastConfig = {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        transition: Bounce
    };

    const handleChange = (event) => {
        setreg(event.target.value);
    };

    function handleSubmit(event) {
        event.preventDefault();

        if (!/^\d{12}$/.test(reg)) {
            toast.error("Student reg number is empty or invalid", toastConfig);
            return;
        }

    
        axios.get(`http://localhost:3000/students?reg=${reg}`)
            .then((response) => {
                if (response.data.length === 0) {
                    toast.error("Student not found", toastConfig);
                    return;
                }

                const studentId = response.data[0].id;

                
                return axios.delete(`http://localhost:3000/students/${studentId}`);
            })
            .then((deleteRes) => {
                toast.success("Student successfully deleted from the database", toastConfig);
                setreg("");
            })
            .catch((err) => {
                toast.error(`Error: ${err.message}`, toastConfig);
                setreg("");
            });
    }

    return (
        <div className={styles.element}>
             <div className={styles.topBar}>
                <Logo />
                <LogoutButton />
            </div>
            <ToastContainer />
             <div className={styles.container}>
                <div className={styles.leftSection}>
                    <img className={styles.img} src={Nerd} width={"120px"} alt={"user-logo"} />
                    <div className={styles.text}>
                        <h1>Delete Student</h1>
                    </div>
                </div>
                <div className={styles.rightSection}>
                    <form onSubmit={handleSubmit}>
                        <input
                            onChange={handleChange}
                            value={reg}
                            id="reg"
                            name="reg"
                            placeholder="Enter reg Number"
                            className={styles.input}
                        />
                        <h5>&nbsp;</h5>
                        <br />
                        <button type={"submit"} className={styles.button}>Delete Student</button>
                        <Link className={styles.back} to='/home'>Back</Link>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default DeleteStudent;
