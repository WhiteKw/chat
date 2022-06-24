const express = require('express')
const app = express();
const port = 3000;

app.use("/", (req, res) => {
    res.sendFile(__dirname + '/page/index.html');
});

// HTTP 서버
const HTTPServer = app.listen(port, () => {
    console.log(`Server opened on port ${port}`);
});

// WebSocket 서버 생성/구동
const webSocket = require('ws')
const wss = new webSocket.Server({
    server: HTTPServer,
    cors: {
        origin: '*'
    }
});

wss.on('connection', (ws, request) => {
    // 연결된 클라이언트의 IP 취득
    const ip = request.headers['x-forwarded-for'] || request.socket.remoteAddress;
    console.log(`새로운 클라이언트 접속 : ${ip}`);

    wss.clients.forEach(client => {
        client.send(`System::msgSplit::새로운 유저가 접속했습니다. 현재 유저: ${wss.clients.size}명`)
    })

    ws.on('message', (msg) => {
        wss.clients.forEach(client => {
            client.send(msg.toString());
        })
    });

    ws.on('close', () => {
        wss.clients.forEach(client => {
            client.send(`System::msgSplit::유저 한명이 떠났습니다. 현재 유저: ${wss.clients.size}명`);
        })
    });
});