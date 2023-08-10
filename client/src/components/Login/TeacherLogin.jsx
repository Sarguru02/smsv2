import axios from "axios";
import React, { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";

const TeacherLogin = () => {
  const [input, setInput] = useState({ userType: "teacher" });
  const { login } = useAuth();
  function handleSubmit(e) {
    e.preventDefault();
    login(input);
  }
  return (
    <form onSubmit={handleSubmit}>
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

      <button type="submit">Submit</button>
    </form>
  );
};

export default TeacherLogin;
