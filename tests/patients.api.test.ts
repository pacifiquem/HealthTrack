import app from "../src";
import { expect, it, test } from "vitest";
import supertest from "supertest";
import { StatusCodes } from "http-status-codes";

// Catching unhandled routes
test("UnHandled Routes", async () => {
    await supertest(app)
        .get("/random-route-just-to-test")
        .expect(StatusCodes.NOT_FOUND)
        .then((res) => {
            expect(res.body["success"]).toBe(false);
        });
});

test("PASS: GET, POST: /health-track/patients", () => {
    it("Should return (200 status code, successful response) on getting patients' list", async () => {
        await supertest(app)
        .get("/health-track/patients")
        .expect(StatusCodes.OK)
        .then((res) => {
            expect(JSON.parse(res.text).success).toBe(true);
        });
    });

    const patientData: {patient_name: string, patient_national_id: string} = {
        patient_name : "Patient Name",
        patient_national_id: "9057654321123456"
    }

    it("Should return (201 status code, successful response) on creating a new patient", async () => {
        await supertest(app)
        .post("/health-track/patients")
        .send(patientData)
        .expect(StatusCodes.CREATED)
    });
})

test("FAIL: POST: /health-track/patients", () => {
    const patientData: {integer_id: number} = {
        integer_id: 123
    }

    it("Should return (201 status code, successful response) on creating a new patient", async () => {
        await supertest(app)
        .post("/health-track/patients")
        .send(patientData)
        .expect(StatusCodes.BAD_REQUEST)
    });
})


test("GET patient by id: health-track/patient/:patient_id", async () => {
    await supertest(app)
    .get("/health-track/patient/1")
    .expect(StatusCodes.OK)
});

test("PUT update patient by id", async () => {
    const patientData: {patient_name: string, patient_national_id: string} = {
        patient_name : "Patient Name Updated",
        patient_national_id: "9057654321123890"
    }
    await supertest(app)
    .put("/health-track/patient/1")
    .send(patientData)
    .expect(StatusCodes.OK)
});