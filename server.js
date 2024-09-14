/** @format */

const express = require("express");
const request = require("request");
const bodyParser = require("body-parser");
const app = express();

const CHIPPS = [
  {
    apiKey: "live_c393ed29-b034-4a05-963c-49686ee07c9a",
    applicationId: 13211,
  },
  {
    apiKey: "live_6824536e-e3cd-441e-a4fc-d885b5c2aacd",
    applicationId: 13212,
  },
  {
    apiKey: "live_f30be7b4-dbca-44ef-b4e9-17908bda455a",
    applicationId: 13213,
  },
];

// Middleware to parse JSON bodies
app.use(bodyParser.json());

app.post("/proxy/chat", (req, res) => {
  res.setHeader("Access-Control-Allow-Credentials", true);
  res.setHeader("Access-Control-Allow-Origin", "https://howtoai.tech");
  // another common pattern
  // res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,OPTIONS,PATCH,DELETE,POST,PUT"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
  );
  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }
  const { number, messageList } = req.body;

  const applicationId = CHIPPS[number].applicationId;
  const apiKey = CHIPPS[number].apiKey;
  // Validate the incoming request body
  console.log(req.body);
  if (
    typeof applicationId !== "number" ||
    typeof apiKey !== "string" ||
    !Array.isArray(messageList)
  ) {
    return res.status(400).json({
      error: "Bad Request",
      message: [
        "messageList must be an array",
        "apiKey must be a string",
        "applicationId must be a number conforming to the specified constraints",
      ],
      statusCode: 400,
    });
  }
  console.log(applicationId, apiKey, messageList);
  // Forward the request to the external API
  request.post(
    {
      url: "https://api.chipp.ai/chat",
      json: {
        applicationId,
        apiKey,
        messageList,
      },
    },
    (error, response, body) => {
      if (error) {
        return res.status(500).send("Server Error");
      }

      res.status(200).json(body);
    }
  );
});

app.listen(3008, () => {
  console.log("Proxy server running on port 3008");
});
