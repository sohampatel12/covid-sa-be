import React, { useEffect } from "react";
import {
  CardContent,
  Card,
  Box,
  CircularProgress,
  styled,
  Toolbar,
  IconButtonProps,
  CardHeader,
  Grid,
  Typography,
  IconButton,
  CardActions,
  Collapse,
  Avatar,
} from "@mui/material";
import { Chart, Series, AdaptiveLayout } from "devextreme-react/chart";
import ModeCommentIcon from "@mui/icons-material/ModeComment";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import VerifiedIcon from "@mui/icons-material/Verified";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Replies from "./Replies";
import Results from "./Results";
import Analytics from "./Analytics.jsx";

const MENTIONS = /@([a-z\d_]+)/gi;
const HASHTAGS = /(^|\s)#(\w+)/gm;
const URLS =
  /(http|ftp|https):\/\/([\w_-]+(?:(?:\.[\w_-]+)+))([\w.,@?^=%&:\/~+#-]*[\w@?^=%&\/~+#-])/gm;

interface ExpandMoreProps extends IconButtonProps {
  expand: boolean;
}

const ExpandMore = styled((props: ExpandMoreProps) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? "rotate(0deg)" : "rotate(180deg)",
  marginLeft: "auto",
  transition: theme.transitions.create("transform", {
    duration: theme.transitions.duration.shortest,
  }),
}));

