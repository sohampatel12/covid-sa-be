import React from 'react';
import { Box, Card, CardContent, CircularProgress, Grid, Toolbar, Typography } from '@mui/material';
import { Cell, Legend, Pie, PieChart, Tooltip, LineChart, CartesianGrid, XAxis, YAxis, Line, BarChart, Bar } from 'recharts';
import { useState } from 'react';
import { useEffect } from 'react';
import ReactWordcloud from 'react-wordcloud';


export default function CorpusStats(props) {

  const country = require('./static_country.json');
  const dates = require('./static_dates.json');
  const hashtags = require('./static_hashtags.json');
  const lang = require('./static_lang.json');
  const mentions = require('./static_mentions.json');
  const poisSent = require('./static_poi_sent.json');
  const poisSentiment = [];
  const pois = require('./static_pois.json');
  const sentiment = require('./static_sentiment.json');

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];
  const RADIAN = Math.PI / 180;
  const options = {
    rotations: 1,
    rotationAngles: [0],
  };
  const size = [500, 200];

  for (let key in poisSent) {
    poisSentiment.push({
      name: key,
      positive: poisSent[key]["Positive"],
      neutral: poisSent[key]["Neutral"],
      negative: poisSent[key]["Negative"],
    })
  }

  const createPieChart = (chartData) => {
    return (
      <PieChart width={500} height={250}>
        <Tooltip />
        <Legend verticalAlign="top" height={24} align="right" />
        <Pie data={chartData} dataKey="value" cx="50%" cy="50%" fill="#8884d8" label >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}-${entry}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
      </PieChart>
    )
  }

  return (
    <Box component="main" sx={{ flexGrow: 1, p: 0 }}>
      <Toolbar />
      <Grid container xs={12}>
        <Grid item padding={2} xs={6}>
          <Card sx={{ mt: 1, bgcolor: 'ghostwhite' }}>
            <CardContent>
              <Typography sx={{ fontSize: 14 }} color="text.primary" gutterBottom>
                Country wise division
              </Typography>
              {createPieChart(country)}
            </CardContent>
          </Card>
        </Grid>
        <Grid item padding={2} xs={6}>
          <Card sx={{ mt: 1, bgcolor: 'ghostwhite' }}>
            <CardContent>
              <Typography sx={{ fontSize: 14 }} color="text.primary" gutterBottom>
                Language wise division
              </Typography>
              {createPieChart(lang)}
            </CardContent>
          </Card>
        </Grid>
        <Grid item padding={2} xs={6}>
          <Card sx={{ mt: 1, bgcolor: 'ghostwhite' }}>
            <CardContent>
              <Typography sx={{ fontSize: 14 }} color="text.primary" gutterBottom>
                Sentiment wise division
              </Typography>
              {createPieChart(sentiment)}
            </CardContent>
          </Card>
        </Grid>
        <Grid item padding={2} xs={6}>
          <Card sx={{ mt: 1, bgcolor: 'ghostwhite' }}>
            <CardContent>
              <ReactWordcloud words={hashtags} options={options} size={size} />
            </CardContent>
          </Card>
        </Grid>
        <Grid item padding={2} xs={6}>
          <Card sx={{ mt: 1, bgcolor: 'ghostwhite' }}>
            <CardContent>
              <ReactWordcloud words={mentions} options={options} size={size} />
            </CardContent>
          </Card>
        </Grid>
        <Grid item padding={2} xs={6}>
          <Card sx={{ mt: 1, bgcolor: 'ghostwhite' }}>
            <CardContent>
              <Typography sx={{ fontSize: 14 }} color="text.primary" gutterBottom>
                Sentiment wise division
              </Typography>
              {createPieChart(sentiment)}
            </CardContent>
          </Card>
        </Grid>
        <Grid item padding={2} xs={12}>
          <Card sx={{ mt: 1, bgcolor: 'ghostwhite' }}>
            <CardContent>
              <LineChart
                width={1000}
                height={300}
                data={dates}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis dataKey="value" height="200" />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="value" stroke="#8884d8" activeDot={{ r: 8 }} />
              </LineChart>
            </CardContent>
          </Card>
        </Grid>
        <Grid item padding={2} xs={12}>
          <Card sx={{ mt: 1, bgcolor: 'ghostwhite' }}>
            <CardContent>
              <BarChart
                width={1100}
                height={300}
                data={poisSentiment}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="positive" stackId="a" fill="#82ca9d" />
                <Bar dataKey="neutral" stackId="a" fill="#808080" />
                <Bar dataKey="negative" stackId="a" fill="#AA4A44" />
              </BarChart>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
