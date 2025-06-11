import axios from "axios";

const Api = axios.create({
    // Base URL for the API
    baseURL: 'https://localhost:3000',
})

export default Api;