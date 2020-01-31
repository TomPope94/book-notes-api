import AWS from "aws-sdk";
const ses = new AWS.SES();
import { success, failure } from "../../libs/response-lib";

export async function main(event, context) {
  const data = JSON.parse(event.body);
  console.log(data);
  console.log(data.emailAddress);
  const params = {
    Source: "magnapps.noreply@gmail.com",
    Destination: {
      ToAddresses: [data.emailAddress]
    },
    Message: {
      Body: {
        Text: {
          Charset: "UTF-8",
          Data: `Message sent from email ${data.emailAddress}`
        }
      },
      Subject: {
        Charset: "UTF-8",
        Data: `You received a message from liberead!`
      }
    }
  };

  try {
    const emailData = await ses.sendEmail(params).promise();
    return success(emailData);
  } catch (err) {
    return failure({ status: false });
  }
}
