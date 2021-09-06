import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Nav from "../component/nav";
import Pagination from "../component/pagination";
import { ExportReactCSV } from "../component/ExportReactCSV";

import { ac_list, building_list } from "../api/report";

const Report = () => {
  const [acList, setAcList] = useState([]);
  const [type, setType] = useState("overall");
  const [currentPage, setCurrentPage] = useState(1);
  const [PerPage] = useState(20);
  const [csv, SetCsv] = useState([]);

  const location = useLocation();

  useEffect(() => {
    let id = 0;
    let group = "building";
    let group_id = 1;

    if (location.state !== undefined) {
      id = location.state.id;
      group = location.state.group;

      if (id !== 0) {
        setType("building");
      }
    }

    if (id !== 0) {
      ac_list(id)
        .then((res) => {
          if (res !== undefined) {
            setAcList(res);

            let data = [];

            res.map((item) => {
              if (item.louver === "0") {
                item.louver = "Auto";
              } else if (item.louver === "1") {
                item.louver = "90°";
              } else if (item.louver === "2") {
                item.louver = "30°";
              } else if (item.louver === "3") {
                item.louver = "45°";
              } else if (item.louver === "4") {
                item.louver = "60°";
              } else if (item.louver === "5") {
                item.louver = "0°";
              } else {
                item.louver = "Error";
              }

              data.push({
                "No.": item.sort,
                "Serial Number": item.serial_number,
                UID: item.uid,
                Building: item.group_name,
                Power: item.power === 0 ? "Off" : "On",
                "Room Temp (°C)": item.room_temp,
                "Set Temp (°C)": item.set_temp,
                Mode: item.mode,
                Louver: item.louver,
                "Fan Speed": item.fspeed,
                "PM2.5 (ug/m3)": item.pm25,
                "CO2 (ppm)": item.co2,
                "Humidity (%)": item.rh2,
                Status: item.status === 1 ? "Enabled" : "Disabled",
              });
              return item;
            });

            SetCsv(data);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      if (group !== "building") {
        group_id = 2;
      }

      building_list(group_id)
        .then((res) => {
          if (res !== undefined) {
            setAcList(res);

            let data = [];

            res.map((item) => {
              data.push({
                "No.": item.sort,
                "Serial Number": item.serial_number,
                "Building Name": item.building_name,
                "Building Group": item.group_name,
              });

              return item;
            });

            SetCsv(data);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [location.state]);

  const indexOfLastPost = currentPage * PerPage;
  const indexOfFirstPost = indexOfLastPost - PerPage;
  const currentPosts = acList.length
    ? acList.slice(indexOfFirstPost, indexOfLastPost)
    : [];

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const louver_name = (louver) => {
    switch (louver) {
      case 1:
        louver = "90°";
        break;
      case 2:
        louver = "30°";
        break;
      case 3:
        louver = "45°";
        break;
      case 4:
        louver = "60°";
        break;
      case 5:
        louver = "0°";
        break;
      default:
        louver = "Auto";
        break;
    }

    return louver;
  };

  let newDate = new Date();
  let date = newDate.getDate();
  let month = newDate.getMonth() + 1;
  let year = newDate.getFullYear();

  let date_now =
    date + "_" + (month < 10 ? 0 + month + "_" : month + "_") + year;

  return (
    <div id="container">
      <Nav />
      <div id="content" className="setting-container vh-100 p-3">
        <div className="p-4 mh-100">
          <h1 className="mx-4 mt-2">
            Report
            <span className="float-end pointer csv mt-4">
              <ExportReactCSV
                csvData={csv}
                fileName={"report_" + date_now + "_.csv"}
              />
            </span>
          </h1>
          <div className="d-flex flex-column overflow-table-container">
            <div className="px-4 h-auto overflow-table">
              <table className="table w-100 setting-table mt-4">
                <thead>
                  {type === "overall" ? (
                    <tr>
                      <th className="text-center">No.</th>
                      <th className="text-center">Serial Number</th>
                      <th className="text-center">Building Name</th>
                      <th className="text-center">Building Group</th>
                    </tr>
                  ) : (
                    <tr>
                      <th className="text-center">No.</th>
                      <th className="text-center">Serial Number</th>
                      <th className="text-center">UID</th>
                      <th className="text-center">Building</th>
                      <th className="text-center">Power</th>
                      <th className="text-center">Room Temp (°C)</th>
                      <th className="text-center">Set Temp (°C)</th>
                      <th className="text-center">Mode</th>
                      <th className="text-center">Louver</th>
                      <th className="tex t-center">Fan Speed</th>
                      <th className="text-center">
                        PM 2.5 (ug/m<sup>3</sup>)
                      </th>
                      <th className="text-center">
                        CO<sub>2</sub> (ppm)
                      </th>
                      <th className="text-center">Humidity (%)</th>
                      <th className="text-center">Status</th>
                    </tr>
                  )}
                </thead>
                <tbody>
                  {type === "overall"
                    ? currentPosts.map((data, index) => (
                        <tr key={index}>
                          <td className="text-center">{data.sort}</td>
                          <td className="text-center">{data.serial_number}</td>
                          <td className="text-center">{data.building_name}</td>
                          <td className="text-center">{data.group_name}</td>
                        </tr>
                      ))
                    : currentPosts.map((data, index) => (
                        <tr key={index}>
                          <td className="text-center">{data.sort}</td>
                          <td className="text-center">{data.serial_number}</td>
                          <td className="text-center">{data.uid}</td>
                          <td className="text-center">{data.group_name}</td>
                          <td className="text-center">
                            {data.power ? "ON" : "OFF"}
                          </td>
                          <td className="text-center">{data.room_temp}</td>
                          <td className="text-center">{data.set_temp}</td>
                          <td className="text-center">{data.mode}</td>
                          <td className="text-center">
                            {louver_name(data.louver)}
                          </td>
                          <td className="text-center">{data.fspeed}</td>
                          <td className="text-center">{data.pm25}</td>
                          <td className="text-center">{data.co2}</td>
                          <td className="text-center">{data.rh2}</td>
                          <td className="text-center">
                            {data.status ? "Enabled" : "Disabled"}
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
    </div>
  );
};

export default Report;
