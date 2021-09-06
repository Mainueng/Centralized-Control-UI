import axios from "axios";
import { SERV_LOCAL_API } from "../constant_config";

const building_list = async (group_id) => {
  return await axios
    .get(SERV_LOCAL_API + "/ac_position/building_list/" + group_id)
    .then((res) => {
      return res.data.data;
    })
    .catch((err) => {
      console.log(err);
    });
};

const ac_list = async (building_id, group) => {
  return await axios
    .get(SERV_LOCAL_API + "/ac_position/ac_list/" + building_id + "/" + group)
    .then((res) => {
      return res.data.data;
    })
    .catch((err) => {
      console.log(err);
    });
};

const ac_building = async (group) => {
  return await axios
    .get(SERV_LOCAL_API + "/ac_position/ac_building/" + group)
    .then((res) => {
      return res.data.data;
    })
    .catch((err) => {
      console.log(err);
    });
};

const add_ac = async (id, building_id) => {
  return await axios
    .get(SERV_LOCAL_API + "/ac_position/add_ac/" + building_id + "/" + id)
    .then((res) => {
      return res.data.data;
    })
    .catch((err) => {
      console.log(err);
    });
};

const remove_ac = async (id, building_id) => {
  return await axios
    .get(SERV_LOCAL_API + "/ac_position/remove_ac/" + building_id + "/" + id)
    .then((res) => {
      return res.data.data;
    })
    .catch((err) => {
      console.log(err);
    });
};

const update_ac = async (id, data) => {
  return await axios
    .post(SERV_LOCAL_API + "/ac_position/update_ac/" + id, data)
    .then(() => {
      return true;
    })
    .catch((err) => {
      console.log(err);
    });
};

const add_building = async (id, group_id) => {
  return await axios
    .get(SERV_LOCAL_API + "/ac_position/add_building/" + group_id + "/" + id)
    .then((res) => {
      return res.data.data;
    })
    .catch((err) => {
      console.log(err);
    });
};

const remove_building = async (id, group_id) => {
  return await axios
    .get(SERV_LOCAL_API + "/ac_position/remove_building/" + group_id + "/" + id)
    .then((res) => {
      return res.data.data;
    })
    .catch((err) => {
      console.log(err);
    });
};

const update_building = async (id, data) => {
  return await axios
    .post(SERV_LOCAL_API + "/ac_position/update_building/" + id, data)
    .then(() => {
      return true;
    })
    .catch((err) => {
      console.log(err);
    });
};

export {
  building_list,
  ac_list,
  ac_building,
  add_ac,
  remove_ac,
  update_ac,
  add_building,
  remove_building,
  update_building,
};
