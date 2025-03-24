import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Trash2,
  Edit,
  Save,
  X,
  PlusCircle,
  RotateCw,
  ChevronLeft,
} from "lucide-react";

// Mock UI Components (for standalone environment)
const Button = ({ className, onClick, disabled, size, children }) => (
  <button
    className={className}
    onClick={onClick}
    disabled={disabled}
    style={{
      padding: size === "icon" ? "8px" : "12px 24px",
      borderRadius: "6px",
      transition: "all 0.2s ease",
      cursor: disabled ? "not-allowed" : "pointer",
      opacity: disabled ? 0.5 : 1,
      ...(className.includes("bg-blue") && {
        backgroundColor: "#3b82f6",
        color: "white",
        ":hover": { backgroundColor: "#2563eb" },
      }),
      ...(className.includes("bg-green") && {
        backgroundColor: "#22c55e",
        color: "white",
        ":hover": { backgroundColor: "#16a34a" },
      }),
      ...(className.includes("bg-gray") && {
        backgroundColor: "#d1d5db",
        color: "#374151",
        ":hover": { backgroundColor: "#b0b3b8" },
      }),
      ...(className.includes("bg-red") && {
        backgroundColor: "#ef4444",
        color: "white",
        ":hover": { backgroundColor: "#dc2626" },
      }),
      ...(className.includes("text-blue") && { color: "#3b82f6" }),
      ...(className.includes("text-green") && { color: "#22c55e" }),
      ...(className.includes("text-gray") && { color: "#6b7280" }),
      ...(className.includes("text-red") && { color: "#ef4444" }),
      ...(className.includes("from-blue") && {
        backgroundImage: "linear-gradient(to right, #3b82f6, #8b5cf6)",
        color: "white",
        ":hover": {
          backgroundImage: "linear-gradient(to right, #2563eb, #6d28d9)",
        },
      }),
      ...(className.includes("from-green") && {
        backgroundImage: "linear-gradient(to right, #22c55e, #14b8a6)",
        color: "white",
        ":hover": {
          backgroundImage: "linear-gradient(to right, #16a34a, #0e7490)",
        },
      }),
      ...(className.includes("from-purple") && {
        backgroundImage: "linear-gradient(to right, #8b5cf6, #ec4899)",
        color: "white",
        ":hover": {
          backgroundImage: "linear-gradient(to right, #6d28d9, #d946ef)",
        },
      }),
      ...(className.includes("shadow-lg") && {
        boxShadow:
          "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
      }),
      ...(className.includes("shadow-xl") && {
        boxShadow:
          "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.05)",
      }),
      ...(className.includes("rounded-full") && {
        borderRadius: "9999px",
        padding: "8px",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
      }),
    }}>
    {children}
  </button>
);

const Input = ({
  className,
  type,
  placeholder,
  value,
  onChange,
  onKeyDown,
}) => (
  <input
    type={type}
    placeholder={placeholder}
    value={value}
    onChange={onChange}
    onKeyDown={onKeyDown}
    className={className}
    style={{
      width: "100%",
      padding: "8px 12px",
      borderRadius: "6px",
      border: "1px solid #d1d5db",
      outline: "none",
      transition: "all 0.2s ease",
      ...(className.includes("bg-black") && {
        backgroundColor: "rgba(0, 0, 0, 0.2)",
        color: "white",
        border: "1px solid #4b5563",
      }),
      ...(className.includes("border-red") && {
        borderColor: "#ef4444",
        ":focus": {
          ringColor: "#f87171",
          ringWidth: "2px",
        },
      }),
      ":focus": {
        borderColor: "#3b82f6",
        ringColor: "rgba(59, 130, 246, 0.5)",
        ringWidth: "2px",
      },
      "::placeholder": {
        color: "#9ca3af",
      },
    }}
  />
);

const Card = ({ className, children }) => (
  <div
    className={className}
    style={{
      borderRadius: "8px",
      boxShadow:
        "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)",
      ...(className.includes("bg-white") && {
        backgroundColor: "rgba(255, 255, 255, 0.1)",
        backdropFilter: "blur(10px)",
        border: "1px solid rgba(255, 255, 255, 0.1)",
      }),
    }}>
    {children}
  </div>
);

const CardHeader = ({ children }) => (
  <div style={{ padding: "16px" }}>{children}</div>
);

const CardTitle = ({ className, children }) => (
  <h2
    className={className}
    style={{
      fontSize: "1.5rem",
      fontWeight: "600",
      color: "white",
    }}>
    {children}
  </h2>
);

const CardContent = ({ children }) => (
  <div style={{ padding: "16px" }}>{children}</div>
);

