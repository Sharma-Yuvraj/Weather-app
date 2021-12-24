const http = require("http");
const fs = require("fs");
var requests = require("requests");
const port = process.env.PORT || 8000;
const homeFile = fs.readFileSync("home.html", "UTF-8");
const replaceVal = (tempVal, orgVal) => {
    if (orgVal.cod != '404') {
        // Min {%tempMin%}°C | Max {%tempMax%}°C
        let temperature = tempVal.replace("{%tempVal%}", Math.floor(orgVal.main.temp - 273.15)+"°C");
        temperature = temperature.replace("{%tempMin%}", "Min "+ Math.floor(orgVal.main.temp_min - 273.15)+"°C | ");
        temperature = temperature.replace("{%tempMax%}", "Max "+ Math.floor(orgVal.main.temp_max - 273.15)+"°C");
        temperature = temperature.replace("{%country%}", orgVal.sys.country);
        temperature = temperature.replace("{%location%}", orgVal.name + ",");
        temperature = temperature.replace("{%tempStatus%}", orgVal.weather[0].main)
        return temperature;
    }
    else {
        let temperature = tempVal.replace("{%tempVal%}", "");
        temperature = temperature.replace("{%tempMax%}", "");
        temperature = temperature.replace("{%tempMin%}", "");
        temperature = temperature.replace("{%country%}", "");
        temperature = temperature.replace("{%location%}", "Invalid City Name");
        temperature = temperature.replace("{%tempStatus%}", "")
        return temperature;
    }
}
const server = http.createServer((req, res) => {
    if (req.url == "/" || req.url == "/favicon.ico") {
        requests(
            "http://api.openweathermap.org/data/2.5/weather?q=kanpur&appid=7ebfe6a5aef7aefa3e5524f5a9fa97eb"
        )
            .on("data", (chunk) => {
                const objData = JSON.parse(chunk);
                const arrData = [objData];
                const realTimeData = arrData
                    .map((val) => replaceVal(homeFile, val))
                    .join("");       // used join to convert array into string by joining all the elements of array
                res.write(realTimeData);
            })
            .on("end", (err) => {
                if (err) return console.log("connection closed due to errors", err);
                res.end();
            });
    }
    else {
        requests(
            "http://api.openweathermap.org/data/2.5/weather?q" + req.url.substring(11) + "&appid=7ebfe6a5aef7aefa3e5524f5a9fa97eb"
        )
            .on("data", (chunk) => {
                const objData = JSON.parse(chunk);
                const arrData = [objData];
                const realTimeData = arrData
                    .map((val) => replaceVal(homeFile, val))
                    .join("");       // used join to convert array into string by joining all the elements of array
                res.write(realTimeData);
            })
            .on("end", (err) => {
                if (err) return console.log("connection closed due to errors", err);
                res.end();
            });
    }
});
server.listen(port);
