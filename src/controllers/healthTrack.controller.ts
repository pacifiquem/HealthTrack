import { Request, Response, NextFunction } from "express";
import db from "../utils/db.utils";
import createHttpError from "http-errors";
import { StatusCodes } from "http-status-codes";
import { SuccessfulApiResponse } from "../common/ApiResponse";
import { getDeduction } from "../utils/helper.utils";
import  { patientSchema, recordSchema } from "../schemas/health-track-joi-schemas.schemas";

const getAllPatients = (req: Request, res: Response, next: NextFunction) => {
    db.all("SELECT * FROM patients", (err, rows) => {
        if (err) {
        console.error(err.message);
        next(createHttpError(StatusCodes.INTERNAL_SERVER_ERROR, "Internal server error"));
        } else {
            res.status(StatusCodes.OK).send(new SuccessfulApiResponse(true, rows));
        }
    });
};

const getPatientById = (req: Request, res: Response, next: NextFunction) => {
    const patient_id = req.params.patient_id;
    db.get("SELECT * FROM patients WHERE id = ?", [patient_id], (err, row) => {
        if (err) {
        console.error(err.message);
        next(createHttpError(StatusCodes.INTERNAL_SERVER_ERROR, "Internal server error"));
        } else if (row) {
            res.status(StatusCodes.OK).send(new SuccessfulApiResponse(true, row));
        } else {
        next(createHttpError(StatusCodes.NOT_FOUND, "Patient not found"));
        }
    });
};

const createNewPatient = (req: Request, res: Response, next: NextFunction) => {

    const { error } = patientSchema.validate(req.body);
    if (error) {
        return next(createHttpError(StatusCodes.BAD_REQUEST, error.details[0].message));
    }

    const { patient_name, patient_national_id } = req.body;

    db.run(
        "INSERT INTO patients (name, national_id) VALUES (?, ?)",
        [patient_name, patient_national_id],
        function (err) {
        if (err) {
            console.log(err);
            next(createHttpError(StatusCodes.BAD_REQUEST, `${err}`));
        } else {
            const patient_id = this.lastID;
            res.status(StatusCodes.CREATED).send(new SuccessfulApiResponse(true, {patient_id}));
        }
        }
    );
};

const updatePatient = (req: Request, res: Response, next: NextFunction) => {
    const patient_id = req.params.patient_id;
    const { error } = patientSchema.validate(req.body);
    if (error) {
        return next(createHttpError(StatusCodes.BAD_REQUEST, error.details[0].message));
    }
    const { patient_name, patient_national_id } = req.body;
    db.run(
        "UPDATE patients SET name = ?, national_id = ? WHERE id = ?",
        [patient_name, patient_national_id, patient_id],
        function (err) {
        if (err) {
            console.error(err.message);
            next(createHttpError(StatusCodes.BAD_REQUEST, `${err.message}`));
        } else {
            res.status(StatusCodes.OK).send(new SuccessfulApiResponse(true, this))
        }
        }
    );
};

const createNewRecord = (req: Request, res: Response, next: NextFunction) => {
    const { error } = recordSchema.validate(req.body);
    if (error) {
      return next(createHttpError(StatusCodes.BAD_REQUEST, error.details[0].message));
    }  
    const { patient_id, body_temperature, heart_rate } = req.body;
    const deduction:string = getDeduction(body_temperature, heart_rate);

    db.run(
        "INSERT INTO records (patient_id, body_temperature, heart_rate, deduction) VALUES (?, ?, ?, ?)",
        [patient_id, body_temperature, heart_rate, deduction],
        function (err) {
            if (err) {
                console.error(err.message);
                next(createHttpError(StatusCodes.BAD_REQUEST, `${err.message}`));
            } else {
                const record_id = this.lastID;
                res.status(StatusCodes.CREATED).send(new SuccessfulApiResponse(true, { record_id }));
            }
        }
    );
};

const getAllRecords = (req: Request, res: Response, next: NextFunction) => {
  db.all("SELECT * FROM records", (err, rows) => {
    if (err) {
      console.error(err.message);
      next(createHttpError(StatusCodes.INTERNAL_SERVER_ERROR, "Internal server error"));
    } else {
      res.status(StatusCodes.OK).send(new SuccessfulApiResponse(true, rows));
    }
  });
};

const getAllRecordsForUser = (req: Request, res: Response, next: NextFunction) => {
    const patientId = req.params.patient_id;

    db.all(
      "SELECT * FROM records WHERE patient_id = ?",
      [patientId],
      (err, rows) => {
        if (err) {
          console.error(err.message);
          next(createHttpError(StatusCodes.INTERNAL_SERVER_ERROR, "Internal server error"));
        } else {
            res.status(StatusCodes.OK).send(new SuccessfulApiResponse(true, rows));
        }
      }
    );
};

export {
  getAllPatients,
  getPatientById,
  createNewPatient,
  updatePatient,
  createNewRecord,
  getAllRecords,
  getAllRecordsForUser
};
