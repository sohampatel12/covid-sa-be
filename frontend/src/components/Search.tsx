import React, { useEffect } from 'react';
import { Autocomplete, Box, Button, CircularProgress, Grid, Pagination, TextField, Toolbar, Typography } from '@mui/material';
import Results from './Results';
import Analytics from './Analytics';


export default function Search(props: any) {
  const [value, setValue] = React.useState("");
  const [inputValue, setInputValue] = React.useState("");
  const [data, setData] = React.useState<any | undefined>();
  const [spinner, setSpinner] = React.useState(false);
  const [page, setPage] = React.useState(1);

  const sample: any[] = [];

  const fetchResults = () => {
    const start = page ? ((page - 1) * 10).toString() : "0"
    console.log(start);

    setData(undefined);
    setSpinner(true);

    if (!inputValue) {
      setSpinner(false);
      console.log("Enter some details");
    } else {
      const url = new URL("http://localhost:9999/api");
      url.searchParams.append("query", inputValue);
      url.searchParams.append("start", start ? start : "0");
      const body = {
        "query": inputValue,
        "start": start ? start.toString() : "0",
        "pois": [],
        "countries": [],
        "languages": []
      }
      fetch(url.toString(), {
        method: 'POST',
        mode: 'cors',
        redirect: 'follow',
        body: JSON.stringify(body)
      })
        .then(response => response.json())
        .then(result => {
          setData(result);
        })
        .catch(error => {
          console.log('error', error);
        })
        .finally(() => {
          setSpinner(false);
        });
    }
  }

  const handleKeyDown = (event: any) => {
    if (event.key === "Enter") {
      fetchResults();
    }
  }

  useEffect(() => {
    fetchResults();
  }, [page])

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
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

  const renderResults = () => {
    if (data) {
      return (
        <Grid container xs={12}>
          <Grid item padding={2} xs={6}>
            <Results data={data}></Results>
            <Pagination
              count={Math.ceil(data?.response?.numFound / 10)}
              showFirstButton
              showLastButton
              color="primary"
              page={page}
              onChange={handlePageChange} 
              sx={{ marginLeft: "25%", marginTop: "24px" }}/>
          </Grid>
          <Grid item padding={2} xs={6} sx={{ bgcolor: "primary.disabled" }}>
            <Analytics data={data}></Analytics>
          </Grid>
        </Grid>

      );
    } else if (!spinner && !data) {
      return (
        <Grid container xs={12}>
          <Typography padding={2}>Begin search to see results.</Typography>
        </Grid>
      );
    }
  }

  return (
    <Box component="main" sx={{ flexGrow: 1, p: 0 }}>
      <Toolbar />
      <Grid container xs={12}>
        <Grid item padding={2} xs={4}>
          <Autocomplete
            freeSolo
            id="combo-box-demo"
            options={sample}
            onKeyDown={handleKeyDown}
            // onChange={(event: any, newValue: string | null) => {
            //   setValue(newValue);
            // }}
            onInputChange={(event, newInputValue) => {
              setInputValue(newInputValue);
            }}
            sx={{ width: '100%' }}
            renderInput={(params) => <TextField {...params} label="Search" />}
          />
        </Grid>
        <Grid item padding={2} xs={1.5}>
          <Button variant="contained" sx={{ width: '100%', height: '100%' }} onClick={() => { fetchResults() }}>
            Search
          </Button>
        </Grid>
        <Grid item padding={2} xs={6.5}></Grid>
        {renderResults()}
      </Grid>
      {showProgress()}
    </Box>
  );
}
