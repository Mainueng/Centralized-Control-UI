import React, { useState, useEffect } from "react";
import socketIOClient from "socket.io-client";
import Nav from "../component/nav";
import Pagination from "../component/pagination";

import { SERV_WWS_API } from "../constant_config";
import { gateway_list } from "../api/gateway";
import { update_ac } from "../api/control";

const Gateway = () => {
  const [gatewayList, setGatewayList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [PerPage] = useState(20);

  useEffect(() => {
    gateway_list()
      .then((res) => {
        if (res !== undefined) {
          setGatewayList(res.data);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const indexOfLastPost = currentPage * PerPage;
  const indexOfFirstPost = indexOfLastPost - PerPage;
  const currentPosts = gatewayList.slice(indexOfFirstPost, indexOfLastPost);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const update_ac_data = (sn) => {
    const socket = socketIOClient(SERV_WWS_API);

    if (!socket.connected) {
      socket.connect();
    }

    socket.on(sn, (message) => {
      let ac_info = JSON.parse(message);

      socket.disconnect();

      ac_info.data.map((ac) => {
        update_ac(sn, ac);

        return ac;
      });

      alert("Update AC Success!");
    });
  };

  return (
    <div id="container">
      <Nav />
      <div id="content" className="setting-container vh-100 p-3">
        <div className="p-4 mh-100">
          <h1 className="mx-4 mt-2">Gateway</h1>
          <div className="d-flex flex-column overflow-table-container">
            <div className="px-4 h-auto overflow-table">
              <table className="table w-100 setting-table mt-4">
                <thead>
                  <tr>
                    <th className="text-center">No.</th>
                    <th className="text-center">Serial Number</th>
                    <th className="text-center">Location</th>
                    <th className="text-center">Group</th>
                    <th className="text-center">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {currentPosts.map((data, index) => (
                    <tr key={index}>
                      <td className="text-center">{index + 1}</td>
                      <td className="text-center">{data.device_sn}</td>
                      <td className="text-center">{data.location}</td>
                      <td className="text-center">{data.group}</td>
                      <td className="text-center">
                        <span
                          className="pointer"
                          onClick={() => update_ac_data(data.device_sn)}
                        >
                          Update AC
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
                totalPosts={gatewayList.length}
                paginate={paginate}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Gateway;
