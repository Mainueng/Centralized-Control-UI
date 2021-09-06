import axios from "axios";
import { SERV_LOCAL_API } from "../constant_config";

const login_api = async (user) => {
  return await axios
    .post(SERV_LOCAL_API + "/user/login", {
      username: user.username,
      password: user.password,
    })
    .then((res) => {
      if (res.data.statusCode === 400) {
        localStorage.setItem("login_error", res.data.message);
      } else {
        localStorage.setItem("usertoken", res.data.data);
        localStorage.removeItem("login_error");
      }
    })
    .catch((err) => {
      if (err.response.data.error) {
        localStorage.setItem("login_error", err);
      }
    });
};

export { login_api };
