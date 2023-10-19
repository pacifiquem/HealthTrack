import { config } from "dotenv";
import express, {Express} from "express"
import * as ResponseStatus from "http-status-codes";
import cors from "cors"
import morgan from "morgan";
import path from "path"

import { UnSuccessfulApiResponse } from "./common/ApiResponse";
import healthTrackRouter from "./router/healthTrack.router";
import rate_limiter from "./utils/limiter.utils";

config(); // environment variable configuration

const app: Express = express();

app .use(cors())
    .use(morgan("tiny"))
    .use(express.json())
    .use(express.urlencoded({extended: true}))
    .use(express.static(path.join(__dirname, "..", "public")))
    .use(rate_limiter)

app.use("/health-track", healthTrackRouter);
app.get("*", (req, res) => {
    return res.status(ResponseStatus.StatusCodes.NOT_FOUND).send(new UnSuccessfulApiResponse(false ,"Welcome to Health-Track server. \n Visit:https://documenter.getpostman.com/view/19417069/2s9YR57aor \t for Documentation "));
});


export default app;