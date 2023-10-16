import app from "../src";
import { expect, test } from "vitest";
import supertest from "supertest";
import { StatusCodes } from "http-status-codes";


test("POST /health-track/records", async () => {

    const recordsData: { patient_id: number, body_temperature: number, heart_rate: number } = {
        patient_id: 1,
        body_temperature: 32,
        heart_rate: 78
     }
    supertest(app)
    .post("/health-track/record")
    .send(recordsData)
    .expect(StatusCodes.CREATED)
    .then((res) => {
        expect(res.body.success).toBeTruthy();
    });
});


test("GET /health-track/records", async () => {
    supertest(app)
    .get("/health-track/record")
    .expect(StatusCodes.OK)
    .then((res) => {
        expect(Array.isArray(res.body.data)).toBeTruthy();
    });
});