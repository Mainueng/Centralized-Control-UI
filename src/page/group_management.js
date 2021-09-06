import React, { useState, useEffect } from "react";
import Nav from "../component/nav";
import Pagination from "../component/pagination";

import {
  group_list,
  add_group,
  update_group,
  delete_group,
} from "../api/group_management";

const Group_Management = () => {
  const [groupList, setGroupList] = useState([]);
  const [errorForm, setErrorForm] = useState({
    group_name: false,
  });
  const [groupInfo, setGroupInfo] = useState({
    group_name: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [PerPage] = useState(20);

  useEffect(() => {
    group_list()
      .then((res) => {
        if (res !== undefined) {
          setGroupList(res);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const indexOfLastPost = currentPage * PerPage;
  const indexOfFirstPost = indexOfLastPost - PerPage;
  const currentPosts = groupList.length
    ? groupList.slice(indexOfFirstPost, indexOfLastPost)
    : [];

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const group_name_handle = (e) => {
    if (e.target.value !== "") {
      setErrorForm({
        ...errorForm,
        group_name: false,
      });
    } else {
      setErrorForm({
        ...errorForm,
        group_name: true,
      });
    }

    setGroupInfo({
      ...groupInfo,
      group_name: e.target.value,
    });
  };

  const deleteGroup = (group_id) => {
    delete_group(group_id).then(() => {
      alert("Delete Success!");

      group_list()
        .then((res) => {
          setGroupList([...res]);
        })
        .catch((err) => {
          console.log(err);
        });
    });

    setGroupInfo({});
  };

  const updateInfo = (group_id, data) => {
    if (!errorForm.group_name) {
      let update_data = {
        group_name: groupInfo.group_name
          ? groupInfo.group_name
          : data.group_name,
      };

      update_group(group_id, update_data).then(() => {
        alert("Update Success!");

        group_list()
          .then((res) => {
            setGroupList([...res]);
          })
          .catch((err) => {
            console.log(err);
          });
      });

      setGroupInfo({});
    }
  };

  const addInfo = () => {
    if (groupInfo.group_name === "") {
      setErrorForm({ ...errorForm, group_name: true });
    }

    if (groupInfo.group_name !== "") {
      let add_data = {
        group_name: groupInfo.group_name,
      };

      add_group(add_data).then(() => {
        alert("Add Success!");

        group_list()
          .then((res) => {
            setGroupList([...res]);
          })
          .catch((err) => {
            console.log(err);
          });
      });
    }
  };

  return (
    <div id="container">
      <Nav />
      <div id="content" className="setting-container vh-100 p-3">
        <div className="p-4 mh-100">
          <h1 className="mx-4 mt-2">
            Group Management
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
                    <th className="text-center">Group Name</th>
                    <th className="text-center">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {currentPosts.map((data, index) => (
                    <tr key={index}>
                      <td className="text-center">{data.id}</td>
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
                totalPosts={groupList.length}
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
                    <label htmlFor="group_name" className="form-label">
                      Group Name
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Group Name"
                      onChange={(e) => group_name_handle(e)}
                    />
                    <div
                      className={errorForm.group_name ? "error-form" : "d-none"}
                    >
                      Please enter group name.
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
      {groupList.map((data, key) => (
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
                    <h4>Edit Group</h4>
                  </div>
                  <div className="col-12 mt-3 px-4">
                    <div className="mb-3">
                      <label htmlFor="group_name" className="form-label">
                        Group Name
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Group Name"
                        defaultValue={data.group_name}
                        onChange={(e) => group_name_handle(e)}
                      />
                      <div
                        className={
                          errorForm.group_name ? "error-form" : "d-none"
                        }
                      >
                        Please enter group name.
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
      {groupList.map((data, key) => (
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
                    <h4>Do you want delete this group ?</h4>
                  </div>
                  <div className="col-12 d-flex justify-content-center align-items-center pt-2 mt-4">
                    <button
                      className="schedule-btn me-2"
                      onClick={() => deleteGroup(data.id)}
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

export default Group_Management;
