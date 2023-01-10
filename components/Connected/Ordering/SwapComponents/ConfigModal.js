import React from "react";

const ConfigModal = (props) => {
  return (
    <div
      className="fixed top-0 left-0 z-50 w-full h-full bg-black opacity-75"
      onClick={props.onClose}
    >
      <div
        className="mx-auto w-1/2 py-6 px-4 bg-white rounded-lg text-left"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4">
          <h4 className="text-lg font-medium">Transaction Settings</h4>
        </div>

        <div className="mb-4">
          <label className="text-sm font-medium">Slippage Tolerance</label>
        </div>
        <div className="flex">
          <div className="w-9/12">
            <input
              className="bg-gray-100 rounded-lg py-2 px-3 text-gray-800"
              placeholder="1.0%"
              value={props.slippageAmount}
              onChange={(e) => props.setSlippageAmount(e.target.value)}
            />
          </div>
          <div className="w-3/12 pl-2">
            <span className="text-gray-600">%</span>
          </div>
        </div>

        <div className="mb-4">
          <label className="text-sm font-medium">Transaction Deadline</label>
        </div>
        <div className="flex">
          <div className="w-9/12">
            <input
              className="bg-gray-100 rounded-lg py-2 px-3 text-gray-800"
              placeholder="10"
              value={props.deadlineMinutes}
              onChange={(e) => props.setDeadlineMinutes(e.target.value)}
            />
          </div>
          <div className="w-3/12 pl-2">
            <span className="text-gray-600">minutes</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfigModal;
