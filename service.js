require("dotenv").config();

const client = require("twilio")(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

async function fetchParticipantConversations(chatId) {
  return client.conversations.v1.participantConversations.list({
    identity: chatId,
    serviceSid: process.env.SERVICE_SID,
  });
}

async function findExistingConversation(identity) {
  const conversations = await fetchParticipantConversations(identity);
  let existing = conversations.find(
    (conversation) => conversation.conversationState !== "closed"
  );
  return existing !== undefined ? existing.conversationSid : undefined;
}

async function createConversation(chatId) {
  return client.conversations.v1.conversations.create({
    friendlyName: `Telegram_conversation_${chatId}`,
  });
}

async function createParticipant(conversationSid, identity) {
  return client.conversations.v1
    .conversations(conversationSid)
    .participants.create({ identity: identity });
}

async function createScopedWebhooks(conversationSid, chatId) {
  console.log("Creating webhooks");
  await client.conversations.v1.conversations(conversationSid).webhooks.create({
    "configuration.filters": "onMessageAdded",
    target: "studio",
    "configuration.flowSid": process.env.STUDIO_FLOW_SID,
  });

  console.log("Webhook for studio created");

  await client.conversations.v1.conversations(conversationSid).webhooks.create({
    target: "webhook",
    "configuration.filters": "onMessageAdded",
    "configuration.method": "POST",
    "configuration.url": `${process.env.WEBHOOK_BASE_URL}/new-message?chat_id=${chatId}`,
  });

  console.log("Webhook for new-message created");
}

async function createMessage(conversationSid, author, body) {
  return client.conversations.v1
    .conversations(conversationSid)
    .messages.create({
      author: author,
      body: body,
      xTwilioWebhookEnabled: true,
    });
}

async function sendMessageToFlex(chatId, body) {
  let identity = `telegram_user_${chatId}`;
  let existingConversationSid = await findExistingConversation(identity);
  if (existingConversationSid === undefined) {
    const { sid: conversationSid } = await createConversation(chatId);
    console.log("Created new conversation SID: ", conversationSid);
    await createParticipant(conversationSid, identity);
    await createScopedWebhooks(conversationSid, chatId);
    existingConversationSid = conversationSid;
  } else {
    console.log("Using existing conversation SID: ", existingConversationSid);
  }

  const { sid: messageSid } = await createMessage(existingConversationSid, identity, body);
  console.log("Message SID: ", messageSid);
}

module.exports = sendMessageToFlex;
