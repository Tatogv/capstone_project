import express from "express";
import OpenAI from "openai";
import dotenv from "dotenv";
import axios from "axios";

import gameResponse from './fixtures/ARAMResponse.json' assert {type: 'json'}; 
import GPTResponse from './fixtures/GPTResponse.json' assert {type: 'json'}; 
import champsbyId from './data/champsById.json' assert {type: 'json'}; 

dotenv.config();

const app = express();
const port = 3001;

app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const getLolMatchData = async (summonerName, summonerRegion) => {
  const summoner = await axios.get(
    `https://${summonerRegion}.api.riotgames.com/lol/summoner/v4/summoners/by-name/${summonerName}`,
    {
      headers: {
        "X-Riot-Token": process.env.RIOT_API_KEY,
      },
    }
  );
  const {id} = summoner.data;
  console.log(summoner);
  const matchData = await axios.get(
    `https://${summonerRegion}.api.riotgames.com/lol/spectator/v4/active-games/by-summoner/${id}`, {
      headers: {
        "X-Riot-Token": process.env.RIOT_API_KEY,
      },
    }
  );
  console.log(matchData);
  // const matchData = gameResponse;
  const { gameMode, participants } = matchData.data;

  const myData = participants.find(p => p.summonerName === summonerName);
  myData.champion = champsbyId[myData.championId];
  const {myTeam, enemyTeam}  = participants.reduce((acc, p) => {
    if(p.teamId === myData.teamId) acc.myTeam.push(champsbyId[p.championId])
    else acc.enemyTeam.push(champsbyId[p.championId])
    return acc;
  }, {myTeam: [], enemyTeam: []})
  return {gameMode, myData, myTeam, enemyTeam}
};

app.post("/getMatchPlan", async (req, res) => {
  const {summonerName, summonerRegion} = req.body;
  try {    
    const matchData = await getLolMatchData(summonerName, summonerRegion);
    const message = `I want advice on how to win my League of Legends match. The gamemode is ${matchData.gameMode}. The champion I am playing is ${matchData.myData.champion}. My team has the following champions: ${matchData.myTeam.join(', ')}. The enemy team has the following champions: ${matchData.enemyTeam.join(', ')}. I want to know 3 things: What are my optimal starting items? What is my game plan? What is my optimal build?`
    const chatCompletion = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are a profesisonal League of Legends coach with vast knowledge on team comps and champion builds. Take into consideration your team and the enemy team to find the best strategy and build. The response is in json format with the following keys: startingItems, gamePlan, optimalBuild. Each one of the keys must also contain an explanation key with a small message describing why these choices are optimal.",
        },
        { role: "user", content: message },
      ],
      model: "gpt-3.5-turbo-1106",
      response_format: { "type": "json_object" },
    });
    // const chatCompletion = GPTResponse;
    const matchPlan = JSON.parse(chatCompletion.choices[0].message.content);
    res.send({matchData, message, matchPlan});
  } catch (error) {
    console.log(error);
    res.send({error: error.data})
  }
});

app.listen(port, () => {
  console.log(`Hexgate listening on port ${port}`);
});
