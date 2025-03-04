const express = require("express");
const bodyParser = require("body-parser");
const { google } = require("googleapis");
const { PassThrough } = require("stream");
const multer = require("multer");
const cors = require("cors");
require('dotenv').config();


// const {
//   listlables,
//   sendEmail,
//   readEmail,
// } = require("./services/gamilApiServices");
const {
  insertUser,
  checkUserIfExist,
} = require("./services/dynamoDbApiServices");

const app = express();
const { jwtDecode } = require("jwt-decode");
const dynamodbAuth = require("./services/awsApiAuthService");

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Start the Express server
const PORT = process.env.PORT || 3002;



const SCOPE = [
  "https://www.googleapis.com/auth/gmail.readonly",
  "https://www.googleapis.com/auth/gmail.send",
  "https://www.googleapis.com/auth/drive",
  "https://www.googleapis.com/auth/userinfo.email",
  "https://www.googleapis.com/auth/userinfo.profile",
];

const checkInput = (to, subject, body) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const scriptRegex = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi;

  if (!emailRegex.test(to)) {
    return { valid: false, message: "Invalid email address" };
  }

  if (scriptRegex.test(subject) || scriptRegex.test(body)) {
    return { valid: false, message: "Scripts are not allowed in the subject or body" };
  }

  return { valid: true, message: "Input is valid" };
}

app.get("/api/auth", async (req, res) => {
  
  const oauth2Client = new google.auth.OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,  
    process.env.REDIRECT_URI
  );
  const url = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: SCOPE,
    
  });

  console.log(`this is link${url}`);

  res.json({ authUrl: url });
});



app.get("/oauth2callback", async (req, res) => {

  const oauth2Client = new google.auth.OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,  
    process.env.REDIRECT_URI
    
  );
  console.log('I am Here');
  const code = req.query.code;
  console.log('I am Here1');

  if (!code) {
    return res.redirect("http://10.24.211.62:3000?error=NoAuthorizationCode");
  }

  try {
    console.log('I am Here2ß');
    // Exchange auth code for access and refresh tokens
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    console.log("Tokens acquired:", tokens);

    let id;
    if (tokens.refresh_token) {
      console.log("Refresh Token:", tokens.refresh_token);
      id = jwtDecode(tokens.id_token);
      console.log(`This is ID Token: ${JSON.stringify(id)}`);
      const DbAuth = await dynamodbAuth();

      const data = {
        name: id.name,
        email: id.email,
        refresh_token: tokens.refresh_token,
        id_token: tokens.id_token,
      };

      userdata = await insertUser(data, DbAuth);
    } else {
      console.log("User Exist");
      id = jwtDecode(tokens.id_token);
    }

    // Redirect to dashboard with tokens as query parameters
    return res.redirect(
      `http://10.24.211.62:3000/dashboard?access_token=${tokens.access_token}&id_token=${tokens.id_token}`
    );
  } catch (error) {
    console.error("Error retrieving access token", error); 
    return res.redirect("http://10.24.211.62:3000?error=AuthFailed");
  }
});

app.post("/api/insert-user", async (req, res) => {
  try {
    const { refresh_token, id_token } = req.body;
    if (!refresh_token || !id_token) {
      return res.status(400).json({ error: "Missing required fields: refresh_token, id_token" });
    }

    const decodedToken = jwtDecode(id_token);
    const { name, email } = decodedToken;

    const DbAuth = await dynamodbAuth();
    

    const data = { name, email, refresh_token, id_token };

    let result;
   
      // Insert user
      result = await insertUser(data, DbAuth);
    

    res.json({ success: true, message: "User processed successfully", result });
  } catch (error) {
    console.error("Error processing user:", error);
    res.status(500).json({ error: "Failed to process user" });
  }
});

app.get("/api/auth/refresh", async (req, res) => {
  const id_token = req.headers.authorization?.split(" ")[1] || null;
  if (!id_token) {
    return res.status(400).json({ error: "No ID Token provided" });
  }
  const id = jwtDecode(id_token);
  const DbAuth = await dynamodbAuth();
  const email = id.email;
  const data = await checkUserIfExist(DbAuth,email);
  if (!data) {
    return res.status(404).json({ error: "User not found" });
  }
  const refresh_token = data.refresh_token;
  if (!refresh_token) {
    return res.status(400).json({ error: "No refresh token available" });
  }
  const oauth2Client = new google.auth.OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,  
    );
  oauth2Client.setCredentials({ refresh_token });

  try{
    const {credentials} = await oauth2Client.refreshAccessToken();
    console.log('New Access Token:', credentials.access_token);
    res.json({new_access_token: credentials});
  }
  catch(error){
    console.error('Error refreshing token', error);
    res.status(500).send('Error refreshing token');
  }

});
  



