const { default: makeWASocket, useMultiFileAuthState } = require('@whiskeysockets/baileys')
const P = require('pino')
require('./config.js')

async function startBot() {
  const { state, saveCreds } = await useMultiFileAuthState('auth_info')
  const sock = makeWASocket({
    logger: P({ level: 'silent' }),
    auth: state,
    browser: ["HEHE-MD-BOT", "Chrome", "1.0.0"]
  })
  sock.ev.on('creds.update', saveCreds)
  sock.ev.on('connection.update', (u) => {
    if (u.connection === 'open') console.log('✅ HEHE-MD-BOT Connected')
  })
  sock.ev.on('messages.upsert', async ({ messages }) => {
    const m = messages[0]
    if (!m.message || m.key.fromMe) return
    const text = m.message.conversation || m.message.extendedTextMessage?.text || ""
    if (!text.startsWith(global.prefix)) return
    const cmd = text.slice(1).trim().split(/ +/)[0].toLowerCase()
    const jid = m.key.remoteJid

    if (cmd === 'menu') {
      await sock.sendMessage(jid, { text: `*╭── HEHE-MD-BOT ──*\n*│*.menu\n*│*.ping\n*│*.alive\n*│*.owner\n*╰────────────*\n\n${global.footer}` })
    }
    if (cmd === 'ping') {
      await sock.sendMessage(jid, { text: `*Pong!* 8ms\n\n${global.footer}` })
    }
    if (cmd === 'alive') {
      await sock.sendMessage(jid, { text: `*HEHE-MD-BOT IS ALIVE* 🤖\n\n${global.footer}` })
    }
    if (cmd === 'owner') {
      await sock.sendMessage(jid, { text: `Owner: wa.me/${global.owner}\n\n${global.footer}` })
    }
  })
}
startBot()
