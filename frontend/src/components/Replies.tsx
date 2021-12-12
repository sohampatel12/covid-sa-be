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
      setSpinner(true);
      const url = new URL("http://localhost:9999/replies?tweet_id=" + props.tweet_id);
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
  }, []);

  const showProgress = () => {
    if (spinner) {
      return (
        <Box sx={{ width: '100%', flex: 1, textAlign: 'center', mt: '50px' }}>
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

  const renderReply = () => {
    console.log(data);
    if (data && data.replies.length > 0) {
      console.log("inside if");

      return (
        data?.replies?.map((item: any, index: number) => {
          return (
            <Typography sx={{ mb: 1.5 }} color="text.primary" key={item.id}>
              {item.reply_text}
            </Typography>
          )
        })
      );
    } else if (data && data.replies.length == 0 && !spinner) {
      return (
        <Typography sx={{ mb: 1.5 }} color="text.primary">
          No replies found.
        </Typography>
      )
    }
  }

  return (
    <Grid container xs={12}>
      {showProgress()}
      {renderReply()}
    </Grid>
  )
}