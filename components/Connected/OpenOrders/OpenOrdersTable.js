import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import { DataGrid } from "@mui/x-data-grid";
import { useDispatch } from "react-redux";
import { useWeb3Contract } from "react-moralis";
import { abi } from "../../../constants";
import useModal from "../../../hooks/use-modal";
import { openOrdersActions } from "../../store/openOrders-slice";
import ChangeAmountPopup from "../Popup/ChangeAmountPopup";
import { useNotification } from "web3uikit";
import { Off } from "@web3uikit/icons";

const OpenOrdersTable = (props) => {
  const [closeCellValue, setCloseCellValue] = useState({
    row: { pool: "0x9E5D7582Fbc36d1366FC1F113f400eE3175B4bc2", id: 0 },
  });
  const [changeQuantityCellInfo, setChangeQuantityCellInfo] = useState({});
  const [isVisible, setIsVisible] = useState(false);
  const onCloseHandlerModify = () => {
    setIsVisible(false);
  };
  console.log("dataOpenOrder");
  console.log(props.dataOpenOrder);
  const columns = [
    { field: "id", headerName: "ID", width: 90 },
    {
      field: "status",
      headerName: "Status",
      width: 100,
    },
    {
      field: "pair",
      headerName: "Pair",
      width: 150,
    },
    {
      field: "pool",
      headerName: "Pool",
      width: 150,
    },
    {
      field: "side",
      headerName: "Side",
      width: 70,
    },
    {
      field: "quantity",
      headerName: "Quantity",
      type: "number",
      width: 100,
    },
    {
      field: "targetPrice",
      headerName: "Target Price",
      type: "number",
      width: 150,
    },
    {
      field: "newSize",
      headerName: "Adjust Size",
      width: 150,
      renderCell: (cellValues) => {
        return (
          <div>
            <button
              variant="contained"
              color="primary"
              onClick={() => {
                setChangeQuantityCellInfo(cellValues);
                setIsVisible(true);
              }}
              className="bg-grayishBlue text-white border-2 rounded-lg px-2 py-1 hover:bg-paleGrayishBlue hover:border-black hover:text-black"
            >
              Modify
            </button>
            {isVisible && (
              <ChangeAmountPopup
                onClose={onCloseHandlerModify}
                id={changeQuantityCellInfo.row.id}
                quantity={changeQuantityCellInfo.row.quantity}
                pool={changeQuantityCellInfo.row.pool}
                side={changeQuantityCellInfo.row.side}
                pair={changeQuantityCellInfo.row.pair}
              />
            )}
          </div>
        );
      },
    },
    {
      field: "close",
      headerName: "Close",
      width: 150,
      renderCell: (cellValues) => {
        return (
          <button
            variant="contained"
            color="primary"
            onClick={async () => {
              console.log("close cellValues");
              console.log(cellValues);
              console.log("closingorderhandler called");
              const changeCloseCellValue = async () => {
                console.log("changing closing cell value ..)");
                setCloseCellValue(cellValues);
              };
              await changeCloseCellValue();
              console.log("closeCellValue");
              console.log(closeCellValue);
            }}
            className="bg-grayishBlue text-white border-2 rounded-lg px-2 py-1 hover:bg-paleGrayishBlue hover:border-black hover:text-black"
          >
            Close
          </button>
        );
      },
    },
  ];
  const dispatch = useDispatch();
  /*
  const {
    isVisible: isVisibleModify,
    onCloseHandler: onCloseHandlerModify,
    onVisibleHandler: onVisibleHandlerModify,
  } = useModal();
  */
  const dispatchNotif = useNotification();

  const onHandleSuccess = async (tx) => {
    console.log("Close Order succesful");
    onHandleNotification(tx);
  };

  const onHandleNotification = () => {
    dispatchNotif({
      type: "info",
      message: "Open Order closed",
      title: "Tx notification",
      position: "topR",
      icon: <Off fontSize="50px" />,
    });
  };

  const { runContractFunction: closePositionOwner } = useWeb3Contract({
    abi: abi,
    contractAddress: closeCellValue.row.pool,
    functionName: "closePositionOwner",
    params: { positionId: closeCellValue.row.id },
  });

  useEffect(() => {
    if (Number(closeCellValue.row.id) > 0) {
      console.log("closing starting");
      closePositionOwner({
        onSuccess: (tx) =>
          tx.wait(1).then((finalTx) => {
            console.log("on closing tx...");
            console.log(finalTx);
            onHandleNotification(finalTx);
            console.log("done closed");
          }),
        onError: (error) => {
          console.log("error closing order");
          console.log(error);
        },
      });
      dispatch(openOrdersActions.closeOpenOrder(props.id));
    }
  }, [closeCellValue]);

  /*
  const onCloseHandler = async (cellValues) => {
    console.log("close cellValues");
    console.log(cellValues);
    console.log("closingorderhandler called");
    const { runContractFunction: closePositionOwner } = useWeb3Contract({
      abi: abi,
      contractAddress: props.pool,
      functionName: "closePositionOwner",
      params: { positionId: cellValues }, //TODOget the current id from props. fetching should put in it store and the get from parent compoent
    });

    closePositionOwner({
      onSuccess: onHandleSuccess,
      onError: (error) => {
        console.log("error closing order");
        console.log(error);
      },
    });
    dispatch(openOrdersActions.closeOpenOrder(props.id));
  };
  */

  const rows2 = [];
  props.dataOpenOrder.map((order) => {
    const data = {
      id: order.positionId,
      status: order.status,
      pair: order.pair,
      pool: order.pool,
      side: order.side,
      quantity: Number(order.quantity),
      targetPrice: Number(order.sqrtPriceX96),
      newSize: "Change",
      close: "Close",
    };
    rows2.push(data);
  });

  return (
    <Box sx={{ height: 400, width: "75%" }}>
      <DataGrid
        rows={rows2}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5]}
        checkboxSelection
        disableSelectionOnClick
        experimentalFeatures={{ newEditingApi: true }}
      />
    </Box>
  );
};

export default OpenOrdersTable;

/*
 */
