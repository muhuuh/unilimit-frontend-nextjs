import React from "react";
import { ConnectButton } from "web3uikit";

const Header = () => {
  return (
    <div className="flex flex-row justify-between border-b-2 text-teal-500 font-bold py-6 mb-10">
      <div className="text-xl">UniLimit</div>
      <div className="flex flex-row justify-center gap-x-6 ">
        <button>FAQ</button>
        <button>About</button>
      </div>
      <div className="flex flex-row justify-center gap-x-6">
        <ConnectButton moralisAuth={false} />
      </div>
    </div>
  );
};

export default Header;
