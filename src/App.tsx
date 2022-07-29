import axios, { AxiosResponse } from "axios";
import "./App.css";
import React, { useState, useEffect, ReactComponentElement } from "react";
import Header from "./components/Header";
import api from "./services/api";
import { Button, Grid, Switch, TextField } from "@mui/material";
import {
  Opacity,
  LocationOn,
  DeviceThermostat,
  ArrowUpward,
  ArrowDownward,
} from "@mui/icons-material";
import styled, { ThemeProvider } from "styled-components";
import { lightTheme, darkTheme } from "./components/DarkMode/theme";
import { Container } from "./components/DarkMode/styled";
import { GlobaclStyled } from "./components/DarkMode/GlobalStyled";

interface WeatherInterface {
  name: string;
  dt: number;
  wind: {
    speed: number;
  };
  main: {
    feels_like: number;
    humidity: number;
    pressure: number;
    temp: number;
    temp_max: number;
    temp_min: number;
  };
  weather: {
    id: number;
    main: string;
    description: string;
    icon: string;
  }[];
}

interface WeatherDaysInterface {
  list: {
    dt_txt: string;
    temp: number;
    icon: string;
  }[];
}

const App: React.FC = () => {
  const [theme, setTheme] = useState("light");
  const [location, setLocation] = useState<boolean>(false);
  const [weatherDays, setWeatherDays] = useState<WeatherDaysInterface>({
    list: [
      {
        dt_txt: "",
        icon: "",
        temp: 0,
      },
    ],
  });
  const [weather, setWeather] = useState<WeatherInterface>({
    name: "",
    dt: 0,
    wind: {
      speed: 0,
    },

    main: {
      feels_like: 0,
      humidity: 0,
      pressure: 0,
      temp: 0,
      temp_max: 0,
      temp_min: 0,
    },
    weather: [
      {
        id: 0,
        description: "",
        main: "",
        icon: "",
      },
    ],
  });
  const [result, setResult] = useState<any>();
  const [cityName, setCityName] = useState<string>("");

  const getImageIcon = (iconName: string) => {
    return (
      <div>
        <img
          src={`http://openweathermap.org/img/wn/${iconName}@2x.png`}
          alt=""
        />
      </div>
    );
  };

  const themeToggler = () => {
    theme === "light" ? setTheme("dark") : setTheme("light");
  };

  const data = () => {
    let timestamp = weather.dt * 1000;
    let date = new Date(timestamp);

    return date.toLocaleString("pt-BR", {
      day: "numeric",
      month: "2-digit",
      weekday: "long",
    });
  };

  const getWeather = async (lat: Number, long: Number): Promise<any> => {
    const res: AxiosResponse<any> = await api({
      params: {
        lat: lat,
        lon: long,
        appid: process.env.REACT_APP_OPEN_WHEATHER_KEY,
        lang: "pt_br",
        units: "metric",
      },
    });

    return res;
  };

  const formatTimestamp = (timestamp: number): string => {
    const formattedTimestamp = new Date(timestamp * 1000);
    return formattedTimestamp.toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
    });
  };

  const getFullWeekName = (weekDay: number): string => {
    const days = [
      "Domingo",
      "Segunda-feira",
      "Terça-feira",
      "Quarta-feira",
      "Quinta-feira",
      "Sexta-feira",
      "Sábado",
    ];
    const day = days[weekDay];
    return day;
  };

  const showWeekday = (): string => {
    const date = new Date();
    return getFullWeekName(date.getDay());
  };

  const getByName = async (event, cityname: string): Promise<any> => {
    event.preventDefault();
    const resName: AxiosResponse<any> = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${process.env.REACT_APP_OPEN_WHEATHER_KEY}`,
      {
        params: {
          lang: "pt_br",
          units: "metric",
        },
      }
    );

    setWeather(resName.data);
    return resName;
  };

  function uniqueValues(value, index, self) {
    return self.indexOf(value) === index;
  }

  const getByNext = async (cityname: string) => {
    const resNameNext: AxiosResponse<any> = await axios.get(
      `https://api.openweathermap.org/data/2.5/forecast?q=${cityname}&appid=${process.env.REACT_APP_OPEN_WHEATHER_KEY}`,
      {
        params: {
          lang: "pt_br",
          units: "metric",
        },
      }
    );

    const list: Array<any> = resNameNext.data.list;

    const dates: Array<any> = list.map((value, index) => {
      return {
        dt_txt: formatTimestamp(value.dt),
        temp: value.main.temp,
        icon: value.weather,
      };
    });
    const unique: any = [];
    const distinct: any = [];
    for (let i = 0; i < dates.length; i++) {
      if (!unique[dates[i].dt_txt]) {
        distinct.push(dates[i]);
        unique[dates[i].dt_txt] = 1;
      }
    }
    setResult(distinct);
    setWeatherDays(distinct);
    console.log(resNameNext.data);
  };

  const cityChange = (e) => {
    setCityName(e.target.value);
  };
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(async (position) => {
      getWeather(position.coords.latitude, position.coords.longitude)
        .then((response) => {
          setWeather(response.data);
          getByNext(response.data.name);
        })
        .catch((error) => console.error(error));
      setLocation(true);
    });
  }, []);

  if (location === false) {
    return <h1> Você precisa ativar a permissão de localização!</h1>;
  } else {
    return (
      <ThemeProvider theme={theme === "light" ? lightTheme : darkTheme}>
        <GlobaclStyled />
        <Container>
          <div className="App">
            <Grid container={true} className="main-container">
              <Grid flexDirection="row-reverse">
                <Grid item spacing={2}>
                  <Switch onClick={() => themeToggler()} />
                  <TextField
                    onChange={cityChange}
                    value={cityName}
                    id="outlined-basic"
                    label="Cidade"
                    variant="outlined"
                  />{" "}
                </Grid>
                <Grid item spacing={2} margin={2}>
                  <Button
                    onClick={(e) => {
                      e.preventDefault();
                      getByNext(cityName);
                      getByName(e, cityName);
                    }}
                    variant="outlined"
                  >
                    Buscar
                  </Button>
                </Grid>{" "}
              </Grid>
              <Grid container={true}>
                <Grid
                  item
                  xl={4}
                  lg={4}
                  md={4}
                  sm={4}
                  xs={12}
                  display="flex"
                  flexDirection="column"
                >
                  <h1 className="cityName">
                    <LocationOn className="locationIcon" />
                    {weather.name}
                  </h1>
                  <h1>{showWeekday()}</h1>
                  {/* <h2>{data()}</h2> */}
                  <h1 className="currentTemp">
                    <DeviceThermostat className="termIcon" />
                    {Number(weather.main.temp).toFixed()}°
                  </h1>
                  <h2 className="feelsLike">
                    Sensação termica {Number(weather.main.feels_like).toFixed()}
                    °
                  </h2>
                </Grid>

                <Grid
                  item
                  xl={4}
                  lg={4}
                  md={4}
                  sm={4}
                  xs={12}
                  display="flex"
                  flexDirection="column"
                >
                  <h1>{getImageIcon(weather.weather["0"].icon)}</h1>
                  <h2 className="currentDescrip">
                    {weather.weather["0"].description}
                  </h2>
                </Grid>

                <Grid
                  item
                  xl={4}
                  lg={4}
                  md={4}
                  sm={4}
                  xs={12}
                  display="flex"
                  flexDirection="column"
                  marginTop="auto"
                >
                  <h2>
                    <ArrowUpward /> {Number(weather.main.temp_max).toFixed()}°
                  </h2>
                  <h2>
                    <ArrowDownward /> {Number(weather.main.temp_min).toFixed()}°
                  </h2>
                  <h2>Pressão {weather.main.pressure} hpa</h2>
                  <div>
                    <h2>
                      <Opacity /> {weather.main.humidity}%
                    </h2>
                  </div>
                </Grid>
              </Grid>
              <Grid container justifyContent="center">
                {result?.map((forecast) => (
                  <Grid item xl={2} lg={2} md={2} sm={2} xs={4}>
                    <div>
                      <div className="nextDaysIcon">
                        {getImageIcon(forecast?.icon[0].icon)}
                      </div>
                      <h1>{Number(forecast.temp).toFixed()}°</h1>
                      <h1>{forecast.dt_txt}</h1>
                    </div>
                  </Grid>
                ))}
              </Grid>
            </Grid>
          </div>
        </Container>
      </ThemeProvider>
    );
  }
};
export default App;
