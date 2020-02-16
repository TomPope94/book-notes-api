import * as billingLib from '../../libs/billing-lib';
import { success, failure } from '../../libs/response-lib';

export async function main(event, context) {
  try {
    const eventData = JSON.parse(event.body);

    // need a switch for the type
    switch (eventData.type) {
      case 'payment_intent.succeeded':
        // find the PI_Id in the transactions DB
        const paymentData = await billingLib.getTransactionData(
          eventData.data.object.id
        );

        // change the status to succeeded
        const editPaymentStatus = await billingLib.editTransactionStatus(
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
      default:
        return failure();
    }

    return success({ received: true });
  } catch (e) {
    console.error(e);
    return failure({ message: e.message });
  }
}
