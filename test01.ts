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
    //const contact = await bot.Contact.find({name: 'Bakugan yoyo'});
    //contact.say("Hello yoyo");
    const room = await bot.Room.find({topic: 'Crypto test'});
    room.say("Hello room");
  })
  .on('message', async msg => {
    console.log(`message: ${JSON.stringify(msg)}`)
      const contact = msg.from()
      console.log("The message is from ", contact);
      const text = msg.text()
      const room = msg.room()
      if (room) {
        const topic = await room.topic()
        console.log(`Room: ${topic} Contact: ${contact.name()} Text: ${text}`)
      } else {
        console.log(`Contact: ${contact.name()} Text: ${text}`)
      }

  })
  .start()

//const foo = async () => {
//const bot = new Wechaty({
//  puppet: 'wechaty-puppet-hostie',
//  puppetOptions: {
//    token,
//  }
//});
//await bot.start();
//await bot.say('hello!');
//};
//
//foo();
