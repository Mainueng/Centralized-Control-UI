import axios from "axios";
import { SRV_CRON_API } from "../constant_config";

const jobs_list = async () => {
  return await axios
    .get(SRV_CRON_API + "/job")
    .then((res) => {
      return res;
    })
    .catch((err) => {
      return [];
    });
};

const add_job = async (json) => {
  return await axios
    .post(SRV_CRON_API + "/job", json)
    .then((res) => {
      return res;
    })
    .catch((err) => {
      console.log(err);
    });
};

const update_job = async (id, json) => {
  return await axios
    .post(SRV_CRON_API + "/job/" + id, json)
    .then((res) => {
      return res;
    })
    .catch((err) => {
      console.log(err);
    });
};

const delete_job = async (id) => {
  return await axios.delete(SRV_CRON_API + "/job/" + id).then((res) => {
    return res;
  });
};

export { jobs_list, add_job, update_job, delete_job };
