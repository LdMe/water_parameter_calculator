import { Router } from 'express';
import measurementController from "../controllers/measurementController.js";

const router = Router();

router.get('/:parameterName', measurementController.getMeasurementsByParameter);

router.get('/', measurementController.getMeasurementsByUser);

router.post('/', measurementController.createMeasurement);

router.get('/:id', measurementController.getMeasurement);

router.delete('/:id', measurementController.deleteMeasurement);

export default router;

