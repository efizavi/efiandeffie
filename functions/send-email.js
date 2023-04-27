const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

exports.handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ message: 'Method not allowed' }),
    };
  }

  const data = JSON.parse(event.body);

  const email = {
    to: data.to,
    from: data.from,
    subject: data.subject,
    text: data.text,
    html: data.html,
  };

  try {
    await sgMail.send(email);
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Email sent' }),
    };
  } catch (error) {
    console.log('API KEY: '+process.env.SENDGRID_API_KEY);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: error.message }),
    };
  }
};