# Twilio Flex 
This project itegrates Twilio Flex with a custom Frontend application using typescript and react. The aim is to create a seamless customer support interface for user and connect this frontend application with flex dashboard to appropriate agent enchanced features and flexibility.

## Table of Contents

- Introduction
- Flex Dashboard
- WebChat App
  - Prerequisite
  - Installation
  - Env File
  - TaskRouter Configuration
- Telegram_Bot
  - Telegram Bot
  - Prerequisite
  - Installation
  - Env File
- Contribution
- License

## Introduction
Flex prodvide a dashboard where agent/ worker accept task initated by customer. Task whould of different types and task here symbolize the communication which is initiated by customer. Task would be a call, sms, chat and any interaction through social media.

### Flex Dashboard 
  It looks like below image.

  ![Screenshot from 2024-07-25 13-54-35](https://github.com/user-attachments/assets/2a58a9ee-efa4-4c7b-9c7a-1adfe9f5710e)

  If you want to customized your dashboard according to your requirement then       you need to follow these step to download in your local then customize and redeploy again. 
 
  1. The Flex Plugins CLI is available via the Twilio CLI. You can install it using the twilio plugins     
     command. NPM version must be 6.0.0 or later and Node versions must be 14, 16 or 18.
     
    
    twilio plugins:install @twilio-labs/plugin-flex
    
    
  2. In order to run the CLI commands, on your Flex application run the following command:

    twilio login

  3.In your terminal, run the following commands to set up a sample Flex plugin:

    # Now we can start with a template plugin for Flex 2.0 with the create command
    twilio flex:plugins:create plugin-sample --install

    # Or if you prefer a typescript project run
    twilio flex:plugins:create plugin-sample --install --typescript

  4. Once you have created your plugin development environment, you can navigate into your plugin's code 
     directory and start Flex:
     
    cd plugin-sample
    twilio flex:plugins:start 
   
  5. Once you are done with the changes, then deploy and release it.

    # In your terminal, within the plugin-sample directory we created, run
    twilio flex:plugins:deploy --major --changelog "Adding Bing as search engine" --description "First Plugin     on Flex"

    # Inorder to enable your plugin, run
    twilio flex:plugins:release --name "First Plugin Release" --description "Enabling Plugin Sample" --plugin 
    plugin-sample@1.0.0

## Web chat app through which user can connect with agent at Flex Dashboard.
  In the branch <b>WebChat_App</b>, You will get the code where In Frontend part I used 
  <b>Twilio/Conversation</b> lib which is helpfull in creating conversation. And In backend part I used 
  <b>Twilio</b> lib by which I am creating interaction between customer and agent using interaction API. 

  ### Prerequisite
1. **Twilio Account**:
   - Sign up for a Twilio account at [Twilio](https://www.twilio.com/try-twilio).
   - Create a new Flex project from the Twilio Console.

2. **Twilio Credentials**:
   - Obtain your Twilio Account SID and Auth Token from the [Twilio Console](https://www.twilio.com/console).
   - Set up a Flex Flow SID by following the [Twilio Flex Quickstart Guide](https://www.twilio.com/docs/flex/quickstart/getting-started).

3. **Node.js and npm**:
   - Ensure you have [Node.js](https://nodejs.org/) and [npm](https://www.npmjs.com/) installed on your machine. You can download and install them from the official websites.
   - Verify the installation by running the following commands in your terminal:
     ```bash
     node -v
     npm -v
     ```

4. **Basic Knowledge**:
   - Familiarity with JavaScript/TypeScript.
   - Understanding of React and its ecosystem.
   - Basic understanding of REST APIs and HTTP requests.

  ### Installation 
      
      - git clone
      - cd WebChat_App
      - npm install
      - npm run dev
      
      For Backend 
      - cd server
      - npm install
      - add .env file 
      - npm start
      
### Add ENV File at backend side inside server folder

  - Account_SID= [From Here](https://www.twilio.com/console)
  - Auth_Token= [From Here](https://www.twilio.com/console)
  - API_Key_SID= [From Here](https://console.twilio.com/us1/account/keys-credentials/api-keys)
  - API_Key_Secret= [From Here](https://console.twilio.com/us1/account/keys-credentials/api-keys)
  - Service_SID= [From Here](https://console.twilio.com/us1/develop/conversations/manage/services?frameUrl=%2Fconsole%2Fconversations%2Fservices%3Fx-target-region%3Dus1)
  - Workspace_SID= [From Here](https://console.twilio.com/us1/develop/taskrouter/workspaces)
  - Workflow_SID= Workspavce > Workflow

### We need to configure few things in our acccount in TaskRouter:
  - <b>TaskRouter</b>: TaskRouter is an attribute based routing system which is use to distribute calls,   
      messaging sessions, and other types of work to agents in your contact center. It uses Tasks to 
      represent calls, messages or other communications, and to capture all the necessary information for   
      routing them.
    
 - <b>Workflow</b>: A Workflow is set of rules and configuration that determine how task are routed within a 
      workspace. You will find this <b>TaskRouter > Workspace > workflow.</b>
      
 - <b>TaskQueues</b>:  It act as holding area where task wait until they can be assigned to the appropriate 
      agents. You will find this <b>TaskRouter > Workspace > TaskQueues.</b>
      If You have multiple agent then you can create multiple queues and correct routing expression.
   
 - <b>Worker</b>: You can create multiple worker as per you need. Here you can differentiate between workers by providing them different skills. You will find this <b>TaskRouter > Workspace > Worker.</b>
  
## Telegram Bot for customer through which user can connect with agent at Flex Dashboard.
  Twilio Flex Conversations natively supports SMS/MMS, WhatsApp, and Chat. To integrate Telegram, we need to create a custom bot that connects with Twilio Conversations. 
  This bot will facilitate communication between customers on Telegram and agents on Flex.

  In the branch <b>Telegram_Bot</b>, you will get the code
  I am adding a [link](https://core.telegram.org/bots) through which you can learn how to create a bot and when a bot is created you will get at <b>token</b>. You will have to add that inside the .env file.
  I am attaching a image below, which will help you in understand how telegram_bot work with flex.
  <img src="https://www.twilio.com/content/dam/twilio-com/global/en/blog/legacy/2022/integrate-telegram-flex-conversations/9F0xIsJeRxJ8yrSAYwfx1n7iQcn6oWGdxNsVARyytbieIBTF1EyKCMtjqRuIWDm1YLDBi3FtenBsk1.png" /> 

### Prerequisite
    
1. **Twilio Account**:
   - Sign up for a Twilio account at [Twilio](https://www.twilio.com/try-twilio).
   - Create a new Flex project from the Twilio Console.

2. **Twilio Credentials**:
   - Obtain your Twilio Account SID and Auth Token from the [Twilio Console](https://www.twilio.com/console).
   - Set up a Flex Flow SID by following the [Twilio Flex Quickstart Guide](https://www.twilio.com/docs/flex/quickstart/getting-started).

3. **Node.js and npm**:
   - Ensure you have [Node.js](https://nodejs.org/) and [npm](https://www.npmjs.com/) installed on your machine. You can download and install them from the official websites.
   - Verify the installation by running the following commands in your terminal:
     ```bash
     node -v
     npm -v
     ```
4. **Telegram Bot**:
   - Need a telegram bot as it will interact with customer.

4. **Basic Knowledge**:
   - Basic understanding of telegram bot and its support lib.
   - Basic understanding of REST APIs and HTTP requests.

  ### Installation 
      
      - git clone
      - cd server
      - npm install
      - add .env file 
      - npm start
      
### Add ENV File at backend side inside server folder

  - TWILIO_ACCOUNT_SID= [From Here](https://www.twilio.com/console)
  - TWILIO_AUTH_TOKEN= [From Here](https://www.twilio.com/console)
  - STUDIO_FLOW_SID= [From Here](https://console.twilio.com/us1/develop/studio/flows?frameUrl=/console/studio/flows)
  - TELEGRAM_API_TOKEN= 
  - WEBHOOK_BASE_URL=
  - API_KEY= [From Here](https://console.twilio.com/us1/account/keys-credentials/api-keys)
  - API_SECRET= [From Here](https://console.twilio.com/us1/account/keys-credentials/api-keys)
  - Service_SID= [From Here](https://console.twilio.com/us1/develop/conversations/manage/services?frameUrl=%2Fconsole%2Fconversations%2Fservices%3Fx-target-region%3Dus1)

## Contributing

We welcome contributions from the community! If you'd like to contribute, please follow these steps:

1. **Fork the repository**: Click the "Fork" button at the top right of the repository page to create a copy of this repository on your GitHub account.

2. **Clone your fork**: 
    ```bash
    git clone https://github.com/your-username/repo-name.git
    cd repo-name
    ```

3. **Create a new branch**: 
    ```bash
    git checkout -b feature-branch
    ```

4. **Make your changes**: Implement your feature or bug fix.

5. **Commit your changes**:
    ```bash
    git add .
    git commit -m "Description of your changes"
    ```

6. **Push to your fork**:
    ```bash
    git push origin feature-branch
    ```

7. **Create a Pull Request**: Go to the original repository and click the "New Pull Request" button. Fill in the necessary details and submit.

Please ensure your code adheres to the project's coding standards and conventions. Include relevant tests and documentation updates as needed.

## License

MIT License

Copyright (c) 2023 Md Kamran & Vanshita Shah

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

