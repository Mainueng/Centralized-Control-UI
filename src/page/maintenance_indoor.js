import React, { useState, useEffect } from "react";
import Nav from "../component/nav";
import Pagination from "../component/pagination";
import { ExportReactCSV } from "../component/ExportReactCSV";
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";

import { gateway_list, maintenance_indoor } from "../api/gateway";

const Maintenance_Indoor = () => {
  const [csv, setCsv] = useState([]);
  const [date, setDate] = useState(new Date());
  const [acList, setAcList] = useState([]);
  const [serial, setSerial] = useState();
  const [infoList, setInfoList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [PerPage] = useState(20);

  const indexOfLastPost = currentPage * PerPage;
  const indexOfFirstPost = indexOfLastPost - PerPage;
  const currentPosts = infoList.slice(indexOfFirstPost, indexOfLastPost);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  useEffect(() => {
    gateway_list().then((res) => {
      if (res !== undefined) {
        setAcList(res.data);
      }
    });
  }, []);

  const handleChangeSN = (e) => {
    setSerial(e.target.value);
  };

  const filter = () => {
    maintenance_indoor(serial, formatDate(date)).then((res) => {
      var obj = [...res];
      var uid;
      var info = [];
      obj.sort((a, b) => (a.uid > b.uid ? 1 : -1));
      obj.map((data) => {
        if (data.uid !== uid) {
          uid = data.uid;
          if (data.louver === "0") {
            data.louver = "Auto";
          } else if (data.louver === "1") {
            data.louver = "90°";
          } else if (data.louver === "2") {
            data.louver = "30°";
          } else if (data.louver === "3") {
            data.louver = "45°";
          } else if (data.louver === "4") {
            data.louver = "60°";
          } else if (data.louver === "5") {
            data.louver = "0°";
          } else {
            data.louver = "Error";
          }
          info.push({
            gateway_no: data.gateway_no,
            uid: data.uid,
            power: data.onoff,
            roomTemp: data.roomTemp,
            setTemp: data.setTemp,
            mode: data.mode,
            louver: data.louver,
            fspeed: data.fspeed,
            aps: data.aps,
            rt: data.iaq_rt,
            rh2: data.iaq_rh2,
            pm25: data.iaq_pm25,
            co2: data.iaq_co2,
            iaq_connect: data.iaq_connect,
            indoor_status: data.indoor_status,
          });
          return info;
        }
        return data;
      });
      setInfoList(info);
      setCsv(info);
    });
  };

  const formatDate = (date) => {
    var d = new Date(date),
      month = "" + (d.getMonth() + 1),
      day = "" + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    return [year, month, day].join("-");
  };

  return (
    <div id="container">
      <Nav />
      <div id="content" className="setting-container vh-100 p-3">
        <div className="p-4 mh-100">
          <h1 className="mx-4 mt-2">
            Maintenance - Indoor
            <span className="float-end pointer csv mt-4">
              <ExportReactCSV
                csvData={csv}
                fileName={
                  serial
                    ? "Indoor_" + serial + "_" + formatDate(date) + "_.csv"
                    : "Indoor_" + formatDate(date) + "_.csv"
                }
              />
            </span>
          </h1>
          <div className="mx-4">
            <div className="row">
              <div className="col-auto">
                <label htmlFor="from">Date:</label>
                <div className="form-group">
                  <DatePicker
                    selected={date}
                    onChange={(date) => setDate(date)}
                    className="form-control"
                    dateFormat="dd/MM/yyyy"
                    isClearable
                  />
                </div>
              </div>
              <div className="col-auto">
                <div className="form-group">
                  <label htmlFor="from">Serial:</label>
                  <select className="form-control" onChange={handleChangeSN}>
                    <option>---- Serial Number ----</option>
                    {acList.map((data, index) => (
                      <option key={index} value={data.device_sn}>
                        {data.device_sn}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="col-auto">
                <div className="form-group">
                  <label htmlFor="end">&nbsp;</label>
                  <button
                    type="button"
                    className="btn btn-primary d-block"
                    onClick={() => filter()}
                  >
                    Filter
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="d-flex flex-column overflow-table-container">
            <div className="px-4 h-auto overflow-table">
              <table className="table w-100 setting-table mt-4">
                <thead>
                  <tr>
                    <th className="text-center">UID</th>
                    <th className="text-center">Power</th>
                    <th className="text-center">Room Temp (°C)</th>
                    <th className="text-center">Set Temp (°C)</th>
                    <th className="text-center">Mode</th>
                    <th className="text-center">Louver</th>
                    <th className="tex t-center">Fan Speed</th>
                    <th className="tex t-center">APS</th>
                    <th className="tex t-center">IAQ</th>
                    <th className="text-center">
                      PM 2.5 (ug/m<sup>3</sup>)
                    </th>
                    <th className="text-center">
                      CO<sub>2</sub> (ppm)
                    </th>
                    <th className="text-center">Humidity (%)</th>
                  </tr>
                </thead>
                <tbody>
                  {infoList.length ? (
                    currentPosts.map((data, index) => (
                      <tr key={index}>
                        <td className="text-center">{data.uid}</td>
                        <td className="text-center">
                          {data.power === 0 ? "Off" : "On"}
                        </td>
                        <td className="text-center">{data.roomTemp}</td>
                        <td className="text-center">{data.setTemp}</td>
                        <td className="text-center">{data.mode}</td>
                        <td className="text-center">{data.louver}</td>
                        <td className="text-center">{data.fspeed}</td>
                        <td className="text-center">{data.aps}</td>
                        <td className="text-center">{data.iaq_connect}</td>
                        <td className="text-center">{data.pm25}</td>
                        <td className="text-center">{data.co2}</td>
                        <td className="text-center">{data.rh2}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="13" className="text-center">
                        No Data
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <Pagination
              postsPerPage={PerPage}
              totalPosts={infoList.length}
              paginate={paginate}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Maintenance_Indoor;
