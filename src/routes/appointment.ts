import * as express from "express";
import * as appointmentController from "../controllers/appointment";
const router = express.Router();
const { addAppointment } = appointmentController;

router.post("/appointment", addAppointment);

export { router as appointmentRouter };
