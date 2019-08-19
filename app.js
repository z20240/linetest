// https://medium.com/pyradise/%E4%BD%BF%E7%94%A8node-js%E5%BB%BA%E7%BD%AE%E4%BD%A0%E7%9A%84%E7%AC%AC%E4%B8%80%E5%80%8Bline-bot-590b7ba7a28a
// https://github.com/Phyllis62418/LINEKICKALL
// https://github.com/line/line-bot-sdk-nodejs

const express = require('express')
const line = require('@line/bot-sdk')
const middleware = require('@line/bot-sdk').middleware
const JSONParseError = require('@line/bot-sdk').JSONParseError
const SignatureValidationFailed = require('@line/bot-sdk').SignatureValidationFailed

const app = express()

const config = {
    channelAccessToken: 'z0KYjgY39bmYou/32dmjiC0UJWByv52j5uBs838cJFPaAwuUMZNaiM6rOkdGETO1rqHrp0KZZGoxczsieB0iW3STr9ONBG4DnCyiSywaJy4EqXI+ZhxJIk+dD6BNUBvccarXI16oJjl15bNPTnCgtwdB04t89/1O/w1cDnyilFU=',
    channelSecret: '98f4785cf3f56c7dbea65fa2da4f713b'
}
const client = new line.Client(config);
console.log("TCL: line.Client", line.Client)

// line
app.post('/webhook', middleware(config), (req, res) => {

    Promise.all(req.body.events.map(handleEvent))
    .then((result) => {
        console.log("TCL: result", result)
        res.json(result);
    })
    .catch((err) => {
        console.error(err);
        res.status(500).end();
    });

})

// setTimeout(function() {
//     const userId = 'Ua5442300b201811a0486bde6e42727e7';
//     client.pushMessage(userId, { type: 'text', text: 'hello, world' })
// }, 3000);

app.get('/sendMsg', async (req, res) => {
    const userId = 'Ua5442300b201811a0486bde6e42727e7';
    client.pushMessage(userId, { type: 'text', text: 'hello, world' })
    res.json({ type: 'text', text: 'hello, world' })
})


function handleEvent(event) {
    console.log("TCL: handleEvent -> event", event)
    if (event.type !== 'message' || event.message.type !== 'text') {
        return Promise.resolve(null);
    }

    return client.replyMessage(event.replyToken, {
        type: 'text',
        text: `你說的是：${event.message.text}`
    });
}

app.use((err, req, res, next) => {
    if (err instanceof SignatureValidationFailed) {
        console.log("TCL: err", err)
        res.status(401).send(err.signature)
        return
    } else if (err instanceof JSONParseError) {
        console.log("TCL: err", err)
        res.status(400).send(err.raw)
        return
    }
    next(err) // will throw default 500
})


app.listen(8080)