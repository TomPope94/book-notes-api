import stripePackage from 'stripe';
import { success, failure } from '../../libs/response-lib';

export async function main(event, context) {
  const paymentId = JSON.parse(event.body);

  // Load our secret key from the  environment variables
  const stripe = stripePackage(process.env.stripeSecretKey);

  try {
    // need to cancel the payment in stripe
    const secret = await stripe.paymentIntents.cancel(paymentId);
    // webhook will handle changing the transactions table

    return success({ status: true, secret: secret });
  } catch (e) {
    console.error(e);
    return failure({ message: e.message });
  }
}
