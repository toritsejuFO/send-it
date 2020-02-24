import { Router } from 'express';
import ParcelsController from './parcelsController';
import validate from './parcelsSchema';
import { userAuth } from '../middleware/auth';

const ParcelsRouter = Router();

ParcelsRouter.post('/', userAuth, validate.createParcelSchema, ParcelsController.createDeliveryOrder);
ParcelsRouter.get('/', userAuth, ParcelsController.getAllDeliveryOrders);
ParcelsRouter.get('/:id', userAuth, ParcelsController.getDeliveryOrder);

export default ParcelsRouter;
