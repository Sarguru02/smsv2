import axios from "axios";
import React, { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import "./TeacherLogin.css";
import { useNavigate } from "react-router-dom";

const TeacherLogin = () => {
  const [input, setInput] = useState({ userType: "teacher" });
  const { login, currentUser, errorMsg, successMessage } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    if (currentUser && currentUser.isLogged) {
      return navigate(`/${currentUser.userType}/home`);
    }
  }, []);
  function handleSubmit(e) {
    e.preventDefault();
    login(input);
  }
  return (
    <div className="teacher-login-container">
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">Username: </label>
          <input
            onChange={(e) => {
              setInput((inp) => {
                return {
                  ...inp,
                  username: e.target.value,
                };
              });
            }}
            type="text "
            id="username"
            name="username"
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            onChange={(e) => {
              setInput((inp) => {
                return {
                  ...inp,
                  password: e.target.value,
                };
              });
            }}
            type="password"
            name="password"
            id="pwd"
          />
        </div>
        {errorMsg && <p className="error-msg">{errorMsg}</p>}
        {successMessage && <p className="success-msg">{successMessage}</p>}
        <button className="submit-btn" type="submit">
          Submit
        </button>
      </form>
    </div>
  );
};

export default TeacherLogin;
