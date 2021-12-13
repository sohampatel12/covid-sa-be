import { CardContent, Card, Grid, Typography } from '@mui/material';
import { Bar, BarChart, CartesianGrid, Legend, Line, LineChart, Pie, Cell, PieChart, Tooltip, XAxis, YAxis } from 'recharts';
import ReactWordcloud from 'react-wordcloud';

export default function Analytics(props) {

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];
  const RADIAN = Math.PI / 180;
  const options = {
    rotations: 1,
    rotationAngles: [0],
  };
  const size = [600, 300];

  const createPieChart = (chartData) => {
    return (
      <PieChart width={500} height={250}>
        <Tooltip />
        <Legend verticalAlign="top" height={24} align="right" />
        <Pie data={chartData} dataKey="value" cx="50%" cy="50%" fill="#8884d8" label labelKey="name">
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}-${entry}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
      </PieChart>
    )
  }

  return (
    <Grid item xs={12}>
      Result analytics
      <Card sx={{ mt: 2, bgcolor: 'ghostwhite' }}>
        <CardContent>
          <Typography sx={{ fontSize: 14 }} color="text.primary" gutterBottom>
            Country wise division
          </Typography>
          {createPieChart(props.country)}
        </CardContent>
      </Card>
      <Card sx={{ mt: 2, bgcolor: 'ghostwhite' }}>
        <CardContent>
          <Typography sx={{ fontSize: 14 }} color="text.primary" gutterBottom>
            Language wise division
          </Typography>
          {createPieChart(props.language)}
        </CardContent>
      </Card>
      <Card sx={{ mt: 2, bgcolor: 'ghostwhite' }}>
        <CardContent>
          <Typography sx={{ fontSize: 14 }} color="text.primary" gutterBottom>
            Sentiment wise division
          </Typography>
          {createPieChart(props.sentiment)}
        </CardContent>
      </Card>
      <Card sx={{ mt: 2, bgcolor: 'ghostwhite' }}>
        <CardContent>
          <Typography sx={{ fontSize: 14 }} color="text.primary" gutterBottom>
            Hashtags word cloud
          </Typography>
          <ReactWordcloud words={props.hashtags} options={options} size={size} />
        </CardContent>
      </Card>
    </Grid>
  )
}
