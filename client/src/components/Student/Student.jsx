import React, { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import axios from "axios";

const Student = () => {
  const { currentUser } = useAuth();
  const [data, setData] = useState();
  useEffect(() => {
    const { std, RollNo } = currentUser;
    axios
      .post(
        "/student/data",
        { std, RollNo },
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      )
      .then((response) => {
        setData(response.data);
      });
  }, []);
  return (
    <div className="student-container">
      <div className="student-details">
        <h1>Name: {currentUser && currentUser.Name}</h1>
        <h1>Roll No. : {currentUser && currentUser.RollNo}</h1>
      </div>
      <div className="student-marks">
        <table border="1">
          <thead>
            <tr>
              <th>Subject</th>
              <th>Marks</th>
            </tr>
          </thead>
        </table>
      </div>
    </div>
  );
};

export default Student;
