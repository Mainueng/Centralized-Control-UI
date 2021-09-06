import React, { useState, useEffect } from "react";
import Nav from "../component/nav";
import Pagination from "../component/pagination";
import { CircleSlider } from "react-circle-slider";
import Picker from "react-mobile-picker-scroll";

import { jobs_list, add_job, delete_job } from "../api/schedule";

const Schedule = () => {
  const [jobsList, setJobList] = useState([]);
  const [sun, setSun] = useState(false);
  const [mon, setMon] = useState(false);
  const [tue, setTue] = useState(false);
  const [wed, setWed] = useState(false);
  const [thu, setThu] = useState(false);
  const [fri, setFri] = useState(false);
  const [sat, setSat] = useState(false);
  const [schedulePower, setSchedulePower] = useState(0);
  const [scheduleTemp, setScheduleTemp] = useState(23);
  const [scheduleHour, setScheduleHour] = useState("00");
  const [scheduleMin, setScheduleMin] = useState("00");
  const [scheduleDay, setScheduleDay] = useState("");
  const [hourValueGroups, setHourValueGroups] = useState({ hour: "00" });
  const [hourOptionGroups, setHourOptionGroups] = useState({
    hour: [
      "00",
      "01",
      "02",
      "03",
      "04",
      "05",
      "06",
      "07",
      "08",
      "09",
      "10",
      "11",
      "12",
      "13",
      "14",
      "15",
      "16",
      "17",
      "18",
      "19",
      "20",
      "21",
      "22",
      "23",
    ],
  });
  const [minValueGroups, setMinValueGroups] = useState({ min: "00" });
  const [minOptionGroups, setMinOptionGroups] = useState({
    min: [
      "00",
      "01",
      "02",
      "03",
      "04",
      "05",
      "06",
      "07",
      "08",
      "09",
      "10",
      "11",
      "12",
      "13",
      "14",
      "15",
      "16",
      "17",
      "18",
      "19",
      "20",
      "21",
      "22",
      "23",
      "24",
      "25",
      "26",
      "27",
      "28",
      "29",
      "30",
      "31",
      "32",
      "33",
      "34",
      "35",
      "36",
      "37",
      "38",
      "39",
      "40",
      "41",
      "42",
      "43",
      "44",
      "45",
      "46",
      "47",
      "48",
      "49",
      "50",
      "51",
      "52",
      "53",
      "54",
      "55",
      "56",
      "57",
      "58",
      "59",
    ],
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [PerPage] = useState(10);

  const indexOfLastPost = currentPage * PerPage;
  const indexOfFirstPost = indexOfLastPost - PerPage;
  const currentPosts = jobsList.length
    ? jobsList.slice(indexOfFirstPost, indexOfLastPost)
    : [];

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  useEffect(() => {
    jobs_list()
      .then((res) => {
        if (res.data !== undefined) {
          setJobList(res.data);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const time_format = (date_time) => {
    if (date_time !== undefined) {
      var res = date_time.split(" ");
      var time = res[1] + ":" + res[0];

      return time;
    } else {
      return "-";
    }
  };

  function dateTxt(numDate) {
    switch (numDate) {
      case "0":
        return "SUN";
      case "1":
        return "MON";
      case "2":
        return "TUE";
      case "3":
        return "WED";
      case "4":
        return "THU";
      case "5":
        return "FRI";
      case "6":
        return "SAT";
      default:
        return "Sun,Mon,Tue,Wed,Thu,Fir,Sat";
    }
  }

  const date_format = (date_time) => {
    if (date_time !== undefined) {
      var res = date_time.split(" ");
      var date = res[4];
      const date_array = date.split(",");
      var jobDate = "";

      date_array.forEach((element) => {
        let dTxt = dateTxt(element);
        jobDate = jobDate.concat(" ", dTxt, ",");
      });

      jobDate = jobDate.trim();

      if (date === "*") {
        jobDate = "Sun,Mon,Tue,Wed,Thu,Fir,Sat";
      }

      return jobDate;
    } else {
      return "-";
    }
  };

  const handleHourChange = (name, value) => {
    setHourValueGroups({ [name]: value });
    setScheduleHour(value);

    setHourOptionGroups({
      hour: [
        "00",
        "01",
        "02",
        "03",
        "04",
        "05",
        "06",
        "07",
        "08",
        "09",
        "10",
        "11",
        "12",
        "13",
        "14",
        "15",
        "16",
        "17",
        "18",
        "19",
        "20",
        "21",
        "22",
        "23",
      ],
    });
  };

  const handleMinChange = (name, value) => {
    setMinValueGroups({ [name]: value });
    setScheduleMin(value);

    setMinOptionGroups({
      min: [
        "00",
        "01",
        "02",
        "03",
        "04",
        "05",
        "06",
        "07",
        "08",
        "09",
        "10",
        "11",
        "12",
        "13",
        "14",
        "15",
        "16",
        "17",
        "18",
        "19",
        "20",
        "21",
        "22",
        "23",
        "24",
        "25",
        "26",
        "27",
        "28",
        "29",
        "30",
        "31",
        "32",
        "33",
        "34",
        "35",
        "36",
        "37",
        "38",
        "39",
        "40",
        "41",
        "42",
        "43",
        "44",
        "45",
        "46",
        "47",
        "48",
        "49",
        "50",
        "51",
        "52",
        "53",
        "54",
        "55",
        "56",
        "57",
        "58",
        "59",
      ],
    });
  };

  const set_day = (day) => {
    if (day === "0") {
      setSun(!sun);
    } else if (day === "1") {
      setMon(!mon);
    } else if (day === "2") {
      setTue(!tue);
    } else if (day === "3") {
      setWed(!wed);
    } else if (day === "4") {
      setThu(!thu);
    } else if (day === "5") {
      setFri(!fri);
    } else if (day === "6") {
      setSat(!sat);
    }

    let days = scheduleDay;
    let res;
    if (days.search(day) > -1) {
      res = days.replace(day + ",", "");
    } else {
      res = days.concat(day + ",");
    }
    setScheduleDay(res);
  };

  const set_schedule = (sn, uid, id) => {
    let data = {
      power: schedulePower,
      set_temp: scheduleTemp,
      set_time: scheduleHour + "." + scheduleMin,
      set_day: scheduleDay.slice(0, -1),
    };

    if (!data["set_day"]) {
      data["set_day"] = "0,1,2,3,4,5,6,";

      setSun(true);
      setMon(true);
      setTue(true);
      setWed(true);
      setThu(true);
      setFri(true);
      setSat(true);
      setScheduleDay(data["set_day"]);
    }

    if (data["set_day"].charAt(data["set_day"].length - 1) === ",") {
      data["set_day"] = data["set_day"].slice(0, -1);
    }

    let contab = scheduleMin + " " + scheduleHour + " * * " + data["set_day"];

    let json = {
      gateway_sn: sn,
      uid: uid.replace(".", "_"),

      task: [
        { cmd: "power", value: data["power"] === 1 ? "on" : "off" },
        { cmd: "temp", value: data["set_temp"] },
      ],
      times: contab,
    };

    add_job(json)
      .then(() => {
        delete_schedule(id);

        jobs_list().then((res) => {
          if (res !== undefined) {
            setJobList(res.data);
          }
        });

        clear_schedule();

        alert("Update Schedule Success!");
      })
      .catch((err) => {
        alert(err);
      });
  };

  const delete_schedule = (id) => {
    delete_job(id).then(() => {
      jobs_list().then((res) => {
        if (res !== undefined) {
          setJobList(res.data);
        }
      });
    });
  };

  const clear_schedule = () => {
    setSun(false);
    setMon(false);
    setTue(false);
    setWed(false);
    setThu(false);
    setFri(false);
    setSat(false);
    setHourValueGroups({ hour: "00" });
    setMinValueGroups({ min: "00" });
    setSchedulePower(0);
    setScheduleTemp(23);
    setScheduleHour("00");
    setScheduleMin("00");
    setScheduleDay("");
  };

  return (
    <div id="container">
      <Nav />
      <div id="content" className="setting-container vh-100 p-3">
        <div className="p-4 mh-100">
          <h1 className="mx-4 mt-2">Schedule List</h1>
          <div className="d-flex flex-column overflow-table-container">
            <div className="px-4 h-auto overflow-table">
              <table className="table w-100 setting-table mt-4">
                <thead>
                  <tr>
                    <th className="text-center">No.</th>
                    <th className="text-center">Gateway No.</th>
                    <th className="text-center">Unit</th>
                    <th className="text-center">Task</th>
                    <th className="text-center">Date</th>
                    <th className="text-center">Time</th>
                    <th className="text-center">Location</th>
                    <th className="text-center">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {jobsList.length > 0 ? (
                    currentPosts.map((data, index) => (
                      <tr key={index}>
                        <td className="text-center">{index + 1}</td>
                        <td className="text-center">{data.gateway_sn}</td>
                        <td className="text-center">{data.uid}</td>
                        <td className="text-center">
                          {data.task.map((task, index) => (
                            <span key={index}>
                              {task.cmd + " : " + task.value + " "}
                            </span>
                          ))}
                        </td>
                        <td className="text-center">
                          {date_format(data.times)}
                        </td>
                        <td className="text-center">
                          {time_format(data.times)}
                        </td>
                        <td className="text-center">
                          {data.location.map((location, index) => (
                            <span key={index}>{location.location}</span>
                          ))}
                        </td>
                        <td className="text-center">
                          <span
                            className="pointer"
                            data-bs-toggle="modal"
                            data-bs-target={"#modal-schedule-" + data._id}
                          >
                            Edit
                          </span>{" "}
                          /{" "}
                          <span
                            className="text-danger pointer"
                            data-bs-toggle="modal"
                            data-bs-target={"#modal-delete-" + data._id}
                          >
                            Delete
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="8" className="text-center">
                        No Schedule
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="mt-4 px-4 pagination-container">
              <Pagination
                postsPerPage={PerPage}
                totalPosts={jobsList.length}
                paginate={paginate}
              />
            </div>
          </div>
          {jobsList.map((item, key) => (
            <div
              className="modal fade"
              id={"modal-schedule-" + item._id}
              key={key}
            >
              <div className="modal-dialog modal-lg modal-dialog-centered">
                <div className="modal-content control-container">
                  <div className="modal-body p-4">
                    <div className="row px-2">
                      <div className="col-4 d-flex align-items-center">
                        <i
                          className="fas fa-arrow-left pointer"
                          data-bs-dismiss="modal"
                        ></i>
                      </div>
                      <div className="col-4">
                        <h4 className="control-header text-center mb-0 align-items-center justify-content-center">
                          Schedule
                        </h4>
                      </div>
                      <div className="col-4 d-flex"></div>
                      <div className="col-6 mt-3 control-left-container ps-0">
                        <div className="row">
                          <div className="col-8 control-text mt-4 ps-4">
                            Power
                          </div>
                          <div className="col-4 d-flex power-container mt-4 pe-4">
                            <div
                              className={
                                schedulePower === 1
                                  ? "w-100 d-flex justify-content-center align-items-center active"
                                  : "w-100 d-flex justify-content-center align-items-center"
                              }
                              onClick={() => setSchedulePower(1)}
                            >
                              ON
                            </div>
                            <div
                              className={
                                schedulePower === 1
                                  ? "w-100 d-flex justify-content-center align-items-center"
                                  : "w-100 d-flex justify-content-center align-items-center active"
                              }
                              onClick={() => setSchedulePower(0)}
                            >
                              OFF
                            </div>
                          </div>
                          <div className="col-12 mt-4">
                            <div className="text-center control-text mb-3">
                              <p className="mb-3">Temperature</p>

                              <CircleSlider
                                value={scheduleTemp}
                                progressColor="#008BF1"
                                circleColor="#444444"
                                size={225}
                                progressWidth={12}
                                circleWidth={10}
                                knobRadius={10}
                                stepSize={0.5}
                                max={30}
                                min={15}
                                showTooltip={true}
                                tooltipSize={48}
                                tooltipColor="#FFFFFF"
                                shadow={false}
                                onChange={(e) => setScheduleTemp(e)}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                      {/* ---------------- */}
                      <div className="col-6 mt-3 d-flex align-items-center pe-0">
                        <div className="row">
                          <div className="col-12 text-center mt-4">
                            <p className="control-text mb-0">Set Time</p>
                          </div>
                          <div className="col-8 offset-2 d-flex justify-content-center align-items-center">
                            <Picker
                              optionGroups={hourOptionGroups}
                              valueGroups={hourValueGroups}
                              onChange={handleHourChange}
                              itemHeight={42}
                              height={126}
                            />
                            :
                            <Picker
                              optionGroups={minOptionGroups}
                              valueGroups={minValueGroups}
                              onChange={handleMinChange}
                              itemHeight={42}
                              height={126}
                            />
                          </div>
                          <div className="col-12 text-center mt-4">
                            <p className="control-text">Set Day</p>
                          </div>
                          <div className="col-12 d-flex justify-content-center align-items-center schedule-day-container">
                            <div
                              className={
                                sun
                                  ? "schedule-day d-flex justify-content-center align-items-center mx-1 active"
                                  : "schedule-day d-flex justify-content-center align-items-center mx-1"
                              }
                              onClick={() => set_day("0")}
                            >
                              <span>Sun</span>
                            </div>
                            <div
                              className={
                                mon
                                  ? "schedule-day d-flex justify-content-center align-items-center mx-1 active"
                                  : "schedule-day d-flex justify-content-center align-items-center mx-1"
                              }
                              onClick={() => set_day("1")}
                            >
                              Mon
                            </div>
                            <div
                              className={
                                tue
                                  ? "schedule-day d-flex justify-content-center align-items-center mx-1 active"
                                  : "schedule-day d-flex justify-content-center align-items-center mx-1"
                              }
                              onClick={() => set_day("2")}
                            >
                              Tue
                            </div>
                            <div
                              className={
                                wed
                                  ? "schedule-day d-flex justify-content-center align-items-center mx-1 active"
                                  : "schedule-day d-flex justify-content-center align-items-center mx-1"
                              }
                              onClick={() => set_day("3")}
                            >
                              Wed
                            </div>
                          </div>
                          <div className="col-12 d-flex justify-content-center align-items-center mt-2 schedule-day-container">
                            <div
                              className={
                                thu
                                  ? "schedule-day d-flex justify-content-center align-items-center mx-1 active"
                                  : "schedule-day d-flex justify-content-center align-items-center mx-1"
                              }
                              onClick={() => set_day("4")}
                            >
                              Thu
                            </div>
                            <div
                              className={
                                fri
                                  ? "schedule-day d-flex justify-content-center align-items-center mx-1 active"
                                  : "schedule-day d-flex justify-content-center align-items-center mx-1"
                              }
                              onClick={() => set_day("5")}
                            >
                              Fri
                            </div>
                            <div
                              className={
                                sat
                                  ? "schedule-day d-flex justify-content-center align-items-center mx-1 active"
                                  : "schedule-day d-flex justify-content-center align-items-center mx-1"
                              }
                              onClick={() => set_day("6")}
                            >
                              Sat
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-12 d-flex justify-content-center align-items-center pt-2 mt-4 mb-2">
                        <button
                          className="schedule-btn me-2"
                          onClick={() =>
                            set_schedule(item.gateway_sn, item.uid, item._id)
                          }
                          data-bs-dismiss="modal"
                        >
                          Set Schedule
                        </button>
                        <button
                          className="clear-schedule-btn ms-2"
                          onClick={() => {
                            clear_schedule();
                          }}
                        >
                          Clear Schedule
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
          {jobsList.map((data, key) => (
            <div
              className="modal fade"
              id={"modal-delete-" + data._id}
              key={"modal-delete-" + key}
            >
              <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content control-container">
                  <div className="modal-body p-4">
                    <div className="row">
                      <div className="col-12 text-center">
                        <h4>Do you want delete this job?</h4>
                      </div>
                      <div className="col-12 d-flex justify-content-center align-items-center pt-2 mt-4">
                        <button
                          className="schedule-btn me-2"
                          onClick={() => delete_schedule(data._id)}
                          data-bs-dismiss="modal"
                        >
                          Confirm
                        </button>
                        <button
                          className="clear-schedule-btn ms-2"
                          data-bs-dismiss="modal"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Schedule;
