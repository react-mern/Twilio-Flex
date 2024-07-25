import React, { useEffect, useState, useRef } from "react";
import {
  Client as TwilioChatClient,
  Message,
  Channel,
} from "@twilio/conversations";
import {
  Input,
  Button,
  message,
  List,
  Layout,
  Typography,
  Avatar,
  Space,
  Row,
  Spin,
  Alert,
} from "antd";

const { TextArea } = Input;
const { Text } = Typography;

interface Props {
  token: string;
  formValues: { name: string; department: "HR" | "Sales"; message: string };
}

const ChatComponent: React.FC<Props> = ({ token, formValues }) => {
  const [messageApi, contextHolder] = message.useMessage();
  const [channel, setChannel] = useState<Channel | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState<string>("");
  const [statusMessage, setStatusMessage] = useState<string>("");
  const [identity, setIdentity] = useState<string>(
    localStorage.getItem("identity") || formValues.name
  );
  const [conversationSid, setConversationSid] = useState<string | null>(
    localStorage.getItem("conversationSID") || null
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingMessage, setLoadingMessage] = useState<string>(
    "Initializing chat..."
  );
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const createTask = async (conversationSid: string, identity: string) => {
    try {
      setLoadingMessage("Creating task...");
      const response = await fetch("http://localhost:3000/create-task", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ conversationSid, identity, department: formValues.department }),
      });
      const data = await response.json();
      console.log("Task created:", data);
      localStorage.setItem("taskSid",data.interaction.routing.properties.sid)
      setLoading(false);
    } catch (error) {
      console.error("Error creating task:", error);
      setLoadingMessage("Failed to create task.");
      setError("Failed to create task.");
    }
  };

  const initializeChatClient = async () => {
    try {
      if (token) {
        const client = new TwilioChatClient(token);

        client.on("connectionStateChanged", (state) => {
          console.log("Client connection state changed to ", state);
        });

        client.on("stateChanged", (state) => {
          console.log("Client state changed to ", state);
        });

        client.on("initialized", async () => {
          console.log("Client initialized");

          let conversation: Channel;
          if (conversationSid) {
            setLoadingMessage("Retrieving conversation...");
            conversation = await client.getConversationBySid(conversationSid);
          } else {
            setLoadingMessage("Creating new conversation...");
            conversation = await client.createConversation({
              friendlyName: "My Chat",
            });

            console.log("Created a new conversation:", conversation.sid);

            await new Promise((res) => setTimeout(res, 2000));
          }

          conversation.on("participantJoined", (state) => {
            console.log("Participant joined:", state.sid, state);
          });

          conversation.on("messageAdded", (message) => {
            setMessages((prevMessages) => [...prevMessages, message]);
            scrollToBottom();
          });

          console.log({ conversationSid });
          
          if (conversationSid) {
            const participants = await conversation.getParticipants();
            const participantExists = participants.some(
              (p) => p.identity === identity
            );
          }

          if (!conversationSid) {
            const participant = await conversation.add(identity);
            console.log(`Participant Added with SID: ${participant.sid}`);
          } else {
            console.log(
              `Participant ${identity} already exists in the conversation.`
            );
          }

          console.log("conversation", conversation);
          setChannel(conversation);

          const paginator = await conversation.getMessages(30, 0, "backwards");
          setMessages(paginator.items);

          scrollToBottom();
          localStorage.setItem("conversationSID", conversation.sid);
          setConversationSid(conversation.sid);
          
          if(!localStorage.getItem("taskSid")){
            await createTask(conversation.sid, identity);
          }else{
            setLoading(false);
          }
        });

        client.on("initFailed", ({ error }) => {
          console.log("Failed to initialize the client:", error);
          setLoadingMessage("Failed to initialize the client.");
          setError("Failed to initialize the client.");
        });
      }
    } catch (error) {
      console.error("Error initializing chat client:", error);
      setLoadingMessage("Failed to initialize chat client.");
      setError("Error initializing chat client.");
    }
  };

  useEffect(() => {
    if (token) {
      initializeChatClient();
    }
  }, [token]);

  useEffect(() => {
    if (channel && formValues?.message) {
      sendMessage(formValues.message);
    }
  }, [channel]);

  const sendMessage = async (messageText: string) => {
    console.log(channel, messageText);
    if (channel && messageText) {
      try {
        await channel
          .prepareMessage()
          .setBody(messageText)
          .setAttributes({ foo: "bar" })
          .build()
          .send();
        setNewMessage("");
        setStatusMessage("Message sent successfully!");
      } catch (error) {
        setStatusMessage("Failed to send message.");
        console.log("Error sending message:", error);
      }
    }
  };

  const clearStorage = () => {
    window.location.reload();
    localStorage.clear();
  };

  return (
    <Layout>
      {contextHolder}
      {error ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "80vh",
            flexDirection: "column",
          }}
        >
          <Alert message="Error" description={error} type="error" showIcon />
          <Button type="primary" onClick={clearStorage}>
            Start New Conversation
          </Button>
        </div>
      ) : loading ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "80vh",
            flexDirection: "column",
          }}
        >
          <Spin size="large" tip="Loading..." />
          <div style={{ marginTop: "16px", fontSize: "16px" }}>
            {loadingMessage}
          </div>
        </div>
      ) : (
        token && (
          <div
            style={{ background: "#fff", padding: "24px", minHeight: "80vh" }}
          >
            <List
              bordered
              dataSource={messages}
              renderItem={(message) => (
                <List.Item>
                  <Space>
                    <Avatar>{message.author[0]}</Avatar>
                    <Text mark>[{message.author}]</Text> {message.body}
                  </Space>
                </List.Item>
              )}
              style={{ height: "60vh", overflowY: "auto" }}
            />
            <div ref={messagesEndRef} />
            <TextArea
              rows={4}
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message"
              style={{ marginTop: "20px" }}
            />
            <Row justify="end" style={{ marginTop: "10px" }}>
              <Space>
                <Button type="primary" onClick={() => sendMessage(newMessage)}>
                  Send
                </Button>
                <Button type="primary" danger ghost onClick={clearStorage}>
                  End Conversation
                </Button>
              </Space>
            </Row>
            <div>{statusMessage}</div>
          </div>
        )
      )}
    </Layout>
  );
};

export default ChatComponent;
