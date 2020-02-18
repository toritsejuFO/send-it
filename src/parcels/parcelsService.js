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


  static findById = async (parcelId) => {
    const parcel = new Parcel();
    await parcel.findById(parcelId);

    if (parcel.hasError()) {
      errorLogger.error(parcel.getErrorStack(), { file: __filename });
      throw new Error('Unable to find parcel');
    }

    if (!parcel.getCount()) {
      return false;
    }

    return parcel.getDetails()[0];
  }

  static toFloat = (data) => parseFloat(data)
}
