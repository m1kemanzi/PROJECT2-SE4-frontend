import axios from "axios";

var baseurl = "http://localhost:3017/";


const apiClient = axios.create({
    baseURL: baseurl,
    headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "X-Requested-With": "XMLHttpRequest",
        "Access-Control-Allow-Origin": "*",
        crossDomain: true,
    }
});

export default apiClient;