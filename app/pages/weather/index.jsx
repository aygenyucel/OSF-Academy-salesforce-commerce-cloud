import { Box, Button, Container, Heading, Image, Input } from "@chakra-ui/react";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";

const WeatherApp = () => {
    const [city, setCity] = useState("")
    const [limit, setLimit] = useState("1")
    
    //location coordinates
    const [lat, setLat] = useState(null) //Latitude
    const [lon, setLon] = useState(null) //Longitude
    
    
    const [weatherData, setWeatherData] = useState(null)

    //some weather informations taken from the weatherData
    const [icon, setIcon] = useState(null) //01d, 02d, etc
    const [main, setMain] = useState(null) //Thunderstorm, Drizzle, Rain, etc.
    const [description, setDescription] = useState(null) //light thunderstorm, drizzle rain, light rain, etc.

    const [temp, setTemp] = useState(null)
    const [feelsLike, setFeelsLike] = useState(null)

    const handleChangeCity = (e) => {
            setCity(e.target.value)
    }

    const searchWeather = (e) => {
        e.preventDefault();
        if(city !== "") {
            fetchWeatherData();
        }
    }

    useEffect(() => {
        console.log("weatherData =>>", weatherData)
    }, [weatherData])

    const fetchWeatherData = async () => {
        try {
            console.log("bgbgbgbgbg")
            const response = await fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=${limit}&appid=6b41d2f6d99bc61d1df7964f2d8e7146`)

            if(response.ok) {
                const geoData = await response.json();
                setLat(geoData[0].lat)
                setLon(geoData[0].lon)
                try {
                    const response2 = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${geoData[0].lat}&lon=${geoData[0].lon}&appid=6b41d2f6d99bc61d1df7964f2d8e7146`)
                    if(response2.ok) {
                        const weatherData = await response2.json();
                        setWeatherData(weatherData);
                        setTemp(weatherData.main.temp);
                        setFeelsLike(weatherData.main.feels_like);
                        setIcon(weatherData.weather[0].icon);
                        setDescription(weatherData.weather[0].description);
                        setMain(weatherData.weather[0].main)
                    } else {
                        console.log("opps, error when fetching!")
                    }
                } catch (error) {
                    console.log(error)
                }
            } else {
                console.log("opps, error when fetching!")
            }
        } catch (error) {
            console.log("opps, error when fetching!", error)
        }
    }


    return (
        <>
            <Container>
                <Box display="flex" flexDirection="column">
                    <Box mb={3}>
                        <Heading as="h3">
                            Weather App
                        </Heading>
                    </Box>
                    <Box className="weatherApp-search" display="flex">
                        <Input placeholder='City' maxWidth="350px" value={city} onChange={handleChangeCity}/>
                        <Button onClick={searchWeather}>Search</Button>
                    </Box>
                    {weatherData && 
                        <Box className="weatherApp-result" display="flex" flexDirection="column" backgroundColor="blue.200" padding={3}>
                            <Box padding="20px">
                                weather icon
                                <Image src={`https://openweathermap.org/img/wn/${icon}.png`} alt= {description} />
                            </Box>
                            <Box>
                                It's {description} in {city}!
                            </Box>
                            <Box>
                                The temparature is {Math.round(temp - 273.15)} °C
                            </Box> 
                        </Box>
                     }
                </Box>
            </Container>
            
            
        </>
    )
}

export default WeatherApp;