import axios from "axios";
import { SERV_LOCAL_API } from "../constant_config";

const ac_list = async (group_id) => {
  return await axios
    .get(SERV_LOCAL_API + "/report/ac_list/" + group_id)
    .then((res) => {
      return res.data.data;
    })
    .catch((err) => {
      console.log(err);
    });
};

const building_list = async (type) => {
  return await axios
    .get(SERV_LOCAL_API + "/report/building_list/" + type)
    .then((res) => {
      return res.data.data;
    })
    .catch((err) => {
      console.log(err);
    });
};

export { ac_list, building_list };
