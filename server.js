const express = require("express");
const app = express();

let latestLocation = {
  lat: null,
  lng: null
};

// Arduino sends location here
app.get("/location", (req, res) => {

    const lat = req.query.lat;
    const lng = req.query.lng;

    latestLocation.lat = lat;
    latestLocation.lng = lng;

    console.log("Latitude:", lat);
    console.log("Longitude:", lng);

    res.json({
        status: "Location received"
    });
});

// Flutter gets location from here
app.get("/getLocation", (req, res) => {
     console.log("Latest Location:", latestLocation);
    res.json({
        lat: latestLocation.lat,
        lng: latestLocation.lng
    });

});

app.listen(3000, "0.0.0.0", () => {
  console.log("Server running on port 3000");
});