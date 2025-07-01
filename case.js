const { default: makeWASocket } = require("@whiskeysockets/baileys");

conn.ev.on("messages.upsert", async ({ messages }) => {
  const m = messages[0];
  if (!m.message || m.key.fromMe) return;

  const body = m.message?.conversation || m.message?.extendedTextMessage?.text || '';
  const command = body.trim().split(" ")[0].toLowerCase();

  switch (command) {
    case "nativeflowmessage":
      await conn.sendMessage(m.key.remoteJid, {
        nativeFlowMessage: {
          buttons: [
            {
              name: 'single_select',
              buttonParamsJson: JSON.stringify({
                title: '🔥 Pilih Tindakan',
                sections: [
                  {
                    title: '⚔️ Attack Menu',
                    highlight_label: '⚠️ Serangan',
                    rows: [
                      { header: '', title: '💥 Overkill', id: 'attack_overkill' },
                      { header: '', title: '⚡ Lite Mode', id: 'attack_lite' }
                    ]
                  }
                ]
              })
            },
            {
              name: 'quick_reply',
              buttonParamsJson: JSON.stringify({
                display_text: '🔥 Quick Launch',
                id: 'quick_launch'
              })
            }
          ],
          messageParamsJson: JSON.stringify({
            title: '💣 Native Flow Activated',
            body: 'Pilih aksi yang ingin kamu jalankan.',
            footer: 'Vonzie Bot - Brutal Mode',
            backgroundColor: '#111B21',
            buttonColor: '#25D366',
            textColor: '#FFFFFF'
          })
        }
      }, { quoted: m });
      break;
  }
});
