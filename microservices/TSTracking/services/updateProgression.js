import * as dynamoDbLib from "../../libs/dynamodb-lib";
import { success, failure } from "../../libs/response-lib";

export async function main(event, context) {
  const data = JSON.parse(event.body);
  const bookId = event.pathParameters.id;
  const userId = event.requestContext.identity.cognitoIdentityId;
  const dateNum = parseInt(data.date);

  const params = {
    TableName: process.env.timeSeriesTableName,
    Key: {
      userId: userId,
      bookId_date: `${bookId}_${dateNum}`
    },
    UpdateExpression: "SET metaData = :metaData",
    ExpressionAttributeValues: {
      ":metaData": {
        fromPage: data.fromPage,
        numPages: data.numPages,
        toPage: data.toPage
      }
    },
    ReturnValues: "ALL_NEW"
  };

  try {
    await dynamoDbLib.call("update", params);
    return success({ status: true });
  } catch (e) {
    return failure({ status: false });
  }
}
