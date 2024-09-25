import { Stack, Box, Paper, Divider } from "@mui/material";
import NavBar from "../components/NavBar";
import * as React from "react";
import { PieChart } from "@mui/x-charts/PieChart";

const ResultPage = () => {
  return (
    <Stack sx={{ backgroundColor: "skyblue", height: "100vh" }}>
      <NavBar />
      <Box sx={{ backgroundColor: "yellow", height: "40vh", width: "40vw" }}>
        <PieChart
          series={[
            {
              data: [
                { id: 0, value: 10, label: "series A" },
                { id: 1, value: 15, label: "series B" },
                { id: 2, value: 20, label: "series C" },
              ],
            },
          ]}
        />
      </Box>
    </Stack>
  );
};

export default ResultPage;
