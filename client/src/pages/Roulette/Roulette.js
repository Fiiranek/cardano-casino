import React from "react";
import { Wheel } from "react-custom-roulette";

const data = [
  { option: "0", style: { backgroundColor: "green", textColor: "black" } },
  { option: "1", style: { backgroundColor: "white" } },
  { option: "2" },
];
function Roulette() {
  return (
    <div>
      <Wheel
        mustStartSpinning={true}
        prizeNumber={3}
        data={data}
        backgroundColors={["#3e3e3e", "#df3428"]}
        textColors={["#ffffff"]}
        onStopSpinning={(e) => console.log("finish", e)}
      />
    </div>
  );
}

export default Roulette;
