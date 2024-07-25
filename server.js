
const express = require("express");
const TelegramBot = require('node-telegram-bot-api');
const bodyParser = require("body-parser");
const cors = require("cors");
const sendMessageToFlex = require("./service");
require("dotenv").config();
const axios = require('axios')

const app = express();
const port = 3001;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


const token = process.env.TELEGRAM_API_TOKEN;
const bot = new TelegramBot(token, {polling: true});

bot.on('message', async (msg) => {
console.log(msg.text)
// bot.sendMessage(msg.chat.id, `In reply to this message: ${msg.text}`)
const chatId = msg.chat.id;
const body = msg.text;

await sendMessageToFlex(chatId, body);

})


app.listen(port, async () => {
    console.log(`Server is running on http://localhost:${port}`)
    // try {
    //     console.log("start Initializing")
    //     await axios.get(`https://api.telegram.org/bot${process.env.TELEGRAM_API_TOKEN}/setWebhook?url=${process.env.WEBHOOK_BASE_URL}/receive-message&allowed_updates=["message"]`)
    //     console.log("Completed Inititalizing")
    // } catch (error) {
    //     console.error(error)  
    // }
    
});
// app.get("/msg", async (req, res) => {
//     const {id, msg} = req.query;
//     console.log({id,msg})
//     await sendMessageToFlex(chatId=id, body=msg)
// })

// app.post('/receive-message', async function (request, response) {
//     console.log('Received a new message from telegram');

//     const chatId = request.body.message.chat.id;
//     const body = request.body.message.text;

//     await sendMessageToFlex(chatId, body);
//     response.sendStatus(200);
// });

// app.get("/game", () => {
//     console.log("welcome to localhost: 3001")
//     res.send({data: "welcome to localhost: 3001"})
// })

app.post('/new-message', async function (request, response) {
    console.log('Twilio new message webhook fired');
    console.log(request.body, request.query)

    if (request.body.Author !== `telegram_user_${request.query.chat_id}`) {
        await axios.post(`https://api.telegram.org/bot${process.env.TELEGRAM_API_TOKEN}/sendMessage`, {
            chat_id: request.query.chat_id,
            text: request.body.Body
        })
    }
    response.sendStatus(200);
});