import axios from "axios";
import { SRV_CRON_API } from "../constant_config";

const gateway_list = async () => {
  return await axios
    .get(SRV_CRON_API + "/gateway")
    .then((res) => {
      return res;
    })
    .catch((err) => {
      console.log(err);
    });
};

const maintenance_indoor = async (sn, date) => {
  return await axios
    .get(SRV_CRON_API + "/acweath/gsn=" + sn + "&start=" + date)
    .then((res) => {
      return res.data;
    })
    .catch(() => {
      return [];
    });
};

const maintenance_outdoor = async (sn, date) => {
  return await axios
    .get(SRV_CRON_API + "/oduweath/gsn=" + sn + "&start=" + date)
    .then((res) => {
      return res.data;
    })
    .catch(() => {
      return [];
    });
};

export { gateway_list, maintenance_indoor, maintenance_outdoor };
