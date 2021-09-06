import axios from "axios";
import { SERV_LOCAL_API } from "../constant_config";

const group_list = async () => {
  return await axios
    .get(SERV_LOCAL_API + "/group_management/group_list")
    .then((res) => {
      return res.data.data;
    })
    .catch((err) => {
      console.log(err);
    });
};

const update_group = async (group_id, data) => {
  return await axios
    .post(SERV_LOCAL_API + "/group_management/update_group/" + group_id, data)
    .then(() => {
      return true;
    });
};

const add_group = async (data) => {
  return await axios
    .post(SERV_LOCAL_API + "/group_management/add_group", data)
    .then(() => {
      return true;
    });
};

const delete_group = async (group_id) => {
  return await axios
    .delete(SERV_LOCAL_API + "/group_management/delete_group/" + group_id)
    .then((res) => {
      return res.data.data;
    })
    .catch((err) => {
      console.log(err);
    });
};

export { group_list, update_group, add_group, delete_group };
