import axios from "axios";
import React, { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import "./StudentLogin.css";
import { useNavigate } from "react-router-dom";

const StudentLogin = () => {
  const [input, setInput] = useState({ userType: "student" });
  const { login, errorMsg, successMessage, currentUser } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    if (currentUser && currentUser.isLogged) {
      navigate(`/${currentUser.userType}/home`);
    }
  }, []);
  function handleSubmit(e) {
    e.preventDefault();
    console.log(input);
    login(input);
  }
  return (
    <div className="student-login-container">
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">Roll No. :</label>
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
        <div className="form-group">
          <label htmlFor="cls">Class: </label>
          <input
            onChange={(e) => {
              setInput((inp) => {
                return {
                  ...inp,
                  std: e.target.value,
                };
              });
            }}
            type="text"
            name="std"
            id="std"
          />
        </div>
        {errorMsg && <p className="error-msg">{errorMsg}</p>}
        {successMessage && <p className="success-msg">{successMessage}</p>}
        <button type="submit" className="submit-btn">
          Submit
        </button>
      </form>
    </div>
  );
};

export default StudentLogin;