// Endpoint to generate a new refresh token
app.get('/api/auth/newRefreshToken', async (req, res) => {
  const oauth2Client = new google.auth.OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,  
    process.env.REDIRECT_URI
  );
  try {
    const url = oauth2Client.generateAuthUrl({
      access_type: "offline",
      scope: SCOPE,
      prompt:'consent', 
    });

    console.log(`this is link${url}`);

  res.json({ authUrl: url });

  
  

    // const { refresh_token } = oauth2Client.credentials;

    // if (!refresh_token) {
    //   return res.status(400).send('No refresh token available');
    // }

    // const { tokens } = await oauth2Client.refreshToken(refresh_token);
    // oauth2Client.setCredentials(tokens);

    // console.log('New Refresh Token:', tokens.refresh_token);

    // res.json({ new_refresh_token: tokens });
  } catch (error) {
    console.error('Error refreshing token', error);
    res.status(500).send('Error refreshing token');
  }
});




// Route to list Gmail labels
app.get("/api/labels", async (req, res) => {
  const oauth2Client = new google.auth.OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,  
    process.env.REDIRECT_URI
    
  );
  
  const access_token = req.headers.authorization?.split(" ")[1] || null;

  try {
    // OAuth2 client has credentials check
    oauth2Client.setCredentials({
      access_token:access_token 
    });


    if (!oauth2Client.credentials || !oauth2Client.credentials.access_token) {
        return res.status(401).json({ error: "Unauthorized. Please authenticate first." });
    }

    // initialize Gmail API
    const gmail = google.gmail({ version: 'v1', auth: oauth2Client });

    // Fetch Labels
    const response = await gmail.users.labels.list({ userId: 'me' });

    res.json(response.data); // Return labels to client
} catch (error) {
  console.error('Error fetching Gmail labels:', error.response.statusText);
  res.status(500).json({ message:error.response.statusText,
    error:"failed to fetch Gmails labels"
   });
}
});

// Route to send an email
app.post("/api/send-email", async (req, res) => {
  const oauth2Client = new google.auth.OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,  
    process.env.REDIRECT_URI
    
  );
 
  const access_token = req.headers.authorization?.split(" ")[1] || null;


  try {
    const { to, subject, body } = req.body; 

    if (!to || !subject || !body) {
        return res.status(400).json({ error: "Missing required fields: to, subject, body" });
    }
    const validate=checkInput(to , subject ,body);
    if(!validate.valid){
      return res.status(400).json({ error: validate.message });
    }
    oauth2Client.setCredentials({
      
      access_token:access_token 
    });

    // OAuth2 client has credentials
    if (!oauth2Client.credentials || !oauth2Client.credentials.access_token) {
        return res.status(401).json({ error: "Unauthorized. Please authenticate first." });
    }

    //  raw email message in Base64
    const message = [
        `To: ${to}`,
        "From: me",
        `Subject: ${subject}`,
        "MIME-Version: 1.0",
        "Content-Type: text/html; charset=UTF-8",
        "",
        body // Supports HTML content
    ].join("\n");

    const encodedMessage = Buffer.from(message).toString("base64").replace(/\+/g, '-').replace(/\//g, '_');

    // initialize Gmail API
    const gmail = google.gmail({ version: 'v1', auth: oauth2Client });

    // Send the email
    const response = await gmail.users.messages.send({
        userId: 'me',
        requestBody: {
            raw: encodedMessage
        }
    });

    res.json({ success: true, messageId: response.data.id });

} catch (error) {
  console.error('Error Sending Gmail :', error.response.statusText);
  res.status(500).json({ message: error.response.statusText,
    error:"failed to fetch Gmails"
   });
}
});

