# HEXGATE

## About this project
League of Legends is a popular MOBA released in 2009.
The objective of the game is simple on the surface: pick a champion and destroy the enemy base.
However, taking into consideration the 150+ champion pool, different roles and hundreds of items the game becomes overwhemlmingly complex and intimidating for new players.
This is where HEXGATE comes in.
This tool fetches the information from your current game from the Leage of Legends API and feeds that information to GPT to create a clever game plan and suggest a build path.
Simply start a game, write your summoner name in the web app and a detailed game plan will be generated for you.
It consists of a React app and Node.js server.

## How to run

### Hexgate React

```npm i && npm start```

### Hexgate API

Create a .env file with your OpenAI and Riot Games API Keys:

```
OPENAI_API_KEY=[YOUR_KEY]
RIOT_API_KEY=[YOUR_KEY]
```

Then run:
```npm i && node app.js```