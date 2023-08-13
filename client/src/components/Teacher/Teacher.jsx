import React, { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileExcel } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import "./Teacher.css";
import { useNavigate } from "react-router-dom";

const Teacher = () => {
  const [file, setFile] = useState();
  const [std, setStd] = useState();
  const [errMsg, setErrMsg] = useState();
  const navigate = useNavigate();
  const [successMsg, setSuccessMsg] = useState();
  const { parseExcel, currentUser } = useAuth();
  // useEffect(() => {
  //   if (currentUser && !currentUser.isLogged) {
  //     alert("Not logged in");
  //     return navigate("/");
  //   }
  // }, []);
  function handleSubmit(e) {
    e.preventDefault();
    if (!file) {
      setErrMsg("File not uploaded");
      return;
    }
    if (parseInt(std) < 1 || parseInt(std) > 12 || isNaN(parseInt(std))) {
      setErrMsg("Class is not valid");
      return;
    }
    parseExcel(file, (data) => {
      axios
        .post(
          "/teacher/upload",
          { ...data, std },
          {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
          }
        )
        .then(() => {
          console.log("Success");
          setSuccessMsg("File Uploaded Successfully!");
        });
    });
  }
  return (
    <div className="teacher">
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="excel" className="excel-input">
            Upload Your file
            <FontAwesomeIcon icon={faFileExcel} size="3x" />
          </label>
          <input
            type="file"
            name="excel"
            id="excel"
            className="file-upload"
            onChange={(e) => {
              setFile(e.target.files[0]);
            }}
            accept=".xlsx"
          />
        </div>
        <div className="form-group">
          <p>File: {(file && file.name) || "No file Uploaded"}</p>
        </div>

        <div className="form-group">
          <label htmlFor="std" className="form-label">
            Class:
          </label>
          <input
            onChange={(e) => {
              setStd(() => {
                return e.target.value;
              });
            }}
            className="form-input"
            type="text"
            name="std"
            id="std"
            placeholder="Enter class"
            required
          />
        </div>
        {errMsg && <p className="error-msg">{errMsg}</p>}
        {successMsg && <p className="success-msg">{successMsg}</p>}
        <div className="form-group">
          <button type="submit" className="submit-btn">
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default Teacher;
