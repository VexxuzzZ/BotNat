/*
Base By: Lezz DcodeR
Recode By: Your Name

Sosmed Creator Base:
- Tiktok Creator: https://tiktok.com/@lezzzcoder
- Github Creator: https://github.com/kyxle21
- YouTube Creator: https://youtube.com/@lezzdcoder

Jangan Lupa Untuk Menyebarkan Cinta [ ♥️ ] Dengan Membiarkan Credit Ini Tetap Ada
*/

const { default: makeWASocket, DisconnectReason, makeInMemoryStore, jidDecode, proto, getContentType, useMultiFileAuthState, downloadContentFromMessage } = require("baileys");

const pino = require('pino');
const chalk = require('chalk');
const fs = require('fs');
const readline = require("readline");
const PhoneNumber = require('awesome-phonenumber');

const { Boom } = require('@hapi/boom');
const { imageToWebp, videoToWebp, writeExifImg, writeExifVid, addExif } = require('./lib/exif')
const { smsg, sleep, getBuffer } = require('./lib/func.js')
const pw = "LezzYangTerbaik";

const store = makeInMemoryStore({
    logger: pino().child({
        level: 'silent',
        stream: 'store'
    })
})

const question = (text) => {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    return new Promise((resolve) => {
        rl.question(text, resolve)
    })
};
//
async function startSesi() {
    const {
        state,
        saveCreds
    } = await useMultiFileAuthState("session")
    const ade = makeWASocket({
        logger: pino({
            level: "silent"
        }),
        printQRInTerminal: false,
        auth: state,
        connectTimeoutMs: 60000,
        defaultQueryTimeoutMs: 0,
        keepAliveIntervalMs: 10000,
        emitOwnEvents: true,
        fireInitQueries: true,
        generateHighQualityLinkPreview: true,
        syncFullHistory: true,
        markOnlineOnConnect: true,
        browser: ["Ubuntu", "Chrome", "20.0.04"],
    });
    //
    if (!ade.authState.creds.registered) {
    const password = await question(`
╭━━┳━┳┳╮╭┳━┳━━┳╮╭┳━━╮
┣━━┣╮┃┃┃┃┃╋┃╯╰┣╮╭╋━━┃
┃━━╋┻╮┃╰╯┃╮┫╰╯┣╯╰┫━━┫
╰━━┻━━┻━━┻┻┻━━┻╯╰┻━━╯
╭━━┳━━┳━━┳━━┳━┳┳┳━┳━╮
┃╭╮┣╮╭┻╮╭┫╭╮┃╭┫╭┫┳┫╋┃
┃┣┫┃┃┃╱┃┃┃┣┫┃╰┫╰┫┻┫╮┫
╰╯╰╯╰╯╱╰╯╰╯╰┻━┻┻┻━┻┻╯
𝐄𝐍𝐓𝐄𝐑 𝐘𝐎𝐔𝐑 𝐏𝐀𝐒𝐒𝐖𝐎𝐑𝐃 𝐍𝐘𝐀 𝐁𝐀𝐍𝐆:\n`)
    if (password !== pw /*"YOUR PASSWORD"*/ ) {
    console.log(`
╭━━╮╱╱╱╭╮╱╱╱
┃╭╮┣━┳┳╯┣━╮╱
┃┣┫┃┃┃┃╋┃╋╰╮
╰╯╰┻┻━┻━┻━━╯
╱╱╱╱╭╮╱╱╭╮╱╱╭╮╱
╭━╮╭╯┣━╮┃┣━╮┃╰╮
┃╋╰┫╋┃╋╰┫┃╋╰┫┃┃
╰━━┻━┻━━┻┻━━┻┻╯
╭━╮╱╱╱╱╱╱╱╱╱╱╭╮╭━╮╱╱
┃╋┣━┳━┳┳━┳┳┳┳╋┫┃━╋━╮
┃╭┫┻┫┃┃┃━┫┃┃╭┫┃┣━┃━┫
╰╯╰━┻┻━┻━┻━┻╯╰╯╰━┻━╯
╭┳╮╱╱╱╱╱╭━╮╭━┳━╮
┃┃┣━╮╭━┳┫╋┃┃╋┃╋┃
┣╮┃╋╰┫┃┃┣╮┃┣╮┣╮┃
╰━┻━━┻┻━┻━╯╰━┻━╯`);
  //  fs.unlinkSync(__filename) //Menghapus File Yang Sedang Di Anukan Ya Itu Connection.js
    process.exit();
    }
        const phoneNumber = await question('Enter Your Number Start With Your Country Code:\n');
        let code = await ade.requestPairingCode(phoneNumber);
        code = code?.match(/.{1,4}/g)?.join("-") || code;
        console.log(`CODE PAIRING :`, code);
    }
    store.bind(ade.ev)

    ade.ev.on('messages.upsert', async chatUpdate => {
        try {
            mek = chatUpdate.messages[0]
            if (!mek.message) return
            mek.message = (Object.keys(mek.message)[0] === 'ephemeralMessage') ? mek.message.ephemeralMessage.message : mek.message
            if (mek.key && mek.key.remoteJid === 'status@broadcast') return
            if (!ade.public && mek.key.remoteJid !== global.owner + "@s.whatsapp.net" && !mek.key.fromMe && chatUpdate.type === 'notify') return
            if (mek.key.id.startsWith('BAE5') && mek.key.id.length === 16) return
            m = smsg(ade, mek, store)
            require("./case")(ade, m, chatUpdate, store)
        } catch (err) {
            console.log(err)
        }
    })
        ade.public = true

    ade.decodeJid = (jid) => {
        if (!jid) return jid
        if (/:\d+@/gi.test(jid)) {
            let decode = jidDecode(jid) || {}
            return decode.user && decode.server && decode.user + '@' + decode.server || jid
        } else return jid
    }

    ade.getName = (jid, withoutContact = false) => {
        id = ade.decodeJid(jid)
        withoutContact = ade.withoutContact || withoutContact
        let v
        if (id.endsWith("@g.us")) return new Promise(async (resolve) => {
            v = store.contacts[id] || {}
            if (!(v.name || v.subject)) v = ade.groupMetadata(id) || {}
            resolve(v.name || v.subject || PhoneNumber('+' + id.replace('@s.whatsapp.net', '')).getNumber('international'))
        })
        else v = id === '0@s.whatsapp.net' ? {
                id,
                name: 'WhatsApp'
            } : id === ade.decodeJid(ade.user.id) ?
            ade.user :
            (store.contacts[id] || {})
        return (withoutContact ? '' : v.name) || v.subject || v.verifiedName || PhoneNumber('+' + jid.replace('@s.whatsapp.net', '')).getNumber('international')
    }

    ade.serializeM = (m) => smsg(ade, m, store);
    ade.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect } = update;
        if (connection === 'close') {
            let reason = new Boom(lastDisconnect?.error)?.output.statusCode;
            if (reason === DisconnectReason.badSession || reason === DisconnectReason.connectionClosed || reason === DisconnectReason.connectionLost || reason === DisconnectReason.connectionReplaced || reason === DisconnectReason.restartRequired || reason === DisconnectReason.timedOut) {
                startSesi();
            } else if (reason === DisconnectReason.loggedOut) {} else {
                ade.end(`Unknown DisconnectReason: ${reason}|${connection}`);
            }
        } else if (connection === 'open') {
console.log(
"\n" +
chalk.green("Bot Berhasil Terhubung") + "\n" +
chalk.magenta("NAME BOT: 𝒃𝒍𝒐𝒘𝒛𝒛 𝒃𝒐𝒕") + "\n" +
chalk.magenta("CREATOR: 𝑽𝒆𝒙𝒙𝒖𝒛𝒛𝒁") + "\n" +//Padahal Bisa Anu Tapi Ga Gw Anuin Wkwk...😂
"\n"
)
        }
    });
    //
    ade.ev.on('creds.update', saveCreds)

    ade.sendText = (jid, text, quoted = '', options) => ade.sendMessage(jid, {
        text: text,
        ...options
    }, {
        quoted
    })

    ade.sendImageAsSticker = async (jid, path, quoted, options = {}) => {
        let buff = Buffer.isBuffer(path) ? 
            path : /^data:.*?\/.*?;base64,/i.test(path) ?
            Buffer.from(path.split`, `[1], 'base64') : /^https?:\/\//.test(path) ?
            await (await getBuffer(path)) : fs.existsSync(path) ? 
            fs.readFileSync(path) : Buffer.alloc(0);
        
        let buffer;
        if (options && (options.packname || options.author)) {
            buffer = await writeExifImg(buff, options);
        } else {
            buffer = await addExif(buff);
        }
        
        await ade.sendMessage(jid, { 
            sticker: { url: buffer }, 
            ...options }, { quoted });
        return buffer;
    };

    ade.sendVideoAsSticker = async (jid, path, quoted, options = {}) => {
        let buff = Buffer.isBuffer(path) ? 
            path : /^data:.*?\/.*?;base64,/i.test(path) ?
            Buffer.from(path.split`, `[1], 'base64') : /^https?:\/\//.test(path) ?
            await (await getBuffer(path)) : fs.existsSync(path) ? 
            fs.readFileSync(path) : Buffer.alloc(0);

        let buffer;
        if (options && (options.packname || options.author)) {
            buffer = await writeExifVid(buff, options);
        } else {
            buffer = await videoToWebp(buff);
        }

        await ade.sendMessage(jid, {
            sticker: { url: buffer }, 
            ...options }, { quoted });
        return buffer;
    };

    ade.downloadMediaMessage = async (message) => {
        let mime = (message.msg || message).mimetype || ''
        let messageType = message.mtype ? message.mtype.replace(/Message/gi, '') : mime.split('/')[0]
        const stream = await downloadContentFromMessage(message, messageType)
        let buffer = Buffer.from([])
        for await (const chunk of stream) {
            buffer = Buffer.concat([buffer, chunk])
        }
        return buffer
    }

    return ade
}
// Anu
startSesi();

//
let file = require.resolve(__filename)
fs.watchFile(file, () => {
    fs.unwatchFile(file)
    console.log(chalk.redBright(`Update ${__filename}`))
    delete require.cache[file]
    require(file)
})
