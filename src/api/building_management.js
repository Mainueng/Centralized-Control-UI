import axios from "axios";
import { SERV_LOCAL_API } from "../constant_config";

const building_list = async () => {
  return await axios
    .get(SERV_LOCAL_API + "/building_management/building_list")
    .then((res) => {
      return res.data.data;
    })
    .catch((err) => {
      console.log(err);
    });
};

const group_list = async () => {
  return await axios
    .get(SERV_LOCAL_API + "/building_management/group_list")
    .then((res) => {
      return res.data.data;
    })
    .catch((err) => {
      console.log(err);
    });
};

const serial_list = async () => {
  return await axios
    .get(SERV_LOCAL_API + "/building_management/serial_list")
    .then((res) => {
      return res.data.data;
    })
    .catch((err) => {
      console.log(err);
    });
};

const update_building = async (building_id, data) => {
  return await axios
    .post(
      SERV_LOCAL_API + "/building_management/update_building/" + building_id,
      data
    )
    .then(() => {
      return true;
    });
};

const add_building = async (data) => {
  return await axios
    .post(SERV_LOCAL_API + "/building_management/add_building", data)
    .then(() => {
      return true;
    });
};

const last_sort = async () => {
  return await axios
    .get(SERV_LOCAL_API + "/building_management/last_sort")
    .then((res) => {
      return res.data.data;
    })
    .catch((err) => {
      console.log(err);
    });
};

const delete_building = async (building_id) => {
  return await axios
    .delete(
      SERV_LOCAL_API + "/building_management/delete_building/" + building_id
    )
    .then((res) => {
      return res.data.data;
    })
    .catch((err) => {
      console.log(err);
    });
};

export {
  building_list,
  serial_list,
  group_list,
  update_building,
  add_building,
  last_sort,
  delete_building,
};
