const express = require("express");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors());

let latestLocation = {
  lat: null,
  lng: null,
  updatedAt: null
};

//////////////////////////////////////////////////////////
// Arduino sends GPS here
//////////////////////////////////////////////////////////

app.get("/location", (req, res) => {

  const lat = req.query.lat;
  const lng = req.query.lng;

  if (lat === undefined || lng === undefined) {
    return res.status(400).json({
      error: "Latitude and Longitude required"
    });
  }

  const latNum = parseFloat(lat);
  const lngNum = parseFloat(lng);

  if (isNaN(latNum) || isNaN(lngNum)) {
    return res.status(400).json({
      error: "Invalid latitude or longitude"
    });
  }

  latestLocation.lat = latNum;
  latestLocation.lng = lngNum;
  latestLocation.updatedAt = new Date();

  console.log("📡 GPS Location Received");
  console.log("Latitude:", latestLocation.lat);
  console.log("Longitude:", latestLocation.lng);

  res.json({
    status: "Location received",
    lat: latestLocation.lat,
    lng: latestLocation.lng
  });

});

//////////////////////////////////////////////////////////
// Flutter gets GPS here
//////////////////////////////////////////////////////////

app.get("/getLocation", (req, res) => {

  console.log("📱 Flutter requested location");

  if (latestLocation.lat === null || latestLocation.lng === null) {
    return res.json({
      message: "Waiting for GPS...",
      lat: null,
      lng: null
    });
  }

  res.json({
    lat: latestLocation.lat,
    lng: latestLocation.lng,
    updatedAt: latestLocation.updatedAt
  });

});

//////////////////////////////////////////////////////////

app.get("/", (req, res) => {
  res.send("🚲 Hybrid Bicycle GPS Server Running");
});

//////////////////////////////////////////////////////////

const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
