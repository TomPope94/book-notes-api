import * as dynamoDbLib from './dynamodb-lib';
import { success, failure } from './response-lib';

export function calculateCost(slots) {
  const costPennies = (slots / 2) * (2 * 0.99 + (slots - 1) * -0.1);

  return costPennies * 100;
}

export async function getTransactionData(paymentId) {
  const params = {
    TableName: process.env.transactionsTableName,
    KeyConditionExpression: 'paymentId = :paymentId',
    ExpressionAttributeValues: {
      ':paymentId': paymentId
    }
  };

  try {
    const result = await dynamoDbLib.call('query', params);
    if (result.Items) {
      if (result.Items.length > 1) {
        console.error(
          'There is more than one payment found? That should not be possible...'
        );
      }
      return result.Items[0];
    } else {
      console.error('There was a result but no item...');
    }
  } catch (e) {
    console.error({
      msg: 'There has been an error with the get transaction dynamodb call...',
      error: e
    });
  }
}

export async function editTransactionStatus(eventData, paymentStatus) {
  const params = {
    TableName: process.env.transactionsTableName,
    Key: {
      paymentId: eventData.paymentId,
      userId: eventData.userId
    },
    // 'UpdateExpression' defines the attributes to be updated
    // 'ExpressionAttributeValues' defines the value in the update expression
    UpdateExpression:
      'SET paymentStatus = :paymentStatus, slotsPurchased = :slotsPurchased',
    ExpressionAttributeValues: {
      ':paymentStatus': paymentStatus || null,
      ':slotsPurchased': eventData.slotsPurchased || null
    },
    // 'ReturnValues' specifies if and how to return the item's attributes,
    // where ALL_NEW returns all attributes of the item after the update; you
    // can inspect 'result' below to see how it works with different settings
    ReturnValues: 'ALL_NEW'
  };

  try {
    await dynamoDbLib.call('update', params);
    return true;
  } catch (e) {
    console.error({
      msg: 'something went wrong with changing status dynamoDB call...',
      error: e
    });
    return false;
  }
}

export async function getCustomerData(userId) {
  const params = {
    TableName: process.env.usersTableName,
    Key: {
      userId: userId
    }
  };
  try {
    const result = await dynamoDbLib.call('get', params);
    if (result.Item) {
      // Return the retrieved item
      return result.Item;
    } else {
      console.error('There was a result but no item with the user call...');
    }
  } catch (e) {
    console.error({
      msg: 'there was a problem with the user DB call',
      error: e
    });
  }
}

export async function editCustomerLimit(data, userId, slots) {
  const params = {
    TableName: process.env.usersTableName,
    Key: {
      userId: userId
    },
    // 'UpdateExpression' defines the attributes to be updated
    // 'ExpressionAttributeValues' defines the value in the update expression
    UpdateExpression:
      'SET bookLimit = :bookLimit, firstLogin = :firstLogin, email = :email, onboard = :onboard, displayName = :displayName',
    ExpressionAttributeValues: {
      ':bookLimit': data.bookLimit + slots || null,
      ':displayName': data.displayName || null,
      ':firstLogin': data.firstLogin || null,
      ':email': data.email || null,
      ':onboard': data.onboard || null
    },
    // 'ReturnValues' specifies if and how to return the item's attributes,
    // where ALL_NEW returns all attributes of the item after the update; you
    // can inspect 'result' below to see how it works with different settings
    ReturnValues: 'ALL_NEW'
  };
  try {
    await dynamoDbLib.call('update', params);
    return success({ status: true });
  } catch (e) {
    console.error(e);
    return failure({ status: false });
  }
}
