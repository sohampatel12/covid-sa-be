import React, { useEffect } from 'react';
import { Alert, Autocomplete, Box, Button, CircularProgress, Grid, Pagination, TextField, Toolbar, Typography } from '@mui/material';
import Results from './Results';
import Analytics from './Analytics.jsx';
import { Cell, Legend, Pie, PieChart, Tooltip } from 'recharts';


export default function Misinformation(props: any) {
  const [value, setValue] = React.useState("");
  const [inputValue, setInputValue] = React.useState("");
  const [data, setData] = React.useState<any | undefined>();
  const [spinner, setSpinner] = React.useState(false);
  const [page, setPage] = React.useState(1);
  const [error, setError] = React.useState({
    show: false,
    message: ""
  });

  const sample: any[] = [];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];
  const RADIAN = Math.PI / 180;
  const options = {
    rotations: 1,
    rotationAngles: [0],
  };
  const size = [600, 300];

  const createPieChart = (chartData: any) => {
    return (
      <PieChart width={500} height={250}>
        <Tooltip />
        <Legend verticalAlign="top" height={24} align="right" />
        <Pie data={chartData} dataKey="value" cx="50%" cy="50%" fill="#8884d8" label >
          {chartData.map((entry: string, index: number) => (
            <Cell key={`cell-${index}-${entry}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
      </PieChart>
    )
  }

  const fetchResults = () => {
    const start = page ? ((page - 1) * 10).toString() : "0"
    console.log(start);

    setData(undefined);
    setSpinner(true);
    setError({ ...error, show: false });

    if (!inputValue) {
      setSpinner(false);
      console.log("Enter some details");
    } else {
      const url = new URL("http://localhost:9999/api");
      const headers = {
        'Content-Type': 'application/json'
      }
      const body = {
        "query": inputValue,
        "start": start ? start.toString() : "0",
        "pois": Array(),
        "countries": Array(),
        "languages": Array()
      }

      fetch(url.toString(), {
        method: 'GET',
        mode: 'cors',
        redirect: 'follow',
        headers: headers
      })
        .then(response => response.json())
        .then(result => {
          setData(result);
        })
        .catch(error => {
          setError({
            show: true,
            message: error.toString()
          });
          console.log(error);
        })
        .finally(() => {
          setSpinner(false);
        });
    }
  }


  const showProgress = () => {
    if (spinner) {
      return (
        <Box sx={{ width: '100%', flex: 1, textAlign: 'center', mt: '200px' }}>
          <div><CircularProgress /></div>
          <div>Loading</div>
        </Box>
      )
    } else {
      return (
        <Box sx={{ display: 'flex' }}>
        </Box>
      )
    }
  }

  return (
    <Box component="main" sx={{ flexGrow: 1, p: 0 }}>
      <Toolbar />
      <Grid container xs={12}>
        <Grid item padding={2} xs={4}>
        </Grid>
      </Grid>
      {showProgress()}
    </Box>
  );
}
