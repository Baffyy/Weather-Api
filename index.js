import express from "express";
import bodyParser from "body-parser";
import axios from "axios";
import dotenv from "dotenv"

const app = express();
const port= 3000;

dotenv.config();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }))

app.get("/", (req,res) => {
   res.render("index.ejs")
})

app.get("/submit", async(req,res) => {
    res.render("weather.ejs")
   
})

app.post("/submit", async(req, res) => {
    const location = req.body.name;

    try{
       const response = await axios.get(`http://api.openweathermap.org/geo/1.0/direct?q=${location}&limit=1&appid=${process.env.API_KEY}`);
       const result = response.data[0];
       const weather= await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${result.lat}&lon=${result.lon}&appid=${process.env.API_KEY}&units=metric`)
       const weatherResult= weather.data;
       console.log(weatherResult)
       res.render("weather.ejs", {city: result.name, 
        country: result.state,
        mainweather: weatherResult.weather[0].main,
        description: weatherResult.weather[0].description,
        pressure: weatherResult.main.pressure,
        temp: weatherResult.main.temp,
        humid: weatherResult.main.humidity,
        windS: weatherResult.wind.speed
    }) 
    } catch (error) {
        console.log(error)
        res.status(501).send("Bad Request");
    }
    
})

app.listen(port, (req,res) => {
    console.log(`server is up and running on port ${port}`)
});

