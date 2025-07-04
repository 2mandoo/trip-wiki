const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;

app.use(express.static(path.join(__dirname, '..')));

app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`START SERVER`);
});

//npm install express@4    
//ESM

// import express from 'express';
// import path from 'path';
// import { fileURLToPath } from 'url';

// const app = express();
// const PORT = 3000;

// // ESM에서는 __dirname을 직접 쓸 수 없기 때문에 아래처럼 만들어야 함
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// //앱 객체의 use 메서드를 사용해서 현재 탐색기에서 위치한 폴더들에 서버가 접근할 수 있도록 경로 작성
// app.use(express.static(path.join(__dirname, '..')));

// app.get('/*', (req, res) => {
//     res.sendFile(path.join(__dirname, '..', 'index.html'));
// })

// app.listen(PORT, () => {
//     console.log(`${PORT}번 포트에서 서버 시작`);
// })