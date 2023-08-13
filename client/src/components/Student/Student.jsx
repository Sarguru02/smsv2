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
        <div className="photo"></div>
        <div className="detail-right">
          <h1 className="name">Name: {currentUser && currentUser.Name}</h1>
          <h1 className="rollno">
            Roll No. : {currentUser && currentUser.RollNo}
          </h1>
          <h1 className="std">Class: {currentUser && currentUser.std}</h1>
          <h1 className="section">
            Section:{" "}
            {currentUser &&
              currentUser["RollNo"].charAt(currentUser["RollNo"].length - 4)}
          </h1>
        </div>
      </div>
      <div className="student-marks">
        {data &&
          Object.keys(data).map((key) => {
            return (
              <div key={crypto.randomUUID()}>
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
