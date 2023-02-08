import React, { useEffect, useState } from "react";

const BalanceBar = (props) => {
  const [selectedPercentage, setSelectedPercentage] = useState(0);

  const handleClick = (event) => {
    event.persist();
    //should only runs if the bar marks are not clicked (12px width)
    if (event.nativeEvent.offsetX > 12) {
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
    }
  };

  useEffect(() => {
    console.log("selectedPercentage");
    console.log(selectedPercentage);
    if (props.balanceBarHandler) {
      props.balanceBarHandler(selectedPercentage);
    }
  }, [selectedPercentage]);

  return (
    <div onClick={handleClick} className="h-5 flex items-center">
      <div
        style={{
          width: `${props.width}px`,
          height: "5px",
          backgroundColor: "RGB(82,99,203)",
          position: "relative",
          left: 0,
          borderLeft: "1px solid white",
        }}
      >
        <div
          style={{
            width: `${selectedPercentage * 100}%`,
            height: "100%",
            backgroundColor: "RGB(183, 193, 254)",
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
            setSelectedPercentage(0);
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
            left: "50%",
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
            left: "75%",
            top: "50%",
            transform: "translate(-50%, -50%)",
          }}
          onClick={() => {
            setSelectedPercentage(0.75);
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
          onClick={() => {
            setSelectedPercentage(1);
          }}
        ></div>
      </div>
    </div>
  );
};

export default BalanceBar;
