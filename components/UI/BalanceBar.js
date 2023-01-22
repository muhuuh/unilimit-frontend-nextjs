import React, { useState } from "react";

const BalanceBar = (props) => {
  const [selectedPercentage, setSelectedPercentage] = useState(0.1);

  const handleClick = (event) => {
    event.persist();
    const percentage =
      //event.nativeEvent.offsetX / event.target.getBoundingClientRect().width;
      event.nativeEvent.offsetX / props.width;
    if (percentage > 1) {
      setSelectedPercentage(1);
    } else if (percentage < 0) {
      setSelectedPercentage(0);
    } else {
      setSelectedPercentage(percentage);
    }
  };

  console.log("selectedPercentage");
  console.log(selectedPercentage);
  return (
    <div
      style={{
        width: `${props.width}px`,
        height: "5px",
        backgroundColor: "green",
        position: "relative",
        left: 0,
        borderLeft: "1px solid white",
      }}
      onClick={handleClick}
    >
      <div
        style={{
          width: `${selectedPercentage * 100}%`,
          height: "100%",
          backgroundColor: "white",
          position: "relative",
        }}
      ></div>
      <div
        style={{
          width: "12px",
          height: "12px",
          backgroundColor: "black",
          borderRadius: "50%",
          border: "1px solid white",
          position: "absolute",
          left: "0%",
          top: "50%",
          transform: "translate(-50%, -50%)",
        }}
        onClick={() => {
          setSelectedPercentage(0.25);
        }}
      ></div>
      <div
        style={{
          width: "12px",
          height: "12px",
          backgroundColor: "black",
          borderRadius: "50%",
          border: "1px solid white",
          position: "absolute",
          left: "25%",
          top: "50%",
          transform: "translate(-50%, -50%)",
        }}
        onClick={() => {
          setSelectedPercentage(0.5);
        }}
      ></div>
      <div
        style={{
          width: "12px",
          height: "12px",
          backgroundColor: "black",
          borderRadius: "50%",
          border: "1px solid white",
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
        }}
      ></div>
      <div
        style={{
          width: "12px",
          height: "12px",
          backgroundColor: "black",
          borderRadius: "50%",
          border: "1px solid white",
          position: "absolute",
          left: "75%",
          top: "50%",
          transform: "translate(-50%, -50%)",
        }}
      ></div>
      <div
        style={{
          width: "12px",
          height: "12px",
          backgroundColor: "black",
          borderRadius: "50%",
          border: "1px solid white",
          position: "absolute",
          left: "100%",
          top: "50%",
          transform: "translate(-50%, -50%)",
        }}
      ></div>
    </div>
  );
};

export default BalanceBar;
