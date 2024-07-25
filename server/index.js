const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const twilio = require("twilio");
require("dotenv").config();

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const client = twilio(process.env.Account_SID, process.env.Auth_Token);

app.get("/token", (req, res) => {
  const identity = req.query.identity;

  if (!identity) {
    return res.status(500).send({ error: "Identity is required" });
  }

  const chatGrant = new twilio.jwt.AccessToken.ChatGrant({
    serviceSid: process.env.Service_SID,
  });

  const token = new twilio.jwt.AccessToken(
    process.env.Account_SID,
    process.env.API_Key_SID,
    process.env.API_Key_Secret,
    { identity: identity }
  );

  token.addGrant(chatGrant);

  res.status(200).send({ token: token.toJwt() });
});

app.get("/calling", async (req, res) => {
  console.log(process.env.calling_account_Sid, process.env.callling_authToken);
  const client = twilio(
    process.env.calling_account_Sid,
    process.env.callling_authToken
  );
  const call = await client.calls.create({
    from: "XXXXXXXX",
    to: "xxxxxxxxx",
    url: "http://demo.twilio.com/docs/voice.xml",
  });
  console.log({ call });
});

app.get("/sms", async (req, res) => {
  console.log(process.env.calling_account_Sid, process.env.callling_authToken);
  const client = twilio(
    process.env.calling_account_Sid,
    process.env.callling_authToken
  );
  const call = await client.messages.create({
    from: "XXXXXXXXXXXXX",
    to: "XXXXXXXXXXX",
    body: "Hello From Customer",
  });
  console.log({ call });
});

app.post("/create-task", async (req, res) => {
  try {
    const { conversationSid, identity, department } = req.body;

    const interaction = await client.flexApi.v1.interaction.create({
      channel: {
        type: "chat",
        initiated_by: "customer",
        properties: {
          media_channel_sid: conversationSid,
        },
      },
      routing: {
        properties: {
          workspace_sid: process.env.Workspace_SID, 
          workflow_sid: process.env.Workflow_SID, 
          task_channel_unique_name: "chat",
          reason: "Query Regarding XYZ Role",
          attributes: {
            from: identity,
            conversationSid: conversationSid,
            skills: [department],
          },
        },
      },
    });

    console.log(`Interaction created with SID: ${interaction.sid}`);
    return res.status(200).send({ interaction });

  } catch (error) {
    console.error("Error creating interaction:", error);
    res.status(500).send({ error });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
