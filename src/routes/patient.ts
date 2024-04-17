import * as express from "express";
import * as patientController from "../controllers/patient";
const router = express.Router();
const { getPatients, addPatient } = patientController;

router.get("/:username", getPatients);
router.post("", addPatient);

export { router as patientRouter };
