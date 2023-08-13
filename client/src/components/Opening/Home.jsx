import React from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";

const Home = () => {
  const navigate = useNavigate();
  return (
    <div className="home">
      <div className="buttons">
        <h2>Select Login:</h2>
        <button
          onClick={() => {
            navigate("/student/login");
          }}
          className="btn"
        >
          Student
        </button>
        <button
          onClick={() => {
            navigate("/teacher/login");
          }}
          className="btn"
        >
          Teacher
        </button>
      </div>
    </div>
  );
};

export default Home;
