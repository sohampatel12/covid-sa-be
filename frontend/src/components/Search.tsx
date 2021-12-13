import React, { useEffect } from 'react';
import { Alert, Autocomplete, Box, Button, CircularProgress, Grid, Pagination, TextField, Toolbar, Typography } from '@mui/material';
import Results from './Results';
import Analytics from './Analytics.jsx';


export default function Search(props: any) {
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
      const url = new URL("http://13.59.1.184:9999/api");
      const headers = {
        'Content-Type': 'application/json'
      }
      const body = {
        "query": inputValue,
        "start": start ? start.toString() : "0",
        "pois": Array(),
        "countries": Array(),
        "languages": Array(),
        "sentiment": Array()
      }
      createRequestBody(body);

      fetch(url.toString(), {
        method: 'POST',
        mode: 'cors',
        redirect: 'follow',
        body: JSON.stringify(body),
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

  const createRequestBody = (body: any) => {
    for (let key in props.languages) {
      if (props.languages[key]) {
        body.languages.push(key)
      }
    }
    for (let key in props.countries) {
      if (props.countries[key]) {
        body.countries.push(key)
      }
    }
    for (let key in props.pois) {
      if (props.pois[key]) {
        body.pois.push(key)
      }
    }
    for (let key in props.sentiment) {
      if (key == "positive" && props.sentiment[key] == true) {
        body.sentiment.push("1");
      }
      if (key == "neutral" && props.sentiment[key] == true) {
        body.sentiment.push("0");
      }
      if (key == "negative" && props.sentiment[key] == true) {
        // body.sentiment.push("-1");
        body.sentiment.push("2");
      }
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

  const renderError = () => {
    if (error.show) {
      return (
        <Alert sx={{ mx: 2 }} severity="error">{error.message}</Alert>
      )
    } else {
      return (
        <div></div>
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
              sx={{ marginLeft: "25%", marginTop: "24px" }} />
          </Grid>
          <Grid item padding={2} xs={6} sx={{ bgcolor: "primary.disabled" }}>
            <Analytics
              language={data.language}
              country={data.country}
              hashtags={data.hashtags}
              mentions={data.mentions}
              sentiment={data.sentiment}
            ></Analytics>
          </Grid>
        </Grid>

      );
    } else if (!spinner && !data && !error.show) {
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
        {renderError()}
        {renderResults()}
      </Grid>
      {showProgress()}
    </Box>
  );
}
