import React from "react";
import Box from "@mui/material/Box";
import { DataGrid, GridColDef, GridValueGetterParams } from "@mui/x-data-grid";

const columns = [
  { field: "id", headerName: "ID", width: 90 },
  {
    field: "status",
    headerName: "Status",
    width: 150,
  },
  {
    field: "pair",
    headerName: "Pair",
    width: 150,
  },
  {
    field: "side",
    headerName: "Side",
    width: 150,
  },
  {
    field: "quantity",
    headerName: "Quantity",
    width: 150,
  },
  {
    field: "targetPrice",
    headerName: "Target Price",
    width: 150,
  },
  {
    field: "newSize",
    headerName: "Adjust Size",
    width: 150,
  },
  {
    field: "close",
    headerName: "Close",
    width: 150,
  },
];

const rows = [
  { id: 1, lastName: "Snow", firstName: "Jon", age: 35 },
  { id: 2, lastName: "Lannister", firstName: "Cersei", age: 42 },
  { id: 3, lastName: "Lannister", firstName: "Jaime", age: 45 },
  { id: 4, lastName: "Stark", firstName: "Arya", age: 16 },
  { id: 5, lastName: "Targaryen", firstName: "Daenerys", age: null },
  { id: 6, lastName: "Melisandre", firstName: null, age: 150 },
  { id: 7, lastName: "Clifford", firstName: "Ferrara", age: 44 },
  { id: 8, lastName: "Frances", firstName: "Rossini", age: 36 },
  { id: 9, lastName: "Roxie", firstName: "Harvey", age: 65 },
];

const OpenOrdersChart = (props) => {
  console.log("props.dataOpenOrderrr");
  console.log(props.dataOpenOrder);
  const rows2 = [];
  props.dataOpenOrder.map((order) => {
    const data = {
      id: order.id,
      status: order.status,
      pair: order.pair,
      side: order.side,
      quantity: order.quantity,
      targetPrice: order.targetPrice,
      newSize: "Change",
      close: "Close",
    };
    rows2.push(data);
  });

  const ids = [];
  props.dataOpenOrder.map((order) => {
    ids.push(order.id);
  });
  console.log("test ids");
  console.log(ids);
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

export default OpenOrdersChart;
