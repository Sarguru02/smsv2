import React, { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";

const Teacher = () => {
  const [file, setFile] = useState();
  const { parseExcel } = useAuth();
  function handleSubmit(e) {
    e.preventDefault();
    parseExcel(file, (data) => {
      console.log(data);
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
      />
      <button type="submit">Submit</button>
    </form>
  );
};

export default Teacher;
