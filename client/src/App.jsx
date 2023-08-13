import React from "react";
import { Route, Routes } from "react-router-dom";
import Login from "./components/Login/TeacherLogin";
import axios from "axios";
import Home from "./components/Opening/Home";
import TeacherLogin from "./components/Login/TeacherLogin";
import StudentLogin from "./components/Login/StudentLogin";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import Teacher from "./components/Teacher/Teacher";
import Student from "./components/Student/Student";
import Loading from "./components/Loading/Loading";

axios.defaults.baseURL = "https://smsv2.vercel.app/";

const App = () => {
  const { loading } = useAuth();
  return (
    <div>
      {!loading && (
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/teacher/login" element={<TeacherLogin />} />
          <Route path="/teacher/home" element={<Teacher />} />
          <Route path="/student/login" element={<StudentLogin />} />
          <Route path="/student/home" element={<Student />} />
        </Routes>
      )}
    </div>
  );
};

export default App;
