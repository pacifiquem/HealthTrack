import app from "../src";
import { expect, test } from "vitest";
import supertest from "supertest";
import { StatusCodes } from "http-status-codes";

test("GET /health-track/patient-records/:patient_id", async () => {
    await supertest(app)
    .get("/health-track/patient-record/1")
    .expect(StatusCodes.OK)
    .then((res) => {
        expect(JSON.parse(res.text).success).toBe(true);
    });
});