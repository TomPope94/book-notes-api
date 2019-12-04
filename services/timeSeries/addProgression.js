// import uuid from "uuid";
import * as dynamoDbLib from "../../libs/dynamodb-lib";
import { success, failure } from "../../libs/response-lib";
import moment from "moment";

export async function main(event, context) {
  const data = JSON.parse(event.body);
  let dateVar;
  if (data.date) {
    dateVar = moment(data.date, "YYYYMMDD").format("YYYYMMDD");
  } else {
    dateVar = moment().format("YYYYMMDD");
  }
  const dateNum = parseInt(dateVar);

  const params = {
    TableName: process.env.timeSeriesTableName,
    Item: {
      userId: event.requestContext.identity.cognitoIdentityId,
      bookId_date: `${event.pathParameters.id}_${dateNum}`,
      observedDate: dateNum,
      observable: data.observable,
      metaData: {
        numPages: data.numPages,
        fromPage: data.fromPage,
        toPage: data.toPage
      }
    }
  };

  try {
    await dynamoDbLib.call("put", params);
    return success(params.Item);
  } catch (e) {
    console.log(e);
    return failure({ status: false });
  }
}
