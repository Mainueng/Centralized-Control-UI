import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Nav from "../component/nav";
import ResizableContent from "../component/resizableContent";

import {
  building_list,
  ac_building,
  ac_list,
  add_ac,
  remove_ac,
  update_ac,
  add_building,
  remove_building,
  update_building,
} from "../api/ac_position";

import air_conditioner from "../img/air-conditioner-2.png";
import home from "../img/home-2.png";
import close from "../img/close.png";

const AC_Position = () => {
  const [buildingList, setBuildingList] = useState([]);
  const [activeACList, setActiveACList] = useState([]);
  const [inactiveACList, setInactiveACList] = useState([]);
  const [buildingID, setBuildingID] = useState(0);
  const [plan, setPlan] = useState("untitled.png");
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [rotateAngle, setRotateAngle] = useState(0);
  const [group, setGroup] = useState(1);

  const location = useLocation();

  useEffect(() => {
    let group_id = 1;

    if (location.state !== undefined) {
      group_id = location.state.group;
      setGroup(location.state.group);
    }

    building_list(group_id)
      .then((res) => {
        if (res !== undefined) {
          setBuildingList(res);
        }
      })
      .catch((err) => {
        console.log(err);
        setBuildingList([]);
      });
  }, [location.state]);

  const change_plan = (e) => {
    if (e.target.value) {
      let building_id = e.target.value;

      setBuildingID(building_id);

      setTimeout(() => {
        let height = document.getElementById("plan").clientHeight;
        let width = document.getElementById("plan").clientWidth;

        setHeight(height);
        setWidth(width);
      });

      if (building_id < 1) {
        ac_building(group)
          .then((res) => {
            if (res !== undefined) {
              setPlan(res.plan_data.image);

              setTimeout(() => {
                let height = document.getElementById("plan").clientHeight;
                let width = document.getElementById("plan").clientWidth;

                setHeight(height);
                setWidth(width);

                setActiveACList(res.active_ac);
                setInactiveACList(res.inactive_ac);
              }, 100);
            }
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
        ac_list(building_id, group)
          .then((res) => {
            setPlan(res.plan_data.image);

            setTimeout(() => {
              let height = document.getElementById("plan").clientHeight;
              let width = document.getElementById("plan").clientWidth;

              setHeight(height);
              setWidth(width);

              setActiveACList(res.active_ac);
              setInactiveACList(res.inactive_ac);
            }, 100);
          })
          .catch((err) => {
            console.log(err);
          });
      }
    } else {
      setPlan("untitled.png");
      setActiveACList([]);
      setInactiveACList([]);
    }
  };

  const on_drag = (id, data) => {
    let position = activeACList.map((item) => {
      if (id === item.id) {
        item.x_axis = data.x_axis;
        item.y_axis = data.y_axis;
      }

      return item;
    });

    setActiveACList(position);

    return position;
  };

  const on_rotate = (id, data) => {
    let rotate_angle = activeACList.map((item) => {
      if (id === item.id) {
        item.rotate_angle = data.rotate_angle;
      }

      return item;
    });

    setRotateAngle(rotate_angle);

    return rotate_angle;
  };

  const addAc = (id) => {
    if (buildingID < 1) {
      add_building(id, group)
        .then((res) => {
          setActiveACList([]);
          setInactiveACList(res.inactive_ac);
          setActiveACList(res.active_ac);
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      add_ac(id, buildingID)
        .then((res) => {
          setActiveACList([]);
          setInactiveACList(res.inactive_ac);
          setActiveACList(res.active_ac);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const removeAc = (id) => {
    if (buildingID < 1) {
      remove_building(id, group)
        .then((res) => {
          setActiveACList([]);
          setInactiveACList(res.inactive_ac);
          setActiveACList(res.active_ac);
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      remove_ac(id, buildingID)
        .then((res) => {
          setActiveACList([]);
          setInactiveACList(res.inactive_ac);
          setActiveACList(res.active_ac);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const updateAC = () => {
    activeACList.map((item) => {
      let data = {
        x_axis: item.x_axis,
        y_axis: item.y_axis,
        rotate_angle: item.rotate_angle,
        status: item.status,
      };

      if (buildingID < 1) {
        update_building(item.id, data);
      } else {
        update_ac(item.id, data);
      }

      return item;
    });

    inactiveACList.map((item) => {
      let data = {
        x_axis: item.x_axis,
        y_axis: item.y_axis,
        rotate_angle: item.rotate_angle,
        status: item.status,
      };

      if (buildingID < 1) {
        update_building(item.id, data);
      } else {
        update_ac(item.id, data);
      }

      return item;
    });

    alert("Update Success!");
  };

  return (
    <div id="container">
      <Nav />
      <div id="content" className="position-container vh-100 p-3">
        <div className="p-4 mh-100">
          <h1 className="mx-4 mt-2">AC Management</h1>
          <div className="mx-4">
            <div className="row">
              <label className="form-label">Building:</label>
              <div className="col-3 pe-0">
                <select
                  className="form-select"
                  onChange={(e) => change_plan(e)}
                >
                  <option value="">------ Building List ------</option>
                  <option value="0">
                    {group === 1 ? "Overall Building" : "Overall Villa"}
                  </option>
                  {buildingList.length
                    ? buildingList.map((item, key) => (
                        <option key={key} value={item.id}>
                          {item.building_name}
                        </option>
                      ))
                    : null}
                </select>
              </div>
              <div className="col-auto px-0">
                <button className="ms-3 save-btn" onClick={() => updateAC()}>
                  Save
                </button>
              </div>
            </div>
            <div className="position-sub-container mt-4">
              <div className="plan-device-container" id="plan">
                <img
                  src={"./image/upload/" + plan}
                  className="mx-auto d-block plan-image"
                  alt=""
                />
                {activeACList.length
                  ? activeACList.map((item, key) => (
                      <ResizableContent
                        top={() => (item.y_axis / 100) * height}
                        left={() => (item.x_axis / 100) * width}
                        width={(height / 100) * 4}
                        height={(height / 100) * 4}
                        rotateAngle={item.rotate_angle}
                        id={item.id}
                        key={key}
                        drag={on_drag}
                        rotate={on_rotate}
                      >
                        <div
                          className="position-icon-container pointer"
                          title={item.ac_name}
                        >
                          <img
                            src={buildingID < 1 ? home : air_conditioner}
                            alt="home-icon"
                            className="ac-icon h-auto w-100 mx-auto d-block"
                            draggable="false"
                          />
                          <img
                            src={close}
                            alt=""
                            className="close-icon"
                            onClick={() => removeAc(item.id)}
                          />
                          <p className="ac_icon_name">{item.ac_name}</p>
                        </div>
                      </ResizableContent>
                    ))
                  : null}
              </div>
            </div>
          </div>
          <div className="d-flex flex-column overflow-table-container"></div>
        </div>
      </div>
      <div className="ac-list-container pe-3">
        <div className="row">
          <div className="col-12">
            <div className="page-header">
              <h2 className="mb-0 pt-4 pb-2">Device</h2>
            </div>
          </div>
          <div className="col-12 mx-0 ac-list-card-container">
            {inactiveACList.length
              ? inactiveACList.map((item, key) => (
                  <div className="ac-list-card py-2 px-3 mb-3" key={key}>
                    <p className="pt-2 mx-2 mb-1">{item.ac_name}</p>
                    <hr className="m-2" />
                    <div className="pt-0 row">
                      <div className="col-12">
                        <p
                          className="mx-2 mb-2 text-end pointer"
                          onClick={() => addAc(item.id)}
                        >
                          Add
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AC_Position;
