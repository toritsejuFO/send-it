import { validationResult } from 'express-validator';
import ParcelsService from './parcelsService';

export default class ParcelsController {
  static createDeliveryOrder = async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400)
        .json({
          status: 400,
          error: errors.errors[0].msg,
        });
    }

    const { body } = req;
    const newParcelOrder = {};
    newParcelOrder.weight = ParcelsService.toFloat(body.weight);
    newParcelOrder.weightmetric = body.weightmetric;
    newParcelOrder.fromaddress = body.from;
    newParcelOrder.toaddress = body.to;
    newParcelOrder.status = 'placed';
    newParcelOrder.placedby = req.user.id;

    const parcel = await ParcelsService.createDeliveryOrder(newParcelOrder);

    return res.status(200).json({
      status: 200,
      data: [{
        id: parcel.id,
        message: 'Order placed',
      }],
    });
  }
}
