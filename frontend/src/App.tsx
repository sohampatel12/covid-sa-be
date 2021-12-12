import React from 'react';
import { Accordion, AccordionDetails, AccordionSummary, AppBar, Box, Checkbox, CssBaseline, Drawer, FormControl, FormControlLabel, FormGroup, FormLabel, List, ListItem, ListItemIcon, ListItemText, Toolbar, Typography } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import QueryStatsIcon from '@mui/icons-material/QueryStats';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import './App.css';
import Search from './components/Search';
import { useEffect } from 'react';

const drawerWidth = 300;

export default function App() {

  const [languages, setLanguage] = React.useState({
    english: false,
    hindi: false,
    spanish: false,
  });
  const [countries, setRegion] = React.useState({
    usa: false,
    india: false,
    mexico: false
  });
  const [pois, setPois] = React.useState({
    SSalud_mx: false,
    CDCgov: false,
    narendramodi: false,
    POTUS: false,
    marcorubio: false,
    JoeBiden: false,
    ShashiTharoor: false,
    SenTedCruz: false,
    lopezobrador_: false,
    SenSchumer: false,
    EnriqueAlfaroR: false,
    GobiernoMX: false,
    alfredodelmazo: false,
    osoriochong: false,
    AmitShah: false,
    Jaime_BonillaV: false,
    Claudiashein: false,
    ArvindKejriwal: false,
    mansukhmandviya: false,
    MoHFW_INDIA: false,
    RandPaul: false,
    HillaryClinton: false,
    AyushmanNHA: false,
    HLGatell: false,
    BarackObama: false,
    PMOIndia: false,
    DrTedros: false,
    KamalaHarris: false,
    rashtrapatibhvn: false,
    HHSGov: false,
    myogiadityanath: false,
    SSaludCdMx: false,
    dremilyportermd: false,
    WHO: false,
    GovRonDeSantis: false,
    RahulGandhi: false,
    VP: false,
    MauVila: false,
    GovKathyHochul: false,
  });

  const poisList = ["SSalud_mx",
    "CDCgov",
    "narendramodi",
    "POTUS",
    "marcorubio",
    "JoeBiden",
    "ShashiTharoor",
    "SenTedCruz",
    "lopezobrador_",
    "SenSchumer",
    "EnriqueAlfaroR",
    "GobiernoMX",
    "alfredodelmazo",
    "osoriochong",
    "AmitShah",
    "Jaime_BonillaV",
    "Claudiashein",
    "ArvindKejriwal",
    "mansukhmandviya",
    "MoHFW_INDIA",
    "RandPaul",
    "HillaryClinton",
    "AyushmanNHA",
    "HLGatell",
    "BarackObama",
    "PMOIndia",
    "DrTedros",
    "KamalaHarris",
    "rashtrapatibhvn",
    "HHSGov",
    "myogiadityanath",
    "SSaludCdMx",
    "dremilyportermd",
    "WHO",
    "GovRonDeSantis",
    "RahulGandhi",
    "VP",
    "MauVila",
    "GovKathyHochul"];

  const handleLanguageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLanguage({
      ...languages,
      [event.target.name]: event.target.checked,
    })
  };

  const handleRegionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRegion({
      ...countries,
      [event.target.name]: event.target.checked,
    })
  };

  const handlePoisChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPois({
      ...pois,
      [event.target.name]: event.target.checked,
    })
  };

  // const getPoiValue = (name: string) => {
  //   if (pois && pois[name]) {
  //     return pois[name];
  //   }
  // }

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
                          <Checkbox checked={languages.english} onChange={handleLanguageChange} name="english" />
                        }
                        label="English"
                      />
                      <FormControlLabel
                        control={
                          <Checkbox checked={languages.hindi} onChange={handleLanguageChange} name="hindi" />
                        }
                        label="Hindi"
                      />
                      <FormControlLabel
                        control={
                          <Checkbox checked={languages.spanish} onChange={handleLanguageChange} name="spanish" />
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
                          <Checkbox checked={countries.usa} onChange={handleRegionChange} name="usa" />
                        }
                        label="USA"
                      />
                      <FormControlLabel
                        control={
                          <Checkbox checked={countries.india} onChange={handleRegionChange} name="india" />
                        }
                        label="India"
                      />
                      <FormControlLabel
                        control={
                          <Checkbox checked={countries.mexico} onChange={handleRegionChange} name="mexico" />
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
                          <Checkbox checked={pois.AmitShah} onChange={handlePoisChange} name="AmitShah" />
                        }
                        label="AmitShah"
                      />
                    </FormGroup>
                    <FormGroup>
                      <FormControlLabel
                        control={
                          <Checkbox checked={pois.ArvindKejriwal} onChange={handlePoisChange} name="ArvindKejriwal" />
                        }
                        label="ArvindKejriwal"
                      />
                    </FormGroup>
                    <FormGroup>
                      <FormControlLabel
                        control={
                          <Checkbox checked={pois.AyushmanNHA} onChange={handlePoisChange} name="AyushmanNHA" />
                        }
                        label="AyushmanNHA"
                      />
                    </FormGroup>
                    <FormGroup>
                      <FormControlLabel
                        control={
                          <Checkbox checked={pois.BarackObama} onChange={handlePoisChange} name="BarackObama" />
                        }
                        label="BarackObama"
                      />
                    </FormGroup>
                    <FormGroup>
                      <FormControlLabel
                        control={
                          <Checkbox checked={pois.CDCgov} onChange={handlePoisChange} name="CDCgov" />
                        }
                        label="CDCgov"
                      />
                    </FormGroup>
                    <FormGroup>
                      <FormControlLabel
                        control={
                          <Checkbox checked={pois.Claudiashein} onChange={handlePoisChange} name="Claudiashein" />
                        }
                        label="Claudiashein"
                      />
                    </FormGroup>
                    <FormGroup>
                      <FormControlLabel
                        control={
                          <Checkbox checked={pois.DrTedros} onChange={handlePoisChange} name="DrTedros" />
                        }
                        label="DrTedros"
                      />
                    </FormGroup>
                    <FormGroup>
                      <FormControlLabel
                        control={
                          <Checkbox checked={pois.EnriqueAlfaroR} onChange={handlePoisChange} name="EnriqueAlfaroR" />
                        }
                        label="EnriqueAlfaroR"
                      />
                    </FormGroup>
                    <FormGroup>
                      <FormControlLabel
                        control={
                          <Checkbox checked={pois.GobiernoMX} onChange={handlePoisChange} name="GobiernoMX" />
                        }
                        label="GobiernoMX"
                      />
                    </FormGroup>
                    <FormGroup>
                      <FormControlLabel
                        control={
                          <Checkbox checked={pois.GovKathyHochul} onChange={handlePoisChange} name="GovKathyHochul" />
                        }
                        label="GovKathyHochul"
                      />
                    </FormGroup>
                    <FormGroup>
                      <FormControlLabel
                        control={
                          <Checkbox checked={pois.GovRonDeSantis} onChange={handlePoisChange} name="GovRonDeSantis" />
                        }
                        label="GovRonDeSantis"
                      />
                    </FormGroup>
                    <FormGroup>
                      <FormControlLabel
                        control={
                          <Checkbox checked={pois.HHSGov} onChange={handlePoisChange} name="HHSGov" />
                        }
                        label="HHSGov"
                      />
                    </FormGroup>
                    <FormGroup>
                      <FormControlLabel
                        control={
                          <Checkbox checked={pois.HLGatell} onChange={handlePoisChange} name="HLGatell" />
                        }
                        label="HLGatell"
                      />
                    </FormGroup>
                    <FormGroup>
                      <FormControlLabel
                        control={
                          <Checkbox checked={pois.HillaryClinton} onChange={handlePoisChange} name="HillaryClinton" />
                        }
                        label="HillaryClinton"
                      />
                    </FormGroup>
                    <FormGroup>
                      <FormControlLabel
                        control={
                          <Checkbox checked={pois.Jaime_BonillaV} onChange={handlePoisChange} name="Jaime_BonillaV" />
                        }
                        label="Jaime_BonillaV"
                      />
                    </FormGroup>
                    <FormGroup>
                      <FormControlLabel
                        control={
                          <Checkbox checked={pois.JoeBiden} onChange={handlePoisChange} name="JoeBiden" />
                        }
                        label="JoeBiden"
                      />
                    </FormGroup>
                    <FormGroup>
                      <FormControlLabel
                        control={
                          <Checkbox checked={pois.KamalaHarris} onChange={handlePoisChange} name="KamalaHarris" />
                        }
                        label="KamalaHarris"
                      />
                    </FormGroup>
                    <FormGroup>
                      <FormControlLabel
                        control={
                          <Checkbox checked={pois.MauVila} onChange={handlePoisChange} name="MauVila" />
                        }
                        label="MauVila"
                      />
                    </FormGroup>
                    <FormGroup>
                      <FormControlLabel
                        control={
                          <Checkbox checked={pois.MoHFW_INDIA} onChange={handlePoisChange} name="MoHFW_INDIA" />
                        }
                        label="MoHFW_INDIA"
                      />
                    </FormGroup>
                    <FormGroup>
                      <FormControlLabel
                        control={
                          <Checkbox checked={pois.PMOIndia} onChange={handlePoisChange} name="PMOIndia" />
                        }
                        label="PMOIndia"
                      />
                    </FormGroup>
                    <FormGroup>
                      <FormControlLabel
                        control={
                          <Checkbox checked={pois.POTUS} onChange={handlePoisChange} name="POTUS" />
                        }
                        label="POTUS"
                      />
                    </FormGroup>
                    <FormGroup>
                      <FormControlLabel
                        control={
                          <Checkbox checked={pois.RahulGandhi} onChange={handlePoisChange} name="RahulGandhi" />
                        }
                        label="RahulGandhi"
                      />
                    </FormGroup>
                    <FormGroup>
                      <FormControlLabel
                        control={
                          <Checkbox checked={pois.RandPaul} onChange={handlePoisChange} name="RandPaul" />
                        }
                        label="RandPaul"
                      />
                    </FormGroup>
                    <FormGroup>
                      <FormControlLabel
                        control={
                          <Checkbox checked={pois.SSaludCdMx} onChange={handlePoisChange} name="SSaludCdMx" />
                        }
                        label="SSaludCdMx"
                      />
                    </FormGroup>
                    <FormGroup>
                      <FormControlLabel
                        control={
                          <Checkbox checked={pois.SSalud_mx} onChange={handlePoisChange} name="SSalud_mx" />
                        }
                        label="SSalud_mx"
                      />
                    </FormGroup>
                    <FormGroup>
                      <FormControlLabel
                        control={
                          <Checkbox checked={pois.SenSchumer} onChange={handlePoisChange} name="SenSchumer" />
                        }
                        label="SenSchumer"
                      />
                    </FormGroup>
                    <FormGroup>
                      <FormControlLabel
                        control={
                          <Checkbox checked={pois.SenTedCruz} onChange={handlePoisChange} name="SenTedCruz" />
                        }
                        label="SenTedCruz"
                      />
                    </FormGroup>
                    <FormGroup>
                      <FormControlLabel
                        control={
                          <Checkbox checked={pois.ShashiTharoor} onChange={handlePoisChange} name="ShashiTharoor" />
                        }
                        label="ShashiTharoor"
                      />
                    </FormGroup>
                    <FormGroup>
                      <FormControlLabel
                        control={
                          <Checkbox checked={pois.VP} onChange={handlePoisChange} name="VP" />
                        }
                        label="VP"
                      />
                    </FormGroup>
                    <FormGroup>
                      <FormControlLabel
                        control={
                          <Checkbox checked={pois.WHO} onChange={handlePoisChange} name="WHO" />
                        }
                        label="WHO"
                      />
                    </FormGroup>
                    <FormGroup>
                      <FormControlLabel
                        control={
                          <Checkbox checked={pois.alfredodelmazo} onChange={handlePoisChange} name="alfredodelmazo" />
                        }
                        label="alfredodelmazo"
                      />
                    </FormGroup>
                    <FormGroup>
                      <FormControlLabel
                        control={
                          <Checkbox checked={pois.dremilyportermd} onChange={handlePoisChange} name="dremilyportermd" />
                        }
                        label="dremilyportermd"
                      />
                    </FormGroup>
                    <FormGroup>
                      <FormControlLabel
                        control={
                          <Checkbox checked={pois.lopezobrador_} onChange={handlePoisChange} name="lopezobrador_" />
                        }
                        label="lopezobrador_"
                      />
                    </FormGroup>
                    <FormGroup>
                      <FormControlLabel
                        control={
                          <Checkbox checked={pois.mansukhmandviya} onChange={handlePoisChange} name="mansukhmandviya" />
                        }
                        label="mansukhmandviya"
                      />
                    </FormGroup>
                    <FormGroup>
                      <FormControlLabel
                        control={
                          <Checkbox checked={pois.marcorubio} onChange={handlePoisChange} name="marcorubio" />
                        }
                        label="marcorubio"
                      />
                    </FormGroup>
                    <FormGroup>
                      <FormControlLabel
                        control={
                          <Checkbox checked={pois.myogiadityanath} onChange={handlePoisChange} name="myogiadityanath" />
                        }
                        label="myogiadityanath"
                      />
                    </FormGroup>
                    <FormGroup>
                      <FormControlLabel
                        control={
                          <Checkbox checked={pois.narendramodi} onChange={handlePoisChange} name="narendramodi" />
                        }
                        label="narendramodi"
                      />
                    </FormGroup>
                    <FormGroup>
                      <FormControlLabel
                        control={
                          <Checkbox checked={pois.osoriochong} onChange={handlePoisChange} name="osoriochong" />
                        }
                        label="osoriochong"
                      />
                    </FormGroup>
                    <FormGroup>
                      <FormControlLabel
                        control={
                          <Checkbox checked={pois.rashtrapatibhvn} onChange={handlePoisChange} name="rashtrapatibhvn" />
                        }
                        label="rashtrapatibhvn"
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
            <ListItem button key={"hesitancy"}>
              <ListItemIcon>
                <QueryStatsIcon />
              </ListItemIcon>
              <ListItemText primary={"Misinformation"} />
            </ListItem>
          </List>
        </Box>
      </Drawer>

      <Search
        languages={languages}
        countries={countries}
        pois={pois}
      ></Search>
    </Box >
  );
}
