const http = require("http");
const fs = require("fs");
var requests = require("requests");
const port = process.env.port || 3000;
const homeFile = fs.readFileSync("home.html", "UTF-8");
const replaceVal = (tempVal, orgVal) => {
    let temperature = tempVal.replace("{%tempVal%}", Math.floor(orgVal.main.temp - 273.15));
    temperature = temperature.replace("{%tempMin%}", Math.floor(orgVal.main.temp_min - 273.15));
    temperature = temperature.replace("{%tempMax%}", Math.floor(orgVal.main.temp_max - 273.15));
    temperature = temperature.replace("{%country%}", orgVal.sys.country);
    temperature = temperature.replace("{%location%}", orgVal.name);
    temperature = temperature.replace("{%tempStatus%}", orgVal.weather[0].main)
    return temperature;
}
const server = http.createServer((req, res) => {
    if (req.url == "/") {
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
});
server.listen(port);
