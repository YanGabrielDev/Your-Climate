import axios, { AxiosResponse } from "axios";
import "./App.css";
import React, { useState, useEffect, ReactComponentElement } from "react";
import Header from "./components/Header";
import api from "./services/api";
import { Grid } from "@mui/material";
import {
  CloudCircle,
  CloudDoneSharp,
  CloudOff,
  Description,
  FilterDrama,
  LightMode,
  Thunderstorm,
} from "@mui/icons-material";
interface IconInterfaze {}

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
  const [result, setResult] = useState<null | undefined>();
  const [cityName, setCityName] = useState<string>("");

  const getImageIcon = (iconName: string) => {
    return (
      <img
        src={`http://openweathermap.org/img/wn/${iconName}@2x.png`}
        // width="100px"
        // height="100px"
        alt=""
      />
    );
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

  // console.log(data());

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

    // console.log(resName.data);
    setWeather(resName.data);

    return resName;
  };

  function uniqueValues(value, index, self) {
    return self.indexOf(value) === index;
  }

  const getByNext = async (event, cityname: string) => {
    event.preventDefault();
    const resNameNext: AxiosResponse<any> = await axios.get(
      `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${process.env.REACT_APP_OPEN_WHEATHER_KEY}`,
      {
        params: {
          lang: "pt_br",
          units: "metric",
        },
      }
    );

    const list: Array<any> = resNameNext.data.list;
    const listFormatted: Array<any> = list.map((value: any, index: number) => {
      return {
        dt_txt: formatTimestamp(value.dt),
        temp: value?.main.temp,
        icon: value.weather[index]?.icon,
      };
    });

    const uniqueObjects = [...new Set(listFormatted.map((obj) => obj.dt_txt))];
    console.log(uniqueObjects); // ["Matheus", "Pedro", "Marcos"]
    // console.log(unique);

    // console.log(listFormatted);
    return resNameNext;
  };

  // console.log(weatherDays);
  const iconReturn = () => {
    let weatherType = weather.weather["0"].description;
    switch (weatherType) {
      case "céu limpo":
        return <LightMode />;
      case "poucas nuvens":
        return <FilterDrama />;
      case "nublado":
        return <CloudDoneSharp />;
      case "chuva de banho":
        return <CloudCircle />;
      case "trovoada":
        return <Thunderstorm />;
      case "nublado":
        return <Thunderstorm />;
      default:
        <></>;
    }
  };

  const cityChange = (e) => {
    setCityName(e.target.value);
  };

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      getWeather(position.coords.latitude, position.coords.longitude)
        .then((response) => setWeather(response.data))
        .catch((error) => console.log(error));
      setLocation(true);
    });
  }, []);

  if (location === false) {
    return <h1> Você precisa ativar a permissão de localização!</h1>;
  } else {
    return (
      <div className="App">
        <Grid container>
          <Grid container spacing={3} justifyContent="center">
            <Grid item lg={3} md={6} sm={8} xs={12}>
              <h1 className="cityName">
                <img className="locationIcon" />
                {weather.name}
              </h1>
              <h1>{data()}</h1>
              <h1 className="currentTemp">
                <img className="termIcon" />
                {Number(weather.main.temp).toFixed()}°
              </h1>
              <h1 className="feelsLike">
                Sensação termica {Number(weather.main.feels_like).toFixed()}°
              </h1>
            </Grid>

            <Grid item lg={3} md={6} sm={8} xs={12}>
              <h1 className="imageIcon">
                {getImageIcon(weather.weather["0"].icon)}
              </h1>
              <h1 className="currentDescrip">
                {weather.weather["0"].description}
              </h1>
            </Grid>

            <Grid item lg={3} md={6} sm={8} xs={12}>
              <h1>
                Temperatura maxima {Number(weather.main.temp_max).toFixed()}°
              </h1>
              <h1>
                Temperatura minima {Number(weather.main.temp_min).toFixed()}°
              </h1>
              <h1>Pressão {weather.main.pressure} hpa</h1>
              <h1>Umidade {weather.main.humidity}%</h1>
            </Grid>
          </Grid>
          <Grid container justifyContent="center">
            <Grid item lg={8} md={8} sm={8}>
              <div className="nextDays">
                <h1></h1>
              </div>
            </Grid>
          </Grid>
        </Grid>
        {weather && (
          <ul>
            <div className="clima">
              <h1 className="climate">{weather.weather["0"].description}</h1>
              <h1 className="result">
                {getImageIcon(weather.weather["0"].icon)}
              </h1>
            </div>
            <h1 className="climate">{weather.name}</h1>
            <li className="description">
              {" "}
              Temperatura atual: <h3>{Number(weather.main.temp).toFixed()}°</h3>
            </li>{" "}
            <li className="description">
              {" "}
              Sensação termica:{" "}
              <h3>{Number(weather.main.feels_like).toFixed()}°</h3>
            </li>
            <li className="description">
              {" "}
              Temperatura maxima:{" "}
              <h3>{Number(weather.main.temp_max).toFixed()}°</h3>
            </li>
            <li className="description">
              {" "}
              Temperatura minima:{" "}
              <h3>{Number(weather.main.temp_min).toFixed()}°</h3>{" "}
            </li>
            <li className="description">
              {" "}
              Pressão: <h3>{weather.main.pressure} hpa</h3>
            </li>
            <li className="description">
              Humidade: <h3> {weather.main.humidity}%</h3>
            </li>
          </ul>
        )}
        {getImageIcon(weather.weather["0"].icon)}
        <form onSubmit={(e) => getByNext(e, cityName)}>
          <input onChange={cityChange} value={cityName}></input>{" "}
          <button>Pesquisar</button>
        </form>
      </div>
    );
  }
};
export default App;
