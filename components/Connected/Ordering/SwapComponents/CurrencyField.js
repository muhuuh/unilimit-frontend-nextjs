import React from "react";
import LoadingSpinner from "../../../UI/LoadingSpinner";
import { BeatLoader } from "react-spinners";

const CurrencyField = (props) => {
  const getPrice = (value) => {
    props.getSwapPrice(value);
  };

  const fetchElement = (
    <div>
      <BeatLoader color="#36d7b7" size={8} margin={3} />
    </div>
  );
  return (
    <div className="flex flex-row gap-x-3">
      <div className="">
        {props.loading ? (
          <div className="text-center py-5">{fetchElement}</div>
        ) : (
          <input
            className="bg-gray-100 h-14 rounded-lg py-2 px-3 text-gray-800"
            placeholder="0.0"
            value={props.value}
            onBlur={(e) =>
              props.field === "input" ? getPrice(e.target.value) : null
            }
          />
        )}
      </div>
      <div className="">
        <span className="text-lg font-medium">{props.tokenName}</span>
        <div className="text-sm text-gray-600">
          Balance: {props.balance?.toFixed(3)}
        </div>
      </div>
    </div>
  );
};

export default CurrencyField;
