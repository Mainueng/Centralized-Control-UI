import axios from "axios";
import { SERV_LOCAL_API } from "../constant_config";

const ac_list = async () => {
  return await axios
    .get(SERV_LOCAL_API + "/ac_management/ac_list")
    .then((res) => {
      return res.data.data;
    })
    .catch((err) => {
      console.log(err);
    });
};

const building_list = async () => {
  return await axios
    .get(SERV_LOCAL_API + "/ac_management/building_list")
    .then((res) => {
      return res.data.data;
    })
    .catch((err) => {
      console.log(err);
    });
};

const update_ac = async (ac_id, data) => {
  return await axios
    .post(SERV_LOCAL_API + "/ac_management/update_ac/" + ac_id, data)
    .then(() => {
      return true;
    });
};

const add_ac = async (data) => {
  return await axios
    .post(SERV_LOCAL_API + "/ac_management/add_ac", data)
    .then(() => {
      return true;
    });
};

const delete_ac = async (group_id) => {
  return await axios
    .delete(SERV_LOCAL_API + "/ac_management/delete_ac/" + group_id)
    .then((res) => {
      return res.data.data;
    })
    .catch((err) => {
      console.log(err);
    });
};

const last_sort = async () => {
  return await axios
    .get(SERV_LOCAL_API + "/ac_management/last_sort")
    .then((res) => {
      return res.data.data;
    })
    .catch((err) => {
      console.log(err);
    });
};

export { ac_list, building_list, update_ac, add_ac, delete_ac, last_sort };
