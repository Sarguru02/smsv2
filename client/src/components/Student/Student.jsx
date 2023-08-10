import React, { useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import axios from "axios";

const Student = () => {
  const { currentUser } = useAuth();
  useEffect(() => {
    const { std, username } = currentUser;
    axios
      .post(
        "/student/data",
        { std, username },
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      )
      .then((response) => {
        console.log(response.data);
      });
  }, []);
  console.log(currentUser);
  return <div>Student</div>;
};

export default Student;
