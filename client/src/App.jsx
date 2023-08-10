import React from "react";
import { Route, Routes } from "react-router-dom";
import Login from "./components/Login/TeacherLogin";
import axios from "axios";
import Home from "./components/Opening/Home";
import TeacherLogin from "./components/Login/TeacherLogin";
import StudentLogin from "./components/Login/StudentLogin";
import { AuthProvider } from "./contexts/AuthContext";
import Teacher from "./components/Teacher/Teacher";
import Student from "./components/Student/Student";

axios.defaults.baseURL = "http://localhost:8080";

const App = () => {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/teacher/login" element={<TeacherLogin />} />
        <Route path="/teacher/home" element={<Teacher />} />
        <Route path="/student/login" element={<StudentLogin />} />
        <Route path="/student/home" element={<Student />} />
      </Routes>
    </AuthProvider>
  );
};

export default App;
