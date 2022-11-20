import { useCallback, useReducer } from "react";

const defaultState = {
  status: "null",
  error: null,
};

const httpReducer = (state, action) => {
  if (action.type === "SENT") {
    return {
      status: "pending",
      error: null,
    };
  }
  if (action.type === "SUCCESS") {
    return {
      status: "success",
      error: null,
    };
  }
  if (action.type === "ERROR") {
    return {
      status: "error",
      error: action.errorMessage,
    };
  }
};

const UseHttp = () => {
  const [httpState, dispatchHttp] = useReducer(httpReducer, defaultState);

  const sendRequest = useCallback(async (resquestConfig, applyData) => {
    dispatchHttp({ type: "SENT" });
    try {
      const response = await fetch(resquestConfig.url, {
        method: resquestConfig.method ? resquestConfig.method : "GET",
        headers: resquestConfig.headers ? resquestConfig.headers : {},
        body: resquestConfig.body ? JSON.stringify(resquestConfig.body) : null,
        mode: "cors",
      });

      if (!response.ok) {
        console.log("error, response failed");
        throw new Error("Request failed!");
      }

      const data = await response.json();
      console.log(data);
      applyData(data);
    } catch (err) {
      dispatchHttp({
        type: "ERROR",
        errorMessage: err.message || "Something went wrong!",
      });
    }
    dispatchHttp({ type: "SUCCESS" });
  }, []);

  return {
    httpState: httpState,
    sendRequest: sendRequest,
  };
};

export default UseHttp;
