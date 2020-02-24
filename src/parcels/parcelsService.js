import Parcel from './parcelsModel';
import logger from '../../logger';

const { errorLogger } = logger;

export default class ParcelsService {
  static createDeliveryOrder = async (newParcelOrder) => {
    const parcel = new Parcel();
    await parcel.create(newParcelOrder);

    if (parcel.hasError()) {
      errorLogger.error(parcel.getErrorStack(), { file: __filename });
      throw new Error('Unable to create parcel delivery order');
    }

    return parcel.getDetails()[0];
  }


  static findByIdAndUserId = async (parcelId, userId) => {
    const parcel = new Parcel();
    await parcel.findByIdAndUserId(parcelId, userId);

    if (parcel.hasError()) {
      errorLogger.error(parcel.getErrorStack(), { file: __filename });
      throw new Error('Unable to find parcel');
    }

    if (!parcel.getCount()) {
      return false;
    }

    return parcel.getDetails()[0];
  }

  static findAllByUserId = async (userId) => {
    const parcel = new Parcel();
    await parcel.findAllByUserId(userId);

    if (parcel.hasError()) {
      errorLogger.error(parcel.getErrorStack(), { file: __filename });
      throw new Error('Unable to find parcels');
    }

    if (!parcel.getCount()) {
      return false;
    }

    return parcel.getDetails();
  }

  static deleteByIdAndUserId = async (parcelId, userId) => {
    const parcel = new Parcel();
    await parcel.deleteByIdAndUserId(parcelId, userId);

    if (parcel.hasError()) {
      errorLogger.error(parcel.getErrorStack(), { file: __filename });
      throw new Error('Unable to cancel delivery');
    }

    if (!parcel.getCount()) {
      return false;
    }

    return parcel.getDetails()[0];
  }

  static toFloat = (data) => parseFloat(data)
}
