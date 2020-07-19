import * as dynamoDbLib from '../../libs/dynamodb-lib';
import { success, failure } from '../../libs/response-lib';
import moment from 'moment';

export async function main(event, context) {
  const data = JSON.parse(event.body);
  const dateVar = moment(data.datePlanned, 'YYYYMMDD').format('YYYYMMDD');
  const dateNum = parseInt(dateVar);

  const params = {
    TableName: process.env.booksTableName,
    Key: {
      userId: event.requestContext.identity.cognitoIdentityId,
      bookId: event.pathParameters.id,
    },
    UpdateExpression: 'SET datePlanned = :datePlanned',
    ExpressionAttributeValues: {
      ':datePlanned': dateNum,
    },
    ReturnValues: 'ALL_NEW',
  };

  try {
    await dynamoDbLib.call('update', params);
    return success({ status: true });
  } catch (e) {
    return failure({ status: false });
  }
}
