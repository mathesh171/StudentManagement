import React, { useState } from "react";
import { Link } from "react-router-dom";
import OutputContainer from "../components/OutputContainer";
import { ToastContainer, toast, Bounce } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import Nerd from "../assets/NerdBoy.png";
import styles from "../styles/UpdateStudent.module.css";
import axios from "axios";

const UpdateStudent = () => {
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

        setOutput({ ...student });
        setStudent({ reg: "", name: "", email: "", contact: "" });
    }

    function handleSubmit(event) {
        event.preventDefault();

        if (!output.reg || !output.name || !output.email || !output.contact) {
            toast.error("Inputs didn't checked out", toastConfig);
            return;
        }

        axios
            .get(`http://localhost:3000/students?reg=${output.reg}`)
            .then((res) => {
                if (res.data.length === 0) {
                    toast.error("Student not found", toastConfig);
                } else {
                    const studentId = res.data[0].id;
                    axios
                        .patch(`http://localhost:3000/students/${studentId}`, output)
                        .then(() => {
                            toast.success("Student successfully updated in the database", toastConfig);
                        })
                        .catch((err) => {
                            toast.error(`Update failed: ${err.message}`, toastConfig);
                        });
                }
            })
            .catch((err) => {
                toast.error(`Error fetching student: ${err.message}`, toastConfig);
            });

        setOutput({ reg: "", name: "", email: "", contact: "" });
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
                <h1>Update Student Details</h1>
                <br />
                <form onSubmit={handleSubmit}>
                    <input onChange={handleChange} value={student.reg} id="reg" name="reg" placeholder="Enter reg Number" className={styles.input} />
                    <input onChange={handleChange} value={student.name} id="name" name="name" placeholder="Enter Name" className={styles.input} />
                    <input onChange={handleChange} value={student.email} id="email" name="email" placeholder="Enter email" className={styles.input} />
                    <input onChange={handleChange} value={student.contact} id="contact" name="contact" placeholder="Enter Contact" className={styles.input} />
                    <h5>&nbsp;</h5>
                    <br />
                    <button onClick={handleCheckOut} type={"button"} className={styles.button}>Check Out</button>
                    <button type={"submit"} className={styles.button}>Update Student Details</button>
                    <Link className={styles.back} to='/home'>Back</Link>
                </form>
                <br />
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

export default UpdateStudent;
