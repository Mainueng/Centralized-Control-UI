import axios from "axios";
import { SERV_LOCAL_API } from "../constant_config";

const plan_list = async () => {
  return await axios
    .get(SERV_LOCAL_API + "/plan_management/plan_list")
    .then((res) => {
      return res.data.data;
    })
    .catch((err) => {
      console.log(err);
    });
};

const name_list = async () => {
  return await axios
    .get(SERV_LOCAL_API + "/plan_management/name_list")
    .then((res) => {
      return res.data.data;
    })
    .catch((err) => {
      console.log(err);
    });
};

const update_plan = async (plan_id, data) => {
  return await axios
    .post(SERV_LOCAL_API + "/plan_management/update_plan/" + plan_id, data)
    .then(() => {
      return true;
    });
};

const add_plan = async (data) => {
  return await axios
    .post(SERV_LOCAL_API + "/plan_management/add_plan", data)
    .then(() => {
      return true;
    });
};

const upload = async (data) => {
  return await axios
    .post(SERV_LOCAL_API + "/plan_management/upload", data)
    .then(() => {
      return true;
    });
};

const last_plan_sort = async () => {
  return await axios
    .get(SERV_LOCAL_API + "/plan_management/last_plan_sort")
    .then((res) => {
      return res.data.data;
    })
    .catch((err) => {
      console.log(err);
    });
};

const delete_plan = async (plan_id) => {
  return await axios
    .delete(SERV_LOCAL_API + "/plan_management/delete_plan/" + plan_id)
    .then((res) => {
      return res.data.data;
    })
    .catch((err) => {
      console.log(err);
    });
};

export {
  plan_list,
  name_list,
  update_plan,
  add_plan,
  upload,
  last_plan_sort,
  delete_plan,
};
