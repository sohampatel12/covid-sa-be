import React from 'react';
import { CardContent, Card, CardHeader, Grid, Typography, IconButton, CardActions, styled, IconButtonProps, Collapse, Avatar } from '@mui/material';
import ModeCommentIcon from '@mui/icons-material/ModeComment';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import VerifiedIcon from '@mui/icons-material/Verified';
import SentimentNeutralIcon from '@mui/icons-material/SentimentNeutral';
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAlt';
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';
import Replies from './Replies';

const MENTIONS = /@([a-z\d_]+)/ig;
const HASHTAGS = /(^|\s)#(\w+)/gm;
const URLS = /(http|ftp|https):\/\/([\w_-]+(?:(?:\.[\w_-]+)+))([\w.,@?^=%&:\/~+#-]*[\w@?^=%&\/~+#-])/gm;


interface ExpandMoreProps extends IconButtonProps {
  expand: boolean;
}

const ExpandMore = styled((props: ExpandMoreProps) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
}));

export default function Results(props: any) {
  const [expanded, setExpanded] = React.useState(false);
  const list = [false, false, false, false, false, false, false, false, false, false]
  const [showReplies, setShowReplies] = React.useState(list);

  const handleExpandClick = (index: number) => {
    console.log("expand", expanded, showReplies.splice(0, index));
    
    if (showReplies[index]) {
      let newShowReplies = [...showReplies];
      newShowReplies[index] = !newShowReplies[index];
      setShowReplies(newShowReplies);
    }
    setExpanded(!expanded);
  };
  
  const handleRepliesClick = (index: number) => {
    console.log("replies", expanded, showReplies);
    if (expanded) {
      setExpanded(!expanded);
    }
    let newShowReplies = [...showReplies];
    newShowReplies[index] = !newShowReplies[index];
    setShowReplies(newShowReplies);
  };

  console.log(showReplies);

  function showTweet(id: any) {
    window.open("https://twitter.com/test/status/" + id.toString());
  }

  function createCard(item: any, index: number) {

    const date = new Date(item.tweet_date);
    const dateString = date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
    var parts;
    if (item.tweet_text) {
      parts = item.tweet_text.split(" ");
    } else {
      parts = item.reply_text.split(" ");
    }
    const country = item.country;

    for (let i = 0; i < parts.length; i++) {
      if (parts[i].match(MENTIONS)) {
        parts[i] = <span> <a className="mention" target="_blank" key={parts[i] + item.id} href={`http://twitter.com/` + parts[i]}>{parts[i]}</a> </span>;
      } else if (parts[i].match(HASHTAGS)) {
        parts[i] = <span> <a className="hashtag" target="_blank" key={parts[i] + item.id} href={`http://twitter.com/` + parts[i]}>{parts[i]}</a> </span>;
      } else if (parts[i].match(URLS)) {
        parts[i] = <span> <a className="url" target="_blank" key={parts[i] + item.id} href={parts[i]}>{parts[i]}</a> </span>;
      } else {
        parts[i] = <span> {parts[i]} </span>
      }
    }

    return (
      <Card key={item.id} sx={{ mt: 2, bgcolor: 'aliceblue' }} >
        <CardHeader
          title={
            <div>
              <span> {item.name ? item.name : item.poi_name ? item.poi_name : item.id } </span>
              {item.verified ? <span> <VerifiedIcon color='success' fontSize='inherit' /> </span> : ''}
            </div>
          }
          subheader={dateString}
          action={
            <IconButton aria-label="settings">
              <OpenInNewIcon onClick={() => showTweet(item.id)} />
            </IconButton>
          }
          avatar={
            <Avatar aria-label="avatar">{item.name ? item.name[0] : item.poi_name ? item.poi_name[0] : item.id[0] }</Avatar>
          }
        />
        <CardContent>
          <Typography color="text.primary">
            {parts}
          </Typography>
        </CardContent>
        <CardActions>
          {
            item.sentiment && item.sentiment === "1" && (
              <SentimentSatisfiedAltIcon sx={{ mx: 1, color: "green" }}/>
            )
          }
          {
            item.sentiment && item.sentiment === "0" && (
              <SentimentNeutralIcon sx={{ mx: 1, color: "grey" }} />
            )
          }
          {
            item.sentiment && (item.sentiment === "2" || item.sentiment === "-1") && (
              <SentimentVeryDissatisfiedIcon sx={{ mx: 1, color: "red" }}/>
            )
          }
          <ExpandMore
            expand={showReplies[index]}
            onClick={() => { handleRepliesClick(index) }}
            aria-expanded={showReplies[index]}
            aria-label="Comments"
          >
            <ModeCommentIcon />
          </ExpandMore>
          <ExpandMore
            expand={expanded}
            onClick={() => { handleExpandClick(index) }}
            aria-expanded={expanded}
            aria-label="show more"
          >
            <ExpandMoreIcon />
          </ExpandMore>
        </CardActions>
        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <CardContent>
            <Typography>
              {country ? 'Country: ' + country : ''}
            </Typography>
          </CardContent>
        </Collapse>
        <Collapse in={showReplies[index]} timeout="auto" unmountOnExit>
          <CardContent>
            <Replies tweet_id={item.id}></Replies>
          </CardContent>
        </Collapse>
      </Card>
    )
  }

  return (
    <Grid item xs={12}>
      About {props.data.response?.numFound} results.
      {
        props.data.response?.docs?.map((item: any, index: number) => {
          return createCard(item, index);
        })
      }
    </Grid>
  )
}