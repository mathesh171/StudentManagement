import React, { useState } from "react";
import { Link } from "react-router-dom";
import OutputContainer from "../components/OutputContainer.jsx";
import styles from "../styles/SubmitStudent.module.css";
import Nerd from "../assets/NerdBoy.png";
import axios from "axios";
import { ToastContainer, toast, Bounce } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import Logo from "../components/Logo.jsx";

const SubmitStudent = () => {
    const [output, setOutput] = useState({ reg: "", name: "", email: "", contact: "", dept: "", batch: "" });
    const [student, setStudent] = useState({ reg: "", name: "", email: "", contact: "", dept: "", batch: "" });

    const departments = ["cse", "ece", "eee", "mech", "civil", "bme", "aids", "it", "csbs", "areospace", "cybersecurity", "mechatronics"];
    const batches = Array.from({ length: 26 }, (_, i) => 2000 + i);

    const subjects = {
        cse: [
            ["Mathematics-I", "Physics", "Programming in C", "Engineering Graphics"],
            ["Mathematics-II", "Chemistry", "Data Structures", "Basic Electrical Engineering"],
            ["Discrete Mathematics", "OOP in Java", "Digital Logic", "Computer Architecture"],
            ["Operating Systems", "Database Management Systems", "Computer Networks", "Theory of Computation"],
            ["Web Technologies", "Software Engineering", "Compiler Design", "AI Fundamentals"],
            ["Machine Learning", "Cloud Computing", "IoT", "Cyber Security"],
            ["Big Data Analytics", "Mobile App Development", "Blockchain Technology"],
            ["Project Work", "Internship", "Entrepreneurship Development"]
        ],
        ece: [
            ["Mathematics-I", "Applied Physics", "Basics of Electronics", "Electrical Engineering"],
            ["Mathematics-II", "Analog Electronics", "Signals & Systems", "Digital Electronics"],
            ["Control Systems", "Network Theory", "Microprocessors", "Electromagnetics"],
            ["Digital Signal Processing", "Communication Systems", "VLSI Design", "Antennas"],
            ["Embedded Systems", "Wireless Communication", "Microwave Engineering", "Optical Communication"],
            ["Satellite Communication", "ASIC Design", "Nanoelectronics", "Advanced DSP"],
            ["IoT for ECE", "EDA Tools", "Biomedical Electronics"],
            ["Project Work", "Internship", "Seminar"]
        ],
        mech: [["Engineering Mechanics", "Thermodynamics", "Fluid Mechanics", "Manufacturing Processes"]], // Add more
        civil: [["Surveying", "Structural Analysis", "Geotechnical Engineering", "Transportation Engineering"]],
        bme: [["Human Anatomy", "Biomedical Instrumentation", "Medical Imaging", "Biomaterials"]],
        aids: [["AI Techniques", "Data Mining", "Probability & Statistics", "Data Analytics"]],
        it: [["Web Programming", "Mobile App Dev", "Cyber Laws", "UI/UX Design"]],
        csbs: [["Financial Accounting", "Business Strategy", "Python for Business", "Marketing Analytics"]],
        areospace: [["Aerodynamics", "Propulsion", "Flight Mechanics", "Space Dynamics"]],
        cybersecurity: [["Ethical Hacking", "Network Security", "Cyber Forensics", "Cryptography"]],
        mechatronics: [["Sensors & Actuators", "Mechatronics Systems", "Automation", "Robotics"]]
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        setStudent((prevValue) => ({
            ...prevValue,
            [name]: value
        }));
    };

    const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

    const generateScores = (dept) => {
        const deptSubjects = subjects[dept] || subjects["cse"];
        const score = {};
        deptSubjects.forEach((subList, i) => {
            const sem = `sem${i + 1}`;
            score[sem] = {};
            subList.forEach(sub => {
                score[sem][sub] = getRandomInt(40, 100);
            });
        });
        return score;
    };

    const generateAttendance = (year) => {
        const attendance = {};
        const start = new Date(`${year}-07-01`);
        let daysCounted = 0;
        let current = new Date(start);

        while (daysCounted < 180) {
            if (current.getDay() !== 0 && current.getDay() !== 6) {
                const dateStr = current.toISOString().split('T')[0];
                attendance[dateStr] = Math.random() < 0.8 ? "P" : "A";
                daysCounted++;
            }
            current.setDate(current.getDate() + 1);
        }
        return attendance;
    };

    const handleCheckOut = () => {
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
        } else if (!student.dept) {
            toast.error("Please select a department", toastConfig);
            return;
        } else if (!student.batch) {
            toast.error("Please select a batch", toastConfig);
            return;
        }

        
        setOutput({ 
            reg: student.reg, 
            name: student.name, 
            email: student.email, 
            contact: student.contact,
            dept: student.dept,
            batch: student.batch
        });
        
        setStudent({ reg: "", name: "", email: "", contact: "", dept: "", batch: "" });
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        if (!output.reg || !output.name || !output.email || !output.contact || !output.dept || !output.batch) {
            toast.error("Inputs didn't checked out", toastConfig);
            return;
        }

        const fullData = {
            ...output,
            scores: generateScores(output.dept),
            attendance: generateAttendance(output.batch)
        };

        axios.post("http://localhost:3000/students", fullData)
            .then(() => {
                toast.success("Student successfully submitted to the database", toastConfig);
                setOutput({ reg: "", name: "", email: "", contact: "", dept: "", batch: "" });
            })
            .catch((err) => {
                const message = err.response?.data?.message || `Error: ${err.message}`;
                toast.error(message, toastConfig);
            });
    };

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
            <ToastContainer {...toastConfig} />
            <Logo/>
            <div className={styles.container}>
                <div className={styles.leftSection}>
                    <img className={styles.img} src={Nerd} width={"120px"} alt={"user-logo"} />
                    <h1>Submit Student</h1>
                </div>
                <div className={styles.rightSection}>
                <form onSubmit={handleSubmit}>
                    <input onChange={handleChange} value={student.reg} id="reg" name="reg" placeholder="Enter reg Number" />
                    <input onChange={handleChange} value={student.name} id="name" name="name" placeholder="Enter Name" />
                    <input onChange={handleChange} value={student.email} id="email" name="email" placeholder="Enter email" />
                    <input onChange={handleChange} value={student.contact} id="contact" name="contact" placeholder="Enter Contact" />
                    <select name="dept" value={student.dept} onChange={handleChange}>
                        <option value="">Select Department</option>
                        {departments.map((d) => (
                            <option key={d} value={d}>{d.toUpperCase()}</option>
                        ))}
                    </select>
                    <select name="batch" value={student.batch} onChange={handleChange}>
                        <option value="">Select Batch</option>
                        {batches.map((year) => (
                            <option key={year} value={year}>{year}</option>
                        ))}
                    </select>
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
        </div>
    );
};

export default SubmitStudent;
