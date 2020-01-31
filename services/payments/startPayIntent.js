import stripePackage from "stripe";
import { calculateCost } from "../../libs/billing-lib";
import { success, failure } from "../../libs/response-lib";

export async function main(event, context) {
  const { slots } = JSON.parse(event.body);
  const amount = calculateCost(slots);

  // Load our secret key from the  environment variables
  const stripe = stripePackage(process.env.stripeSecretKey);

  try {
    const secret = await stripe.paymentIntents.create({
      amount: amount,
      currency: "gbp"
    });
    return success({ status: true, secret: secret });
  } catch (e) {
    console.error(e);
    return failure({ message: e.message });
  }
}
