import axios from "axios";

const url = "http://localhost:3000/students";

export function PostCall(output) {
    return axios.post(url, output);
}

export function GetCall(reg) {
    return axios.get(`${url}/${reg}`);
}

export function DeleteCall(reg) {
    return axios.delete(`${url}/${reg}`);
}

export function PatchCall(reg, output) {
    return axios.patch(`${url}/${reg}`, output);
}