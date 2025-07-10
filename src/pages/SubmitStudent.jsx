import React, { useState } from "react";
import { Link } from "react-router-dom";
import OutputContainer from "../components/OutputContainer.jsx";
import styles from "../styles/SubmitStudent.module.css";
import Nerd from "../assets/NerdBoy.png";
import axios from "axios";
import { ToastContainer, toast, Bounce } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

function SubmitStudent() {
    const [output, setOutput] = useState({ reg: "", name: "", email: "", contact: "" });
    const [student, setStudent] = useState({ reg: "", name: "", email: "", contact: "" });

    function handleChange(event) {
        const { name, value } = event.target;
        setStudent((prevValue) => ({
            ...prevValue,
            [name]: value
        }));
    }

    function handleCheckOut() {
        if (!/^\d{12}$/.test(student.reg)) {
            toast.error("Student reg number is empty or invalid", toastConfig);
            return;
        } else if (!/^[A-Za-z][A-Za-z ]+$/.test(student.name)) {
            toast.error("Student name is empty or invalid", toastConfig);
            return;
        } else if (!/^[0-9]{2}[a-z]{2}[0-9]{3}@xavier\.ac\.in$/.test(student.email)) {
            toast.error("Student email is empty or invalid", toastConfig);
            return;
        } else if (!/^\d{10}$/.test(student.contact)) {
            toast.error("Student contact is empty or invalid", toastConfig);
            return;
        }

        setOutput({ reg: student.reg, name: student.name, email: student.email, contact: student.contact });
        setStudent({ reg: "", name: "", email: "", contact: "" });
    }

    async function handleSubmit(event) {
        event.preventDefault();

        if (!output.reg || !output.name || !output.email || !output.contact) {
            toast.error("Inputs didn't checked out", toastConfig);
            return;
        }

        try {
            await axios.post("http://localhost:3000/students", output);
            toast.success("Student successfully submitted to the database", toastConfig);
        } catch (err) {
            if (err.response) {
                toast.error(err.response.data.message, toastConfig);
            } else {
                toast.error(`Error: ${err.message}`, toastConfig);
            }
        } finally {
            setOutput({ reg: "", name: "", email: "", contact: "" });
        }
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
            <img className={styles.img} src={Nerd} width={"120px"} alt={"user-logo"} />
            <div className={styles.container}>
                <h1>Submit Student</h1>
                <br />
                <form onSubmit={handleSubmit}>
                    <input onChange={handleChange} value={student.reg} id="reg" name="reg" placeholder="Enter reg Number" />
                    <input onChange={handleChange} value={student.name} id="name" name="name" placeholder="Enter Name" />
                    <input onChange={handleChange} value={student.email} id="email" name="email" placeholder="Enter email" />
                    <input onChange={handleChange} value={student.contact} id="contact" name="contact" placeholder="Enter Contact" />
                    <br />
                    <button onClick={handleCheckOut} type={"button"}>Check Out</button>
                    <button type={"submit"}>Submit Student</button>
                    <Link className={styles.back} to='/home'>Back</Link>
                </form>
                <br />
                <OutputContainer
                    reg={output.reg}
                    name={output.name}
                    email={output.email}
                    contact={output.contact}
                />
            </div>
        </div>
    );
}

export default SubmitStudent;
