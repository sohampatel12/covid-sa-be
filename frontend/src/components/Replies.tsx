import React, { useEffect } from 'react';
import { Alert, Autocomplete, Box, Button, CircularProgress, Grid, Pagination, TextField, Toolbar, Typography } from '@mui/material';
import Results from './Results';
import Analytics from './Analytics';


export default function Replies(props: any) {
  const [data, setData] = React.useState<any | undefined>();
  const [first, setFirst] = React.useState(false);
  const [spinner, setSpinner] = React.useState(false);
  const [error, setError] = React.useState({
    show: false,
    message: ""
  });

  useEffect(() => {
    if (!first) {
      const url = new URL("http://localhost:5000/replies?tweet_id=" + props.tweet_id);
      fetch(url.toString(), {
        method: 'GET',
        // mode: 'cors',
        redirect: 'follow',
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
          setFirst(true);
        });
    }
  });

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
    <Grid container xs={12}>
      <Grid item padding={2} xs={6}>
        {showProgress()}
        {renderError()}
        <Results data={props}></Results>
      </Grid>
    </Grid>
  )
}