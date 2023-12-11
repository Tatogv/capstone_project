import axios from "axios";
import "./App.css";
import React, { useState } from "react";

const regions = [
  { value: "la1", label: "LAN" },
  { value: "na1", label: "NA" },
  { value: "la2", label: "LAS" },
  { value: "euw1", label: "EUW" },
  { value: "kr", label: "KR" },
  { value: "br1", label: "BR" },
  { value: "eun1", label: "EUNE" },
  { value: "oc1", label: "OCE" },
  { value: "jp1", label: "JPN" },
];

const instructions =
  "Enter your summoner name and region while in a live game an I'll give you all the info you need for victory!";

const TextSection = ({ goldText, whiteText }) => (
  <>
    <div className="Text-section">
      <p className="Golden-text">{goldText}:</p>
      <p className="White-text">{whiteText}</p>
    </div>
  </>
);

function App() {
  const [summoner, setSummoner] = useState("");
  const [response, setResponse] = useState(null);
  const [region, setRegion] = useState(regions[0].value);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    setError(null);
    if (loading) {
      return;
    }
    if (!summoner.length) {
      setError("Summoner name cannot be empty");
      return;
    }
    setLoading(true);
    try {
      const result = await axios.post("/getMatchPlan", {
        summonerName: summoner,
        summonerRegion: region,
      });
      console.log(result.data);
      setResponse(result.data);
    } catch (error) {
      setError(error);
    }
    setLoading(false);
  };

  return (
    <div className="App">
      <div className="Logo-container">
        <h1 className="App-logo">HEXGATE</h1>
        <hr className="solid" />
      </div>
      <p className="Instructions">{instructions}</p>
      <div className="Input-container">
        <input
          value={summoner}
          onChange={(e) => setSummoner(e.target.value)}
          className="Summoner-input"
          type="text"
        ></input>
        <select
          className="Region-select"
          value={region}
          onChange={(e) => setRegion(e.target.value)}
        >
          {regions.map((r) => (
            <option key={r.value} value={r.value}>
              {r.label}
            </option>
          ))}
        </select>
      </div>
      <button className="Submit-button" onClick={submit}>
        FIND MATCH
      </button>
      {error ? <p className="Error-message">{error}</p> : null}
      {loading ? <p className="Loading-label">Loading...</p> : null}
      {response && !loading ? (
        <div>
          <h2 className="Subtitle">Match Data</h2>
          <TextSection
            goldText={"Game Mode"}
            whiteText={response.matchData.gameMode}
          />
          <TextSection
            goldText={"My Champion"}
            whiteText={response.matchData.myData.champion}
          />
          <TextSection
            goldText={"My Team"}
            whiteText={response.matchData.myTeam.join(", ")}
          />
          <TextSection
            goldText={"Enemy Team"}
            whiteText={response.matchData.enemyTeam.join(", ")}
          />
          <TextSection
            goldText={"Game Mode"}
            whiteText={response.matchData.gameMode}
          />
          <hr className="solid" />
          <h2 className="Subtitle">Match plan</h2>
          <h3 className="Section-title">Early Game:</h3>
          <TextSection
            goldText={"Items to aim for"}
            whiteText={response.matchPlan.startingItems.items.join(', ')}
          />
          <TextSection
            goldText={"Explanation"}
            whiteText={response.matchPlan.startingItems.explanation}
          />
          <h3 className="Section-title">Game Plan:</h3>
          <TextSection
            goldText={"Strategy"}
            whiteText={response.matchPlan.gamePlan.plan}
          />
          <TextSection
            goldText={"Explanation"}
            whiteText={response.matchPlan.gamePlan.explanation}
          />
          <h3 className="Section-title">Optimal Build:</h3>
          <TextSection
            goldText={"Items to aim for"}
            whiteText={response.matchPlan.optimalBuild.build.join(', ')}
          />
          <TextSection
            goldText={"Explanation"}
            whiteText={response.matchPlan.optimalBuild.explanation}
          />
        </div>
      ) : null}
    </div>
  );
}

export default App;