// Utility function (mocked for standalone)
const cn = (...args) => args.filter(Boolean).join(" ");

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

  // Save state to localStorage (mocked)
  useEffect(() => {
    // In a true standalone environment, you might use a simple object for storage
    const storage = {};

    const setItem = (key, value) => {
      storage[key] = value;
    };
    const getItem = (key) => storage[key];
    const removeItem = (key) => delete storage[key];

    setItem("tournamentTeams", JSON.stringify(teams));
    setItem("tournamentMatches", JSON.stringify(matches));
    setItem("tournamentRound", round.toString());
    setItem("tournamentCompletedRounds", completedRounds.toString());
    setItem("tournamentHistory", JSON.stringify(history));
    setItem("tournamentTitle", tournamentTitle);
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
              ? {
                  ...m,
                  winner: m.team1,
                  score1: null,
                  score2: null,
                }
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
    <div
      className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-700 flex flex-col items-center justify-start pt-16"
      style={{
        minHeight: "100vh",
        backgroundImage: "linear-gradient(to bottom right, #1f2937, #4b5563)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        paddingTop: "4rem",
      }}>
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
              onClick={() => setIsEditingTitle(true)}
              style={{
                fontSize: "2.25rem",
                fontWeight: "bold",
                color: "white",
                textAlign: "center",
                backgroundImage: "linear-gradient(to right, #8b5cf6, #d946ef)",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                color: "transparent",
                cursor: "pointer",
              }}>
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

      <div
        className="w-full max-w-md bg-white/10 backdrop-blur-md rounded-xl shadow-lg p-6 space-y-4 border border-white/10"
        style={{
          width: "100%",
          maxWidth: "28rem",
          backgroundColor: "rgba(255, 255, 255, 0.1)",
          backdropFilter: "blur(10px)",
          borderRadius: "0.75rem",
          boxShadow:
            "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.05)",
          padding: "1.5rem",
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
          border: "1px solid rgba(255, 255, 255, 0.1)",
        }}>
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

      <div
        className="w-full max-w-3xl mt-8"
        style={{
          width: "100%",
          maxWidth: "64rem",
          marginTop: "2rem",
        }}>
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
                      className="flex items-center justify-between p-2 rounded-md bg-black/20 text-white">
                      {editingTeamId === index ? (
                        <>
                          <Input
                            type="text"
                            value={editedTeamName}
                            onChange={(e) => setEditedTeamName(e.target.value)}
                            className="flex-1 mr-2 bg-black/20 text-white border-gray-700 placeholder:text-gray-400"
                          />
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
                        </>
                      ) : (
                        <>
                          <span className="flex-1">{team}</span>
                          <Button
                            size="icon"
                            onClick={() => handleEditTeam(index)}
                            className="bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 hover:text-blue-300 mr-2">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="icon"
                            onClick={() => handleDeleteTeam(index)}
                            className="bg-red-500/20 text-red-400 hover:bg-red-500/30 hover:text-red-300">
                            <Trash2 className="h-4 w-4" />
                          </Button>
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

      {isTournamentStarted && (
        <div
          className="w-full max-w-3xl mt-8"
          style={{
            width: "100%",
            maxWidth: "64rem",
            marginTop: "2rem",
          }}>
          <Card className="bg-white/10 backdrop-blur-md border border-white/10">
            <CardHeader>
              <CardTitle className="text-2xl font-semibold text-white">
                Round {round} Matches
              </CardTitle>
            </CardHeader>
            <CardContent>
              {currentMatches.length > 0 ? (
                <ul className="space-y-4">
                  {currentMatches.map((match) => (
                    <li
                      key={match.id}
                      className="p-4 rounded-md bg-black/20 text-white">
                      <div className="flex items-center justify-between">
                        <div className="flex-1 flex items-center gap-4">
                          <span className="font-semibold">{match.team1}</span>
                          <Input
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
                            className="w-20 bg-black/20 text-white border-gray-700 placeholder:text-gray-400"
                          />
                        </div>
                        <span className="mx-4">vs</span>
                        <div className="flex-1 flex items-center gap-4">
                          <Input
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
                            className="w-20 bg-black/20 text-white border-gray-700 placeholder:text-gray-400"
                          />
                          <span className="font-semibold">{match.team2}</span>
                        </div>
                      </div>
                      {match.winner && (
                        <p className="mt-2 text-green-400">
                          Winner: {match.winner}
                        </p>
                      )}
                      <div className="mt-4 flex justify-end">
                        <Button
                          onClick={() => handleMatchFinish(match.id)}
                          disabled={
                            (match.team2 !== "Bye" &&
                              (match.score1 === null ||
                                match.score2 === null)) ||
                            match.winner !== null
                          }
                          className="bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 hover:text-blue-300">
                          {match.winner ? "Match Finished" : "Finish Match"}
                        </Button>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-400">No matches for this round.</p>
              )}
              {allScoresEntered && currentMatches.length > 0 && (
                <div className="mt-6 flex justify-between">
                  {completedRounds > 0 && (
                    <Button
                      onClick={goToPreviousRound}
                      className="bg-gray-500/20 text-gray-300 hover:bg-gray-500/30">
                      <ChevronLeft className="mr-2 h-4 w-4" />
                      Previous Round
                    </Button>
                  )}
                  <Button
                    onClick={advanceWinners}
                    className="bg-green-500/20 text-green-400 hover:bg-green-500/30">
                    Advance Winners
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default KnockoutTournamentGenerator;
