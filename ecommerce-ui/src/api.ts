import axios from "axios";

const api = axios.create({
  baseURL: "https://asmprn232-3.onrender.com",
});

export default api;