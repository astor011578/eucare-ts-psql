import * as express from "express";
import * as appointmentController from "../controllers/appointment";
const router = express.Router();
const { addAppointment } = appointmentController;

router.post("/:username", addAppointment);

export { router as appointmentRouter };
