import {Router} from 'express';

import parameterController from '../controllers/parameterController.js';

const router = Router();

router.get('/', parameterController.getParameters);
router.post('/', parameterController.createParameter);
router.get('/byname/:parameterName', parameterController.getParameterByName);
router.get('/:parameterId', parameterController.getParameter);

router.delete('/:parameterId', parameterController.deleteParameter);
router.put('/:parameterId', parameterController.updateParameter);

export default router;
