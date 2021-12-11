import React from 'react';
import { Accordion, AccordionDetails, AccordionSummary, AppBar, Box, Checkbox, CssBaseline, Drawer, FormControl, FormControlLabel, FormGroup, FormLabel, List, ListItem, ListItemIcon, ListItemText, Toolbar, Typography } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import QueryStatsIcon from '@mui/icons-material/QueryStats';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import './App.css';
import Search from './components/Search';

const drawerWidth = 240;

export default function App() {

  const [state, setState] = React.useState({
    english: true,
    hindi: false,
    spanish: false,
    usa: false,
    india: false,
    mexico: false,
    narendramodi: false
  });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setState({
      ...state,
      [event.target.name]: event.target.checked,
    });
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            COVID Sentiment Analysis
          </Typography>
        </Toolbar>
      </AppBar>

      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: 'auto' }}>
          <List>
            <ListItem button key={"search"}>
              <ListItemIcon>
                <SearchIcon />
              </ListItemIcon>
              <ListItemText primary={"Search tweets"} />
            </ListItem>
            <ListItem>
              <Accordion>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1a-content"
                  id="panel1a-header"
                >
                  <Typography>Filters</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <FormControl sx={{ m: 1 }} component="fieldset" variant="standard">
                    <FormLabel component="legend">Language</FormLabel>
                    <FormGroup>
                      <FormControlLabel
                        control={
                          <Checkbox checked={state.english} onChange={handleChange} name="english" />
                        }
                        label="English"
                      />
                      <FormControlLabel
                        control={
                          <Checkbox checked={state.hindi} onChange={handleChange} name="hindi" />
                        }
                        label="Hindi"
                      />
                      <FormControlLabel
                        control={
                          <Checkbox checked={state.spanish} onChange={handleChange} name="spanish" />
                        }
                        label="Spanish"
                      />
                    </FormGroup>
                  </FormControl>
                  <FormControl sx={{ m: 1 }} component="fieldset" variant="standard">
                    <FormLabel component="legend">Region</FormLabel>
                    <FormGroup>
                      <FormControlLabel
                        control={
                          <Checkbox checked={state.usa} onChange={handleChange} name="usa" />
                        }
                        label="USA"
                      />
                      <FormControlLabel
                        control={
                          <Checkbox checked={state.india} onChange={handleChange} name="india" />
                        }
                        label="India"
                      />
                      <FormControlLabel
                        control={
                          <Checkbox checked={state.mexico} onChange={handleChange} name="mexico" />
                        }
                        label="Mexico"
                      />
                    </FormGroup>
                  </FormControl>
                  <FormControl sx={{ m: 1 }} component="fieldset" variant="standard">
                    <FormLabel component="legend">Person of Interest</FormLabel>
                    <FormGroup>
                      <FormControlLabel
                        control={
                          <Checkbox checked={state.narendramodi} onChange={handleChange} name="narendramodi" />
                        }
                        label="English"
                      />
                    </FormGroup>
                  </FormControl>
                </AccordionDetails>
              </Accordion>
            </ListItem>
            <ListItem button key={"stats"}>
              <ListItemIcon>
                <QueryStatsIcon />
              </ListItemIcon>
              <ListItemText primary={"Corpus stats"} />
            </ListItem>
          </List>
        </Box>
      </Drawer>

      <Search></Search>
    </Box >
  );
}
