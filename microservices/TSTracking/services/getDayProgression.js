import { success, failure } from "../../libs/response-lib";
import * as dynamoDbLib from "../../libs/dynamodb-lib";

export async function main(event, context) {
  const data = JSON.parse(event.body);
  const userId = event.requestContext.identity.cognitoIdentityId;

  const params = {
    TableName: process.env.timeSeriesTableName,
    IndexName: "userId-observedDate-index",
    KeyConditionExpression: "userId = :userId and observedDate= :dateCheck",
    ExpressionAttributeValues: {
      ":userId": userId,
      ":dateCheck": data.date
    }
  };

  try {
    const result = await dynamoDbLib.call("query", params);
    return success(result.Items);
  } catch (e) {
    console.log(e);
    return failure({ status: false });
  }
}
