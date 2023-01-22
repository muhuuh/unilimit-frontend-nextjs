import React, { useState } from "react";

const BalanceBar = (props) => {
  const [selectedPercentage, setSelectedPercentage] = useState(0.1);

  const handleClick = (event) => {
    console.log("nativeEvent.offsetX");
    console.log(event.nativeEvent.offsetX);
    console.log("event.target.getBoundingClientRect().width");
    console.log(event.target.getBoundingClientRect().width);
    const percentage =
      //event.nativeEvent.offsetX / event.target.getBoundingClientRect().width;
      event.nativeEvent.offsetX / props.width;
    console.log("percentage");
    console.log(percentage);
    if (percentage > 1) {
      setSelectedPercentage(1);
    } else if (percentage < 0) {
      setSelectedPercentage(0);
    } else {
      setSelectedPercentage(percentage);
    }
  };
  return (
    <div
      style={{
        width: `${props.width}px`,
        height: "20px",
        backgroundColor: "green",
        position: "relative",
        left: 0,
      }}
      onClick={handleClick}
    >
      <div
        style={{
          width: `${selectedPercentage * 100}%`,
          height: "100%",
          backgroundColor: "red",
          position: "relative",
        }}
      ></div>
    </div>
  );
};

export default BalanceBar;
