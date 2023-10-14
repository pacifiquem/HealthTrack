import express, { Router } from "express";

import { getAllPatients, getPatientById, createNewPatient, updatePatient ,createNewRecord, getAllRecords, getAllRecordsForUser } from "../controllers/healthTrack.controller"

const router:Router = express.Router();

router.route("/patients")
        .get(getAllPatients)
        .post(createNewPatient);

router.route("/patient/:patient_id")
        .get(getPatientById)
        .put(updatePatient);

router.route("/record")
        .get(getAllRecords)
        .post(createNewRecord);

router.route("/patient-record/:patient_id").get(getAllRecordsForUser)

export default router