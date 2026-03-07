const net = require('net');

// ==== 🔧 設定エリア ====
const PORT = 2101;
const BASE_PASSWORD = "nosaka01";  // ESP32（基準局）が送ってくるパスワード
const MOUNTPOINT = "/TAMBA_NOSAKA_BASE";     // スマホ（移動局）がアクセスする名前
// =======================

const rovers = new Set();

const server = net.createServer((socket) => {
    let isBase = false;
    let isRover = false;

    socket.on('data', (data) => {
        if (!isBase && !isRover) {
            const header = data.toString('utf-8', 0, Math.min(data.length, 1024));

            if (header.startsWith('SOURCE')) {
                // 📡 基準局 (ESP32) からの接続
                if (header.includes(BASE_PASSWORD)) {
                    console.log(`[${socket.remoteAddress}] 📡 基準局 (Base) が接続しました！`);
                    socket.write("ICY 200 OK\r\n");
                    isBase = true;
                } else {
                    console.log(`[${socket.remoteAddress}] ❌ パスワードエラー`);
                    socket.end();
                }
            } else if (header.startsWith('GET')) {
                // 🚜 移動局 (スマホ等) からの接続
                if (header.includes(MOUNTPOINT)) {
                    console.log(`[${socket.remoteAddress}] 🚜 移動局 (Rover) が接続しました！`);
                    socket.write("ICY 200 OK\r\n");
                    isRover = true;
                    rovers.add(socket);
                } else {
                    console.log(`[${socket.remoteAddress}] ❌ マウントポイントエラー`);
                    socket.end();
                }
            } else {
                socket.end();
            }
        } else if (isBase) {
            for (const rover of rovers) {
                rover.write(data); 
            }
        }
    });

    socket.on('close', () => {
        if (isBase) {
            console.log(`[${socket.remoteAddress}] 📡 基準局が切断されました`);
        } else if (isRover) {
            console.log(`[${socket.remoteAddress}] 🚜 移動局が切断されました`);
            rovers.delete(socket);
        }
    });

    socket.on('error', (err) => {});
});

server.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Node.js NTRIP Caster が ポート ${PORT} で起動しました！`);
});