import stripePackage from "stripe";
import { calculateCost } from "../../libs/billing-lib";
import { success, failure } from "../../libs/response-lib";

export async function main(event, context) {
  const { slots, source } = JSON.parse(event.body);
  const amount = calculateCost(slots);
  const description = "Book slots";

  // Load our secret key from the  environment variables
  const stripe = stripePackage(process.env.stripeSecretKey);

  try {
    await stripe.paymentIntents.create({
      source,
      amount: amount,
      description,
      currency: "gbp"
    });
    return success({ status: true });
  } catch (e) {
    return failure({ message: e.message });
  }
}
