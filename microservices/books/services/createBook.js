import uuid from 'uuid';
import moment from 'moment';
import * as dynamoDbLib from '../../libs/dynamodb-lib';
import { success, failure } from '../../libs/response-lib';

export async function main(event, context) {
  const data = JSON.parse(event.body);
  let dateVar;
  if (data.date) {
    dateVar = moment(data.date, 'YYYYMMDD').format('YYYYMMDD');
  } else {
    dateVar = moment().format('YYYYMMDD');
  }
  const dateNum = parseInt(dateVar);
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
      bookState: data.bookState,
      dateCreated: dateNum,
    },
  };

  try {
    await dynamoDbLib.call('put', params);
    return success(params.Item);
  } catch (e) {
    return failure({ status: false });
  }
}
