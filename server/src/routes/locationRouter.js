import { Router } from 'express';
import locationController from '../controllers/locationController.js';


const router = Router();

router.get('/', locationController.getLocations);
router.post('/', locationController.createLocation);
router.get('/:id', locationController.getLocation);
router.delete('/:id', locationController.deleteLocation);
router.put('/:id', locationController.updateLocation);


export default router;

