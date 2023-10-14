import { config } from "dotenv";
import express, {Express} from "express"
import * as ResponseStatus from "http-status-codes";
import cors from "cors"
import morgan from "morgan";

import { UnSuccessfulApiResponse } from "./common/ApiResponse";
import healthTrackRouter from "./router/healthTrack.router";

config(); // environment variable configuration

const app: Express = express();

app.use(cors()).use(morgan("tiny")).use(express.json()).use(express.urlencoded({extended: true})); // middlewares

app.use("/health-track", healthTrackRouter);
app.get("*", (req, res) => {
    return res.status(ResponseStatus.StatusCodes.NOT_FOUND).send(new UnSuccessfulApiResponse(false ,"Route you're requesting was not found."));
});


export default app;