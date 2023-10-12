import { config } from "dotenv";
import express from "express"
import * as ResponseStatus from "http-status-codes";

import ApiResponse from "./common/ApiResponse.common.js";

config(); // environment variable configuration

const app = express();

app.get("*", (req, res) => {
    return res.status(ResponseStatus.StatusCodes.NOT_FOUND).send(new ApiResponse("Route you're requesting was not found.", false, null));
});


export default app;