import { config } from "dotenv";
import express, {Express} from "express"
import * as ResponseStatus from "http-status-codes";

import { UnSuccessfulApiResponse } from "./common/ApiResponse.ts";

config(); // environment variable configuration

const app: Express = express();

app.get("*", (req, res) => {
    return res.status(ResponseStatus.StatusCodes.NOT_FOUND).send(new UnSuccessfulApiResponse(false ,"Route you're requesting was not found."));
});


export default app;