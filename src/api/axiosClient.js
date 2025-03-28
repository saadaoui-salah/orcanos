import axios from "axios";

// /orcanosdemo/api/v2/Json/QW_Login

export const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});
