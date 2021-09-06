import React from "react";
import { CSVLink } from "react-csv";

export const ExportReactCSV = ({ csvData, fileName }) => {
  return (
    <CSVLink data={csvData} filename={fileName}>
      <i className="fas fa-file-export export-icon"></i>
    </CSVLink>
  );
};
