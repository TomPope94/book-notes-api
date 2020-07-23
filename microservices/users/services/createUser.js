import * as dynamoDbLib from "../../libs/dynamodb-lib";
import { success, failure } from "../../libs/response-lib";

export async function main(event, context) {
  const data = JSON.parse(event.body);

  const params = {
    TableName: process.env.usersTableName,
    Item: {
      userId: event.requestContext.identity.cognitoIdentityId,
      email: data.email,
      bookLimit: 3,
      onboard: false,
      firstLogin: true,
      displayName: "NA"
    }
  };

  try {
    await dynamoDbLib.call("put", params);
    return success(params.Item);
  } catch (e) {
    console.error(e);
    return failure({ status: false });
  }
}
