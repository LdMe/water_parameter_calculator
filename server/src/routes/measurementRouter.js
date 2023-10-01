import { Router } from 'express';
import measurementController from "../controllers/measurementController.js";

const router = Router();

router.get('/:parameterName', measurementController.getMeasurementsByParameter);

router.get('/location/:locationName', measurementController.getMeasurementsByLocation);

router.get('/', measurementController.getMeasurementsByUser);

router.post('/', measurementController.createMeasurement);

router.get('/:id', measurementController.getMeasurement);

router.delete('/:parameterName', measurementController.deleteMeasurement);

export default router;

