import React, { useState, useEffect } from "react";
import Nav from "../component/nav";
import Pagination from "../component/pagination";
import { ExportReactCSV } from "../component/ExportReactCSV";
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";

import { gateway_list, maintenance_outdoor } from "../api/gateway";

const Maintenance_Outdoor = () => {
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
    maintenance_outdoor(serial, formatDate(date)).then((res) => {
      var obj = [...res];
      var uid;
      var info = [];

      obj.sort((a, b) => (a.uid > b.uid ? 1 : -1));

      obj.map((data) => {
        if (data.uid !== uid) {
          uid = data.uid;

          info.push({
            gateway_no: data.gateway_no,
            uid: data.uid,
            mid_coil_temp: data.mid_coil_temp,
            outlet_temp: data.outlet_temp,
            discharge_pipe_temp1: data.discharge_pipe_temp1,
            discharge_pipe_temp2: data.dischart_pipe_temp2,
            ambient_temp: data.ambient_temp,
            suction_pipe_temp: data.suction_pipe_temp,
            control_device_temp1: data.control_device_temp1,
            control_device_temp2: data.control_device_temp2,
            water_inlet_temp: data.water_inlet_temp,
            water_outlet_temp: data.water_outlet_temp,
            comp1_actual_speed: data.comp1_actual_speed,
            comp2_actual_speed: data.comp2_actual_speed,
            comp1_current_speed: data.comp1_current_speed,
            comp2_current_speed: data.comp2_current_speed,
            outdoor_fan_speed: data.outdoor_fan_speed,
            system_mode: data.system_mode,
            unit_capacity: data.unit_capacity,
            demand_running1: data.demand_running1,
            demand_running2: data.demand_running2,
            system_status_comp1: data.system_status_comp1,
            system_status_comp2: data.system_status_comp2,
            protection_status_com1: data.protection_status_com1,
            protection_status_com2: data.protection_status_com2,
            inverter_driver_status1: data.invester_driver_status1,
            inverter_driver_status2: data.invester_driver_status2,
            inverter_driver_err_msg1: data.inverter_driver_err_msg1,
            inverter_driver_err_msg2: data.inverter_driver_err_msg2,
            system_power_input: data.system_power_input,
            outdoor_exv: data.outdoor_exv,
            outdoor_led_status: data.outdoor_led_status,
            water_flow: data.water_flow,
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
            Maintenance - Outdoor
            <span className="float-end pointer csv mt-4">
              <ExportReactCSV
                csvData={csv}
                fileName={
                  serial
                    ? "Outdoor_" + serial + "_" + formatDate(date) + "_.csv"
                    : "Outdoor_" + formatDate(date) + "_.csv"
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
            <div className="px-4 h-auto table-responsive">
              <table className="table w-100 setting-table mt-4">
                <thead>
                  <tr>
                    <th className="text-center">UID</th>
                    <th className="text-center">Mid Coil Temp (°C)</th>
                    <th className="text-center">Outlet Temp (°C)</th>
                    <th className="text-center">Discharge Pipe Temp 1 (°C)</th>
                    <th className="text-center">Discharge Pipe Temp 2 (°C)</th>
                    <th className="text-center">Ambient Temp (°C)</th>
                    <th className="text-center">Suction Pipe Temp (°C)</th>
                    <th className="text-center">Control Device Temp 1 (°C)</th>
                    <th className="text-center">Control Device Temp 2 (°C)</th>
                    <th className="text-center">Water Inlet Temp (°C)</th>
                    <th className="text-center">Water Outlet Temp (°C)</th>
                    <th className="text-center">Comp 1 Actual Speed</th>
                    <th className="text-center">Comp 2 Actual Speed</th>
                    <th className="text-center">Comp 1 Current Speed</th>
                    <th className="text-center">Comp 2 Current Speed</th>
                    <th className="text-center">Outdoor Fan Speed</th>
                    <th className="text-center">System Mode</th>
                    <th className="text-center">Unit Capacity</th>
                    <th className="text-center">Demand Running 1</th>
                    <th className="text-center">Demand Running 2</th>
                    <th className="text-center">System Status Comp 1</th>
                    <th className="text-center">System Status Comp 2</th>
                    <th className="text-center">Protection Status Com 1</th>
                    <th className="text-center">Protection Status Com 2</th>
                    <th className="text-center">Inverter Driver Status 1</th>
                    <th className="text-center">Inverter Driver Status 2</th>
                    <th className="text-center">
                      Inverter Driver Error Message 1
                    </th>
                    <th className="text-center">
                      Inverter Driver Error Message 2
                    </th>
                    <th className="text-center">System Power Input</th>
                    <th className="text-center">Outdoor Exv</th>
                    <th className="text-center">Outdoor LED Status</th>
                    <th className="text-center">Water Flow</th>
                  </tr>
                </thead>
                <tbody>
                  {infoList.length ? (
                    currentPosts.map((data, index) => (
                      <tr key={index}>
                        <td className="text-center">{data.uid}</td>
                        <td className="text-center">{data.mid_coil_temp}</td>
                        <td className="text-center">{data.outlet_temp}</td>
                        <td className="text-center">
                          {data.discharge_pipe_temp1}
                        </td>
                        <td className="text-center">
                          {data.discharge_pipe_temp2}
                        </td>
                        <td className="text-center">{data.ambient_temp}</td>
                        <td className="text-center">
                          {data.suction_pipe_temp}
                        </td>
                        <td className="text-center">
                          {data.control_device_temp1}
                        </td>
                        <td className="text-center">
                          {data.control_device_temp2}
                        </td>
                        <td className="text-center">{data.water_inlet_temp}</td>
                        <td className="text-center">
                          {data.water_outlet_temp}
                        </td>
                        <td className="text-center">
                          {data.comp1_actual_speed}
                        </td>
                        <td className="text-center">
                          {data.comp2_actual_speed}
                        </td>
                        <td className="text-center">
                          {data.comp1_current_speed}
                        </td>
                        <td className="text-center">
                          {data.comp2_current_speed}
                        </td>
                        <td className="text-center">
                          {data.outdoor_fan_speed}
                        </td>
                        <td className="text-center">{data.system_mode}</td>
                        <td className="text-center">{data.unit_capacity}</td>
                        <td className="text-center">{data.demand_running1}</td>
                        <td className="text-center">{data.demand_running2}</td>
                        <td className="text-center">
                          {data.system_status_comp1}
                        </td>
                        <td className="text-center">
                          {data.system_status_comp2}
                        </td>
                        <td className="text-center">
                          {data.protection_status_com1}
                        </td>
                        <td className="text-center">
                          {data.protection_status_com2}
                        </td>
                        <td className="text-center">
                          {data.inverter_driver_status1}
                        </td>
                        <td className="text-center">
                          {data.inverter_driver_status2}
                        </td>
                        <td className="text-center">
                          {data.inverter_driver_err_msg1}
                        </td>
                        <td className="text-center">
                          {data.inverter_driver_err_msg2}
                        </td>
                        <td className="text-center">
                          {data.system_power_input}
                        </td>
                        <td className="text-center">{data.outdoor_exv}</td>
                        <td className="text-center">
                          {data.outdoor_led_status}
                        </td>
                        <td className="text-center">{data.water_flow}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="32" className="text-center">
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

export default Maintenance_Outdoor;
