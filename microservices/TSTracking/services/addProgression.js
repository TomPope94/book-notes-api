import { success, failure } from '../../libs/response-lib';
import { updateBookProgress } from '../../libs/bookTS-lib';

export async function main(event, context) {
  const data = JSON.parse(event.body);

  try {
    const res = await updateBookProgress(
      event.requestContext.identity.cognitoIdentityId,
      event.pathParameters.id,
      data
    );

    return success(res);
  } catch (e) {
    console.log(e);
    return failure({ status: false });
  }
}
