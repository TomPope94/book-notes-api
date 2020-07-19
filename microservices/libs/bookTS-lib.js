import * as dynamoDbLib from './dynamodb-lib';
import { failure } from './response-lib';
import moment from 'moment';

// get book progression
export const getBookProgress = async (userId, bookId) => {
  //
  const params = {
    TableName: process.env.booksTableName,
    Key: {
      userId: userId,
      bookId: bookId
    }
  };

  try {
    const result = await dynamoDbLib.call('get', params);
    if (result.Item) {
      // Return the retrieved item
      return result.Item;
    } else {
      return failure({ status: false, error: 'Item not found.' });
    }
  } catch (e) {
    return failure({ status: false });
  }
};

export const updateTSTable = async (userId, bookId, data) => {
  const dateVar = data.date
    ? moment(data.date, 'YYYYMMDD').format('YYYYMMDD')
    : moment().format('YYYYMMDD');

  const dateNum = parseInt(dateVar);

  const params = {
    TableName: process.env.timeSeriesTableName,
    Item: {
      userId: userId,
      bookId_date: `${bookId}_${dateNum}`,
      observedDate: dateNum,
      observable: data.observable,
      metaData: {
        numPages: data.numPages
      }
    }
  };

  try {
    await dynamoDbLib.call('put', params);
    console.log('Added tracking to time series table successfully!');
    return { data: params.Item };
  } catch (e) {
    console.log(e);
    return failure({ status: false });
  }
};

export const updateBookTable = async (userId, bookId, data) => {
  const params = {
    TableName: process.env.booksTableName,
    Key: {
      userId: userId,
      bookId: bookId
    },
    UpdateExpression: 'SET pagesRead = if_not_exists(pagesRead, :start) + :inc',
    ExpressionAttributeValues: {
      ':inc': data.numPages,
      ':start': 0
    },
    // 'ReturnValues' specifies if and how to return the item's attributes,
    // where ALL_NEW returns all attributes of the item after the update; you
    // can inspect 'result' below to see how it works with different settings
    ReturnValues: 'ALL_NEW'
  };

  try {
    await dynamoDbLib.call('update', params);
    console.log('Added pages to book table successfully!');
  } catch (e) {
    console.error(e);
    return failure({ status: false });
  }
};

// update book progression
export const updateBookProgress = async (userId, bookId, data) => {
  const res = await updateTSTable(userId, bookId, data);
  await updateBookTable(userId, bookId, data);
  return res;
};