export default function Misinformation(props: any) {
  const [value, setValue] = React.useState("");
  const [inputValue, setInputValue] = React.useState("");
  const [data, setData] = React.useState<any | undefined>();
  const [spinner, setSpinner] = React.useState(false);
  const [expanded, setExpanded] = React.useState(0);
  const list = [false, false, false, false, false, false, false, false, false, false]
  const [showReplies, setShowReplies] = React.useState(list);
  const [page, setPage] = React.useState(1);
  const [hashtag, setHashtag] = React.useState("");

  const [error, setError] = React.useState({
    show: false,
    message: "",
  });

  const neg_tweets = require("./negative_tweets.json");

  console.log(neg_tweets, "tweets");

  const neg_tweets_keys = Object.keys(neg_tweets);

  let obj = {};

  const neg_tweets_count = require("./negative_tweet_count.json");

  console.log(neg_tweets_count, "values");

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28"];
  const RADIAN = Math.PI / 180;
  const options = {
    rotations: 1,
    rotationAngles: [0],
  };
  const size = [600, 300];

  const handleChange = (event: any) => {
    setHashtag(event.target.value);
  };

  const handleExpandClick = (index: number) => {
    if (showReplies[index]) {
      let newShowReplies = [...showReplies];
      newShowReplies[index] = !newShowReplies[index];
      setShowReplies(newShowReplies);
    }
    setExpanded(index);
  };

  const handleRepliesClick = (index: number) => {
    if (expanded !== 0) {
      setExpanded(0);
    }
    let newShowReplies = [...showReplies];
    newShowReplies[index] = !newShowReplies[index];
    setShowReplies(newShowReplies);
  };

  const showTweet = (id: any) => {
    window.open("https://twitter.com/test/status/" + id.toString());
  };

  const fetchResults = () => {
    const start = page ? ((page - 1) * 10).toString() : "0";
    setData(undefined);
    setSpinner(true);
    setError({ ...error, show: false });

    if (!inputValue) {
      setSpinner(false);
      console.log("Enter some details");
    } else {
      const url = new URL("http://13.59.1.184:9999/api");
      const headers = {
        "Content-Type": "application/json",
      };
      const body = {
        query: inputValue,
        start: start ? start.toString() : "0",
        pois: Array(),
        countries: Array(),
        languages: Array(),
      };

      fetch(url.toString(), {
        method: "GET",
        mode: "cors",
        redirect: "follow",
        headers: headers,
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
        });
    }
  };

  const showProgress = () => {
    if (spinner) {
      return (
        <Box sx={{ width: "100%", flex: 1, textAlign: "center", mt: "200px" }}>
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

  return (
    <Box component="main" sx={{ flexGrow: 1, p: 0 }}>
      <Toolbar />
      <Chart
        id="chart"
        style={{ margin: 20 }}
        dataSource={neg_tweets_count}
        rotated={true}
      >
        <Series
          valueField="value"
          argumentField="name"
          name="Hashtags"
          type="bar"
          color="#ffaa66"
        />
      </Chart>

      <Grid container xs={12}>
        <FormControl fullWidth>
          <InputLabel id="demo-simple-select-label">Hashtags</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={hashtag}
            label="Hashtags"
            onChange={handleChange}
          >
            {neg_tweets_keys.map((index: any) => {
              return <MenuItem value={index}>{index}</MenuItem>;
            })}
          </Select>
        </FormControl>
        <Grid item padding={2} xs={6}>
          {neg_tweets[hashtag]?.map((index: any, key: number) => {
            const date = new Date(index.tweet_date);
            const dateString =
              date.toLocaleDateString() + " " + date.toLocaleTimeString();
            var parts;
            if (index.tweet_text) {
              parts = index.tweet_text.split(" ");
            } else {
              parts = index.reply_text.split(" ");
            }
            const country = index.country;

            for (let i = 0; i < parts.length; i++) {
              if (parts[i].match(MENTIONS)) {
                parts[i] = (
                  <span>
                    {" "}
                    <a
                      className="mention"
                      target="_blank"
                      key={parts[i] + index.id}
                      href={`http://twitter.com/` + parts[i]}
                    >
                      {parts[i]}
                    </a>{" "}
                  </span>
                );
              } else if (parts[i].match(HASHTAGS)) {
                parts[i] = (
                  <span>
                    {" "}
                    <a
                      className="hashtag"
                      target="_blank"
                      key={parts[i] + index.id}
                      href={`http://twitter.com/` + parts[i]}
                    >
                      {parts[i]}
                    </a>{" "}
                  </span>
                );
              } else if (parts[i].match(URLS)) {
                parts[i] = (
                  <span>
                    {" "}
                    <a
                      className="url"
                      target="_blank"
                      key={parts[i] + index.id}
                      href={parts[i]}
                    >
                      {parts[i]}
                    </a>{" "}
                  </span>
                );
              } else {
                parts[i] = <span> {parts[i]} </span>;
              }
            }
            return (
              <Card key={index.id} sx={{ mt: 2, bgcolor: "aliceblue" }}>
                <CardHeader
                  title={
                    <div>
                      <span>
                        {" "}
                        {index.name
                          ? index.name
                          : index.poi_name
                          ? index.poi_name
                          : index.id}{" "}
                      </span>
                      {index.verified ? (
                        <span>
                          {" "}
                          <VerifiedIcon
                            color="success"
                            fontSize="inherit"
                          />{" "}
                        </span>
                      ) : (
                        ""
                      )}
                    </div>
                  }
                  subheader={dateString}
                  action={
                    <IconButton aria-label="settings">
                      <OpenInNewIcon onClick={() => showTweet(index.id)} />
                    </IconButton>
                  }
                  avatar={
                    <Avatar aria-label="avatar">
                      {index.name
                        ? index.name[0]
                        : index.poi_name
                        ? index.poi_name[0]
                        : index.id[0]}
                    </Avatar>
                  }
                />
                <CardContent>
                  <Typography color="text.primary">{parts}</Typography>
                </CardContent>
                <CardActions>
                  <ExpandMore
                    expand={showReplies[key]}
                    onClick={() => {
                      handleRepliesClick(key);
                    }}
                    aria-expanded={showReplies[key]}
                    aria-label="Comments"
                  >
                    <ModeCommentIcon />
                  </ExpandMore>
                  <ExpandMore
                    expand={expanded === key}
                    onClick={() => {
                      handleExpandClick(key);
                    }}
                    aria-expanded={expanded === key}
                    aria-label="show more"
                  >
                    <ExpandMoreIcon />
                  </ExpandMore>
                </CardActions>
                <Collapse in={expanded === key} timeout="auto" unmountOnExit>
                  <CardContent>
                    <Typography>
                      {country ? "Country: " + country : ""}
                    </Typography>
                  </CardContent>
                </Collapse>
                <Collapse in={showReplies[key]} timeout="auto" unmountOnExit>
                  <CardContent>
                    <Replies tweet_id={index.id}></Replies>
                  </CardContent>
                </Collapse>
              </Card>
            );
          })}
        </Grid>
      </Grid>
      {showProgress()}
    </Box>
  );
}
