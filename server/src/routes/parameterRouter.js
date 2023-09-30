import {Router} from 'express';

import parameterController from '../controllers/parameterController.js';

const router = Router();

router.get('/', parameterController.getParameters);
router.post('/', parameterController.createParameter);
router.get('/:parameterName', parameterController.getParameter);
router.delete('/:parameterName', parameterController.deleteParameter);
router.put('/:parameterName', parameterController.updateParameter);

export default router;
