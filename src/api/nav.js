import axios from "axios";
import { SERV_LOCAL_API } from "../constant_config";

const nav_list = async (group_id) => {
  return await axios
    .get(SERV_LOCAL_API + "/nav/nav_list/" + group_id)
    .then((response) => {
      return response.data.data;
    });
};

export { nav_list };
