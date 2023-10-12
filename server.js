import http from "http";
import https from "https";
import { config } from "dotenv";

config(); // environment variable configuration

import app from "./src/index.js";

const port = (process.env.NODE_ENV == "dev") ? process.env.DEV_PORT : process.env.PROD_PORT;

const server = http.createServer(app);
server.listen(port, () => {
    console.log(`HealthTrack server is running in "${process.env.NODE_ENV}" mode @ ${port}`);
});