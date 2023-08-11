import React, { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import axios from "axios";
import Row from "./Row";

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
      <div className="student-details" align="center">
        <h1>Name: {currentUser && currentUser.Name}</h1>
        <h1>Roll No. : {currentUser && currentUser.RollNo}</h1>
      </div>
      <div className="student-marks">
        {data &&
          Object.keys(data).map((key) => {
            return (
              <div align="center" key={crypto.randomUUID()}>
                <h2 key={crypto.randomUUID()}>{key.toUpperCase()}</h2>
                <table align="center" key={crypto.randomUUID()}>
                  <thead>
                    <tr>
                      <th>S.no</th>
                      <th>Subject</th>
                      <th>Marks</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data &&
                      Object.keys(data[key]).map((a, i) => {
                        return (
                          <Row
                            key={crypto.randomUUID()}
                            sub={a}
                            idx={i}
                            obj={data[key]}
                          />
                        );
                      })}
                  </tbody>
                </table>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default Student;
