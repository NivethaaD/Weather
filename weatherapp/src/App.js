
import './App.css';

/*Images*/
import searchIcon from './assets/search.png';
import clearIcon from './assets/clear.png';
import cloudIcon from './assets/cloud.png';
import windIcon from './assets/wind.png';
import rainIcon from './assets/rain.png';
import snowIcon from './assets/snow.png';
import humidityIcon from './assets/humidity.jpg'


import { useEffect, useState } from 'react';

const WeatherDetails = ({icon,temp,city,country,lat,log,humidity,wind})=>{
  return(
    <>
      <div className='image'>
        <img src={icon} alt='image' width={100}></img>
      </div>
      <div className='temp'><h1>{temp}&deg;C</h1></div>
      <div className='city'><h1>{city}</h1></div>
      <div className='country'><h1>{country}</h1></div>
      <div className='coordinates'>
          <div>
            <span className='lat'>Latitude</span>
            <span>{lat}</span>
          </div>
          <div>
            <span className='log'>Longitude</span>
            <span>{log}</span>
          </div>
      </div>
      <div className='data-container'>
          <div className='element'>
              <img src={humidityIcon} alt='humidity' className='icon' width={40}/>
              <div className='data'>
                  <div className='humidity-percent'>{humidity}</div>
                  <div className='text'>Humidity</div>
              </div>
          </div>
          <div className='element'>
              <img src={windIcon} alt='wind' className='icon' width={40}/>
              <div className='data'>
                  <div className='wind-percent'>{wind} km/h </div>
                  <div className='text'>Wind Speed</div>
              </div>
          </div>
      </div>

    </>
  )
}



function App() {

  let api_key= "24c42c9e80182a4c9078d207bb59fc10";

  const [icon,setIcon]=useState(clearIcon);
  const [temp,settemp]=useState(0);
  const [city,setCity]=useState("chennai");
  const [country,setCountry]=useState("In");
  const [lat,setLat]=useState(0);
  const [log,setLog]=useState(0);
  const [humidity,setHumidity]=useState(0);
  const [wind,setWind]=useState(0);
  const [text,setText]=useState("Chennai");
  const [cityNotFound,setCityNotFound]=useState(false);
  const [loading,setLoading]=useState(false);
  const [error,setError]=useState();

  const weatherIconMap={
      "01d":clearIcon,
      "01n":clearIcon,
      "02d":cloudIcon,
      "02n":cloudIcon,
      "03n":cloudIcon,
      "09d":rainIcon,
      "09n":rainIcon,
      "10d":rainIcon,
      "10n":rainIcon,
      "13d":snowIcon,
      "13n":snowIcon
  }

  const search=async ()=>{

    setLoading(true);
    let url=`https://api.openweathermap.org/data/2.5/weather?q=${text}&appid=${api_key}&units=Metric`;

    try{
        let res=await fetch(url);
        let data = await res.json();
       // console.log(data);
       if(data.cod==="404")
        {
          console.log("City not found");
          setCityNotFound(true);
          setLoading(false);
          return;
        }
        setHumidity(data.main.humidity);
        setWind(data.wind.speed);
        settemp(Math.floor(data.main.temp));
        setCity(data.name);
        setCountry(data.sys.country);
        setLat(data.coord.lat);
        setLog(data.coord.lon);
        const weatherIconCode=data.weather[0].icon;
        setIcon(weatherIconMap[weatherIconCode] || clearIcon);
        setCityNotFound(false);
    }
    catch(error){
      console.log("An Error Occured:",error.message);
      setError("An Error Occured While Fetching data....):")
    }
    finally{
      setLoading(false);
    }
  };

  const handleCity =(e)=>{
    setText(e.target.value);
  }

  const handleKeyDown=(e)=>{
    if(e.key=="Enter")
      {
        search();
      }
  }

  useEffect(()=>{
    search();
  },[]);


  return (
    <div className="App">
          <div className='container'>
            <div className='input-container'>
                <input type="text" className='cityInput' placeholder='Search City' onChange={handleCity} value={text} onKeyDown={handleKeyDown} />
                <div className='search-icon'>
                  <img src={searchIcon} alt="Search" width={18} onClick={()=>search()}></img>
                </div>
            </div>
            <div>
                {error && <div className='error-message'>{error}</div>}
                { cityNotFound &&  <div className='city-not-found'>City not Found</div>}

                {!loading && !cityNotFound && <WeatherDetails icon={icon} temp={temp} city={city} country={country} lat={lat} log={log} humidity={humidity} wind={wind}/>}

            </div>

          </div>
    </div>
  );
}

export default App;
