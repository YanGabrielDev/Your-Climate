import axios from 'axios';
import './App.css';
import React, {useState, useEffect, Fragment }from 'react';
import Header from './components/Header';


function App() {
  const [location, setLocation] = useState(false)
  const [weather, setWeather] = useState(false)

  let getWeather = async (lat, long) => {
    let res = await axios.get("http://api.openweathermap.org/data/2.5/weather", {
      params:{
        lat: lat,
        lon: long,
        appid: process.env.REACT_APP_OPEN_WHEATHER_KEY,
        lang: 'pt',
        units: 'metric'
      }
    }).then(response => setWeather(response.data));
    // setWeather(res.data);
    console.log(res.data);
    

  }
  useEffect(() =>{
    navigator.geolocation.getCurrentPosition((position) => {
      getWeather(position.coords.latitude, position.coords.longitude);
      setLocation(true)
    })
  }, [])

  if(location == false){
    return(
<h1> Você precisa ativar a permissão de localização!</h1>
    )
  } else{
    return (
      <div className="App">
       <Header/>
        
          {weather &&
        <ul>
       <h1 className='climate'>Clima atual: {weather.weather["0"].description}</h1>
       <li className='description'> temperatura atual: <h3>{Number(weather.main.temp).toFixed()}°</h3></li>
       <li className='description'> temperatura maxima; <h3>{Number(weather.main.temp_max).toFixed()}°</h3></li>
       <li className='description'> temperatura minima: <h3>{Number(weather.main.temp_min).toFixed()}°</h3> </li> 
       <li className='description'> pressão: <h3>{weather.main.pressure} hpa</h3> </li>
       <li className='description'>humidade: <h3> {weather.main.humidity}%</h3></li>
       </ul>
         }
  
   
      </div>
       
    );
  }
  



  }


 
export default App;
