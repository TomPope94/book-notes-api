import * as billingLib from '../../libs/billing-lib';
import { success, failure } from '../../libs/response-lib';

export async function main(event, context) {
  try {
    const eventData = JSON.parse(event.body);

    // need a switch for the type
    let paymentData, editPaymentStatus;

    switch (eventData.type) {
      case 'payment_intent.succeeded':
        // find the PI_Id in the transactions DB
        paymentData = await billingLib.getTransactionData(
          eventData.data.object.id
        );

        // change the status to succeeded
        editPaymentStatus = await billingLib.editTransactionStatus(
          paymentData,
          'success'
        );

        if (editPaymentStatus) {
          // get the corresponding UserId and Slots
          const userData = await billingLib.getCustomerData(paymentData.userId);

          // add slots to the bookLimit of the corresponding UserId in the users DB
          await billingLib.editCustomerLimit(
            userData,
            paymentData.userId,
            paymentData.slotsPurchased
          );
        }
        break;
      case 'payment_intent.payment_failed':
        paymentData = await billingLib.getTransactionData(
          eventData.data.object.id
        );

        // change the status to succeeded
        editPaymentStatus = await billingLib.editTransactionStatus(
          paymentData,
          'failed'
        );
        break;
      case 'payment_intent.canceled':
        paymentData = await billingLib.getTransactionData(
          eventData.data.object.id
        );

        // change the status to succeeded
        editPaymentStatus = await billingLib.editTransactionStatus(
          paymentData,
          'canceled'
        );
        break;
      default:
        return failure();
    }

    return success({ received: true });
  } catch (e) {
    console.error(e);
    return failure({ message: e.message });
  }
}
