import React, { useState, useEffect } from "react";
import Nav from "../component/nav";
import Pagination from "../component/pagination";

import {
  plan_list,
  name_list,
  update_plan,
  upload,
  last_plan_sort,
  add_plan,
  delete_plan,
} from "../api/plan_management";

const Plan_Management = () => {
  const [planList, setPlanList] = useState([]);
  const [nameList, setNameList] = useState([]);
  const [errorForm, setErrorForm] = useState({
    building_id: false,
    plan_group: false,
    type: false,
    plan_image: false,
  });
  const [planInfo, setPlanInfo] = useState({
    building_id: "",
    plan_group: "",
    type: "",
    image_name: "",
    file: "",
    file_upload: null,
  });
  const [file, setFile] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [PerPage] = useState(20);

  useEffect(() => {
    name_list()
      .then((res) => {
        if (res !== undefined) {
          setNameList(res);
        }
      })
      .catch((err) => {
        console.log(err);
      });

    plan_list()
      .then((res) => {
        if (res !== undefined) {
          setPlanList(res);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const indexOfLastPost = currentPage * PerPage;
  const indexOfFirstPost = indexOfLastPost - PerPage;
  const currentPosts = planList.length
    ? planList.slice(indexOfFirstPost, indexOfLastPost)
    : [];

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  const imageHandler = (e) => {
    const reader = new FileReader();
    setFile(e.target.files[0]);
    reader.onload = () => {
      if (reader.readyState === 2) {
        setPlanInfo({
          ...planInfo,
          image_name: e.target.files[0].name.replace(/\s/g, "").toLowerCase(),
          file: reader.result,
        });
      }
    };

    reader.readAsDataURL(e.target.files[0]);
  };

  const building_name_handle = (e) => {
    if (e.target.value !== "-") {
      setErrorForm({
        ...errorForm,
        building_id: false,
      });
    } else {
      setErrorForm({
        ...errorForm,
        building_id: true,
      });
    }

    setPlanInfo({
      ...planInfo,
      building_id: e.target.value,
    });
  };

  const plan_group_handle = (e) => {
    if (e.target.value !== "-") {
      setErrorForm({
        ...errorForm,
        plan_group: false,
      });
    } else {
      setErrorForm({
        ...errorForm,
        plan_group: true,
      });
    }

    setPlanInfo({
      ...planInfo,
      plan_group: e.target.value,
    });
  };

  const type_handle = (e) => {
    if (e.target.value !== "-") {
      setErrorForm({
        ...errorForm,
        type: false,
      });
    } else {
      setErrorForm({
        ...errorForm,
        type: true,
      });
    }

    setPlanInfo({
      ...planInfo,
      type: e.target.value,
    });
  };

  const deletePlan = (plan_id) => {
    delete_plan(plan_id).then(() => {
      alert("Delete Success!");

      plan_list()
        .then((res) => {
          setPlanList([...res]);
        })
        .catch((err) => {
          console.log(err);
        });
    });

    setPlanInfo({});
  };

  const updateInfo = (plan_id, data) => {
    if (!errorForm.building_group && !errorForm.plan_group && !errorForm.type) {
      let update_data = {
        building_id: planInfo.building_id
          ? planInfo.building_id
          : data.building_id,
        plan_group: planInfo.plan_group
          ? planInfo.plan_group
          : data.plan_group_id,
        type: planInfo.type ? planInfo.type : data.type_id,
        image: planInfo.image_name ? planInfo.image_name : data.image,
        sort: data.plan_sort,
      };

      update_plan(plan_id, update_data).then(() => {
        if (file) {
          var formData = new FormData();
          formData.append("file", file);

          setFile(null);
          upload(formData).then(() => {
            alert("Update Success!");
          });
        } else {
          alert("Update Success!");
        }

        plan_list()
          .then((res) => {
            setPlanList([...res]);
          })
          .catch((err) => {
            console.log(err);
          });
      });

      setPlanInfo({});
    }
  };

  const addInfo = () => {
    last_plan_sort().then((data) => {
      if (planInfo.building_id === "") {
        setErrorForm({ ...errorForm, building_id: true });
      }

      if (planInfo.building_id === "") {
        setErrorForm({ ...errorForm, building_id: true });
      }

      if (planInfo.type === "") {
        setErrorForm({ ...errorForm, type: true });
      }

      if (planInfo.image === "") {
        setErrorForm({ ...errorForm, plan_image: true });
      }

      if (
        planInfo.building_group !== "" &&
        planInfo.plan_group !== "" &&
        planInfo.type !== "" &&
        planInfo.image_name !== ""
      ) {
        let add_data = {
          building_id: planInfo.building_id,
          plan_group: planInfo.plan_group,
          type: planInfo.type,
          image: planInfo.image_name,
          sort: data !== null ? parseInt(data.sort) + 1 : 1,
        };

        console.log(add_data);

        add_plan(add_data).then(() => {
          if (file) {
            var formData = new FormData();
            formData.append("file", file);

            setFile(null);
            upload(formData).then(() => {
              alert("Add Success!");
            });
          } else {
            alert("Add Success!");
          }

          plan_list()
            .then((res) => {
              setPlanList([...res]);
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
            Plan Management{" "}
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
                    <th className="text-center">Image</th>
                    <th className="text-center">Building Name</th>
                    <th className="text-center">Plan Group</th>
                    <th className="text-center">Type</th>
                    <th className="text-center">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {currentPosts.map((data, index) => (
                    <tr key={index}>
                      <td className="text-center">{data.plan_sort}</td>
                      <td className="text-center">
                        <img
                          src={"image/upload/" + data.image}
                          data-bs-toggle="modal"
                          data-bs-target={"#modal-" + data.id}
                          className="pointer"
                          alt={data.image}
                        />
                      </td>
                      <td className="text-center">
                        {data.building_name ? data.building_name : "-"}
                      </td>
                      <td className="text-center">
                        {data.plan_group_name ? data.plan_group_name : "-"}
                      </td>
                      <td className="text-center">
                        {capitalizeFirstLetter(data.type_name)}
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
                totalPosts={planList.length}
                paginate={paginate}
              />
            </div>
          </div>
        </div>
      </div>
      {/* -------- Plan Image Modal -------- */}
      {planList.map((data) => (
        <div
          className="modal fade"
          id={"modal-" + data.id}
          key={"modal-" + data.id}
        >
          <div className="modal-dialog modal-lg modal-dialog-centered d-flex">
            <div className="position-relative">
              <img
                src={"/image/upload/" + data.image}
                alt=""
                className="w-100"
              />
              <button
                type="button"
                className="btn-close close-modal pointer"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
          </div>
        </div>
      ))}
      {/* -------- Add Form Modal -------- */}
      <div className="modal fade" id="modal-add">
        <div className="modal-dialog modal-lg modal-dialog-centered">
          <div className="modal-content control-container">
            <div className="modal-body p-4">
              <div className="row">
                <div className="col-12 text-center">
                  <h4>Add Building Plan</h4>
                </div>
                <div className="col-6 control-left-container mt-3 pe-4">
                  <div className="mb-3">
                    <label htmlFor="building_name" className="form-label">
                      Building
                    </label>
                    <select
                      className="form-select"
                      aria-label="Building Name"
                      onChange={(e) => building_name_handle(e)}
                    >
                      <option>------ Building Name ------</option>
                      <option value="0">-</option>
                      {nameList.length
                        ? nameList.map((item, key) => (
                            <option key={key} value={item.id}>
                              {item.building_name}
                            </option>
                          ))
                        : null}
                    </select>
                    <div
                      className={
                        errorForm.building_id ? "error-form" : "d-none"
                      }
                    >
                      Please select building.
                    </div>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="building_group" className="form-label">
                      Plan Group
                    </label>
                    <select
                      className="form-select"
                      aria-label="Plan Group"
                      onChange={(e) => plan_group_handle(e)}
                    >
                      <option>------ Plan Group ------</option>
                      <option value="1">Building</option>
                      <option value="2">Villa</option>
                    </select>
                    <div
                      className={errorForm.plan_group ? "error-form" : "d-none"}
                    >
                      Please select plan group.
                    </div>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="type" className="form-label">
                      Type
                    </label>
                    <select
                      className="form-select"
                      aria-label="Type"
                      onChange={(e) => type_handle(e)}
                    >
                      <option>------ Type ------</option>
                      <option value="1">Overall</option>
                      <option value="2">Building</option>
                    </select>
                    <div className={errorForm.type ? "error-form" : "d-none"}>
                      Please Type.
                    </div>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="plan_image" className="form-label">
                      Plan Image
                    </label>
                    <input
                      className="form-control"
                      type="file"
                      name="plan_image"
                      accept="image/*"
                      onChange={imageHandler}
                    />
                  </div>
                </div>
                <div className="col-6 mt-3 ps-4 d-flex justify-content-center align-items-center">
                  <div className="upload-plan-container">
                    <label className="form-label">Preview Image</label>
                    <img
                      src={
                        planInfo.file
                          ? planInfo.file
                          : "/image/upload/untitled.png"
                      }
                      alt=""
                      className="w-100"
                    />
                    <div
                      className={errorForm.plan_image ? "error-form" : "d-none"}
                    >
                      Please upload plan image.
                    </div>
                  </div>
                </div>
                <div className="col-12 d-flex justify-content-center align-items-center pt-2 mt-4">
                  <button
                    className="schedule-btn me-2"
                    onClick={() => addInfo()}
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
      {/* -------- Edit Form Modal -------- */}
      {planList.map((data, key) => (
        <div
          className="modal fade"
          id={"modal-edit-" + data.id}
          key={"modal-edit-" + key}
        >
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content control-container">
              <div className="modal-body p-4">
                <div className="row">
                  <div className="col-12 text-center">
                    <h4>Edit Building Plan</h4>
                  </div>
                  <div className="col-6 control-left-container mt-3 pe-4">
                    <div className="mb-3">
                      <label htmlFor="building_name" className="form-label">
                        Building
                      </label>
                      <select
                        className="form-select"
                        aria-label="Building Name"
                        defaultValue={data.building_id ? data.building_id : 0}
                        onChange={(e) => building_name_handle(e)}
                      >
                        <option>------ Building Name ------</option>
                        <option value="0">-</option>
                        {nameList.length
                          ? nameList.map((item, key) => (
                              <option key={key} value={item.id}>
                                {item.building_name}
                              </option>
                            ))
                          : null}
                      </select>
                      <div
                        className={
                          errorForm.building_id ? "error-form" : "d-none"
                        }
                      >
                        Please select building.
                      </div>
                    </div>
                    <div className="mb-3">
                      <label htmlFor="building_group" className="form-label">
                        Plan Group
                      </label>
                      <select
                        className="form-select"
                        aria-label="Plan Group"
                        defaultValue={data.plan_group_id}
                        onChange={(e) => plan_group_handle(e)}
                      >
                        <option>------ Plan Group ------</option>
                        <option value="1">Building</option>
                        <option value="2">Villa</option>
                      </select>
                      <div
                        className={
                          errorForm.plan_group ? "error-form" : "d-none"
                        }
                      >
                        Please select plan group.
                      </div>
                    </div>
                    <div className="mb-3">
                      <label htmlFor="type" className="form-label">
                        Type
                      </label>
                      <select
                        className="form-select"
                        aria-label="Type"
                        defaultValue={data.type_id}
                        onChange={(e) => type_handle(e)}
                      >
                        <option>------ Type ------</option>
                        <option value="1">Overall</option>
                        <option value="2">Building</option>
                      </select>
                      <div className={errorForm.type ? "error-form" : "d-none"}>
                        Please Type.
                      </div>
                    </div>
                    <div className="mb-3">
                      <label htmlFor="plan_image" className="form-label">
                        Plan Image
                      </label>
                      <input
                        className="form-control"
                        type="file"
                        name="plan_image"
                        accept="image/*"
                        onChange={imageHandler}
                      />
                    </div>
                  </div>
                  <div className="col-6 mt-3 ps-4 d-flex justify-content-center align-items-center">
                    <div className="upload-plan-container">
                      <label className="form-label">Preview Image</label>
                      <img
                        src={
                          planInfo.file
                            ? planInfo.file
                            : "/image/upload/" + data.image
                        }
                        alt=""
                        className="w-100"
                      />
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
      {planList.map((data, key) => (
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
                      onClick={() => deletePlan(data.id)}
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

export default Plan_Management;
