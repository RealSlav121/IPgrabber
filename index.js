const express = require("express");
const axios = require("axios");
const app = express();
const port = process.env.PORT || 3000;

app.get("/", async (req, res) => {
  try {
    // Get visitor IP
    const userIp = req.headers["x-forwarded-for"] || req.socket.remoteAddress;

    // Fetch geolocation info
    const geoResponse = await axios.get(`http://ip-api.com/json/${userIp}`);
    const geoData = geoResponse.data;

    console.log("Visitor IP:", userIp);
    console.log("Location:", `${geoData.city}, ${geoData.regionName}, ${geoData.country}`);

    // Redirect user
    res.redirect("https://www.google.com");
  } catch (err) {
    console.error(err);
    res.redirect("https://www.google.com");
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
