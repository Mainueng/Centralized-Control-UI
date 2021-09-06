import React, { useState, useEffect } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { CircleSlider } from "react-circle-slider";
import Picker from "react-mobile-picker-scroll";

import Nav from "../component/nav";
import {
  building_plan,
  serial_list,
  ac_list_data,
  // update_ac,
  update_all_power,
} from "../api/control";
import { api_set_all_power } from "../api/api_server";
import { all_power_building } from "../api/building";
import { add_job } from "../api/schedule";

import { initial_socket, unsubscribe, connect } from "../api/socket";

import home_icon from "../img/home-2.png";

let socket = initial_socket();

const Control = () => {
  const [buildingPlan, setBuildingPlan] = useState("");
  const [acBuilding, setAcBuilding] = useState([]);
  const [allPower, setAllPower] = useState(false);
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

  const history = useHistory();
  const location = useLocation();

  useEffect(() => {
    set_building_plan();
    set_default_all_power();

    subscribe(socket);

    return () => {
      if (socket.connected) {
        unsubscribe(socket);
      }
    };
  }, []);

  const set_building_plan = () => {
    let group_id = 1;

    if (location.state !== undefined) {
      group_id = location.state.group;
    }

    building_plan(group_id).then((res) => {
      if (res !== undefined) {
        setBuildingPlan(res.image.toLowerCase());
      }
    });
  };

  const subscribe = (socket) => {
    let group_id = 1;

    if (location.state !== undefined) {
      group_id = location.state.group;
    }

    serial_list(group_id)
      .then((res) => {
        if (res !== undefined) {
          ac_list_data(group_id)
            .then((res) => {
              if (res !== undefined) {
                setAcBuilding(res);
                if (res.length) {
                  res.map((item) => {
                    socket.on(item.serial_number, (message) => {
                      let serial_number = item.serial_number;
                      let ac_info = JSON.parse(message);
                      let power = 0;

                      ac_info.data.map((item) => {
                        if (
                          typeof item === "object" &&
                          typeof item.uid !== undefined
                        ) {
                          //update_ac(serial_number, item);

                          if (parseInt(item.onoff) === 1) {
                            power = 1;
                          }
                        }

                        return item;
                      });

                      update_all_power(serial_number, power);

                      let ac_data = res.map((data) => {
                        if (data.serial_number === serial_number) {
                          data.power = power;
                        }

                        return data;
                      });

                      setAcBuilding(ac_data);
                      set_default_all_power();
                    });

                    return item;
                  });
                }
              }
            })
            .catch(() => {
              setAcBuilding([]);
            });
        }
      })
      .catch(() => {
        setAcBuilding([]);
      });
  };

  const goto_building = (building_id) => {
    history.push({
      pathname: "building",
      state: { id: building_id },
    });
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

  const set_schedule = (sn) => {
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
      uid: "all",
      task: [
        { cmd: "power", value: data["power"] === 1 ? "on" : "off" },
        { cmd: "temp", value: data["set_temp"] },
      ],
      times: contab,
    };

    add_job(json)
      .then(() => {
        alert("Set Schedule Success!");
      })
      .catch((err) => {
        alert(err);
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

  const set_default_all_power = () => {
    let group_id = 1;

    if (location.state !== undefined) {
      group_id = location.state.group;
    }

    all_power_building(group_id).then((res) => {
      if (res > 0) {
        setAllPower(true);
      } else {
        setAllPower(false);
      }
    });
  };

  const set_all_power = (power) => {
    if (socket.connected) {
      unsubscribe(socket);
    }

    setAllPower(power);

    acBuilding.map((item) => {
      item.power = power;

      return item;
    });

    acBuilding.map((item) => {
      update_all_power(item.serial_number, power);
      api_set_all_power(item.serial_number, power ? "on" : "off");
      return item;
    });

    setTimeout(() => {
      connect(socket);
    }, 10000);
  };

  return (
    <div id="container">
      <Nav />
      <div id="content" className="vh-100 p-3">
        <div className="plan-container">
          <div className="plan-device-container">
            <img
              src={"./image/upload/" + buildingPlan}
              className="mx-auto d-block plan-image"
              alt={buildingPlan}
            />
            {acBuilding
              ? acBuilding.map((item, key) => (
                  <div
                    className="ac-icon-container"
                    style={{
                      top: item.y_axis + "%",
                      left: item.x_axis + "%",
                      transform: "rotate(" + item.rotate_angle + "deg)",
                      filter: item.power ? "grayscale(0)" : "grayscale(1)",
                    }}
                    key={key}
                    onClick={() => goto_building(item.building_group_id)}
                    title={item.building_name}
                  >
                    <img
                      src={home_icon}
                      alt="home-icon"
                      className="ac-icon mx-auto d-block"
                    />
                    <p className="ac_icon_name">{item.building_name}</p>
                  </div>
                ))
              : null}
          </div>
        </div>
      </div>
      <div className="ac-list-container pe-3">
        <div className="row">
          <div className="col-12">
            <div className="page-header">
              <h2 className="mb-0 pt-4">Building Plan</h2>
              <p className="plan-name">Overall Building</p>
            </div>
          </div>
          <div className="col-7 ac-list-header">
            <p className="mb-0">Power</p>
          </div>
          <div className="col-5 d-flex power-container">
            <div
              className={
                allPower
                  ? "w-100 d-flex justify-content-center align-items-center active"
                  : "w-100 d-flex justify-content-center align-items-center"
              }
              onClick={() => {
                setAllPower(true);
                set_all_power(1);
              }}
            >
              ON
            </div>
            <div
              className={
                allPower
                  ? "w-100 d-flex justify-content-center align-items-center"
                  : "w-100 d-flex justify-content-center align-items-center active"
              }
              onClick={() => {
                setAllPower(false);
                set_all_power(0);
              }}
            >
              OFF
            </div>
          </div>
          <div className="col-12 ac-list-header pt-4">
            <p>Devices</p>
            <div className="row col-12 mx-0 ac-list-card-container">
              {acBuilding
                ? acBuilding.map((item, key) => (
                    <div className="ac-list-card py-2 px-3 mb-3" key={key}>
                      <p className="pt-2 mx-2 mb-1">
                        {item.building_name}
                        <span className="pull-right">
                          <i
                            className="far fa-calendar-alt pointer"
                            data-bs-toggle="modal"
                            data-bs-target={"#modal-schedule" + key}
                          ></i>
                        </span>
                      </p>
                      <hr className="m-2" />
                      <div className="pt-0 row">
                        <div className="col-7">
                          <p className="mx-2 mb-2">Power</p>
                        </div>
                        <div className="col-5">
                          <p className="mx-2 mb-2 text-end">
                            {item.power ? "ON" : "OFF"}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                : null}
            </div>
          </div>
          {acBuilding
            ? acBuilding.map((item, key) => (
                <div
                  className="modal fade"
                  id={"modal-schedule" + key}
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
                              onClick={() => set_schedule(item.serial_number)}
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
              ))
            : null}
        </div>
      </div>
    </div>
  );
};

export default Control;
