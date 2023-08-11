import React, { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import axios from "axios";

const Teacher = () => {
  const [file, setFile] = useState();
  const [std, setStd] = useState();
  const { parseExcel } = useAuth();
  function handleSubmit(e) {
    e.preventDefault();
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
        });
    });
  }
  return (
    <form onSubmit={handleSubmit}>
      <input
        type="file"
        name="excel"
        id="excel"
        onChange={(e) => {
          setFile(e.target.files[0]);
        }}
        accept=".xlsx"
      />

      <label htmlFor="std">Class:</label>
      <input
        onChange={(e) => {
          setStd(() => {
            return e.target.value;
          });
        }}
        type="text"
        name="std"
        id="std"
        placeholder="Enter class"
      />

      <button type="submit">Submit</button>
    </form>
  );
};

export default Teacher;
