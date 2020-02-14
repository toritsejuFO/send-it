import Parcel from './parcelsModel';

export default class ParcelsService {
  static createDeliveryOrder = async (newParcelOrder) => {
    const parcel = new Parcel();
    await parcel.create(newParcelOrder);
    if (parcel.hasError()) {
      console.log(parcel.getErrorStack());
      throw new Error('Unable to create parcel delivery order');
    }
    return parcel.getDetails()[0];
  }

  static toFloat = (data) => parseFloat(data)
}
