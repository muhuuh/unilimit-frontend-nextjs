import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import { DataGrid } from "@mui/x-data-grid";
import { useDispatch } from "react-redux";
import { useWeb3Contract } from "react-moralis";
import { abi } from "../../../constants";
import { openOrdersActions } from "../../store/openOrders-slice";
import ChangeAmountPopup from "../Popup/ChangeAmountPopup";
import { useNotification } from "web3uikit";
import { Off } from "@web3uikit/icons";
import contractAddresses from "../../../constants/contractAddress.json" assert { type: "json" };

const OpenOrdersTable = (props) => {
  //-------Define variables-----------
  const currentPoolAddress = contractAddresses["USDC/WETH"].chain["5"][0];
  const dispatch = useDispatch();
  const dispatchNotif = useNotification();
  const [closeCellValue, setCloseCellValue] = useState({
    row: { pool: currentPoolAddress, id: 0 },
  });
  const [changeQuantityCellInfo, setChangeQuantityCellInfo] = useState({});
  const [isVisible, setIsVisible] = useState(false);
  const onCloseHandlerModify = () => {
    setIsVisible(false);
  };

  //-------Define Table columns and button functionalities in cells-----------
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
              className="bg-grayishBlue text-white  rounded-lg px-2 py-1 hover:bg-paleGrayishBlue hover:border-black hover:text-black"
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
              const changeCloseCellValue = async () => {
                setCloseCellValue(cellValues);
              };
              await changeCloseCellValue();
            }}
            className="bg-grayishBlue text-white  rounded-lg px-2 py-1 hover:bg-paleGrayishBlue hover:border-black hover:text-black"
          >
            Close
          </button>
        );
      },
    },
  ];

  //-------Connection to Smart Contract-----------

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

  //-------Display table-----------

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
    <Box sx={{ height: 400, width: 1170 }}>
      <DataGrid
        rows={rows2}
        columns={columns}
        style={{
          color: "#f7fafc",
          //fontFamily: '"font-mono"',
          backgroundColor: "#172437",
          borderColor: "rgb(107 114 128)",
          borderWidth: "1px",
          borderStyle: "solid",
        }}
        className="my-datagrid"
        getRowHeight={() => "auto"}
        autoHeight
        autoWidth
        rowsPerPageOptions={[5]}
        pageSize={5}
        checkboxSelection
        disableSelectionOnClick
        experimentalFeatures={{ newEditingApi: true }}
      />
    </Box>
  );
};

export default OpenOrdersTable;
