import { Box, Button, Container, Heading, Image, Input } from "@chakra-ui/react";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";

const WeatherApp = () => {
    const [city, setCity] = useState("")
    const [limit, setLimit] = useState("1")
    
    //location datas
    const [geoData, setGeoData] = useState(null)
    const [lat, setLat] = useState(null) //Latitude
    const [lon, setLon] = useState(null) //Longitude
    
    
    const [weatherData, setWeatherData] = useState(null)

    const [citySearched, setCitySearched] = useState(null)
    //some weather informations taken from the weatherData
    const [icon, setIcon] = useState(null) //01d, 02d, etc
    const [main, setMain] = useState(null) //Thunderstorm, Drizzle, Rain, etc.
    const [description, setDescription] = useState(null) //light thunderstorm, drizzle rain, light rain, etc.

    const [temp, setTemp] = useState(null)
    const [feelsLike, setFeelsLike] = useState(null)

    //customize background image
    const [bgImage, setBgImage] = useState(null)

    //custom text in component
    const [customText, setCustomText] = useState(null)

    const handleChangeCity = (e) => {
            setCity(e.target.value)
    }

    const searchWeather = (e) => {
        e.preventDefault();
        if(city !== "") {
            fetchWeatherData();
            setCity("")
        }
    }

    // useEffect(() => {
    //     console.log("weatherData =>>", weatherData)
    // }, [weatherData])

    // useEffect(() => {
    //     console.log("geoData =>>", geoData)
    // }, [geoData])

    const customizeContent = (main, citySearched, description) => {
        switch (main) {
            case "Rain":
                setBgImage("https://images.unsplash.com/photo-1433863448220-78aaa064ff47?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1931&q=80")
                setCustomText(`The weather in ${citySearched} is ${description}`)
                break;
            case "Drizzle":
                setBgImage("https://images.unsplash.com/photo-1556485689-33e55ab56127?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80")
                setCustomText(`The weather in ${citySearched} is ${description}`)
                break;
            case "Thunderstorm":
                setBgImage("https://images.unsplash.com/photo-1559087867-ce4c91325525?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80")
                setCustomText(`The weather in ${citySearched} is ${description}`)
                break;
            case "Snow":
                setBgImage("https://images.unsplash.com/photo-1547754980-3df97fed72a8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80")
                setCustomText(`The weather in ${citySearched} is ${description}`)
                break;

            case "Clear":
                setBgImage("https://images.unsplash.com/photo-1469122312224-c5846569feb1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1889&q=80")
                setCustomText(`There is ${description} in ${citySearched}`)
                break;
            case "Clouds":
                setBgImage("https://images.unsplash.com/photo-1501630834273-4b5604d2ee31?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80")
                setCustomText(`It's ${description} in ${citySearched}`)
                break;
            default:
                setBgImage("https://images.unsplash.com/photo-1538947151057-dfe933d688d1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80")
                setCustomText(`It's ${description} in ${citySearched}`)
                break;
        }
    }

    const fetchWeatherData = async () => {
        try {
            const response = await fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=${limit}&appid=6b41d2f6d99bc61d1df7964f2d8e7146`)

            if(response.ok) {
                const geoData = await response.json();
                setGeoData(geoData)
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
                        setMain(weatherData.weather[0].main);
                        setCitySearched(city)
                        customizeContent(weatherData.weather[0].main, geoData[0].name, weatherData.weather[0].description)
                        
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
                    <Box mb={3} backgroundColor="">
                        <Heading as="h3">
                            Weather App
                        </Heading>
                    </Box>
                    <Box className="weatherApp-search" display="flex">
                        <Input placeholder='City' maxWidth="350px" value={city} onChange={handleChangeCity}/>
                        <Button onClick={searchWeather}>Search</Button>
                    </Box>
                    {geoData?.length > 0 && weatherData && 
                        <Box mt={3} className="weatherApp-result" display="flex" flexDirection="column" justifyContent="center" alignItems="center" backgroundColor="blue.200" padding={3} backgroundImage={`${bgImage}`} 
                        
                        >
                            <Box backdropFilter='auto' backdropBlur='8px' padding="20px" display="flex" flexDirection="column" justifyContent="center" alignItems="center">

                                <Box>
                                    <Image src={`https://openweathermap.org/img/wn/${icon}@2x.png`} alt= {description} />
                                </Box>
                                <Box mb={3}>
                                    {customText}
                                </Box>
                                <Box >
                                    The temparature is <b>{Math.round(temp - 273.15)}°C</b> 
                                </Box> 
                            </Box>
                        </Box>
                     }
                </Box>
            </Container>
        </>
    )
}

export default WeatherApp;