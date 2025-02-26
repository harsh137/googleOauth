// const dynamodbAuth = require('./awsApiAuthService');

const {  GetCommand, PutCommand } = require("@aws-sdk/lib-dynamodb");
const crypto = require("crypto");



  
  async function insertUser(data,client) {
    
  
    const userId = crypto.randomBytes(8).toString("hex"); // Generate random ID
    const userData = {
        TableName:"user",
        Item:{
            Id: userId,
            name: data.name,
            email: data.email,
            refresh_token: data.refresh_token,
            id_token:data.id_token,
        }
    }
    console.log(`USER DATA1:${JSON.stringify(userData)}`)
  
    try {
      await client.send(new PutCommand(userData));
      console.log("User inserted successfully:", userData);
      return userData;
    } catch (error) {
      console.error("Error inserting user:", error);
    } 
  }

  async function checkUserIfExist(docClient, email){
    const params = { TableName: "user",
        Key: {
          email: email,
        } };
      try {
        const userdata = await docClient.send(new GetCommand(params));
        console.log("Fetched data:", userdata.Item);

        if(userdata.Item){
            console.log("User exist")
            return userdata
        }
        
      } catch (err) {
        console.error("Error fetching data:", err);
      }
  }


//   async function getData(docClient) {
//     const params = { TableName: "user",
//       Key: {
//         Id: 'c713caa574b94599',
//       } };
//     try {
//       const data = await docClient.send(new GetCommand(params));
//       console.log("Fetched data:", data.Item);
//     } catch (err) {
//       console.error("Error fetching data:", err);
//     }
//   };
  
  module.exports = { insertUser,checkUserIfExist };