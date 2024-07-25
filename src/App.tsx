import { useEffect, useState } from "react";
import "./App.css";
import ChatComponent from "./components/ChatComponent";
import MyForm from "./components/Form";
import { message,Layout } from "antd";

const { Header, Content, Footer } = Layout;

function App() {
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [formValues, setFormValues] = useState(null);
  const [messageApi, contextHolder] = message.useMessage();

  const fetchToken = async (identity) => {
    try {
      console.log({ identity });
      const response = await fetch(
        `http://localhost:3000/token?identity=${identity}`
      );
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to generate token");
      }
      const data = await response.json();
      setToken(data.token);
      localStorage.setItem("token", data.token);
      localStorage.setItem("identity", identity);
    } catch (error) {
      console.log("Failed in generating token", error);
      message.error(error.message || "Failed to generate token");
    }
  };

  useEffect(() => {
    if (formValues) {
      fetchToken(formValues.name);
    }
  }, [formValues]);

  return (
    <>
    <Layout className="layout" style={{gap: "0px"}}>
      <Header>
        <span style={{ color: "white" }}>Twilio Flex Customer Support</span>
      </Header>
      <Content style={{ padding: "30px 50px" }}>
      {contextHolder}
      {!token ? (
        <MyForm setFormValues={setFormValues} />
      ) : (
        <ChatComponent token={token} formValues={formValues} />
      )}
      </Content>
      <Footer style={{ textAlign: "center", padding: "0 0 15px 0" }}>
        Twilio Customer support ©2024
      </Footer>
    </Layout>
    </>
  );
}

export default App;
