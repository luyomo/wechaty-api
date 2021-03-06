import { Wechaty } from 'wechaty'
import { ScanStatus } from 'wechaty-puppet'
var qrcodeTerminal = require('qrcode-terminal');

const fs = require('fs')
const bodyParser = require('koa-bodyparser');
const YAML = require('yaml')

const file = fs.readFileSync('/opt/yomo-wechat-api/etc/roomNameMapping.yaml', 'utf8')
var __roomMapping = YAML.parse(file);

if (__roomMapping["roomMapping"] == null){
    console.log("Please provide proper room mapping config file");
    process.exit(2);
}
__roomMapping = __roomMapping["roomMapping"];

if(process.env.WECHATY_TOKEN == null ){
    console.log("Please input the token for login");
    process.exit(1);
}
const token = process.env.WECHATY_TOKEN;

const bot = new Wechaty({
  puppet: 'wechaty-puppet-hostie',
    puppetOptions: { 
        token,
    }
});

bot
  .on('scan', (qrcode, status) => {
    if (status === ScanStatus.Waiting) {
      qrcodeTerminal.generate(qrcode)
    }
  })
//  .on('logout', async user => {
//    console.log(`${user['payload']['name']} was logined`)
//  })
.on('login', async user => {
   console.log(`${user['payload']['name']} was logined`)
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

const Koa = require('koa2');
const app = new Koa();

app.use(bodyParser());

// /room/roomName
// /contact/ContactName
app.use(async ctx => {
  if ( ctx.method === 'POST' ) {
      console.log("The url is ", ctx.url.split('/'));
      if (ctx.url.split('/').length != 3){
          ctx.body = 'Invalid URL: (/room/roomName or /contact/contactName or /group/groupName)';
        ctx.status = 500;
        return;
      }
      var [_, __msgType, __dest] = ctx.url.split('/');
      console.log("The message type is ", __msgType);
      console.log("The target is ", __dest);
      if ( ! ["room", "contact", "group"].includes(__msgType)  ){
          ctx.body = 'Invalid URL: (/room/roomName or /contact/contactName or /group/groupName)';
        ctx.status = 500;
        return;
      }
      __dest = __dest.replace('%20', ' ');
      if(__msgType == "room"){
        const room = await bot.Room.find({topic: __dest});
        console.log('The room name is ', room);
        if (room == null){
          ctx.body = 'Invalid room name (' + __dest + ')';
          ctx.status = 500;
          return;
        }
        room.say(ctx.request.body.data);
        ctx.body = 'Sent the message to ' + __dest;

      }

      if(__msgType == "contact"){
        const contact = await bot.Contact.find({name: __dest});
        if (contact == null){
          ctx.body = 'Invalid contact name (' + __dest + ')';
          ctx.status = 500;
          return;
        }
        contact.say(ctx.request.body.data);
        ctx.body = 'Sent the message to ' + __dest;
      }

      if(__msgType == "group"){
        if(__roomMapping[__dest] == null){
          console.log("The group name is not available in the config file");
          process.exit(3);
        }else{
          const room = await bot.Room.find({topic: __roomMapping[__dest]});
          console.log('The room name is ', room);
          if (room == null){
            ctx.body = 'Invalid room name (' + __dest + ')';
            ctx.status = 500;
            return;
          }
          room.say(ctx.request.body.data);
          ctx.body = 'Sent the message to ' + __dest;
        }

      }
  }
});

app.listen(3000, '0.0.0.0');
