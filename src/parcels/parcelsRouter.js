import { Router } from 'express';
import ParcelsController from './parcelsController';
import validate from './parcelsSchema';
import { userAuth } from '../middleware/auth';

const ParcelsRouter = Router();

ParcelsRouter.post('/', userAuth, validate.createParcelSchema, ParcelsController.createDeliveryOrder);
ParcelsRouter.get('/', userAuth, ParcelsController.getAllDeliveryOrders);
ParcelsRouter.get('/:id', userAuth, ParcelsController.getDeliveryOrder);
ParcelsRouter.patch('/:id/cancel', userAuth, ParcelsController.cancelDeliveryOrder);

export default ParcelsRouter;
