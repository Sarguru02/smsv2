import React from "react";

const Row = ({ sub, idx, obj }) => {
  return (
    <tr>
      <td>{idx + 1}</td>
      <td>{sub.toUpperCase()}</td>
      <td>{obj[sub]}</td>
    </tr>
  );
};

export default Row;
