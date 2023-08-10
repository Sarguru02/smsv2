import React from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  return (
    <>
      <button
        onClick={() => {
          navigate("/student/login");
        }}
      >
        Student
      </button>
      <button
        onClick={() => {
          navigate("/teacher/login");
        }}
      >
        Teacher
      </button>
    </>
  );
};

export default Home;
