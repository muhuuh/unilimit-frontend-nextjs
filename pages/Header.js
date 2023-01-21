import React from "react";
import { ConnectButton } from "web3uikit";

const Header = () => {
  return (
    <div className="flex flex-row justify-between border-b-2 text-grayishBlue font-bold py-6 mb-10">
      <div className="text-3xl">UniLimit</div>
      <div className="flex flex-row justify-center text-lg gap-x-12 ml-52">
        <button>FAQ</button>
        <button>About</button>
      </div>
      <div className="flex flex-row justify-center gap-x-6">
        <ConnectButton moralisAuth={true} />
      </div>
    </div>
  );
};

export default Header;
