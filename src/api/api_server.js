import axios from "axios";
import { SRV_SERV_API } from "../constant_config";

const api_set_power = async (sn, uid, cmd) => {
  return await axios
    .get(SRV_SERV_API + "/api/v2/device/" + sn + "/" + uid + "/power=" + cmd)
    .then((res) => {
      return res;
    })
    .catch((err) => {
      return err;
    });
};

const api_set_temp = async (sn, uid, cmd) => {
  return await axios
    .get(SRV_SERV_API + "/api/v2/device/" + sn + "/" + uid + "/temp=" + cmd)
    .then((res) => {
      return res;
    })
    .catch((err) => {
      return err;
    });
};

const api_set_swing = async (sn, uid, cmd) => {
  return await axios
    .get(SRV_SERV_API + "/api/v2/device/" + sn + "/" + uid + "/swing=" + cmd)
    .then((res) => {
      return res;
    })
    .catch((err) => {
      return err;
    });
};

const api_set_fspeed = async (sn, uid, cmd) => {
  return await axios
    .get(SRV_SERV_API + "/api/v2/device/" + sn + "/" + uid + "/fanspeed=" + cmd)
    .then((res) => {
      return res;
    })
    .catch((err) => {
      return err;
    });
};

const api_set_mode = async (sn, uid, cmd) => {
  return await axios
    .get(SRV_SERV_API + "/api/v2/device/" + sn + "/" + uid + "/mode=" + cmd)
    .then((res) => {
      return res;
    })
    .catch((err) => {
      return err;
    });
};

const api_set_all_power = async (sn, cmd) => {
  return await axios
    .get(SRV_SERV_API + "/api/v2/device/" + sn + "/all/power=" + cmd)
    .then((res) => {
      return res;
    })
    .catch((err) => {
      return err;
    });
};

export {
  api_set_power,
  api_set_temp,
  api_set_swing,
  api_set_fspeed,
  api_set_mode,
  api_set_all_power,
};
