import {Router} from 'express';

import parameterController from '../controllers/parameterController.js';

const router = Router();

router.get('/', parameterController.getParameters);
router.post('/', parameterController.createParameter);
router.get('/:id', parameterController.getParameter);
router.delete('/:id', parameterController.deleteParameter);

export default router;
