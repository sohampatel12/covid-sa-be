import React, { useEffect } from "react";
import {
  Alert,
  Autocomplete,
  Box,
  Button,
  CircularProgress,
  Grid,
  Divider,
  Pagination,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";
import Results from "./Results";
import Analytics from "./Analytics";
import { Legend, Pie, PieChart, Tooltip, Cell } from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28"];

export default function Replies(props: any) {
  const [data, setData] = React.useState<any | undefined>();
  const [first, setFirst] = React.useState(false);
  const [spinner, setSpinner] = React.useState(false);
  const [error, setError] = React.useState({
    show: false,
    message: "",
  });

  useEffect(() => {
    if (!first) {
      setSpinner(true);
      const url = new URL(
        "http://localhost:9999/replies?tweet_id=" + props.tweet_id
      );
      fetch(url.toString(), {
        method: "GET",
        // mode: 'cors',
        redirect: "follow",
      })
        .then((response) => response.json())
        .then((result) => {
          setData(result);
        })
        .catch((error) => {
          setError({
            show: true,
            message: error.toString(),
          });
          console.log(error);
        })
        .finally(() => {
          setSpinner(false);
          setFirst(true);
        });
    }
  }, []);

  const createPieChart = (chartData: any) => {
    return (
      <PieChart width={300} height={250}>
        <Tooltip />
        <Legend verticalAlign="top" height={24} align="right" />
        <Pie
          data={chartData}
          dataKey="value"
          cx="50%"
          cy="50%"
          fill="#8884d8"
          label
        >
          {chartData.map((entry: any, index: number) => (
            <Cell
              key={`cell-${index}-${entry}`}
              fill={COLORS[index % COLORS.length]}
            />
          ))}
        </Pie>
      </PieChart>
    );
  };

  const showProgress = () => {
    if (spinner) {
      return (
        <Box sx={{ width: "100%", flex: 1, textAlign: "center", mt: "50px" }}>
          <div>
            <CircularProgress />
          </div>
          <div>Loading</div>
        </Box>
      );
    } else {
      return <Box sx={{ display: "flex" }}></Box>;
    }
  };

  const renderReply = () => {
    console.log(data);
    if (data && data.replies.length > 0) {
      return (
        <>
          {createPieChart(data?.count)}
          {data?.replies?.map((item: any, index: number) => {
            return (
              <Box sx={{ borderBottom: 1 }}>
                <Typography sx={{ mb: 1.5 }} color="text.primary" key={item.id}>
                  {item.reply_text}
                </Typography>
              </Box>
            );
          })}
          ;
        </>
      );
    } else if (data && data.replies.length == 0 && !spinner) {
      return (
        <Typography sx={{ mb: 1.5 }} color="text.primary">
          No replies found.
        </Typography>
      );
    }
  };

  return (
    <Grid container xs={12}>
      {showProgress()}
      {renderReply()}
    </Grid>
  );
}
