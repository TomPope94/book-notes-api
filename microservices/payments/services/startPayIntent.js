import stripePackage from 'stripe';
import { calculateCost } from '../../libs/billing-lib';
import * as dynamoDbLib from '../../libs/dynamodb-lib';
import { success, failure } from '../../libs/response-lib';

export async function main(event, context) {
  const { slots } = JSON.parse(event.body);
  const amount = calculateCost(slots);

  // Load our secret key from the  environment variables
  const stripe = stripePackage(process.env.stripeSecretKey);

  try {
    const secret = await stripe.paymentIntents.create({
      amount: amount,
      currency: 'gbp'
    });

    // If the payintent is successful, it needs to register the ID (that comes from stripe) and the customer ID (that comes from the request)
    // in the transactions database
    const params = {
      TableName: process.env.transactionsTableName,
      Item: {
        userId: event.requestContext.identity.cognitoIdentityId,
        paymentId: secret.id,
        slotsPurchased: slots,
        paymentStatus: 'started'
      }
    };

    await dynamoDbLib.call('put', params);

    return success({ status: true, secret: secret, dbItem: params.Item });
  } catch (e) {
    console.error(e);
    return failure({ message: e.message });
  }
}
