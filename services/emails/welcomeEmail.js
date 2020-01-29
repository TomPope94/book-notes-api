import AWS from 'aws-sdk';
// AWS.config.update({ region: 'eu-west-1' });

export async function main(event, context) {
  const data = JSON.parse(event.body);

  const params = {
    Destination: {
      ToAddresses: [data.emailAddress]
    },
    Message: {
      Body: {
        Html: {
          Charset: 'UTF-8',
          Data: '<h1>Welcome!</h1>'
        }
      },
      Subject: {
        Charset: 'UTF-8',
        Data: 'Test email'
      }
    },
    Source: 'magnapps.noreply@gmail.com'
  };

  const sendPromise = new AWS.SES({
    region: 'eu-west-1',
    apiVersion: '2010-12-01'
  })
    .sendEmail(params)
    .promise();

  sendPromise
    .then(function(data) {
      console.log(data.MessageId);
    })
    .catch(function(err) {
      console.error(err, err.stack);
    });
}
