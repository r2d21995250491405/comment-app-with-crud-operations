import axios from "axios";

const api = axios.create({
    baseURL: process.env.REACT_APP_SERVER_URL,
    withCredentials: true
})
export async function makeRequest(url, options) {

    try {
        const res = await axios(`http://localhost:3001${url}`, options);
        return res.data;
    } catch (error) {
        return await Promise.reject(error?.response?.data?.message ??
            "kek");
    }
}