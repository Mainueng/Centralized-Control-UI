import axios from "axios";
import { SERV_LOCAL_API } from "../constant_config";

const building_plan = async (group_id) => {
  return await axios
    .get(SERV_LOCAL_API + "/plan/overall_plan/" + group_id)
    .then((response) => {
      return response.data.data;
    });
};

const serial_list = async (id) => {
  return await axios
    .get(SERV_LOCAL_API + "/ac/serial_list/" + id)
    .then((response) => {
      return response.data.data;
    })
    .catch(() => {
      return [];
    });
};

const ac_list_data = async (group) => {
  return await axios
    .get(SERV_LOCAL_API + "/ac/building_list/" + group)
    .then((response) => {
      return response.data.data;
    })
    .catch(() => {
      return [];
    });
};

const update_ac = async (sn, data) => {
  return await axios
    .post(SERV_LOCAL_API + "/ac/update_ac/" + sn, data)
    .then(() => {
      return true;
    })
    .catch((err) => {
      console.log(err);
    });
};

const update_all_power = async (sn, power) => {
  return await axios
    .post(SERV_LOCAL_API + "/ac/update_all_power/" + sn + "/" + power)
    .then(() => {
      return true;
    });
};

const all_power = async (building_id) => {
  return await axios
    .get(SERV_LOCAL_API + "/ac/all_power_group/" + building_id)
    .then((response) => {
      if (response.data.data[0].ac_infos.length) {
        return response.data.data[0].ac_infos[0].power;
      } else {
        return false;
      }
    });
};

export {
  building_plan,
  serial_list,
  ac_list_data,
  update_ac,
  update_all_power,
  all_power,
};