// Route to read the latest email
app.get("/api/read-email", async (req, res) => {
  
  const oauth2Client = new google.auth.OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,  
    process.env.REDIRECT_URI
  );

  
  
  const access_token = req.headers.authorization?.split(" ")[1] || null;
  
  try {
    oauth2Client.setCredentials({
      access_token: access_token 
    });

    // OAuth2 client has credentials check
    if (!oauth2Client.credentials || !oauth2Client.credentials.access_token) {
        return res.status(401).json({ error: "Unauthorized. Please authenticate first." });
    }

    const gmail = google.gmail({ version: 'v1', auth: oauth2Client });

    const messagesResponse = await gmail.users.messages.list({
        userId: 'me',
        maxResults: 100, // Fetch only 100 emails
    });
    console.log(` this is test in node server ${JSON.stringify(messagesResponse.data.messages)}`);

    

    if (!messagesResponse.data.messages) {
        console.log('No emails found');
        return res.json({ emails: [] }); 
    }

    // Fetch emails and their labels
    const emails = await Promise.all(
        messagesResponse.data.messages.map(async (msg) => {
            const message = await gmail.users.messages.get({
                userId: 'me',
                id: msg.id,
            });

            const headers = message.data.payload.headers;
            const subject = headers.find(header => header.name === "Subject")?.value || "No Subject";
            const title = headers.find(header => header.name === "From")?.value || "No Title";
            
            // Extract body 
            let body = "No Body";
            if (message.data.payload.body && message.data.payload.body.data) {
                body = Buffer.from(message.data.payload.body.data, 'base64').toString("utf-8");
            } else if (message.data.payload.parts) {
                const part = message.data.payload.parts.find(p => p.mimeType === "text/html");
                if (part && part.body && part.body.data) {
                    body = Buffer.from(part.body.data, 'base64').toString("utf-8");
                }
            }

            // Extract labels
            const labels = message.data.labelIds || [];

            return { title, subject, body, labels };
        })
    );

    // Send response
    res.json({ emails });

  } catch (error) {
    console.error('Error reading Gmail:', error.response?.statusText || error.message);
    res.status(500).json({ message: error.response?.statusText || "Internal Server Error", error: "Failed to read Gmails" });
  }
});

app.get("/drive-files", async (req, res) => {
  try {
      const authHeader = req.headers.authorization;
      if (!authHeader) {
          return res.status(401).json({ error: "Missing Authorization Header" });
      }
      const accessToken = authHeader.split(" ")[1]; // Extract token
      if (!accessToken) {
          return res.status(401).json({ error: "Invalid Token" });
      }
      const oauth2Client = new google.auth.OAuth2();
      oauth2Client.setCredentials({ access_token: accessToken });
      const drive = google.drive({ version: "v3", auth: oauth2Client });
      const response = await drive.files.list({ pageSize: 10, fields: "files(id, name, webViewLink, webContentLink)" });
      console.log("Files:", response.data.files);
      res.json({ files: response.data.files });
  } catch (error) {
      console.error("Error fetching drive files:", error);
      res.status(500).json({ error: error.message });
  }
})

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
app.post("/upload-file", upload.single("file"), async (req, res) => {
    try {
      const token = req.headers.authorization?.split(" ")[1]; // Extract Bearer token
      if (!token) return res.status(401).json({ error: "User token is required" });
      // Create OAuth2 Client using token
      const oauth2Client = new google.auth.OAuth2();
      oauth2Client.setCredentials({ access_token: token });
      // Create Google Drive client with OAuth2 authentication
      const drive = google.drive({ version: "v3", auth: oauth2Client });
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }
      const { mimetype, originalname, buffer } = req.file;
      const fileStream = new PassThrough();
      fileStream.end(buffer);
      // Upload file using the authenticated client
      const response = await drive.files.create({
        requestBody: { name: originalname ,mimeType: mimetype },
        media: { mimeType: mimetype, body: fileStream },
      });
      if (response) {
        res.json({ message: "File uploaded successfully", result: response.data });
      } else {
        res.status(500).json({ error: "Failed to upload file" });
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      res.status(500).json({ error: error.message });
    }
});

app.post("/delete-file", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if(!token) return res.status(401).json({ error: "User token is required" });
    const { fileId } = req.body;
    if(!fileId) return res.status(400).json({ error: "File ID is required" });
    const oauth2Client = new google.auth.OAuth2();
    oauth2Client.setCredentials({ access_token: token });
    const drive = google.drive({ version: "v3", auth: oauth2Client });
    await drive.files.delete({ fileId });
    res.json({ message: "File deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/update-file", async (req, res) => {
  try {
    const drive = getDriveClient();
    const { fileId, newFileName } = req.body;
    const response = await drive.files.update({ fileId, resource: { name: newFileName } });
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});





// Start server listening on the specified port
if(require.main === module){
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
}
module.exports = {app};

