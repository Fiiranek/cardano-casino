import React from "react";
import { Wheel } from "react-custom-roulette";

const data = [
  { option: "0", style: { backgroundColor: "green", textColor: "black" } },
  { option: "1", style: { backgroundColor: "white" } },
  { option: "2" },
];

const Spin2 = () => (
  <Wheel
    mustStartSpinning={true}
    prizeNumber={3}
    data={data}
    backgroundColors={["#3e3e3e", "#df3428"]}
    textColors={["#ffffff"]}
    onStopSpinning={(e) => {
      console.log(e);
    }}
  />
);

export default Spin2;
