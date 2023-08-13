import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
const AuthContext = React.createContext();
import * as xlsx from "xlsx";

export function useAuth() {
  return useContext(AuthContext);
}
export function AuthProvider({ children }) {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState();
  const [errorMsg, setErrorMsg] = useState();
  const [successMessage, setSuccessMessage] = useState();
  const [loading, setLoading] = useState(false);
  const value = { login, currentUser, parseExcel, errorMsg, successMessage };
  function login(input) {
    setLoading(true);
    setErrorMsg("");
    setSuccessMessage("");
    axios
      .post(`/${input.userType}/login`, input, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      })
      .then((response) => {
        setCurrentUser(() => response.data);
        setLoading(false);
        setSuccessMessage("User Logged in");
        navigate(`/${input.userType}/home`);
      })
      .catch((e) => {
        setErrorMsg("Failed to login");
        setLoading(false);
        console.log(e);
      });
  }

  function parseExcel(file, cb) {
    setErrorMsg();
    setSuccessMessage();
    setLoading(true);
    const promise = new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsArrayBuffer(file);
      fileReader.onload = (e) => {
        const bufferArray = e.target.result;
        const workbook = xlsx.read(bufferArray, { type: "buffer" });
        const sheetNames = workbook.SheetNames;
        var data = {};
        sheetNames.forEach((sheet) => {
          const ws = xlsx.utils.sheet_to_json(workbook.Sheets[sheet]);
          var sheetObj = {};
          ws.map((doc) => {
            const tempObj = JSON.parse(
              `{"${doc.RollNo}": ${JSON.stringify({ ...doc })}}`
            );
            const finalObj = JSON.parse(
              `{"${sheet}":${JSON.stringify({ ...tempObj })}}`
            );
            sheetObj = { ...sheetObj, ...finalObj[sheet] };
          });
          const finalData = JSON.parse(
            `{"${sheet}":${JSON.stringify({ ...sheetObj })}}`
          );
          data = { ...data, ...finalData };
        });
        resolve(data);
      };
    });

    promise
      .then((data) => {
        cb(data);
        setLoading(false);
      })
      .catch(() => {
        setErrorMsg("Failed to parse Excel file");
        setLoading(false);
      });
  }
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
