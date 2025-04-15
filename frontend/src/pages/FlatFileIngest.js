import React, { useState } from "react";
import axios from "axios";

const FlatFileIngest = () => {
  const [file, setFile] = useState(null);
  const [delimiter, setDelimiter] = useState(",");
  const [filePath, setFilePath] = useState("");
  const [columns, setColumns] = useState([]);
  const [selectedColumns, setSelectedColumns] = useState([]);
  const [previewData, setPreviewData] = useState([]);
  const [clickhouseConfig, setClickhouseConfig] = useState({
    host: "",
    port: "",
    database: "",
    user: "",
    token: "",
    table: ""
  });
  const [status, setStatus] = useState("");

  const handleFileChange = (e) => setFile(e.target.files[0]);

  const uploadFile = async () => {
    if (!file) return alert("Choose a file first!");
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await axios.post("http://localhost:5000/api/upload", formData);
      setFilePath(res.data.file_path);
      setStatus("File uploaded.");
    } catch (err) {
      setStatus("Upload error: " + err.response.data.error);
    }
  };

  const loadColumns = async () => {
    try {
      const res = await axios.post("http://localhost:5000/api/file-columns", {
        file_path: filePath,
        delimiter
      });
      setColumns(res.data.columns);
      setSelectedColumns(res.data.columns);
      setStatus("Columns loaded.");
    } catch (err) {
      setStatus("Column load error: " + err.response.data.error);
    }
  };

  const loadPreview = async () => {
    try {
      const res = await axios.post("http://localhost:5000/api/file-preview", {
        file_path: filePath,
        delimiter
      });
      setPreviewData(res.data.preview);
    } catch (err) {
      setStatus("Preview error: " + err.response.data.error);
    }
  };

  const ingestToClickHouse = async () => {
    try {
      const res = await axios.post("http://localhost:5000/api/ingest-to-clickhouse", {
        ...clickhouseConfig,
        file_path: filePath,
        columns: selectedColumns,
        delimiter
      });
      setStatus(`Ingested ${res.data.records} records successfully.`);
    } catch (err) {
      setStatus("Ingestion error: " + err.response.data.error);
    }
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Flat File → ClickHouse</h2>

      <div className="mb-4">
        <label>Upload CSV File:</label>
        <input type="file" onChange={handleFileChange} />
        <button className="btn ml-2" onClick={uploadFile}>Upload</button>
      </div>

      <div className="mb-4">
        <label>Delimiter:</label>
        <input type="text" value={delimiter} onChange={(e) => setDelimiter(e.target.value)} className="ml-2 p-1 border rounded" />
        <button className="btn ml-2" onClick={loadColumns}>Load Columns</button>
      </div>

      {columns.length > 0 && (
        <div className="mb-4">
          <h4 className="font-semibold">Select Columns:</h4>
          {columns.map((col) => (
            <label key={col} className="mr-4">
              <input
                type="checkbox"
                checked={selectedColumns.includes(col)}
                onChange={() => {
                  setSelectedColumns((prev) =>
                    prev.includes(col)
                      ? prev.filter((c) => c !== col)
                      : [...prev, col]
                  );
                }}
              />{" "}
              {col}
            </label>
          ))}
          <button className="btn ml-2" onClick={loadPreview}>Preview</button>
        </div>
      )}

      {previewData.length > 0 && (
        <div className="mb-4">
          <h4 className="font-semibold">Preview (first 100 rows):</h4>
          <div className="overflow-x-scroll border">
            <table className="table-auto min-w-full text-sm">
              <thead>
                <tr>
                  {columns.map((col) => (
                    <th key={col} className="border px-2 py-1">{col}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {previewData.map((row, idx) => (
                  <tr key={idx}>
                    {columns.map((col) => (
                      <td key={col} className="border px-2 py-1">{row[col]}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="mb-4">
        <h4 className="font-semibold">ClickHouse Config:</h4>
        {["host", "port", "database", "user", "token", "table"].map((key) => (
          <div key={key} className="mb-1">
            <input
              placeholder={key}
              value={clickhouseConfig[key]}
              onChange={(e) => setClickhouseConfig({ ...clickhouseConfig, [key]: e.target.value })}
              className="p-2 border rounded w-full"
            />
          </div>
        ))}
      </div>

      <button className="btn bg-blue-600 text-white px-4 py-2 rounded" onClick={ingestToClickHouse}>
        Start Ingestion
      </button>

      {status && <div className="mt-4 text-green-600 font-semibold">{status}</div>}
    </div>
  );
};

export default FlatFileIngest;
