const express = require("express");
const axios = require("axios");
const app = express();
const port = process.env.PORT || 3000;

app.get("/", async (req, res) => {
  try {
    // Get visitor IP (first one if multiple)
    let userIp = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
    userIp = userIp.split(",")[0].trim();

    // Get timestamp in Eastern Time
    const timestamp = new Date().toLocaleString("en-US", { timeZone: "America/New_York" });

    // Check for private/local IPs
    if (
      userIp === "::1" ||
      userIp.startsWith("10.") ||
      userIp.startsWith("192.168.") ||
      /^172\.(1[6-9]|2[0-9]|3[0-1])\./.test(userIp)
    ) {
      console.log(`[${timestamp}] Visitor IP: ${userIp} (private IP, location unavailable)`);
    } else {
      // Fetch geolocation info
      const geoResponse = await axios.get(`http://ip-api.com/json/${userIp}`);
      const geoData = geoResponse.data;

      const location = `${geoData.city}, ${geoData.regionName}, ${geoData.country}`;
      console.log(`[${timestamp}] Visitor IP: ${userIp}`);
      console.log(`[${timestamp}] Location: ${location}`);
    }

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
