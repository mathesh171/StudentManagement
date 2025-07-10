import React, { useState } from "react";
import { Link } from "react-router-dom";
import OutputContainer from "../components/OutputContainer";
import Nerd from "../assets/NerdBoy.png";
import { ToastContainer, toast, Bounce } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import axios from "axios";
import styles from "../styles/GetStudent.module.css";

const GetStudent = () => {
    const [output, setOutput] = useState({ reg: "", name: "", email: "", contact: "" });
    const [reg, setreg] = useState("");
    const [focusField, setFocusField] = useState("");

    const handleChange = (event) => {
        setOutput({ reg: "", name: "", email: "", contact: "" });
        setreg(event.target.value);
    };

    function handleSubmit(event) {
        event.preventDefault();

        if (!/^\d{12}$/.test(reg)) {
            toast.error("Student reg number is empty or invalid", toastConfig);
            setFocusField("reg");
            return;
        }

        axios
            .get(`http://localhost:3000/students?reg=${reg}`)
            .then((response) => {
                if (response.data.length === 0) {
                    toast.error("Student not found", toastConfig);
                } else {
                    const student = response.data[0];
                    toast.success("Student successfully fetched from the database", toastConfig);
                    setOutput({
                        reg: student.reg,
                        name: student.name,
                        email: student.email,
                        contact: student.contact
                    });
                }
                setreg("");
            })
            .catch((err) => {
                if (err.response) {
                    toast.error(err.response.data.message || "Student not found", toastConfig);
                } else {
                    toast.error(`Error: ${err.message}`, toastConfig);
                }
                setreg("");
            });
    }

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

    return (
        <div className={styles.element}>
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick={false}
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="dark"
                transition={Bounce}
            />
            <img className={styles.img} src={Nerd} width={"100px"} alt={"student-logo"} />
            <div className={styles.container}>
                <h1>Get Student Details</h1>
                <br />
                <form onSubmit={handleSubmit}>
                    <input
                        onChange={handleChange}
                        value={reg}
                        id="reg"
                        name="reg"
                        placeholder="Enter reg Number"
                        className={focusField === "reg" ? styles.inputError : styles.input}
                    />
                    <h5>&nbsp;</h5>
                    <br />
                    <button type={"submit"} className={styles.button}>Get Student Details</button>
                    <Link className={styles.link} to='/home'>Back</Link>
                </form>
                <OutputContainer
                    reg={output.reg}
                    name={output.name}
                    email={output.email}
                    contact={output.contact}
                />
                <br />
                <h4>&nbsp;</h4>
            </div>
        </div>
    );
};

export default GetStudent;
