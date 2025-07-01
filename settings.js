/*
Base By: Lezz DcodeR
Recode By: Your Name

Sosmed Creator Base:
- Tiktok Creator: https://tiktok.com/@lezzzcoder
- Github Creator: https://github.com/kyxle21
- YouTube Creator: https://youtube.com/@lezzdcoder

Jangan Lupa Untuk Menyebarkan Cinta [ ♥️ ] Dengan Membiarkan Credit Ini Tetap Ada
*/

const fs = require('fs')
const chalk = require('chalk')

//Settings
global.owner = "62857734669112"
global.namabot = "𝐙𝐲𝐮𝐫𝐨𝐱𝐙"

/*
global.img = fs.readFileSync('./tempat/gambar/anda.jpg')
global.aud = fs.readFileSync('./tempat/audio/anda.mp3')
*/


let file = require.resolve(__filename)
fs.watchFile(file, () => {
fs.unwatchFile(file)
console.log(chalk.redBright(`Update ${__filename}`))
delete require.cache[file]
require(file)
})
