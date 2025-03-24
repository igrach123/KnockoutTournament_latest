import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  PlusCircle,
  PlayFill,
  ArrowClockwise,
  PencilFill,
  Trash3Fill,
  Save2Fill,
  XCircleFill,
  ChevronLeft,
} from "react-bootstrap-icons";

const KnockoutTournamentGenerator = () => {
  const [teams, setTeams] = useState([]);
  const [teamNameInput, setTeamNameInput] = useState("");
  const [inputError, setInputError] = useState(null);
  const [matches, setMatches] = useState([]);
  const [round, setRound] = useState(0);
  const [completedRounds, setCompletedRounds] = useState(0);
  const [editingTeamId, setEditingTeamId] = useState(null);
  const [editedTeamName, setEditedTeamName] = useState("");
  const [history, setHistory] = useState([]);
  const [tournamentTitle, setTournamentTitle] = useState("Tournament");
  const [isEditingTitle, setIsEditingTitle] = useState(false);

  // Save state to localStorage
  useEffect(() => {
    localStorage.setItem("tournamentTeams", JSON.stringify(teams));
    localStorage.setItem("tournamentMatches", JSON.stringify(matches));
    localStorage.setItem("tournamentRound", round.toString());
    localStorage.setItem(
      "tournamentCompletedRounds",
      completedRounds.toString()
    );
    localStorage.setItem("tournamentHistory", JSON.stringify(history));
    localStorage.setItem("tournamentTitle", tournamentTitle);
  }, [teams, matches, round, completedRounds, history, tournamentTitle]);

  // Load state from localStorage
  useEffect(() => {
    const savedTeams = localStorage.getItem("tournamentTeams");
    const savedMatches = localStorage.getItem("tournamentMatches");
    const savedRound = localStorage.getItem("tournamentRound");
    const savedCompletedRounds = localStorage.getItem(
      "tournamentCompletedRounds"
    );
    const savedHistory = localStorage.getItem("tournamentHistory");
    const savedTitle = localStorage.getItem("tournamentTitle");

    if (savedTeams) setTeams(JSON.parse(savedTeams));
    if (savedMatches) setMatches(JSON.parse(savedMatches));
    if (savedRound) setRound(parseInt(savedRound, 10));
    if (savedCompletedRounds)
      setCompletedRounds(parseInt(savedCompletedRounds, 10));
    if (savedHistory) setHistory(JSON.parse(savedHistory));
    if (savedTitle) setTournamentTitle(savedTitle);
  }, []);

  const handleAddTeam = () => {
    if (!teamNameInput.trim()) {
      setInputError("Team name cannot be empty.");
      return;
    }
    if (teams.includes(teamNameInput.trim())) {
      setInputError("Team name already exists.");
      return;
    }
    setTeams([...teams, teamNameInput.trim()]);
    setTeamNameInput("");
    setInputError(null);
  };

  const handleInputChange = (event) => {
    setTeamNameInput(event.target.value);
    setInputError(null);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleAddTeam();
    }
  };

  const handleEditTeam = (index) => {
    setEditingTeamId(index);
    setEditedTeamName(teams[index]);
  };

  const handleSaveTeam = (index) => {
    if (!editedTeamName.trim()) {
      setInputError("Team name cannot be empty.");
      return;
    }
    if (
      teams.includes(editedTeamName.trim()) &&
      teams.indexOf(editedTeamName.trim()) !== index
    ) {
      setInputError("Team name already exists.");
      return;
    }
    const newTeams = [...teams];
    newTeams[index] = editedTeamName.trim();
    setTeams(newTeams);
    setEditingTeamId(null);
    setInputError(null);
  };

  const handleDeleteTeam = (index) => {
    const newTeams = teams.filter((_, i) => i !== index);
    setTeams(newTeams);
    if (newTeams.length < Math.pow(2, completedRounds + 1)) {
      setMatches([]);
      setRound(0);
      setCompletedRounds(0);
      setHistory([]);
    }
  };

  const generateInitialMatches = (initialTeams) => {
    const numTeams = initialTeams.length;
    if (numTeams < 2) {
      setInputError("At least two teams are required to start a tournament.");
      return [];
    }

    let matches = [];
    let roundNumber = 0;
    let teamsArr = [...initialTeams];

    // Determine the number of byes
    let k = 1;
    while (k < numTeams) {
      k *= 2;
    }
    const byesCount = k - numTeams;

    if (byesCount === 0) {
      // Even number of teams, proceed as before
      while (teamsArr.length > 1) {
        matches.push({
          id: `${roundNumber}-${matches.length}`,
          team1: teamsArr.shift() || "",
          team2: teamsArr.shift() || "",
          score1: null,
          score2: null,
          winner: null,
        });
      }
    } else {
      // Uneven number of teams, create only necessary pre-round matches to ensure everyone plays
      const teamsToPlayInPreRound =
        numTeams - Math.pow(2, Math.floor(Math.log2(numTeams)));
      for (let i = 0; i < teamsToPlayInPreRound; i += 2) {
        matches.push({
          id: `${roundNumber}-${i / 2}`,
          team1: teamsArr.shift() || "",
          team2: teamsArr.shift() || "",
          score1: null,
          score2: null,
          winner: null,
        });
      }

      // Assign byes to the remaining teams.  The byes are assigned to the *first* teams in the teamsArr
      for (let i = 0; i < byesCount; i++) {
        matches.push({
          id: `${roundNumber + 1}-${i}`, // Use roundNumber + 1 because byes advance to the next round
          team1: teamsArr[i] || "", // The teams getting a bye
          team2: "Bye",
          score1: null,
          score2: null,
          winner: teamsArr[i] || null, // The team with the bye is the winner
        });
      }
      teamsArr = teamsArr.slice(byesCount); // Remove the teams that got a bye.
      // Pair up the remaining teams for the next round
      while (teamsArr.length > 1) {
        matches.push({
          id: `${roundNumber + 1}-${matches.length}`,
          team1: teamsArr.shift() || "",
          team2: teamsArr.shift() || "",
          score1: null,
          score2: null,
          winner: null,
        });
      }
    }
    return matches;
  };

  const startTournament = () => {
    if (teams.length < 2) {
      setInputError("At least two teams are required to start a tournament.");
      return;
    }
    const initialMatches = generateInitialMatches(teams);
    setMatches(initialMatches);
    setRound(0);
    setCompletedRounds(0);
    setHistory([]);
  };

  const updateScore = (matchId, score1, score2) => {
    setMatches((prevMatches) =>
      prevMatches.map((match) =>
        match.id === matchId ? { ...match, score1, score2 } : match
      )
    );
  };

  const advanceWinners = () => {
    // Store the current matches in history
    setHistory((prevHistory) => [...prevHistory, matches]);

    let nextRoundMatches = [];
    const winners = [];

    matches.forEach((match) => {
      if (match.team2 === "Bye") {
        winners.push(match.team1); // Team with a bye is the winner
      } else if (match.winner) {
        winners.push(match.winner);
      }
    });

    if (winners.length === 1) {
      alert(`Tournament finished! Winner is ${winners[0]}`);
      return;
    }

    for (let i = 0; i < winners.length; i += 2) {
      const team1 = winners[i];
      const team2 = winners[i + 1] || "Bye"; // Handle odd number of winners
      nextRoundMatches.push({
        id: `${round + 1}-${i / 2}`,
        team1: team1,
        team2: team2,
        score1: null,
        score2: null,
        winner: team2 === "Bye" ? team1 : null, //if team2 is bye, team1 is winner
      });
    }
    setMatches(nextRoundMatches);
    setRound((prevRound) => prevRound + 1);
    setCompletedRounds((prevRounds) => prevRounds + 1);
  };

  const handleMatchFinish = (matchId) => {
    const match = matches.find((m) => m.id === matchId);
    if (!match) return;

    if (match.team2 === "Bye") {
      setMatches((prevMatches) =>
        prevMatches.map((m) =>
          m.id === matchId
            ? {
                ...m,
                winner: m.team1, // Team1 is the winner of a bye.
                score1: null,
                score2: null,
              }
            : m
        )
      );
      return;
    }

    if (match.score1 === null || match.score2 === null) {
      setInputError("Please enter scores for both teams.");
      return;
    }

    if (match.score1 === match.score2) {
      setInputError("Tie game. Please enter different scores.");
      return;
    }

    const winner = match.score1 > match.score2 ? match.team1 : match.team2;
    setMatches((prevMatches) =>
      prevMatches.map((m) => (m.id === matchId ? { ...m, winner } : m))
    );
    setInputError(null);
  };

  const allScoresEntered = matches.every(
    (match) => match.team2 === "Bye" || match.winner !== null
  );
  const isTournamentStarted = matches.length > 0;

  const resetTournament = () => {
    setTeams([]);
    setMatches([]);
    setRound(0);
    setCompletedRounds(0);
    setTeamNameInput("");
    setInputError(null);
    setHistory([]);
    setTournamentTitle("Tournament");
    setIsEditingTitle(false);
  };

  const goToPreviousRound = () => {
    if (history.length > 0) {
      const previousMatches = history[history.length - 1];
      setMatches(previousMatches);
      setRound(round - 1);
      setCompletedRounds(completedRounds - 1);
      setHistory((prevHistory) => prevHistory.slice(0, -1));
    }
  };

  const currentMatches = matches.filter((match) =>
    match.id.startsWith(`${round}`)
  );

  return (
    <div className="min-vh-100 bg-gradient-to-br from-gray-900 to-gray-700 d-flex flex-column align-items-center pt-5">
      <div className="d-flex align-items-center gap-4 mb-5">
        {isEditingTitle ? (
          <>
            <input
              type="text"
              value={tournamentTitle}
              onChange={(e) => setTournamentTitle(e.target.value)}
              className="form-control form-control-lg text-white bg-dark border-secondary text-center"
            />
            <button
              onClick={() => setIsEditingTitle(false)}
              className="btn btn-success">
              <Save2Fill />
            </button>
            <button
              onClick={() => {
                setIsEditingTitle(false);
                setTournamentTitle("Tournament");
              }}
              className="btn btn-secondary">
              <XCircleFill />
            </button>
          </>
        ) : (
          <>
            <h1
              className="display-4 fw-bold text-white text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400 cursor-pointer"
              onClick={() => setIsEditingTitle(true)}
              style={{ cursor: "pointer" }}>
              {tournamentTitle}
            </h1>
            <button
              onClick={() => setIsEditingTitle(true)}
              className="btn btn-primary">
              <PencilFill />
            </button>
          </>
        )}
      </div>

      <div className="w-100 max-w-md bg-white/10 backdrop-blur-md rounded-xl shadow-lg p-6 space-y-4 border border-white/10">
        <input
          type="text"
          placeholder="Enter team name"
          value={teamNameInput}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          className={`form-control form-control-lg bg-dark text-white border-secondary placeholder-gray-400 ${
            inputError ? "is-invalid" : ""
          }`}
        />
        {inputError && <p className="text-danger">{inputError}</p>}
        <div className="d-flex gap-4 flex-wrap justify-content-center">
          <button
            onClick={handleAddTeam}
            className="btn btn-primary flex-grow md:flex-grow-0 py-3 shadow-lg">
            <PlusCircle className="me-2" /> Add Team
          </button>
          <button
            onClick={startTournament}
            disabled={teams.length < 2 || isTournamentStarted}
            className="btn btn-success flex-grow md:flex-grow-0 py-3 shadow-lg">
            <PlayFill className="me-2" /> Start Tournament
          </button>
          <button
            onClick={resetTournament}
            className="btn btn-secondary flex-grow md:flex-grow-0 py-3 shadow-lg">
            <ArrowClockwise className="me-2" /> Restart
          </button>
        </div>
      </div>

      <div className="w-100 max-w-3xl mt-5">
        {teams.length > 0 && (
          <div className="card bg-white/10 backdrop-blur-md border border-white/10">
            <div className="card-header">
              <h2 className="h4 text-white">Teams Entered:</h2>
            </div>
            <div className="card-body">
              <ul className="list-group">
                <AnimatePresence>
                  {teams.map((team, index) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="list-group-item d-flex justify-content-between align-items-center bg-dark text-white rounded-md">
                      {editingTeamId === index ? (
                        <>
                          <input
                            type="text"
                            value={editedTeamName}
                            onChange={(e) => setEditedTeamName(e.target.value)}
                            className="form-control form-control-sm me-2 bg-dark text-white border-secondary"
                          />
                          <button
                            onClick={() => handleSaveTeam(index)}
                            className="btn btn-success btn-sm">
                            <Save2Fill />
                          </button>
                          <button
                            onClick={() => setEditingTeamId(null)}
                            className="btn btn-secondary btn-sm">
                            <XCircleFill />
                          </button>
                        </>
                      ) : (
                        <>
                          <span className="flex-grow-1">{team}</span>
                          <button
                            onClick={() => handleEditTeam(index)}
                            className="btn btn-primary btn-sm me-2">
                            <PencilFill />
                          </button>
                          <button
                            onClick={() => handleDeleteTeam(index)}
                            className="btn btn-danger btn-sm">
                            <Trash3Fill />
                          </button>
                        </>
                      )}
                    </motion.li>
                  ))}
                </AnimatePresence>
              </ul>
            </div>
          </div>
        )}
      </div>

      {isTournamentStarted && (
        <div className="w-100 max-w-3xl mt-5">
          <div className="card bg-white/10 backdrop-blur-md border border-white/10">
            <div className="card-header">
              <h2 className="h4 text-white">Round {round} Matches</h2>
            </div>
            <div className="card-body">
              {currentMatches.length > 0 ? (
                <ul className="list-group">
                  {currentMatches.map((match) => (
                    <li
                      key={match.id}
                      className="list-group-item bg-dark text-white rounded-md p-4">
                      <div className="d-flex justify-content-between align-items-center flex-wrap gap-4">
                        <div className="d-flex flex-grow-1 align-items-center gap-4 min-w-[200px]">
                          <span className="font-semibold flex-grow-1 truncate">
                            {match.team1}
                          </span>
                          <input
                            type="number"
                            placeholder="Score"
                            value={
                              match.score1 === null
                                ? ""
                                : match.score1.toString()
                            }
                            onChange={(e) =>
                              updateScore(
                                match.id,
                                e.target.value === ""
                                  ? null
                                  : parseInt(e.target.value, 10),
                                match.score2
                              )
                            }
                            className="form-control form-control-sm w-20 bg-dark text-white border-secondary placeholder-gray-400"
                          />
                        </div>
                        <span className="mx-4">vs</span>
                        <div className="d-flex flex-grow-1 align-items-center gap-4 min-w-[200px]">
                          <input
                            type="number"
                            placeholder="Score"
                            value={
                              match.score2 === null
                                ? ""
                                : match.score2.toString()
                            }
                            onChange={(e) =>
                              updateScore(
                                match.id,
                                match.score1,
                                e.target.value === ""
                                  ? null
                                  : parseInt(e.target.value, 10)
                              )
                            }
                            className="form-control form-control-sm w-20 bg-dark text-white border-secondary placeholder-gray-400"
                          />
                          <span className="font-semibold flex-grow-1 truncate">
                            {match.team2}
                          </span>
                        </div>
                      </div>
                      {match.winner && (
                        <p className="mt-2 text-success">
                          Winner: {match.winner}
                        </p>
                      )}
                      <div className="mt-4 d-flex justify-content-end">
                        <button
                          onClick={() => handleMatchFinish(match.id)}
                          disabled={
                            (match.team2 !== "Bye" &&
                              (match.score1 === null ||
                                match.score2 === null)) ||
                            match.winner !== null
                          }
                          className="btn btn-primary">
                          {match.winner ? "Match Finished" : "Finish Match"}
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-400">No matches for this round.</p>
              )}
              {allScoresEntered && currentMatches.length > 0 && (
                <div className="mt-4 d-flex justify-content-between flex-wrap gap-4">
                  {completedRounds > 0 && (
                    <button
                      onClick={goToPreviousRound}
                      className="btn btn-secondary">
                      <ChevronLeft className="me-2" />
                      Previous Round
                    </button>
                  )}
                  <button onClick={advanceWinners} className="btn btn-success">
                    Advance Winners
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default KnockoutTournamentGenerator;
