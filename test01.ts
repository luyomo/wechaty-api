//const Wechaty = require('wechaty');
//const ScanStatus = require('wechaty-puppet');
//const QrcodeTerminal = require('qrcode-terminal');
import { Wechaty } from 'wechaty'
import { ScanStatus } from 'wechaty-puppet'
var qrcodeTerminal = require('qrcode-terminal');

const token = 'puppet_wxwork_e55d45d53adf4491';

const bot = new Wechaty({
  puppet: 'wechaty-puppet-hostie',
  puppetOptions: {
    token,
  }
});

bot
  .on('scan', (qrcode, status) => {
    if (status === ScanStatus.Waiting) {
    console.log(qrcode);
//      qrcodeTerminal.generate(qrcode, { small: true })
      qrcodeTerminal.generate(qrcode)
    }
  })
  .on('login', async user => {
    console.log(`user: ${JSON.stringify(user)}`)
  })
  .on('message', async message => {
    console.log(`message: ${JSON.stringify(message)}`)
  })
  .start()
