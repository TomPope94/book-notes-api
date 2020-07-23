import * as dynamoDbLib from "../../libs/dynamodb-lib";
import { success, failure } from "../../libs/response-lib";

export async function main(event, context) {
  const data = JSON.parse(event.body);

  const params = {
    TableName: process.env.usersTableName,
    Key: {
      userId: event.requestContext.identity.cognitoIdentityId
    },
    // 'UpdateExpression' defines the attributes to be updated
    // 'ExpressionAttributeValues' defines the value in the update expression
    UpdateExpression:
      "SET bookLimit = :bookLimit, firstLogin = :firstLogin, email = :email, onboard = :onboard, displayName = :displayName",
    ExpressionAttributeValues: {
      ":bookLimit": data.bookLimit || null,
      ":displayName": data.displayName || null,
      ":firstLogin": data.firstLogin || null,
      ":email": data.email || null,
      ":onboard": data.onboard || null
    },
    // 'ReturnValues' specifies if and how to return the item's attributes,
    // where ALL_NEW returns all attributes of the item after the update; you
    // can inspect 'result' below to see how it works with different settings
    ReturnValues: "ALL_NEW"
  };

  try {
    await dynamoDbLib.call("update", params);
    return success({ status: true });
  } catch (e) {
    console.error(e);
    return failure({ status: false });
  }
}
