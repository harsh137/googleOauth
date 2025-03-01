const request = require("supertest");
const {app} = require("../index");

describe("Google OAuth and Drive API Tests", () => {
  let authToken;

  beforeEach(() => {
    authToken = "your token"  });

  test("GET /api/auth - Should return Google OAuth URL", async () => {
    const res = await request(app).get("/api/auth");
    expect(res.body.authUrl).toBeDefined();
  });

  test("GET /drive-files - Should fail without token", async () => {
    const res = await request(app).get("/drive-files");
    expect(res.statusCode).toBe(401);
    expect(res.body.error).toBe("Missing Authorization Header");
  });

  test("GET /drive-files - Should return files with valid token", async () => {
    const res = await request(app)
      .get("/drive-files")
      .set("Authorization", `Bearer ${authToken}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.files).toBeDefined();
  });

  test("POST /upload-file - Should fail without file", async () => {
    const res = await request(app)
      .post("/upload-file")
      .set("Authorization", `Bearer ${authToken}`);
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe("No file uploaded");
  });

  test("POST /upload-file - Should upload file with valid token and file", async () => {
    const res = await request(app)
      .post("/upload-file")
      .set("Authorization", `Bearer ${authToken}`)
      .attach("file", Buffer.from("test file content"), "testfile.txt");
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("File uploaded successfully");
  });

  test("POST /delete-file - Should fail without file ID", async () => {
    const res = await request(app)
      .post("/delete-file")
      .set("Authorization", `Bearer ${authToken}`)
      .send({});
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe("File ID is required");
  });

  test("POST /delete-file - Should delete file with valid token and file ID", async () => {
    const fileId = "your fildID"; // Replace with a valid file ID for actual testing
    const res = await request(app)
      .post("/delete-file")
      .set("Authorization", `Bearer ${authToken}`)
      .send({ fileId });
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("File deleted");
  });

  test("GET /api/labels - Should fail without token", async () => {
    const res = await request(app).get("/api/labels");
    expect(res.statusCode).toBe(401);
    expect(res.body.error).toBe("Unauthorized. Please authenticate first.");
  });

  test("GET /api/labels - Should return labels with valid token", async () => {
    const res = await request(app)
      .get("/api/labels")
      .set("Authorization", `Bearer ${authToken}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.labels).toBeDefined();
  });

  test("POST /api/send-email - Should fail without required fields", async () => {
    const res = await request(app)
      .post("/api/send-email")
      .set("Authorization", `Bearer ${authToken}`)
      .send({});
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe("Missing required fields: to, subject, body");
  });
  const mockEmailData = [
    { to: "invalid-email", subject: "Test", body: "This is a test email.", error: "Invalid email address" },
    { to: "", subject: "Test", body: "This is a test email.", error: "Missing required fields: to, subject, body" },
    { to: "guptaharsh137@gmail.com", subject: "", body: "This is a test email.", error: "Missing required fields: to, subject, body" },
    { to: "guptaharsh137@gmail.com", subject: "Test", body: "", error: "Missing required fields: to, subject, body" }
  ];

  mockEmailData.forEach(({ to, subject, body, error }) => {
    test(`POST /api/send-email - Should fail with error: ${error}`, async () => {
      const res = await request(app)
        .post("/api/send-email")
        .set("Authorization", `Bearer ${authToken}`)
        .send({ to, subject, body });
      expect(res.statusCode). not.toBe(200);
      expect(res.body.error).toBe(error);
    });
  });

  test("POST /api/send-email - Should send email with valid token and fields", async () => {
    const res = await request(app)
      .post("/api/send-email")
      .set("Authorization", `Bearer ${authToken}`)
      .send({ to: "guptaharsh137@gmail.com", subject: "Test", body: "This is a test email." });
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBeTruthy();
    expect(res.body.messageId).toBeDefined();
  });



  test("GET /api/read-email - Should fail without token", async () => {
    const res = await request(app).get("/api/read-email");
    expect(res.statusCode).toBe(401);
    expect(res.body.error).toBe("Unauthorized. Please authenticate first.");
  });

  test("GET /api/read-email - Should return emails with valid token", () => {
    return request(app)
      .get("/api/read-email")
      .set("Authorization", `Bearer ${authToken}`)
      .expect(200)
      .then((res) => {
        expect(res.body.emails).toBeDefined();
      });
  });

 
});