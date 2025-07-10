import React from 'react'

const OutputContainer = (props) => {
    return (
        <div>
            <h3>Reg Number : {props.reg}</h3>
            <h3>Student Name : {props.name}</h3>
            <h3>Student Address : {props.email}</h3>
            <h3>Student Contact : {props.contact}</h3>
        </div>
    );
}

export default OutputContainer;
