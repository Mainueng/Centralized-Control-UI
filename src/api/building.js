import axios from "axios";
import { SERV_LOCAL_API } from "../constant_config";

const ac_building = async (building_id) => {
  return await axios
    .get(SERV_LOCAL_API + "/ac/ac_building/" + building_id)
    .then((response) => {
      return response.data.data;
    });
};

const building_name = async (building_id) => {
  return await axios
    .get(SERV_LOCAL_API + "/ac/building_name/" + building_id)
    .then((response) => {
      return response.data.data;
    });
};

const all_power = async (building_id) => {
  return await axios
    .get(SERV_LOCAL_API + "/ac/all_power/" + building_id)
    .then((response) => {
      if (response.data.data[0].ac_infos.length) {
        return response.data.data[0].ac_infos[0].power;
      } else {
        return false;
      }
    });
};

const all_power_building = async (group_id) => {
  return await axios
    .get(SERV_LOCAL_API + "/ac/all_power_building/" + group_id)
    .then((response) => {
      return parseInt(response.data.data);
    });
};

export { ac_building, building_name, all_power, all_power_building };
