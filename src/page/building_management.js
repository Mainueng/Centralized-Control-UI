import React, { useState, useEffect } from "react";
import Nav from "../component/nav";
import Pagination from "../component/pagination";

import {
  building_list,
  serial_list,
  group_list,
  add_building,
  update_building,
  delete_building,
  last_sort,
} from "../api/building_management";

const Building_Management = () => {
  const [buildingList, setBuildingList] = useState([]);
  const [serialList, setSerialList] = useState([]);
  const [groupList, setGroupList] = useState([]);
  const [errorForm, setErrorForm] = useState({
    serial_number: false,
    building_name: false,
    building_group: false,
  });
  const [buildingInfo, setBuildingInfo] = useState({
    serial_number: "",
    building_name: "",
    building_group: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [PerPage] = useState(20);

  useEffect(() => {
    serial_list()
      .then((res) => {
        if (res !== undefined) {
          setSerialList(res);
        }
      })
      .catch((err) => {
        setSerialList([]);
        console.log(err);
      });

    group_list()
      .then((res) => {
        if (res !== undefined) {
          setGroupList(res);
        }
      })
      .catch((err) => {
        console.log(err);
        setGroupList([]);
      });

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
  }, []);

  const indexOfLastPost = currentPage * PerPage;
  const indexOfFirstPost = indexOfLastPost - PerPage;
  const currentPosts = buildingList.length
    ? buildingList.slice(indexOfFirstPost, indexOfLastPost)
    : [];

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const building_name_handle = (e) => {
    if (e.target.value !== "") {
      setErrorForm({
        ...errorForm,
        building_name: false,
      });
    } else {
      setErrorForm({
        ...errorForm,
        building_name: true,
      });
    }

    setBuildingInfo({
      ...buildingInfo,
      building_name: e.target.value,
    });
  };

  const serial_number_handle = (e) => {
    if (e.target.value !== "") {
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

    setBuildingInfo({
      ...buildingInfo,
      serial_number: e.target.value,
    });
  };

  const building_group_handle = (e) => {
    if (e.target.value !== "-") {
      setErrorForm({
        ...errorForm,
        building_group: false,
      });
    } else {
      setErrorForm({
        ...errorForm,
        building_group: true,
      });
    }

    setBuildingInfo({
      ...buildingInfo,
      building_group: e.target.value,
    });
  };

  const deleteBuilding = (building_id) => {
    delete_building(building_id).then(() => {
      alert("Delete Success!");

      building_list()
        .then((res) => {
          setBuildingList([...res]);
        })
        .catch((err) => {
          console.log(err);
        });
    });

    setBuildingInfo({});
  };

  const updateInfo = (building_id, data) => {
    if (
      !errorForm.building_name &&
      !errorForm.serial_number &&
      !errorForm.building_group
    ) {
      let update_data = {
        building_name: buildingInfo.building_name
          ? buildingInfo.building_name
          : data.building_name,
        serial_number: buildingInfo.serial_number
          ? buildingInfo.serial_number
          : data.serial_number,
        building_group: buildingInfo.building_group
          ? buildingInfo.building_group
          : data.building_group_id,
      };

      console.log(update_data);

      update_building(building_id, update_data).then(() => {
        alert("Update Success!");

        building_list()
          .then((res) => {
            setBuildingList([...res]);
          })
          .catch((err) => {
            console.log(err);
          });
      });

      setBuildingInfo({});
    }
  };

  const addInfo = () => {
    last_sort().then((data) => {
      if (buildingInfo.building_name === "") {
        setErrorForm({ ...errorForm, building_name: true });
      }

      if (buildingInfo.serial_number === "") {
        setErrorForm({ ...errorForm, serial_number: true });
      }

      if (buildingInfo.building_group === "") {
        setErrorForm({ ...errorForm, building_group: true });
      }

      if (
        buildingInfo.building_name !== "" &&
        buildingInfo.serial_number !== "" &&
        buildingInfo.building_group !== ""
      ) {
        let add_data = {
          building_name: buildingInfo.building_name,
          serial_number: buildingInfo.serial_number,
          building_group: buildingInfo.building_group,
          sort: data !== null ? parseInt(data.sort) + 1 : 1,
        };

        add_building(add_data).then(() => {
          alert("Add Success!");

          building_list()
            .then((res) => {
              setBuildingList([...res]);
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
            Building Management
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
                    <th className="text-center">Building Name</th>
                    <th className="text-center">Building Group</th>
                    <th className="text-center">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {currentPosts.map((data, index) => (
                    <tr key={index}>
                      <td className="text-center">{data.sort}</td>
                      <td className="text-center">
                        {data.serial_number ? data.serial_number : "-"}
                      </td>
                      <td className="text-center">
                        {data.building_name ? data.building_name : "-"}
                      </td>
                      <td className="text-center">{data.group_name}</td>
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
                totalPosts={buildingList.length}
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
                  <h4>Add Building Plan</h4>
                </div>
                <div className="col-12 mt-3 px-4">
                  <div className="mb-3">
                    <label htmlFor="serial_number" className="form-label">
                      Serial Number
                    </label>
                    <select
                      className="form-select"
                      aria-label="Serial Number"
                      onChange={(e) => serial_number_handle(e)}
                    >
                      <option>------ Serial Name ------</option>

                      {serialList.length
                        ? serialList.map((item, key) => (
                            <option key={key} value={item.serial_number}>
                              {item.serial_number}
                            </option>
                          ))
                        : null}
                    </select>
                    <div
                      className={
                        errorForm.serial_number ? "error-form" : "d-none"
                      }
                    >
                      Please select serial number.
                    </div>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="building_name" className="form-label">
                      Building Name
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Building Name"
                      onChange={(e) => building_name_handle(e)}
                    />
                    <div
                      className={
                        errorForm.building_name ? "error-form" : "d-none"
                      }
                    >
                      Please enter building name.
                    </div>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="building_group" className="form-label">
                      Building Group
                    </label>
                    <select
                      className="form-select"
                      aria-label="Building Group"
                      onChange={(e) => building_group_handle(e)}
                    >
                      <option>------ Building Group ------</option>
                      {groupList.length
                        ? groupList.map((item, key) => (
                            <option key={key} value={item.id}>
                              {item.group_name}
                            </option>
                          ))
                        : null}
                    </select>
                    <div
                      className={
                        errorForm.building_group ? "error-form" : "d-none"
                      }
                    >
                      Please select building group.
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
      {buildingList.map((data, key) => (
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
                    <h4>Edit Building</h4>
                  </div>
                  <div className="col-12 mt-3 px-4">
                    <div className="mb-3">
                      <label htmlFor="serial_number" className="form-label">
                        Serial Number
                      </label>
                      <select
                        className="form-select"
                        aria-label="Serial Number"
                        defaultValue={data.serial_number}
                        onChange={(e) => serial_number_handle(e)}
                      >
                        <option>------ Serial Name ------</option>
                        {serialList.length
                          ? serialList.map((item, key) => (
                              <option key={key} value={item.serial_number}>
                                {item.serial_number}
                              </option>
                            ))
                          : null}
                      </select>
                      <div
                        className={
                          errorForm.serial_number ? "error-form" : "d-none"
                        }
                      >
                        Please select serial number.
                      </div>
                    </div>
                    <div className="mb-3">
                      <label htmlFor="building_name" className="form-label">
                        Building Name
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Building Name"
                        defaultValue={data.building_name}
                        onChange={(e) => building_name_handle(e)}
                      />
                      <div
                        className={
                          errorForm.building_name ? "error-form" : "d-none"
                        }
                      >
                        Please enter building name.
                      </div>
                    </div>
                    <div className="mb-3">
                      <label htmlFor="building_group" className="form-label">
                        Building Group
                      </label>
                      <select
                        className="form-select"
                        aria-label="Building Group"
                        defaultValue={
                          data.building_group_id ? data.building_group_id : 0
                        }
                        onChange={(e) => building_group_handle(e)}
                      >
                        <option>------ Building Group ------</option>
                        <option value="0">Overall</option>
                        {groupList.length
                          ? groupList.map((item, key) => (
                              <option key={key} value={item.id}>
                                {item.group_name}
                              </option>
                            ))
                          : null}
                      </select>
                      <div
                        className={
                          errorForm.building_group ? "error-form" : "d-none"
                        }
                      >
                        Please select building group.
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
      {buildingList.map((data, key) => (
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
                    <h4>Do you want delete this building plan?</h4>
                  </div>
                  <div className="col-12 d-flex justify-content-center align-items-center pt-2 mt-4">
                    <button
                      className="schedule-btn me-2"
                      onClick={() => deleteBuilding(data.id)}
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

export default Building_Management;
