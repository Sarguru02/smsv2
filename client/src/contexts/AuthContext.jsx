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
  const value = { login, currentUser, parseExcel };
  function login(input) {
    axios
      .post(`/${input.userType}/login`, input, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      })
      .then((response) => {
        setCurrentUser(() => response.data);
        navigate(`/${input.userType}/home`);
      })
      .catch((e) => {
        console.log(e);
      });
  }

  function parseExcel(file, cb) {
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
          if (sheet.toLowerCase() === "details") {
            data = { ...data, details: { ...ws } };
          } else {
            const newobj = JSON.stringify({ ...ws });
            const obj = JSON.parse(`{"${sheet}": ${newobj}}`);
            data = { ...data, ...obj };
          }
        });
        resolve(data);
      };
    });

    promise.then((data) => {
      cb(data);
    });
  }
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
