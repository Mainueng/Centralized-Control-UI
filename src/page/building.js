import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { CircleSlider } from "react-circle-slider";
import Picker from "react-mobile-picker-scroll";

import Nav from "../component/nav";
import { ac_building, all_power, building_name } from "../api/building";
import { update_ac } from "../api/control";
import { add_job } from "../api/schedule";
import {
  api_set_power,
  api_set_temp,
  api_set_swing,
  api_set_fspeed,
  api_set_mode,
  api_set_all_power,
} from "../api/api_server";

import { initial_socket, unsubscribe, connect } from "../api/socket";

import air_conditioner from "../img/air-conditioner-2.png";
import swing_5 from "../img/swing_5.png";
import swing_4 from "../img/swing_4.png";
import swing_3 from "../img/swing_3.png";
import swing_2 from "../img/swing_2.png";
import swing_1 from "../img/swing_1.png";
import cool from "../img/cool.png";
import fan from "../img/fan.png";
import dry from "../img/dry.png";
import low from "../img/low.png";
import med from "../img/med.png";
import high from "../img/high.png";
import hi_hi from "../img/hi_hi.png";
import turbo from "../img/turbo.png";

let socket = initial_socket();

const Building = () => {
  const [acData, setAcData] = useState([]);
  const [allPower, setAllPower] = useState(false);
  const [buildingName, setBuildingName] = useState("");
  const [buildingID, setBuildingID] = useState(1);
  const [flip, setFlip] = useState(false);
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
  const [temp, setTemp] = useState(25);

  const location = useLocation();

  useEffect(() => {
    set_building_name();
    set_default_all_power();
    set_ac_list();

    return () => {
      if (socket.connected) {
        unsubscribe(socket);
      }
    };
  }, []);

  const set_ac_list = () => {
    let building_id = 1;

    if (location.state !== undefined) {
      building_id = location.state.id;
      setBuildingID(building_id);
    }

    ac_building(building_id).then((res) => {
      if (res !== undefined) {
        setAcData(res);
        subscribe(socket, building_id, res);
      }
    });
  };

  const subscribe = (socket, building_id, ac_data) => {
    ac_data.map((item) => {
      item.ac_infos.map((data) => {
        socket.on(data.serial_number, (message) => {
          let ac_info = JSON.parse(message);

          ac_info.data.map((item) => {
            if (typeof item === "object" && typeof item.uid !== undefined) {
              update_ac(data.serial_number, item);

              if (item.uid === data.uid) {
                data.power = item.onoff;
                data.set_temp = item.setTemp;
                data.room_temp = item.roomTemp;
                data.louver = item.louver;
                data.fspeed = item.fspeed;
                data.mode = item.mode;
                data.pm25 = item.iaq_pm25;
                data.co2 = item.iaq_co2;
                data.rh2 = item.iaq_rh2;
                data.iaq_connect = item.iaq_connect;
              }
            }

            return item;
          });

          setAcData([...ac_data]);

          all_power(building_id).then((res) => {
            if (parseInt(res)) {
              setAllPower(true);
            } else {
              setAllPower(false);
            }
          });
        });

        return data;
      });

      return item;
    });
  };

  const set_building_name = () => {
    let building_id = 1;

    if (location.state !== undefined) {
      building_id = location.state.id;
    }

    building_name(building_id).then((res) => {
      if (res !== undefined) {
        setBuildingName(res);
      }
    });
  };

  const set_default_all_power = () => {
    let building_id = 1;

    if (location.state !== undefined) {
      building_id = location.state.id;
    }

    all_power(building_id).then((res) => {
      if (res > 0) {
        setAllPower(true);
      } else {
        setAllPower(false);
      }
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

  const set_schedule = (sn, uid) => {
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
      uid: uid,
      task: [
        { cmd: "power", value: data["power"] === 1 ? "on" : "off" },
        { cmd: "temp", value: data["set_temp"] },
      ],
      times: contab,
    };

    add_job(json)
      .then(() => {
        clear_schedule();
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

  const set_power = (sn, uid, power) => {
    if (socket.connected) {
      unsubscribe(socket);
    }

    let ac_data = acData.map((item) => {
      item.ac_infos.map((data) => {
        if (sn === data.serial_number && uid === data.uid) {
          data.power = power === "on" ? 1 : 0;
        }

        return data;
      });

      return item;
    });

    setAcData([...ac_data]);
    uid = uid.replace(".", "_");

    if (power) {
      setAllPower(true);
    } else {
      all_power(buildingID).then((res) => {
        if (parseInt(res)) {
          setAllPower(true);
        } else {
          setAllPower(false);
        }
      });
    }

    api_set_power(sn, uid, power);

    setTimeout(() => {
      connect(socket);
    }, 10000);
  };

  const set_temp = (sn, uid) => {
    if (socket.connected) {
      unsubscribe(socket);
    }

    let ac_data = acData.map((item) => {
      item.ac_infos.map((data) => {
        if (sn === data.serial_number && uid === data.uid) {
          data.set_temp = temp;
        }

        return data;
      });

      return item;
    });

    setAcData([...ac_data]);
    uid = uid.replace(".", "_");

    api_set_temp(sn, uid, temp);

    setTimeout(() => {
      connect(socket);
    }, 10000);
  };

  const set_louver = (sn, uid, louver) => {
    if (socket.connected) {
      unsubscribe(socket);
    }

    let ac_data = acData.map((item) => {
      item.ac_infos.map((data) => {
        if (sn === data.serial_number && uid === data.uid) {
          data.louver = louver;
        }

        return data;
      });

      return item;
    });

    setAcData([...ac_data]);
    uid = uid.replace(".", "_");

    switch (louver) {
      case 1:
        louver = "h";
        break;
      case 2:
        louver = "3";
        break;
      case 3:
        louver = "4";
        break;
      case 4:
        louver = "6";
        break;
      case 5:
        louver = "v";
        break;
      default:
        louver = "a";
        break;
    }

    api_set_swing(sn, uid, louver);

    setTimeout(() => {
      connect(socket);
    }, 10000);
  };

  const set_fspeed = (sn, uid, fspeed) => {
    if (socket.connected) {
      unsubscribe(socket);
    }

    let ac_data = acData.map((item) => {
      item.ac_infos.map((data) => {
        if (sn === data.serial_number && uid === data.uid) {
          data.fspeed = fspeed;
        }

        return data;
      });

      return item;
    });

    setAcData([...ac_data]);
    uid = uid.replace(".", "_");

    switch (fspeed) {
      case "MED":
        fspeed = 3;
        break;
      case "HIGH":
        fspeed = 4;
        break;
      case "HI HI":
        fspeed = 5;
        break;
      case "TURBO":
        fspeed = 6;
        break;
      default:
        fspeed = 2;
        break;
    }

    api_set_fspeed(sn, uid, fspeed);

    setTimeout(() => {
      connect(socket);
    }, 10000);
  };

  const set_mode = (sn, uid, mode) => {
    if (socket.connected) {
      unsubscribe(socket);
    }

    let ac_data = acData.map((item) => {
      item.ac_infos.map((data) => {
        if (sn === data.serial_number && uid === data.uid) {
          data.mode = mode;
        }

        return data;
      });

      return item;
    });

    setAcData([...ac_data]);
    uid = uid.replace(".", "_");

    api_set_mode(sn, uid, mode.toLowerCase());

    setTimeout(() => {
      connect(socket);
    }, 10000);
  };

  const set_all_power = (power) => {
    if (socket.connected) {
      unsubscribe(socket);
    }

    let ac_data = acData.map((item) => {
      item.ac_infos.map((data) => {
        data.power = power;
        api_set_all_power(data.serial_number, power ? "on" : "off");

        return data;
      });

      return item;
    });

    setAllPower(power);
    setAcData([...ac_data]);

    setTimeout(() => {
      connect(socket);
    }, 10000);
  };

  return (
    <div id="container">
      <Nav />
      <div id="content" className="vh-100 p-3">
        <div className="plan-container">
          <nav>
            <div className="nav nav-tabs" id="nav-tab" role="tablist">
              {acData.length
                ? acData.map((item, key) => (
                    <button
                      key={key}
                      className={key ? "nav-link" : "nav-link active"}
                      id={"nav-" + key + "-tab"}
                      data-bs-toggle="tab"
                      data-bs-target={"#nav-" + key}
                      type="button"
                      role="tab"
                      aria-controls={"nav-" + key}
                      aria-selected="true"
                      title={item.building_name}
                    >
                      {item.building_name}
                    </button>
                  ))
                : null}
            </div>
          </nav>
          <div className="tab-content" id="nav-tabContent">
            {acData.length
              ? acData.map((item, key) => (
                  <div
                    key={key}
                    className={
                      key ? "tab-pane h-100 show" : "tab-pane h-100 show active"
                    }
                    id={"nav-" + key}
                    role="tabpanel"
                    aria-labelledby={"nav-" + key + "-tab"}
                  >
                    <div className="plan-device-container">
                      <img
                        src={"./image/upload/" + item.plan.image}
                        className="mx-auto d-block plan-image"
                        alt={item.plan.image}
                      />
                      {item.ac_infos.length
                        ? item.ac_infos.map((data, index) => (
                            <div
                              className="ac-icon-container"
                              style={{
                                top: data.y_axis + "%",
                                left: data.x_axis + "%",
                                transform:
                                  "rotate(" + data.rotate_angle + "deg)",
                                filter: parseInt(data.power)
                                  ? "grayscale(0)"
                                  : "grayscale(1)",
                              }}
                              key={index}
                              title={data.ac_name}
                              data-bs-toggle="modal"
                              data-bs-target={"#modal-" + data.id}
                            >
                              <img
                                src={air_conditioner}
                                alt="air_conditioner"
                                className="ac-icon mx-auto d-block"
                              />
                              <p className="ac_icon_name">{data.ac_name}</p>
                            </div>
                          ))
                        : null}
                    </div>
                  </div>
                ))
              : null}
          </div>
          {acData.length
            ? acData.map((item, key) =>
                item.ac_infos.length
                  ? item.ac_infos.map((data, index) => (
                      <div
                        className="modal fade"
                        id={"modal-" + data.id}
                        key={index}
                      >
                        <div
                          className={
                            flip
                              ? "modal-dialog modal-lg modal-dialog-centered flip-control-inner inner-flip"
                              : "modal-dialog modal-lg modal-dialog-centered flip-control-inner"
                          }
                        >
                          <div
                            className={
                              flip
                                ? "modal-content control-container control-front front-flip"
                                : "modal-content control-container control-front"
                            }
                          >
                            <div className="modal-body p-4">
                              <div className="row px-2">
                                <div className="col-2 d-flex align-items-center">
                                  <i
                                    className="fas fa-arrow-left pointer"
                                    data-bs-dismiss="modal"
                                    onClick={() => setFlip(false)}
                                  ></i>
                                </div>
                                <div className="col-8">
                                  <h4 className="control-header text-center mb-0 align-items-center justify-content-center">
                                    {data.ac_name}
                                  </h4>
                                </div>
                                <div className="col-2 d-flex align-items-center justify-content-end">
                                  <i
                                    className="fas fa-calendar-alt pointer"
                                    onClick={() => setFlip(!flip)}
                                  ></i>
                                </div>
                                <div className="col-6 my-3 control-left-container ps-0">
                                  <div className="row">
                                    <div className="col-8 control-text mt-4 ps-4">
                                      Power
                                    </div>
                                    <div className="col-4 d-flex power-container mt-4 pe-4">
                                      <div
                                        className={
                                          parseInt(data.power) === 1
                                            ? "w-100 d-flex justify-content-center align-items-center active"
                                            : "w-100 d-flex justify-content-center align-items-center"
                                        }
                                        onClick={() =>
                                          set_power(
                                            data.serial_number,
                                            data.uid,
                                            "on"
                                          )
                                        }
                                      >
                                        ON
                                      </div>
                                      <div
                                        className={
                                          parseInt(data.power) === 1
                                            ? "w-100 d-flex justify-content-center align-items-center"
                                            : "w-100 d-flex justify-content-center align-items-center active"
                                        }
                                        onClick={() =>
                                          set_power(
                                            data.serial_number,
                                            data.uid,
                                            "off"
                                          )
                                        }
                                      >
                                        OFF
                                      </div>
                                    </div>
                                    <div className="col-12 mt-4">
                                      <div className="text-center control-text mb-3">
                                        <p className="mb-3 control-text">
                                          Temperature
                                        </p>
                                        <div
                                          onMouseUp={() => {
                                            set_temp(
                                              data.serial_number,
                                              data.uid
                                            );
                                          }}
                                        >
                                          <CircleSlider
                                            value={data.set_temp}
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
                                            onChange={(e) => setTemp(e)}
                                            disabled={
                                              parseInt(data.power) === 1
                                                ? false
                                                : true
                                            }
                                          />
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="col-6 my-3 pe-0">
                                  <div className="row">
                                    <div className="col-8 control-text mt-4 ps-4">
                                      Room Temp
                                    </div>
                                    <div className="col-4 control-text mt-4 text-end pe-4">
                                      {data.room_temp + "  °C"}
                                    </div>
                                    <div className="col-4 control-text d-flex align-items-end justify-content-start mt-4 pt-2 ps-4">
                                      Swing
                                    </div>
                                    <div className="col-8 d-flex swing-container align-items-center justify-content-end mt-4 pt-2 pe-4">
                                      <div
                                        className={
                                          parseInt(data.louver) === 1 &&
                                          parseInt(data.power) === 1
                                            ? "w-100 d-flex justify-content-center align-items-center active"
                                            : "w-100 d-flex justify-content-center align-items-center"
                                        }
                                        onClick={() =>
                                          set_louver(
                                            data.serial_number,
                                            data.uid,
                                            1
                                          )
                                        }
                                      >
                                        <img src={swing_5} alt="swing" />
                                      </div>
                                      <div
                                        className={
                                          parseInt(data.louver) === 4 &&
                                          parseInt(data.power) === 1
                                            ? "w-100 d-flex justify-content-center align-items-center active"
                                            : "w-100 d-flex justify-content-center align-items-center"
                                        }
                                        onClick={() =>
                                          set_louver(
                                            data.serial_number,
                                            data.uid,
                                            4
                                          )
                                        }
                                      >
                                        <img src={swing_4} alt="swing" />
                                      </div>
                                      <div
                                        className={
                                          parseInt(data.louver) === 3 &&
                                          parseInt(data.power) === 1
                                            ? "w-100 d-flex justify-content-center align-items-center active"
                                            : "w-100 d-flex justify-content-center align-items-center"
                                        }
                                        onClick={() =>
                                          set_louver(
                                            data.serial_number,
                                            data.uid,
                                            3
                                          )
                                        }
                                      >
                                        <img src={swing_3} alt="swing" />
                                      </div>
                                      <div
                                        className={
                                          parseInt(data.louver) === 2 &&
                                          parseInt(data.power) === 1
                                            ? "w-100 d-flex justify-content-center align-items-center active"
                                            : "w-100 d-flex justify-content-center align-items-center"
                                        }
                                        onClick={() =>
                                          set_louver(
                                            data.serial_number,
                                            data.uid,
                                            2
                                          )
                                        }
                                      >
                                        <img src={swing_2} alt="swing" />
                                      </div>
                                      <div
                                        className={
                                          parseInt(data.louver) === 5 &&
                                          parseInt(data.power) === 1
                                            ? "w-100 d-flex justify-content-center align-items-center active"
                                            : "w-100 d-flex justify-content-center align-items-center"
                                        }
                                        onClick={() =>
                                          set_louver(
                                            data.serial_number,
                                            data.uid,
                                            5
                                          )
                                        }
                                      >
                                        <img src={swing_1} alt="swing" />
                                      </div>
                                      <div
                                        className={
                                          parseInt(data.louver) === 0 &&
                                          parseInt(data.power) === 1
                                            ? "w-100 d-flex justify-content-center align-items-center active"
                                            : "w-100 d-flex justify-content-center align-items-center"
                                        }
                                        onClick={() =>
                                          set_louver(
                                            data.serial_number,
                                            data.uid,
                                            0
                                          )
                                        }
                                      >
                                        Auto
                                      </div>
                                    </div>
                                    <div
                                      className="col-8 offset-4 mt-2 pt-1 text-center"
                                      style={{ fontSize: "14px" }}
                                    >
                                      {parseInt(data.louver)
                                        ? "Swing " + data.louver
                                        : "Swing Auto"}
                                    </div>
                                    <div className="col-4 control-text d-flex align-items-end justify-content-start mt-3 ps-4">
                                      Fan Speed
                                    </div>
                                    <div className="col-8 d-flex swing-container d-flex align-items-center justify-content-start mt-3 pe-4">
                                      <div
                                        className={
                                          data.fspeed === "LOW" &&
                                          parseInt(data.power) === 1
                                            ? "w-100 d-flex justify-content-center align-items-center active"
                                            : "w-100 d-flex justify-content-center align-items-center"
                                        }
                                        onClick={() =>
                                          set_fspeed(
                                            data.serial_number,
                                            data.uid,
                                            "LOW"
                                          )
                                        }
                                      >
                                        <img
                                          src={low}
                                          alt="fan"
                                          className="h-100"
                                        />
                                      </div>
                                      <div
                                        className={
                                          data.fspeed === "MED" &&
                                          parseInt(data.power) === 1
                                            ? "w-100 d-flex justify-content-center align-items-center active"
                                            : "w-100 d-flex justify-content-center align-items-center"
                                        }
                                        onClick={() =>
                                          set_fspeed(
                                            data.serial_number,
                                            data.uid,
                                            "MED"
                                          )
                                        }
                                      >
                                        <img
                                          src={med}
                                          alt="fan"
                                          className="h-100"
                                        />
                                      </div>
                                      <div
                                        className={
                                          data.fspeed === "HIGH" &&
                                          parseInt(data.power) === 1
                                            ? "w-100 d-flex justify-content-center align-items-center active"
                                            : "w-100 d-flex justify-content-center align-items-center"
                                        }
                                        onClick={() =>
                                          set_fspeed(
                                            data.serial_number,
                                            data.uid,
                                            "HIGH"
                                          )
                                        }
                                      >
                                        <img
                                          src={high}
                                          alt="fan"
                                          className="h-100"
                                        />
                                      </div>
                                      <div
                                        className={
                                          data.fspeed === "HI HI" &&
                                          parseInt(data.power) === 1
                                            ? "w-100 d-flex justify-content-center align-items-center active"
                                            : "w-100 d-flex justify-content-center align-items-center"
                                        }
                                        onClick={() =>
                                          set_fspeed(
                                            data.serial_number,
                                            data.uid,
                                            "HI HI"
                                          )
                                        }
                                      >
                                        <img
                                          src={hi_hi}
                                          alt="fan"
                                          className="h-100"
                                        />
                                      </div>
                                      <div
                                        className={
                                          data.fspeed === "TURBO" &&
                                          parseInt(data.power) === 1
                                            ? "w-100 d-flex justify-content-center align-items-center active"
                                            : "w-100 d-flex justify-content-center align-items-center"
                                        }
                                        onClick={() =>
                                          set_fspeed(
                                            data.serial_number,
                                            data.uid,
                                            "TURBO"
                                          )
                                        }
                                      >
                                        <img
                                          src={turbo}
                                          alt="fan"
                                          className="h-100"
                                        />
                                      </div>
                                    </div>
                                    <div
                                      className="col-8 offset-4 mt-2 pt-1 text-center"
                                      style={{ fontSize: "14px" }}
                                    >
                                      {data.fspeed === "HI HI"
                                        ? "HIGH HIGH"
                                        : data.fspeed}
                                    </div>
                                    <div className="col-12 control-text text-center mt-3">
                                      Mode
                                    </div>
                                    <div className="col-12 mt-3">
                                      <div className="d-flex justify-content-center align-items-center">
                                        <div
                                          className={
                                            data.mode === "COOL" &&
                                            parseInt(data.power) === 1
                                              ? "mode-container mx-2 d-flex justify-content-center align-items-center active-mode"
                                              : "mode-container mx-2 d-flex justify-content-center align-items-center"
                                          }
                                          onClick={() =>
                                            set_mode(
                                              data.serial_number,
                                              data.uid,
                                              "COOL"
                                            )
                                          }
                                        >
                                          <div className="mt-2">
                                            <img src={cool} alt="cool" />
                                            <p className="mb-0 mt-2">Cool</p>
                                          </div>
                                        </div>
                                        <div
                                          className={
                                            data.mode === "DRY" &&
                                            parseInt(data.power) === 1
                                              ? "mode-container mx-2 d-flex justify-content-center align-items-center active-mode"
                                              : "mode-container mx-2 d-flex justify-content-center align-items-center"
                                          }
                                          onClick={() =>
                                            set_mode(
                                              data.serial_number,
                                              data.uid,
                                              "DRY"
                                            )
                                          }
                                        >
                                          <div className="mt-2">
                                            <img src={dry} alt="dry" />
                                            <p className="mb-0 mt-2">Dry</p>
                                          </div>
                                        </div>
                                        <div
                                          className={
                                            data.mode === "FAN" &&
                                            parseInt(data.power) === 1
                                              ? "mode-container mx-2 d-flex justify-content-center align-items-center active-mode"
                                              : "mode-container mx-2 d-flex justify-content-center align-items-center"
                                          }
                                          onClick={() =>
                                            set_mode(
                                              data.serial_number,
                                              data.uid,
                                              "FAN"
                                            )
                                          }
                                        >
                                          <div className="mt-2">
                                            <img src={fan} alt="fan" />
                                            <p className="mb-0 mt-2">Fan</p>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="modal-content control-container control-back">
                            <div className="modal-body p-4">
                              <div className="row px-2">
                                <div className="col-4 d-flex align-items-center">
                                  <i
                                    className="fas fa-arrow-left pointer"
                                    data-bs-dismiss="modal"
                                    onClick={() => setFlip(false)}
                                  ></i>
                                </div>
                                <div className="col-4">
                                  <h4 className="control-header text-center mb-0 align-items-center justify-content-center">
                                    Schedule
                                  </h4>
                                </div>
                                <div className="col-4 d-flex align-items-center justify-content-end">
                                  <i
                                    className="fas fa-sliders-h pointer"
                                    onClick={() => setFlip(!flip)}
                                  ></i>
                                </div>
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
                                <div className="col-6 mt-3 d-flex align-items-center pe-0">
                                  <div className="row">
                                    <div className="col-12 text-center mt-4">
                                      <p className="control-text mb-0">
                                        Set Time
                                      </p>
                                    </div>
                                    <div className="col-8 offset-2 d-flex justify-content-center align-items-center pointer">
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
                                      set_schedule(data.serial_number, data.uid)
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
                    ))
                  : null
              )
            : null}
        </div>
      </div>
      <div className="ac-list-container pe-3">
        <div className="row">
          <div className="col-12">
            <div className="page-header">
              <h2 className="mb-0 pt-4">Building Plan</h2>
              <p className="plan-name">{buildingName}</p>
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
                set_all_power(0);
              }}
            >
              OFF
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-12 ac-list-header pt-4">
            <p>Devices</p>
            <div className="row col-12 mx-0 ac-list-card-container ">
              {acData.length
                ? acData.map((item) =>
                    item.ac_infos
                      ? item.ac_infos.map((data, index) => (
                          <div
                            className="ac-list-card py-2 px-3 mb-3 pointer"
                            key={index}
                            data-bs-toggle="modal"
                            data-bs-target={"#modal-" + data.id}
                          >
                            <p className="pt-2 mx-2 mb-1">{data.ac_name}</p>
                            <p
                              className={
                                data.ac_room ? "pt-2 mx-2 mb-1" : "d-none"
                              }
                            >
                              {data.ac_room}
                            </p>
                            <hr className="m-2" />
                            <div className="pt-0 row">
                              <div className="col-7">
                                <p className="mx-2 mb-2">Power</p>
                              </div>
                              <div className="col-5">
                                <p className="mx-2 mb-2 text-end">
                                  {parseInt(data.power) ? "ON" : "OFF"}
                                </p>
                              </div>
                              <div className="col-7">
                                <p className="mx-2 mb-2">Room Temp</p>
                              </div>
                              <div className="col-5">
                                <p className="mx-2 mb-2 text-end">
                                  {data.room_temp + " °C"}
                                </p>
                              </div>
                              <div className="col-7">
                                <p className="mx-2 mb-2">Set Temp</p>
                              </div>
                              <div className="col-5">
                                <p className="mx-2 mb-2 text-end">
                                  {data.set_temp + " °C"}
                                </p>
                              </div>
                              <div
                                className={
                                  data.iaq_connect === "YES"
                                    ? "col-5"
                                    : "col-5 d-none"
                                }
                              >
                                <p className="mx-2 mb-2">PM 2.5</p>
                              </div>
                              <div
                                className={
                                  data.iaq_connect === "YES"
                                    ? "col-7 ps-0"
                                    : "col-7 ps-0 d-none"
                                }
                              >
                                <p className="mx-2 mb-2 float-end">
                                  {data.pm25} ug/m<sup>3</sup>
                                </p>
                              </div>
                              <div
                                className={
                                  data.iaq_connect === "YES"
                                    ? "col-5"
                                    : "col-5 d-none"
                                }
                              >
                                <p className="mx-2 mb-2">
                                  CO<sub>2</sub>
                                </p>
                              </div>
                              <div
                                className={
                                  data.iaq_connect === "YES"
                                    ? "col-7 ps-0"
                                    : "col-7 ps-0 d-none"
                                }
                              >
                                <p className="mx-2 mb-2 float-end">
                                  {data.co2} ppm
                                </p>
                              </div>
                              <div
                                className={
                                  data.iaq_connect === "YES"
                                    ? "col-5"
                                    : "col-5 d-none"
                                }
                              >
                                <p className="mx-2 mb-2">Humidity</p>
                              </div>
                              <div
                                className={
                                  data.iaq_connect === "YES"
                                    ? "col-7 ps-0"
                                    : "col-7 ps-0 d-none"
                                }
                              >
                                <p className="mx-2 mb-2 float-end">
                                  {data.rh2} %
                                </p>
                              </div>
                            </div>
                          </div>
                        ))
                      : null
                  )
                : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Building;
