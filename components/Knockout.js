import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button"; // Make sure the path is correct for JS project
import { Input } from "@/components/ui/input"; // Make sure the path is correct for JS project
import { cn } from "@/lib/utils"; // Make sure the path is correct for JS project
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"; // Make sure the path is correct for JS project
import {
  Trash2,
  Edit,
  Save,
  X,
  PlusCircle,
  RotateCw,
  ChevronLeft,
} from "lucide-react"; // Make sure you have this installed
import { motion, AnimatePresence } from "framer-motion"; // Make sure you have this installed

const KnockoutTournamentGenerator = () => {
  const [teams, setTeams] = useState(() => {
    if (typeof window !== "undefined") {
      const savedTeams = localStorage.getItem("tournamentTeams");
      return savedTeams ? JSON.parse(savedTeams) : [];
    }
    return [];
  });
  const [teamNameInput, setTeamNameInput] = useState("");
  const [inputError, setInputError] = useState(null);
  const [matches, setMatches] = useState(() => {
    if (typeof window !== "undefined") {
      const savedMatches = localStorage.getItem("tournamentMatches");
      return savedMatches ? JSON.parse(savedMatches) : [];
    }
    return [];
  });
  const [round, setRound] = useState(() => {
    if (typeof window !== "undefined") {
      const savedRound = localStorage.getItem("tournamentRound");
      return savedRound ? parseInt(savedRound, 10) : 0;
    }
    return 0;
  });
  const [completedRounds, setCompletedRounds] = useState(() => {
    if (typeof window !== "undefined") {
      const savedCompletedRounds = localStorage.getItem(
        "tournamentCompletedRounds"
      );
      return savedCompletedRounds ? parseInt(savedCompletedRounds, 10) : 0;
    }
    return 0;
  });
  const [editingTeamId, setEditingTeamId] = useState(null);
  const [editedTeamName, setEditedTeamName] = useState("");
  const [history, setHistory] = useState(() => {
    if (typeof window !== "undefined") {
      const savedHistory = localStorage.getItem("tournamentHistory");
      return savedHistory ? JSON.parse(savedHistory) : [];
    }
    return [];
  });
  const [tournamentTitle, setTournamentTitle] = useState(() => {
    if (typeof window !== "undefined") {
      const savedTitle = localStorage.getItem("tournamentTitle");
      return savedTitle ? savedTitle : "Tournament"; // Default title
    }
    return "Tournament";
  });
  const [isEditingTitle, setIsEditingTitle] = useState(false);

  // Save state to localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("tournamentTeams", JSON.stringify(teams));
      localStorage.setItem("tournamentMatches", JSON.stringify(matches));
      localStorage.setItem("tournamentRound", round.toString());
      localStorage.setItem(
        "tournamentCompletedRounds",
        completedRounds.toString()
      );
      localStorage.setItem("tournamentHistory", JSON.stringify(history));
      localStorage.setItem("tournamentTitle", tournamentTitle);
    }
  }, [teams, matches, round, completedRounds, history, tournamentTitle]);

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

      // Assign byes to the remaining teams.
      for (let i = 0; i < byesCount; i++) {
        matches.push({
          id: `${roundNumber + 1}-${i}`, // Use roundNumber + 1, as these byes are effectively in the next round.
          team1: teamsArr[i] || "", // assign the remaining teams to byes
          team2: "Bye",
          score1: null,
          score2: null,
          winner: teamsArr[i] || null,
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
    setRound(
      initialMatches.length > 0 && initialMatches[0].id.startsWith("0") ? 0 : 1
    );
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
        winners.push(match.team1);
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
      const team2 = winners[i + 1] || "Bye";
      nextRoundMatches.push({
        id: `${round + 1}-${i / 2}`, // Corrected match ID for next round
        team1: team1,
        team2: team2,
        score1: null,
        score2: null,
        winner: team2 === "Bye" ? team1 : null,
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
      setMatches(
        (prevMatches) =>
          prevMatches.map((m) =>
            m.id === matchId
              ? { ...m, winner: m.team1, score1: null, score2: null }
              : m
          ) // set scores to null
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
    if (typeof window !== "undefined") {
      localStorage.removeItem("tournamentTeams");
      localStorage.removeItem("tournamentMatches");
      localStorage.removeItem("tournamentRound");
      localStorage.removeItem("tournamentCompletedRounds");
      localStorage.removeItem("tournamentHistory");
      localStorage.removeItem("tournamentTitle");
    }
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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-700 flex flex-col items-center justify-start pt-16">
      <div className="flex items-center gap-4 mb-8">
        {isEditingTitle ? (
          <>
            <Input
              type="text"
              value={tournamentTitle}
              onChange={(e) => setTournamentTitle(e.target.value)}
              className="text-3xl font-bold text-white text-center bg-black/20 border-gray-700 placeholder:text-gray-400"
            />
            <Button
              size="icon"
              onClick={() => setIsEditingTitle(false)}
              className="bg-green-500/20 text-green-400 hover:bg-green-500/30 hover:text-green-300">
              <Save className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              onClick={() => {
                setIsEditingTitle(false);
                setTournamentTitle("Tournament"); // Reset to default
              }}
              className="bg-gray-500/20 text-gray-400 hover:bg-gray-500/30 hover:text-gray-300">
              <X className="h-4 w-4" />
            </Button>
          </>
        ) : (
          <>
            <h1
              className="text-4xl font-bold text-white text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400 cursor-pointer"
              onClick={() => setIsEditingTitle(true)}>
              {tournamentTitle}
            </h1>
            <Button
              size="icon"
              onClick={() => setIsEditingTitle(true)}
              className="bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 hover:text-blue-300">
              <Edit className="h-4 w-4" />
            </Button>
          </>
        )}
      </div>

      <div className="w-full max-w-md bg-white/10 backdrop-blur-md rounded-xl shadow-lg p-6 space-y-4 border border-white/10">
        <Input
          type="text"
          placeholder="Enter team name"
          value={teamNameInput}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          className={cn(
            "w-full bg-black/20 text-white border-gray-700 placeholder:text-gray-400",
            inputError &&
              "border-red-500 focus:ring-red-500 focus:border-red-500"
          )}
        />
        {inputError && <p className="text-red-400 text-sm">{inputError}</p>}
        <div className="flex gap-4">
          <Button
            onClick={handleAddTeam}
            className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white
                                   hover:from-blue-600 hover:to-purple-600
                                   transition-colors duration-300 py-3 shadow-lg hover:shadow-xl">
            Add Team
          </Button>
          <Button
            onClick={startTournament}
            disabled={teams.length < 2 || isTournamentStarted}
            className="flex-1 bg-gradient-to-r from-green-500 to-teal-500 text-white
                                   hover:from-green-600 hover:to-teal-600
                                   transition-colors duration-300 py-3 shadow-lg hover:shadow-xl disabled:opacity-50">
            Start Tournament
          </Button>
          <Button
            onClick={resetTournament}
            className="flex-1 bg-gray-500/20 text-gray-300 hover:bg-gray-500/30
                                   transition-colors duration-300 py-3 shadow-lg hover:shadow-xl">
            <RotateCw className="mr-2 h-4 w-4" /> Restart
          </Button>
        </div>
      </div>

      <div className="w-full max-w-3xl mt-8">
        {teams.length > 0 && (
          <Card className="bg-white/10 backdrop-blur-md border border-white/10">
            <CardHeader>
              <CardTitle className="text-2xl font-semibold text-white">
                Teams Entered:
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <AnimatePresence>
                  {teams.map((team, index) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.2 }}
                      className="text-gray-300 py-2 px-4 rounded-md bg-black/20 border border-gray-700 flex items-center justify-between">
                      {editingTeamId === index ? (
                        <>
                          <Input
                            type="text"
                            value={editedTeamName}
                            onChange={(e) => setEditedTeamName(e.target.value)}
                            className="w-48 bg-black/20 text-white border-gray-700 placeholder:text-gray-400"
                          />
                          <div className="flex gap-2">
                            <Button
                              size="icon"
                              onClick={() => handleSaveTeam(index)}
                              className="bg-green-500/20 text-green-400 hover:bg-green-500/30 hover:text-green-300">
                              <Save className="h-4 w-4" />
                            </Button>
                            <Button
                              size="icon"
                              onClick={() => setEditingTeamId(null)}
                              className="bg-gray-500/20 text-gray-400 hover:bg-gray-500/30 hover:text-gray-300">
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </>
                      ) : (
                        <>
                          <span>
                            {index + 1}. {team}
                          </span>
                          <div className="flex gap-2">
                            <Button
                              size="icon"
                              onClick={() => handleEditTeam(index)}
                              className="bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 hover:text-blue-300">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              size="icon"
                              onClick={() => handleDeleteTeam(index)}
                              className="bg-red-500/20 text-red-400 hover:bg-red-500/30 hover:text-red-300">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </>
                      )}
                    </motion.li>
                  ))}
                </AnimatePresence>
              </ul>
            </CardContent>
          </Card>
        )}
      </div>

      {matches.length > 0 && (
        <div className="w-full max-w-3xl mt-8 space-y-4">
          <h2 className="text-3xl font-bold text-white mb-4 text-center">
            {round === 0 ? "Pre-Round" : `Round ${round}`}
          </h2>
          <AnimatePresence>
            {currentMatches.map((match) => {
              // Display Bye matches in the first round only
              if (match.team2 === "Bye" && round !== 0) {
                return null; // Don't display Bye matches in later rounds
              }
              return match.team2 !== "Bye" ? (
                <motion.div
                  key={match.id}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white/10 backdrop-blur-md rounded-xl shadow-lg p-4 border border-white/10 space-y-4">
                  <div className="flex justify-between items-center text-lg text-gray-300">
                    <div className="flex flex-col items-center gap-2">
                      <span>{match.team1}</span>
                      <Input
                        type="number"
                        placeholder="Score"
                        value={match.score1 === null ? "" : match.score1}
                        onChange={(e) =>
                          updateScore(
                            match.id,
                            e.target.value === ""
                              ? null
                              : parseInt(e.target.value, 10),
                            match.score2
                          )
                        }
                        className="w-24 bg-black/20 text-white border-gray-700 placeholder:text-gray-400"
                        disabled={match.winner !== null}
                      />
                    </div>
                    <span>vs</span>
                    <div className="flex flex-col items-center gap-2">
                      <span>{match.team2}</span>
                      <Input
                        type="number"
                        placeholder="Score"
                        value={match.score2 === null ? "" : match.score2}
                        onChange={(e) =>
                          updateScore(
                            match.id,
                            match.score1,
                            e.target.value === ""
                              ? null
                              : parseInt(e.target.value, 10)
                          )
                        }
                        className="w-24 bg-black/20 text-white border-gray-700 placeholder:text-gray-400"
                        disabled={match.winner !== null}
                      />
                    </div>
                  </div>
                  <div className="flex justify-center">
                    <Button
                      onClick={() => handleMatchFinish(match.id)}
                      disabled={
                        match.winner !== null ||
                        match.score1 === null ||
                        match.score2 === null
                      }
                      className="bg-gradient-to-r from-purple-500 to-pink-500 text-white
                                               hover:from-purple-600 hover:to-pink-600
                                               transition-colors duration-300 py-2 px-6 rounded-md shadow-md
                                               disabled:opacity-50 disabled:cursor-not-allowed">
                      Finish Match
                    </Button>
                  </div>
                  {match.winner && (
                    <p className="text-green-400 text-center">
                      Winner: {match.winner}
                    </p>
                  )}
                </motion.div>
              ) : (
                <motion.div
                  key={match.id}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white/10 backdrop-blur-md rounded-xl shadow-lg p-4 border border-white/10 space-y-4">
                  <div className="flex justify-between items-center text-lg text-gray-300">
                    <span>{match.team1}</span>
                    <span>vs</span>
                    <span>{match.team2}</span>
                  </div>
                  <p className="text-green-400 text-center">
                    Winner: {match.team1}
                  </p>
                </motion.div>
              );
            })}
          </AnimatePresence>
          <div className="flex justify-center gap-4">
            <Button
              onClick={advanceWinners}
              disabled={!allScoresEntered || matches.length === 0}
              className="bg-gradient-to-r from-green-500 to-teal-500 text-white
                                    hover:from-green-600 hover:to-teal-600
                                    transition-colors duration-300 py-3 px-8 rounded-md shadow-lg
                                    disabled:opacity-50 disabled:cursor-not-allowed">
              {round === 0
                ? "Advance to Round 1"
                : matches.length > 1
                ? "Advance to Next Round"
                : "Finish Tournament"}
            </Button>
            <Button
              onClick={goToPreviousRound}
              disabled={history.length === 0}
              className="bg-gray-500/20 text-gray-300 hover:bg-gray-500/30
                                    transition-colors duration-300 py-3 px-8 rounded-md shadow-lg
                                    disabled:opacity-50 disabled:cursor-not-allowed">
              <ChevronLeft className="mr-2 h-4 w-4" /> Previous Round
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default KnockoutTournamentGenerator;
