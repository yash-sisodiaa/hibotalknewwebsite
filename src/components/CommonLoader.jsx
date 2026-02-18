import React from "react";

const CommonLoader = ({ size = 20 }) => {
  return (
    <div style={{ textAlign: "center" }}>
      <div
        style={{
          width: size,
          height: size,
          border: "3px solid #f3f3f3",
          borderTop: "3px solid #007bff",
          borderRadius: "50%",
          animation: "spin 1s linear infinite"
        }}
      />
    </div>
  );
};

export default CommonLoader;
