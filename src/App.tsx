import { AxiosResponse } from "axios";
import "./App.css";
import React, { useState, useEffect} from "react";
import Header from "./components/Header";
import api from "./services/api";
import { CloudDone, Description, FilterDrama } from "@mui/icons-material";

interface App{
  FilterDrama: any;
}

interface WeatherInterface {
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

function App() {
  const [location, setLocation] = useState<boolean>(false);
  const [weather, setWeather] = useState<WeatherInterface>();
  const [result, setResult] = useState<any>()

  const getWeather = async (lat: number, long: number): Promise<any> => {
    const res: AxiosResponse<any> = await api({
      params: {
        lat: lat,
        lon: long,
        appid: process.env.REACT_APP_OPEN_WHEATHER_KEY,
        lang: "pt",
        units: "metric",
      },
    });
    console.log(res.data)

    return res;
  };
  const iconReturn =() =>{
    if(weather?.weather["0"].description == "céu limpo"){
      setResult(weather.weather["0"].description && <FilterDrama/>)
    }
  }
  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      getWeather(position.coords.latitude, position.coords.longitude)
        .then((response) => setWeather(response.data))
        .catch((error) => console.log(error));
      setLocation(true);
    });
  }, []);
  console.log(weather?.weather["0"].description);
  if (location === false) {
    return <h1> Você precisa ativar a permissão de localização!</h1>;
  } else {
    return (
      <div className="App">
        <Header />

        {weather && (
          <ul>
            {/* <img> {weather.weather["0"].icon}</img> */}
            <h1 className="climate">
              Clima atual:{" "}
              {weather.weather["0"].description !== "céu limpo" ? 
                <div>
                  
                {weather.weather["0"].description}<FilterDrama />
              </div> : weather.weather["0"].description}
            </h1>
            <li className="description">
              {" "}
              temperatura atual: <h3>{Number(weather.main.temp).toFixed()}°</h3>
            </li>
            <li className="description">
              {" "}
              temperatura maxima:{" "}
              <h3>{Number(weather.main.temp_max).toFixed()}°</h3>
            </li>
            <li className="description">
              {" "}
              temperatura minima:{" "}
              <h3>{Number(weather.main.temp_min).toFixed()}°</h3>{" "}
            </li>
            <li className="description">
              {" "}
              pressão: <h3>{weather.main.pressure} hpa</h3>{" "}
            </li>
            <li className="description">
              humidade: <h3> {weather.main.humidity}%</h3>
            </li>
          </ul>
        )}
      </div>
    );
  }
}
{
  /* <h1 className="climate">
              Clima atual:{" "}
              {weather.weather["0"].description == "sndkfgnskd" ? (
                weather.weather["0"].description
              ) : (
                <FilterDrama />
              )}
            </h1> */
}
export default App;
