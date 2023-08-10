import axios from "axios";
import React, { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";

const StudentLogin = () => {
  const [input, setInput] = useState({ userType: "student" });
  const { login } = useAuth();
  function handleSubmit(e) {
    e.preventDefault();
    console.log(input);
    login(input);
  }
  return (
    <form onSubmit={handleSubmit}>
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

      <button type="submit">Submit</button>
    </form>
  );
};

export default StudentLogin;
