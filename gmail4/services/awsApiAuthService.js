const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient } = require("@aws-sdk/lib-dynamodb");
require('dotenv').config();
// const  { docClient }=  require  ("./aws-config.js");

async function dynamodbAuth() {
  let client;
  if (client != undefined) {
    return client;
  }

  client = new DynamoDBClient({
    region: "us-east-2",
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
  });
  const docClient = DynamoDBDocumentClient.from(client);
  return docClient;
}
module.exports=dynamodbAuth
