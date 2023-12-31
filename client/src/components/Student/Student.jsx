import React, { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import axios from "axios";
import Row from "./Row";
import "./Student.css";
import { useNavigate } from "react-router-dom";

const Student = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState();
  function sorted(arr) {
    arr.sort();
    return arr.map((key) => {
      return key.split("_")[1];
    });
  }
  useEffect(() => {
    if (!currentUser || !currentUser.isLogged) {
      alert("Session Expired!");
      return navigate("/");
    }
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
        <div className="detail-right">
          <p className="name">Name: {currentUser && currentUser.Name}</p>
          <p className="rollno">
            Roll No. : {currentUser && currentUser.RollNo}
          </p>
          <p className="std">
            Class:{" "}
            {currentUser &&
              `${currentUser.std}-${currentUser["RollNo"].charAt(
                currentUser["RollNo"].length - 4
              )}`}
          </p>
        </div>
      </div>
      <div className="student-marks">
        {data &&
          Object.keys(data).map((key) => {
            return (
              <div className="table-container" key={crypto.randomUUID()}>
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
                      sorted(Object.keys(data[key])).map((a, i) => {
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
