import React from "react";
import Modal from "../../../UI/Modal";

const ConfigModal = (props) => {
  return (
    <Modal onClose={props.onClose}>
      <div className="flex justify-center">
        <div
          className="mx-auto py-6 px-4 "
          onClick={(e) => e.stopPropagation()}
        >
          <div className="mb-8">
            <h4 className="text-lg font-medium">Transaction Settings</h4>
          </div>

          <div className="mb-4">
            <label className="text-sm font-medium">Slippage Tolerance</label>
          </div>
          <div className="flex mb-6">
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
            <label className="text-sm font-medium ">Transaction Deadline</label>
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
          <div className="flex justify-center mt-10">
            <button
              onClick={props.onClose}
              className="bg-indigo-500 hover:bg-indigo-600 text-white font-medium py-2 px-4 rounded-lg"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ConfigModal;
