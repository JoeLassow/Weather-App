import express from "express"
import axios from "axios"
import bodyParser from "body-parser"

const app = express()
const port = 3000

const APIURL = "https://api.openweathermap.org/data/2.5/weather"
const APIKEY = "YOUR API KEY"

app.use(bodyParser.urlencoded({extended:true}))
app.use(express.static("public"))

async function getLatLong (cityName){
try{
    const response = await axios.get(`http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&appid=${APIKEY}`)
    const data = response.data    
    var lat = data[0]["lat"]
    var long = data[0]["lon"]
    return [lat, long]

} catch (error) {
    console.log(error.message);
}}

async () => {    
    const result = await getLatLong("London");
    console.log(result[0]); // Output the latitude and longitude
   
};

app.get("/", (req,res)=> {
    res.render("home.ejs")
})

app.post("/submit", async  (req,res)=> {    
    try {
        var userLocation = req.body.location;
        // Function call getting latitude and longitude
        const result = await getLatLong(userLocation);          
        var lat = result[0]
        var long = result[1]
        // Main program 
        const response = await axios.get(`${APIURL}?lat=${lat}&lon=${long}&units=metric&appid=${APIKEY}`)
        const data = response.data   
        // Data variables     
        var description0 = String(data["weather"][0]["description"])
        var description = description0.charAt(0).toUpperCase() + description0.slice(1);       

        var imageIcon = data["weather"][0]["icon"]
        var temp = Math.round(data["main"]["temp"])
        var location = `${data["name"]}, ${data["sys"]["country"]}`
        

        res.render("home.ejs", {
            "location": location,
            "description": description,
            "image": imageIcon,
            "temperature": temp
        })
    } catch(error) {
        console.log(error.message);
    }})


app.listen(port, ()=> {
    console.log(`Server is live on port ${port}`);
})
