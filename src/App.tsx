import axios, { AxiosResponse } from "axios";
import "./App.css";
import React, { useState, useEffect, ReactComponentElement } from "react";
import Header from "./components/Header";
import api from "./services/api";
import moment from "moment";
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
interface IconInterfaze {

}

interface WeatherInterface {
  name: string;
  dt: number;
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

const App: React.FC = () => {
  const [location, setLocation] = useState<boolean>(false);
  const [weather, setWeather] = useState<WeatherInterface>({
    name: "",
    dt: 0,

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
  // const data = () =>{
  //   let timestamp = new Date(weather.dt); 

  // return timestamp
  // }
  // console.log(new Date())


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

    console.log(resName.data);
    setWeather(resName.data);

    return resName;
  };
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

          <Grid container spacing={3}>

            <Grid item lg={4} md={4} sm={4} >
              <h1 className="cityName"><img className="locationIcon" />{weather.name}</h1>
              <h1 className="currentTemp"> <img className="termIcon" />{Number(weather.main.temp).toFixed()}°</h1>
              <h2 className="feelsLike">Sensação termica {Number(weather.main.feels_like).toFixed()}°</h2>
            </Grid>

            <Grid item lg={4} md={4} sm={4}>
            <h1 className="imageIcon">
                {getImageIcon(weather.weather["0"].icon)}
              </h1>
              <h2 className="currentDescrip">{weather.weather["0"].description}</h2>

            </Grid>

          </Grid>
          <Grid container justifyContent="center">
            <Grid item lg={8} md={8} sm={8}>
              <div className="nextDays"><h1>to aqui</h1></div>
            </Grid>

          </Grid>


        </Grid>
        {/* <Header /> */}
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
              Pressão: <h3>{weather.main.pressure} hpa</h3>{" "}
            </li>
            <li className="description">
              Humidade: <h3> {weather.main.humidity}%</h3>
            </li>
          </ul>
        )}
        {getImageIcon(weather.weather["0"].icon)}
        <form onSubmit={(e) => getByName(e, cityName)}>
          <input onChange={cityChange} value={cityName}></input>{" "}
          <button>Pesquisar</button>
        </form>
      </div>
    );
  }
};
export default App;
