import http, {Server} from "http";
import { config } from "dotenv";

config(); // environment variable configuration

import app from "./src";

const port: string | undefined = (process.env.NODE_ENV == "dev") ? process.env.DEV_PORT : process.env.PROD_PORT;

const server:Server<typeof http.IncomingMessage, typeof http.ServerResponse> = http.createServer(app);
server.listen(port, () => {
    console.log(`HealthTrack server is running in "${process.env.NODE_ENV}" mode @ ${port}`);
});