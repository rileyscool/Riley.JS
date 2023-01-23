
# Riley.JS

A discord.js utility made for private use but is avaliable publicly.

## Usage
```javascript
const Discord = require(`discord.js`)
const RileyJS = require(`riley.js`)

const Client = new Discord.Client({intents: Discord.IntentsBitField(3276799)})

Client.init({client: Client, commandsDirectory: __dirname+"/commands", eventsDirectory: __dirname+"/events", prefix: "!"})

Client.login(process.env.TOKEN)
```