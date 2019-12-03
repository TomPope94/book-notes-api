import uuid from "uuid";
import * as dynamoDbLib from "../../libs/dynamodb-lib";
import { success, failure } from "../../libs/response-lib";

export async function main(event, context) {
  const data = JSON.parse(event.body);
  const today = new Date();
  const params = {
    TableName: process.env.booksTableName,
    Item: {
      bookId: uuid.v1(),
      userId: event.requestContext.identity.cognitoIdentityId,
      bookTitle: data.title,
      bookAuthor: data.author,
      numPages: data.numPages,
      coverArt: data.coverArt,
      categories: data.categories,
      bookLanguage: data.bookLanguage,
      bookNotes: {},
      bookReview: {},
      bookProgression: {
        pagesRead: 0,
        dateStarted: today.toString()
      }
    }
  };

  try {
    await dynamoDbLib.call("put", params);
    return success(params.Item);
  } catch (e) {
    return failure({ status: false });
  }
}
