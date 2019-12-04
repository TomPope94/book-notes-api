import { success, failure } from "../../libs/response-lib";
import * as dynamoDbLib from "../../libs/dynamodb-lib";

export async function main(event, context) {
  const bookId = event.pathParameters.id;
  const userId = event.requestContext.identity.cognitoIdentityId;

  const params = {
    TableName: process.env.timeSeriesTableName,
    KeyConditionExpression:
      "userId = :userId and begins_with(bookId_date, :bookId)",
    ExpressionAttributeValues: {
      ":userId": userId,
      ":bookId": bookId
    }
  };

  try {
    const result = await dynamoDbLib.call("query", params);
    return success(result.Items);
  } catch (e) {
    return failure({ status: false });
  }
}
