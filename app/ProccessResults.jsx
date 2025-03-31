"use client";
import React, { useState, useEffect } from "react";
import Papa from "papaparse";
import { handleFiles, handleResults } from "./actions";

const Settings = ({ onClick }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    onClick={onClick}
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="size-6"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
    />
  </svg>
);

export const CSVUploader = ({ header }) => {
  "use client";
  const [files, setFiles] = useState([]);
  const [pressure, setPressure] = useState("");
  const [error, setError] = useState("");
  const [tableData, setTableData] = useState([]);
  const [popup, setPopup] = useState(false);
  const [loading, setLoading] = useState({ files: 0, results: 0 });
  useEffect(() => {
    setTableData([]);
  }, []);

  const handleFileUpload = (event) => {
    setFiles([...event.target.files]);
    setLoading({ files: 0, results: 0 });
    setTableData([]); //
    setError(""); //
  };

  const handleProcessResults = () => {
    if (!pressure) {
      setError("Please enter the minimum pressure value.");
      return;
    }
    setError("");
    if (files.length === 0) {
      setError("Please upload CSV files before processing.");
      return;
    }
    if (!document.getElementById("orcanosUrl").value) {
      setError("Please Add url");
      return;
    }
    if (!document.getElementById("projectId").value) {
      setError("Please Add Project ID");
      return;
    }
    if (!document.getElementById("majorVersion").value) {
      setError("Please Add Major Version");
      return;
    }
    if (!document.getElementById("minorVersion").value) {
      setError("Please Add Minor Version");
      return;
    }
    if (!document.getElementById("objectType").value) {
      setError("Please Add Object Type");
      return;
    }
    if (!document.getElementById("defParentId").value) {
      setError("Please Add Orcanos Report Id");
      return;
    }
    setTableData([]);
    let allData = [];
    setLoading({ files: 0, results: 0 });

    const filePromises = files.map((file) => {
      return new Promise((resolve) => {
        Papa.parse(file, {
          complete: (results) => {
            const data = results.data.slice(1).reduce((acc, row) => {
              if (!row[0] || !row[2] || !row[1]) return acc;

              const eventPress = parseFloat(row[2]);
              const maxPress = parseFloat(row[1]);
              if (isNaN(eventPress)) return acc;

              const status = maxPress <= parseFloat(pressure) ? "Pass" : "Fail";

              acc.push({
                key: row[0],
                fileName: file.name,
                pressureMeasurement: eventPress,
                pressureMaxMeasurement: row[1] ? row[1] + "" : "N/A",
                status: status,
                startDate: row[9],
                startTime: row[10],
                endTime: row[12],
                updatedBy: "",
                updatedDate: new Date().toISOString().split("T")[0],
                attachmentsIndicator: "0",
              });
              return acc;
            }, []);

            allData = [...allData, ...data];
            resolve();
          },
          header: false,
        });
      });
    });

    Promise.all(filePromises).then(() => {
      setTableData([...allData]);
    });
  };

  const save = () => {
    localStorage.setItem(
      "orcanosUrl",
      document.getElementById("orcanosUrl").value
    );
    localStorage.setItem(
      "projectId",
      document.getElementById("projectId").value
    );
    localStorage.setItem(
      "majorVersion",
      document.getElementById("majorVersion").value
    );
    localStorage.setItem(
      "minorVersion",
      document.getElementById("minorVersion").value
    );
    localStorage.setItem(
      "objectType",
      document.getElementById("objectType").value
    );
    localStorage.setItem(
      "defParentId",
      document.getElementById("defParentId").value
    );
    setPopup(false);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    for (const row of tableData) {
      const formData = new FormData(e.target);
      formData.set("auth", header);
      formData.set("table", JSON.stringify([row]));
      const result = await handleResults(formData);
      if (result.success)
        setLoading((st) => ({ ...st, results: st.results + 1 }));
    }
    const fData = new FormData(e.target);
    for (const file of fData.getAll("files")) {
      fData.set("files", file);
      fData.set("auth", header);
      const result = await handleFiles(fData);
      if (result.success) setLoading((lo) => ({ ...lo, files: lo.files + 1 }));
    }
    console.log(loading);
  };
  return (
    <form onSubmit={handleSubmit} encType="multipart/form-data">
      <div
        className={`absolute ${
          !popup && "hidden"
        } w-full h-full bg-black/50 flex items-center justify-center`}
      >
        <div className="bg-white px-4 py-2 w-[600px] flex flex-col gap-y-4 rounded-md">
          <p className="text-2xl">Setup Your config</p>
          <div className="flex">
            <label className="font-semibold w-[200px]">Url :</label>
            <input
              className="border w-full ml-4  border-gray-400 py-1 px-2 rounded-md"
              placeholder="Url"
              type="url"
              name="orcanosUrl"
              defaultValue={localStorage.getItem("orcanosUrl")}
              id="orcanosUrl"
            />
          </div>
          <div className="flex">
            <label className="font-semibold w-[200px]">Project ID :</label>
            <input
              className="border w-full ml-4 border-gray-400 py-1 px-2 rounded-md"
              placeholder="Project ID"
              type="number"
              name="projectId"
              defaultValue={localStorage.getItem("projectId")}
              id="projectId"
            />
          </div>
          <div className="flex">
            <label className="font-semibold w-[200px]">Major Version :</label>

            <input
              className="border w-full ml-4 border-gray-400 py-1 px-2 rounded-md"
              placeholder="Major Version"
              type="number"
              name="majorVersion"
              defaultValue={localStorage.getItem("majorVersion")}
              id="majorVersion"
            />
          </div>
          <div className="flex">
            <label className="font-semibold w-[200px]">Minor Version :</label>

            <input
              className="border w-full ml-4 border-gray-400 py-1 px-2 rounded-md"
              placeholder="Minor Version"
              type="number"
              name="minorVersion"
              id="minorVersion"
              defaultValue={localStorage.getItem("minorVersion")}
            />
          </div>
          <div className="flex">
            <label className="font-semibold w-[200px]">Object Type :</label>

            <input
              defaultValue={localStorage.getItem("objectType")}
              className="border w-full ml-4 border-gray-400 py-1 px-2 rounded-md"
              placeholder="Object Type"
              type="text"
              name="objectType"
              id="objectType"
            />
          </div>
          <div className="flex">
            <label className="font-semibold w-[200px]">
              Orcanos Report Id :
            </label>

            <input
              defaultValue={localStorage.getItem("defParentId")}
              className="border w-full ml-4 border-gray-400 py-1 px-2 rounded-md"
              placeholder="Orcanos Report Id"
              type="number"
              name="defParentId"
              id="defParentId"
            />
          </div>
          <button
            type="button"
            onClick={save}
            className="bg-blue-600 text-white py-1 rounded-md font-bold"
          >
            Save
          </button>
        </div>
      </div>
      <div className="w-full p-6 bg-white shadow-lg rounded-lg space-y-6 text-left">
        <div className="flex flex-col items-start space-y-2">
          <div className="flex">
            <label className="font-semibold">HBLT ID :</label>
            <Settings onClick={() => setPopup(true)} />
          </div>

          <input
            name="hbltId"
            id="hbltId"
            type="text"
            className="border p-2 rounded w-full"
          />
        </div>
        <div className="flex flex-col items-start space-y-2">
          <label className="font-semibold">Step 1 : Orcanos Report ID :</label>
          <input
            name="parentId"
            id="parentId"
            type="text"
            className="border p-2 rounded w-full"
          />
        </div>

        <div className="flex flex-col items-start space-y-2">
          <label className="font-semibold">Step 2 : Upload Files :</label>
          <input
            type="file"
            multiple
            id="files"
            name="files"
            accept=".csv"
            onChange={handleFileUpload}
            className="border p-2 rounded w-full"
          />
        </div>

        <div className="flex flex-col items-start space-y-2">
          <label className="font-semibold">
            Step 3 : Set Minimum Pressure :
          </label>
          <input
            type="number"
            name="minPressure"
            id="minPressure"
            className="border p-2 rounded w-full"
            value={pressure}
            onChange={(e) => {
              setPressure(e.target.value);
              setTableData([]);
            }}
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
        </div>

        <div className="flex items-center gap-x-6">
          <button
            type="button"
            onClick={handleProcessResults}
            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
          >
            Process Results{" "}
          </button>
          <p>
            {loading.results
              ? `Uploaded ${loading.results}/${tableData.length} result and ${loading.files}/${files.length} file`
              : ""}
          </p>
        </div>

        <div className="overflow-x-auto mt-6 w-full">
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="border border-gray-300 p-2">Key</th>
                <th className="border border-gray-300 p-2">File Name</th>
                <th className="border border-gray-300 p-2">Start Date</th>
                <th className="border border-gray-300 p-2">Start time</th>
                <th className="border border-gray-300 p-2">End Time</th>
                <th className="border border-gray-300 p-2">
                  Pressure Max Measurement
                </th>
                <th className="border border-gray-300 p-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {tableData.length > 0 ? (
                tableData.map((row, index) => (
                  <tr key={index} className="text-center">
                    <td className="border border-gray-300 p-2">{row.key}</td>
                    <td className="border border-gray-300 p-2">
                      {row.fileName}
                    </td>
                    <td className="border border-gray-300 p-2">
                      {row.startDate}
                    </td>
                    <td className="border border-gray-300 p-2">
                      {row.startTime}
                    </td>
                    <td className="border border-gray-300 p-2">
                      {row.endTime}
                    </td>
                    <td className="border border-gray-300 p-2">
                      {row.pressureMaxMeasurement}
                    </td>
                    <td
                      className={`border border-gray-300 p-2 ${
                        row.status === "Pass"
                          ? "text-green-500"
                          : "text-red-500"
                      }`}
                    >
                      {row.status}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="text-center p-4 text-gray-500">
                    No results
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="w-full flex items-center justify-end">
          <button
            type="submit"
            className="bg-green-500 cursor-pointer text-white py-2 px-4 rounded hover:bg-green-600"
          >
            Uplooad Results
          </button>
        </div>
      </div>
    </form>
  );
};

export default CSVUploader;
