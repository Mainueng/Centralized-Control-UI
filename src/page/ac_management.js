import React, { useState, useEffect } from "react";
import Nav from "../component/nav";
import Pagination from "../component/pagination";

import {
  ac_list,
  building_list,
  add_ac,
  update_ac,
  delete_ac,
  last_sort,
} from "../api/ac_management";

const AC_Management = () => {
  const [acList, setAcList] = useState([]);
  const [buildingList, setBuildingList] = useState([]);
  const [errorForm, setErrorForm] = useState({
    serial_number: false,
    uid: false,
    ac_name: false,
    building: false,
  });
  const [acInfo, setAcInfo] = useState({
    serial_number: "",
    uid: "",
    ac_name: "",
    ac_room: "",
    building: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [PerPage] = useState(20);

  useEffect(() => {
    building_list()
      .then((res) => {
        if (res !== undefined) {
          setBuildingList(res);
        }
      })
      .catch((err) => {
        console.log(err);
        setBuildingList([]);
      });

    ac_list()
      .then((res) => {
        if (res !== undefined) {
          setAcList(res);
        }
      })
      .catch((err) => {
        console.log(err);
        setAcList([]);
      });
  }, []);

  const indexOfLastPost = currentPage * PerPage;
  const indexOfFirstPost = indexOfLastPost - PerPage;
  const currentPosts = acList.length
    ? acList.slice(indexOfFirstPost, indexOfLastPost)
    : [];

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const ac_name_handle = (e) => {
    if (e.target.value !== "") {
      setErrorForm({
        ...errorForm,
        ac_name: false,
      });
    } else {
      setErrorForm({
        ...errorForm,
        ac_name: true,
      });
    }

    setAcInfo({
      ...acInfo,
      ac_name: e.target.value,
    });
  };

  const ac_room_handle = (e) => {
    if (e.target.value !== "") {
      setErrorForm({
        ...errorForm,
        ac_room: false,
      });
    } else {
      setErrorForm({
        ...errorForm,
        ac_room: true,
      });
    }

    setAcInfo({
      ...acInfo,
      ac_room: e.target.value,
    });
  };

  const serial_number_handle = (e) => {
    if (e.target.value !== "-") {
      setErrorForm({
        ...errorForm,
        serial_number: false,
      });
    } else {
      setErrorForm({
        ...errorForm,
        serial_number: true,
      });
    }

    setAcInfo({
      ...acInfo,
      serial_number: e.target.value,
    });
  };

  const uid_handle = (e) => {
    if (e.target.value !== "") {
      setErrorForm({
        ...errorForm,
        uid: false,
      });
    } else {
      setErrorForm({
        ...errorForm,
        uid: true,
      });
    }

    setAcInfo({
      ...acInfo,
      uid: e.target.value,
    });
  };

  const building_handle = (e) => {
    if (e.target.value !== "-") {
      setErrorForm({
        ...errorForm,
        building: false,
      });
    } else {
      setErrorForm({
        ...errorForm,
        building: true,
      });
    }

    setAcInfo({
      ...acInfo,
      building: e.target.value,
    });
  };

  const deleteAC = (ac_id) => {
    delete_ac(ac_id).then(() => {
      alert("Delete Success!");

      ac_list()
        .then((res) => {
          setAcList([...res]);
        })
        .catch((err) => {
          console.log(err);
        });
    });

    setAcInfo({});
  };

  const updateInfo = (ac_id, data) => {
    if (
      !errorForm.serial_number &&
      !errorForm.uid &&
      !errorForm.ac_name &&
      !errorForm.ac_room &&
      !errorForm.building
    ) {
      let update_data = {
        serial_number: acInfo.serial_number
          ? acInfo.serial_number
          : data.serial_number,
        uid: acInfo.uid ? acInfo.uid : data.uid,
        ac_name: acInfo.ac_name ? acInfo.ac_name : data.ac_name,
        ac_room: acInfo.ac_room ? acInfo.ac_room : data.ac_room,
        building: acInfo.building ? acInfo.building : data.building_id,
      };

      update_ac(ac_id, update_data).then(() => {
        alert("Update Success!");

        ac_list()
          .then((res) => {
            setAcList([...res]);
          })
          .catch((err) => {
            console.log(err);
          });
      });

      setAcInfo({});
    }
  };

  const addInfo = () => {
    last_sort().then((data) => {
      if (acInfo.ac_name === "") {
        setErrorForm({ ...errorForm, ac_name: true });
      }

      if (acInfo.ac_room === "") {
        setErrorForm({ ...errorForm, ac_room: true });
      }

      if (acInfo.serial_number === "") {
        setErrorForm({ ...errorForm, serial_number: true });
      }

      if (acInfo.uid === "") {
        setErrorForm({ ...errorForm, uid: true });
      }

      if (acInfo.building === "") {
        setErrorForm({ ...errorForm, building: true });
      }

      if (
        acInfo.serial_number !== "" &&
        acInfo.uid !== "" &&
        acInfo.ac_name !== "" &&
        acInfo.ac_room !== "" &&
        acInfo.building !== ""
      ) {
        let add_data = {
          serial_number: acInfo.serial_number,
          uid: acInfo.uid,
          ac_name: acInfo.ac_name,
          ac_room: acInfo.ac_room,
          building: acInfo.building,
          sort: data !== null ? parseInt(data.sort) + 1 : 1,
        };

        add_ac(add_data).then(() => {
          alert("Add Success!");

          ac_list()
            .then((res) => {
              setAcList([...res]);
            })
            .catch((err) => {
              console.log(err);
            });
        });
      }
    });
  };

  return (
    <div id="container">
      <Nav />
      <div id="content" className="setting-container vh-100 p-3">
        <div className="p-4 mh-100">
          <h1 className="mx-4 mt-2">
            AC Management
            <span
              className="float-end pointer"
              data-bs-toggle="modal"
              data-bs-target={"#modal-add"}
            >
              +
            </span>
          </h1>
          <div className="d-flex flex-column overflow-table-container">
            <div className="px-4 h-auto overflow-table">
              <table className="table w-100 setting-table mt-4">
                <thead>
                  <tr>
                    <th className="text-center">No.</th>
                    <th className="text-center">Serial Number</th>
                    <th className="text-center">UID</th>
                    <th className="text-center">AC Name</th>
                    <th className="text-center">Building</th>
                    <th className="text-center">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {currentPosts.map((data, index) => (
                    <tr key={index}>
                      <td className="text-center">{data.id}</td>
                      <td className="text-center">
                        {data.serial_number ? data.serial_number : "-"}
                      </td>
                      <td className="text-center">
                        {data.uid ? data.uid : "-"}
                      </td>
                      <td className="text-center">
                        {data.ac_name ? data.ac_name : "-"}
                      </td>
                      <td className="text-center">
                        {data.building_name ? data.building_name : "-"}
                      </td>
                      <td className="text-center">
                        <span
                          className="pointer"
                          data-bs-toggle="modal"
                          data-bs-target={"#modal-edit-" + data.id}
                        >
                          Edit
                        </span>{" "}
                        /{" "}
                        <span
                          className="text-danger pointer"
                          data-bs-toggle="modal"
                          data-bs-target={"#modal-delete-" + data.id}
                        >
                          Delete
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-4 px-4 pagination-container">
              <Pagination
                postsPerPage={PerPage}
                totalPosts={acList.length}
                paginate={paginate}
              />
            </div>
          </div>
        </div>
      </div>
      {/* -------- Add Form Modal -------- */}
      <div className="modal fade" id="modal-add">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content control-container">
            <div className="modal-body p-4">
              <div className="row">
                <div className="col-12 text-center">
                  <h4>Add AC</h4>
                </div>
                <div className="col-12 mt-3 px-4">
                  <div className="mb-3">
                    <label htmlFor="serial_number" className="form-label">
                      Serial Number
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Serial Number"
                      onChange={(e) => serial_number_handle(e)}
                    />
                    <div
                      className={
                        errorForm.serial_number ? "error-form" : "d-none"
                      }
                    >
                      Please enter serial number.
                    </div>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="uid" className="form-label">
                      UID
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="UID"
                      onChange={(e) => uid_handle(e)}
                    />
                    <div className={errorForm.uid ? "error-form" : "d-none"}>
                      Please enter UID.
                    </div>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="uid" className="form-label">
                      AC Name
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="AC Name"
                      onChange={(e) => ac_name_handle(e)}
                    />
                    <div
                      className={errorForm.ac_name ? "error-form" : "d-none"}
                    >
                      Please enter ac name.
                    </div>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="uid" className="form-label">
                      AC Room
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="AC Room"
                      onChange={(e) => ac_room_handle(e)}
                    />
                    <div
                      className={errorForm.ac_room ? "error-form" : "d-none"}
                    >
                      Please enter ac room.
                    </div>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="building" className="form-label">
                      Building
                    </label>
                    <select
                      className="form-select"
                      aria-label="Building"
                      onChange={(e) => building_handle(e)}
                    >
                      <option>------ Building ------</option>

                      {buildingList.length
                        ? buildingList.map((item, key) => (
                            <option key={key} value={item.id}>
                              {item.building_name}
                            </option>
                          ))
                        : null}
                    </select>
                    <div
                      className={errorForm.building ? "error-form" : "d-none"}
                    >
                      Please select building.
                    </div>
                  </div>
                </div>
                <div className="col-12 d-flex justify-content-center align-items-center pt-2 mt-4">
                  <button
                    className="schedule-btn me-2"
                    data-bs-dismiss="modal"
                    onClick={() => addInfo()}
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
      {/* -------- Edit Form Modal -------- */}
      {acList.map((data, key) => (
        <div
          className="modal fade"
          id={"modal-edit-" + data.id}
          key={"modal-edit-" + key}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content control-container">
              <div className="modal-body p-4">
                <div className="row">
                  <div className="col-12 text-center">
                    <h4>Edit AC</h4>
                  </div>
                  <div className="col-12 mt-3 px-4">
                    <div className="mb-3">
                      <label htmlFor="serial_number" className="form-label">
                        Serial Number
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Serial Number"
                        defaultValue={data.serial_number}
                        onChange={(e) => serial_number_handle(e)}
                      />
                      <div
                        className={
                          errorForm.serial_number ? "error-form" : "d-none"
                        }
                      >
                        Please enter serial number.
                      </div>
                    </div>
                    <div className="mb-3">
                      <label htmlFor="uid" className="form-label">
                        UID
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="UID"
                        defaultValue={data.uid}
                        onChange={(e) => uid_handle(e)}
                      />
                      <div className={errorForm.uid ? "error-form" : "d-none"}>
                        Please enter UID.
                      </div>
                    </div>
                    <div className="mb-3">
                      <label htmlFor="ac_name" className="form-label">
                        AC Name
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="AC Name"
                        defaultValue={data.ac_name}
                        onChange={(e) => ac_name_handle(e)}
                      />
                      <div
                        className={errorForm.ac_name ? "error-form" : "d-none"}
                      >
                        Please enter ac name.
                      </div>
                    </div>
                    <div className="mb-3">
                      <label htmlFor="uid" className="form-label">
                        AC Room
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="AC Room"
                        defaultValue={data.ac_room}
                        onChange={(e) => ac_room_handle(e)}
                      />
                      <div
                        className={errorForm.ac_room ? "error-form" : "d-none"}
                      >
                        Please enter ac room.
                      </div>
                    </div>
                    <div className="mb-3">
                      <label htmlFor="building" className="form-label">
                        Building
                      </label>
                      <select
                        className="form-select"
                        aria-label="Building"
                        defaultValue={data.building_id}
                        onChange={(e) => building_handle(e)}
                      >
                        <option>------ Building ------</option>
                        {buildingList.length
                          ? buildingList.map((item, key) => (
                              <option key={key} value={item.id}>
                                {item.building_name}
                              </option>
                            ))
                          : null}
                      </select>
                      <div
                        className={errorForm.building ? "error-form" : "d-none"}
                      >
                        Please select building name.
                      </div>
                    </div>
                  </div>

                  <div className="col-12 d-flex justify-content-center align-items-center pt-2 mt-4">
                    <button
                      className="schedule-btn me-2"
                      onClick={() => updateInfo(data.id, data)}
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
      {/* -------- Delete Form Modal -------- */}
      {acList.map((data, key) => (
        <div
          className="modal fade"
          id={"modal-delete-" + data.id}
          key={"modal-delete-" + key}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content control-container">
              <div className="modal-body p-4">
                <div className="row">
                  <div className="col-12 text-center">
                    <h4>Do you want delete this ac?</h4>
                  </div>
                  <div className="col-12 d-flex justify-content-center align-items-center pt-2 mt-4">
                    <button
                      className="schedule-btn me-2"
                      onClick={() => deleteAC(data.id)}
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
  );
};

export default AC_Management;
