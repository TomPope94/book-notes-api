import * as dynamoDbLib from '../../libs/dynamodb-lib';
import { success, failure } from '../../libs/response-lib';

export async function main(event, context) {
  const data = JSON.parse(event.body);
  const params = {
    TableName: process.env.booksTableName,
    Key: {
      userId: event.requestContext.identity.cognitoIdentityId,
      bookId: event.pathParameters.id
    },
    UpdateExpression: 'SET bookNotes = :bookNotes',
    ExpressionAttributeValues: {
      ':bookNotes': {
        notesCreated: data.bookNotes.notesCreated || null,
        notesContent: data.bookNotes.notesContent || null,
        notesLastEdited: data.bookNotes.notesLastEdited || null,
        notesNumEdited: data.bookNotes.notesNumEdited || null
      }
    },
    // 'ReturnValues' specifies if and how to return the item's attributes,
    // where ALL_NEW returns all attributes of the item after the update; you
    // can inspect 'result' below to see how it works with different settings
    ReturnValues: 'ALL_NEW'
  };

  try {
    await dynamoDbLib.call('update', params);
    return success({ status: true });
  } catch (e) {
    console.error(e);
    return failure({ status: false });
  }
}
