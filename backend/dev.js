const express = require("express");
const util = require("util");
const csvParser = require("csv-parser");
const fs = require("fs");
const sqlite3 = require("sqlite3").verbose();
let app = express();

const PORT = 3000;

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.listen(PORT, () => {
  console.log("Server is listening on port " + PORT);
});

db = createDbConnection("./player_stats.db");
standings_db = createDbConnection("./standings.db");
shots_db = createDbConnection("./shots.db");
teams_db = createDbConnection("./team_stats.db");

function createDbConnection(filepath) {
  const db = new sqlite3.Database(filepath, (error) => {
    if (error) {
      return console.error(error.message);
    }
  });
  console.log("Connection with SQLite has been established for database: " + filepath);
  return db;
}

function sanitizeParam(param) {
  return param.replace(/'/g, "''");
}

function getPlayers(filters, table) {
  let season = "";
  if (filters.season) {
    if (filters.season == "2023") {
      season = "";
    } else {
      season = "_" + filters.season;
    }
  }
  let querySegments = [
    `WITH team_ids AS (SELECT team_id, CASE WHEN team_name = 'Montreal Canadiens' THEN 'Montréal Canadiens' ELSE team_name END AS team_name FROM teams) SELECT * FROM ${table}${season} AS p JOIN team_ids t on p.team = t.team_name`,
  ];
  let query = [];
  let params = [];

  if (filters.team !== "") {
    query.push("TEAM = ?");
    params.push(sanitizeParam(filters.team));
  }
  if (filters.nationality !== "") {
    query.push("NATIONALITY = ?");
    params.push(sanitizeParam(filters.nationality));
  }
  if (filters.position !== "0") {
    query.push("POSITION = ?");
    params.push(sanitizeParam(filters.position));
  }
  if (filters.name !== "") {
    let name = sanitizeParam(filters.name.toLowerCase());
    query.push(
      "LOWER(FIRSTNAME || ' ' || LASTNAME) LIKE ? OR LOWER(LASTNAME || ' ' || FIRSTNAME) LIKE ?"
    );
    params.push(`%${name}%`);
    params.push(`%${name}%`);
  }

  if (query.length) {
    querySegments.push("WHERE", query.join(" AND "));
  }

  if (filters.sortField) {
    querySegments.push(
      `ORDER BY ${sanitizeParam(filters.sortField)} ${
        sanitizeParam(filters.sortDir) || "ASC"
      }`
    );
  }

  query = querySegments.join(" ");
  return { query, params };
}

app.get("/players/", (req, res, next) => {
  let filters = req.query;
  let { query, params } = getPlayers(filters, "PLAYERS");

  db.all(query, params, (err, playerRows) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    let rows = playerRows.map((row) => ({
      firstName: row.firstName,
      lastName: row.lastName,
      playerID: Number(row.player_id),
      birthDate: row.birthDate,
      nationality: row.nationality,
      position: row.position,
      height: row.height,
      weight: row.weight,
      teamId: Number(row.team_id),
      team: row.team,
      handedness: row.handedness,
      shots: row.shots,
      assists: row.assists,
    }));

    let goalieQuery = getPlayers(filters, "GOALIES");
    db.all(goalieQuery.query, goalieQuery.params, (err, goalieRows) => {
      if (err) {
        res.status(400).json({ error: err.message });
        return;
      }
      rows.push(
        ...goalieRows.map((row) => ({
          firstName: row.firstName,
          lastName: row.lastName,
          playerID: Number(row.player_id),
          birthDate: row.birthDate,
          nationality: row.nationality,
          position: row.position,
          height: row.height,
          weight: row.weight,
          teamId: Number(row.team_id),
          team: row.team,
          handedness: row.handedness,
          shots: row.shots,
          assists: row.assists,
        }))
      );

      res.status(200).json(rows);
    });
  });
});

app.get("/players/name", (req, res, next) => {
  let filters = req.query;
  let { query, params } = getPlayers(filters, "PLAYERS");

  db.all(query, params, (err, playerRows) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    let rows = playerRows.map((row) => ({
      name: row.firstName + " " + row.lastName,
      playerID: Number(row.player_id),
    }));

    let goalieQuery = getPlayers(filters, "GOALIES");
    db.all(goalieQuery.query, goalieQuery.params, (err, goalieRows) => {
      if (err) {
        res.status(400).json({ error: err.message });
        return;
      }
      rows.push(
        ...goalieRows.map((row) => ({
          name: row.firstName + " " + row.lastName,
          playerID: Number(row.player_id),
        }))
      );
      res.status(200).json(rows);
    });
  });
});

app.get("/standings", (req, res, next) => {
    const params = req.params;
    const query = `SELECT * FROM standings
    WHERE last_updated = (SELECT MAX(last_updated) FROM standings);`;
    standings_db.all(query,
       params,
      (err, standingsRows) => {
      if (err) {
        res.status(400).json({ error: err.message });
        return;
      } else {
        let rows = standingsRows.map((standingsRow) => ({
            teamId: Number(standingsRow.team_id),
            teamName: standingsRow.team,
            simulatedPoints: standingsRow.simulated_points,
            actualPoints: Number(standingsRow.actual_points),
            division: standingsRow.division,
            lastUpdated: standingsRow.last_updated,
          }));
        res.status(200).json(rows);
        }
      }
    );
  });

app.get("/players/card/war/:id", (req, res, next) => {
  const id = Number(req.query.id);
  let season = "";
  season = "_" + req.query.season;
  db.get(
    `SELECT * FROM war${season} WHERE player_id = ?`,
    [id],
    (err, playerRow) => {
      if (err) {
        res.status(400).json({ error: err.message });
        return;
      }

      if (playerRow) {
        const response = {
          playerID: playerRow.player_id,
          war: playerRow.WAR,
          warPercentile: playerRow.war_percentile,
        };
        res.status(200).json(response);
      }
    }
  );
});

app.get("/players/card/:id", (req, res, next) => {
  const id = Number(req.query.id);
  let season = "";
  if (req.query.season) {
    if (req.query.season == "2023") {
      season = "";
    } else {
      season = "_" + req.query.season;
    }
    console.log(season);
  }

  db.get(
    `SELECT *
            FROM players${season}
            WHERE player_id = ?`,
    [id],
    (err, playerRow) => {
      if (err) {
        res.status(400).json({ error: err.message });
        return;
      }

      if (playerRow) {
        const response = {
          xGF: playerRow.xGF,
          xGA: playerRow.xGA,
          goals: playerRow.goals_60,
          sh_xGA: playerRow.sh_xGA,
          primaryAssistsPP: playerRow.primary_assists_PP,
          pp: playerRow.pp_60,
          primaryAssistsEV: playerRow.primary_assists_EV,
          TOI: playerRow.EV_TOI,
          gsae: playerRow.gsae,
          shortHandedTOI: playerRow.SH_TOI,
          powerPlayTOI: playerRow.PP_TOI,
        };
        res.status(200).json(response);
      } else {
        db.get(
          `SELECT *
                FROM goalies${season}
                WHERE player_id = ?`,
          [id],
          (err, goalieRow) => {
            if (err) {
              res.status(400).json({ error: err.message });
              return;
            }

            if (goalieRow) {
              const response = {
                TOI: goalieRow.TOI,
                low_danger: goalieRow.low_danger,
                med_danger: goalieRow.medium_danger,
                high_danger: goalieRow.high_danger,
                ev: goalieRow.ev,
                starts: goalieRow.starts,
                shootout: goalieRow.shootout,
                med_danger_freq: goalieRow.medium_danger_freq,
                high_danger_freq: goalieRow.high_danger_freq,
                pk: goalieRow.pk,
              };
              res.status(200).json(response);
            } else {
              res.status(404).json({ error: "Player not found" });
            }
          }
        );
      }
    }
  );
});

app.get("/players/info/:id", (req, res, next) => {
  const id = Number(req.query.id);
  let season = "";
  if (req.query.season) {
    if (req.query.season == "2023") {
      season = "";
    } else {
      season = "_" + req.query.season;
    }
  }

  db.get(
    `WITH team_ids AS(
        SELECT team_id,
        CASE WHEN team_name = 'Montreal Canadiens' THEN 'Montréal Canadiens' ELSE team_name
        END AS team_name
        FROM teams
    )
    SELECT *
        FROM players${season} p
        JOIN team_ids t on p.team = t.team_name
        WHERE player_id = ?`,
    [id],
    (err, row) => {
      if (err) {
        res.status(400).json({ error: err.message });
        return;
      }

      if (row) {
        const response = {
          firstName: row.firstName,
          lastName: row.lastName,
          playerID: Number(row.player_id),
          birthDate: row.birthDate,
          nationality: row.nationality,
          position: row.position,
          height: row.height,
          weight: row.weight,
          teamId: Number(row.team_id),
          team: row.team,
          handedness: row.handedness,
          shots: row.shots,
          assists: row.assists,
        };
        res.status(200).json(response);
      } else {
        db.get(
          `WITH team_ids AS(
            SELECT team_id,
            CASE WHEN team_name = 'Montreal Canadiens' THEN 'Montréal Canadiens' ELSE team_name
            END AS team_name
            FROM teams
        )
            SELECT *
            FROM goalies${season} p
            JOIN team_ids t on p.team = t.team_name
            WHERE player_id = ?`,
          [id],
          (err, row) => {
            if (err) {
              res.status(400).json({ error: err.message });
              return;
            }

            if (row) {
              const response = {
                firstName: row.firstName,
                lastName: row.lastName,
                playerID: Number(row.player_id),
                birthDate: row.birthDate,
                nationality: row.nationality,
                position: row.position,
                height: row.height,
                weight: row.weight,
                teamId: Number(row.team_id),
                team: row.team,
                handedness: row.handedness,
                shots: row.shots,
                assists: row.assists,
              };
              res.status(200).json(response);
            } else {
              res.status(404).json({ error: "Player not found" });
            }
          }
        );
      }
    }
  );
});

app.get("/players_no_percentile", (req, res, next) => {
  let filters = req.query;
  let { query, params } = getPlayers(filters, "PLAYERS_NO_PERCENTILE");

  db.all(query, params, (err, rows) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    rows = rows.map((row) => ({
      firstName: row.firstName,
      lastName: row.lastName,
      playerID: Number(row.player_id),
      xG: Math.round((row.xGF / (row.xGF + row.xGA)) * 100),
      xGF: row.xGF,
      xGA: row.xGA,
      goals: row.goals_60,
      gsae: row.gsae,
      primaryAssistsEV: row.primary_assists_EV,
      teamId: Number(row.team_id),
      team: row.team, // might need teamid here
      position: row.position,
      nationality: row.nationality,
    }));
    res.status(200).json(rows);
  });
});

app.get("/scores/:date", async (req, res, next) => {
  const date = req.query.date;
  const data = await (
    await fetch(`https://statsapi.web.nhl.com/api/v1/schedule?date=${date}`)
  ).json();
  if (!data || !data.dates) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
  if (data.dates.length == 0) {
    res.status(200).json([]);
    return;
  }
  const games = data.dates[0].games.map((game) => ({
    gamePk: game.gamePk,
    awayTeam: game.teams.away.team.name,
    awayRecord:
      game.teams.away.leagueRecord.wins +
      "-" +
      game.teams.away.leagueRecord.losses +
      "-" +
      game.teams.away.leagueRecord.ot,
    awayScore: game.teams.away.score,
    homeTeam: game.teams.home.team.name,
    homeRecord:
      game.teams.home.leagueRecord.wins +
      "-" +
      game.teams.home.leagueRecord.losses +
      "-" +
      game.teams.home.leagueRecord.ot,
    homeScore: game.teams.home.score,
  }));
  res.status(200).json(games);
});

const dbGetAsync = util.promisify(db.get).bind(db);

app.get("/scores/:year/:date", async (req, res, next) => {
  try {
    const date = req.query.date;

    let shots = [];

    const query = `
      SELECT * FROM shots
      WHERE date = ?
    `;

    shots_db.all(query, [date], async (err, rows) => {
      if (err) {
        return res.status(500).json({ error: "Internal Server Error" });
      }

      shots = rows;
      if (!shots || shots.length == 0) {
        return res.status(500).json({ error: "No games." });
      }
      let season = "_" + shots[0].season.toString().slice(4, 8);
      if (season == "_2023") {
        season = "";
      }

      const skatersXGFMap = new Map();
      const skatersXGAMap = new Map();
      for (const shot of shots) {
        const teamSkaterIDs = shot.team_skaters
          .split(",")
          .map((id) => id.replace(/[.\s]/g, "").slice(0, 7));

        const opposingSkaterIDs = shot.opposing_skaters
          .split(",")
          .map((id) => id.replace(/[.\s]/g, "").slice(0, 7));

        const xGF = Number(shot.xGF);
        const xGA = Number(shot.xGF);

        for (const skaterID of teamSkaterIDs) {
          if (!skatersXGFMap.has(skaterID)) {
            skatersXGFMap.set(skaterID, 0);
          }
          // test
          skatersXGFMap.set(skaterID, skatersXGFMap.get(skaterID) + xGF);
        }

        for (const skaterID of opposingSkaterIDs) {
          if (!skatersXGAMap.has(skaterID)) {
            skatersXGAMap.set(skaterID, 0);
          }
          skatersXGAMap.set(skaterID, skatersXGAMap.get(skaterID) + xGA);
        }
      }

      const skaterRatios = [];

      for (const [skaterID, xGF] of skatersXGFMap) {
        if (skatersXGAMap.has(skaterID)) {
          const xGA = skatersXGAMap.get(skaterID);
          const ratio = xGF / (xGA + xGF);

          let nameRow = await dbGetAsync(
            `SELECT * FROM players${season}
            WHERE player_id = ?`,
            skaterID
          );

          if (!nameRow) {
            const info = await (
              await fetch(
                `https://statsapi.web.nhl.com/api/v1/people/${skaterID}/`
              )
            ).json();
            nameRow = { fullName: info["people"][0]["fullName"] };
          } else {
            nameRow = { fullName: nameRow.firstName + " " + nameRow.lastName };
          }

          const name = nameRow.fullName;
          if (xGF + xGA >= 1) {
            skaterRatios.push({ playerID: skaterID, xGF: ratio, name: name });
          }
        }
      }

      const best_xGs = skaterRatios.sort((a, b) => b.xGF - a.xGF).slice(0, 5);
      const worst_xGs = skaterRatios.sort((a, b) => a.xGF - b.xGF).slice(0, 5);

      const goaliesXGSum = new Map();
      for (const shot of shots) {
        let goalieID = shot.goalie_id;
        if (goalieID) {
          const goalieID = shot.goalie_id
            .toString()
            .replace(/[.\s]/g, "")
            .slice(0, 7);

          const xG = Number(shot.xGF);
          const isGoal = Number(shot.isGoal);

          if (!goaliesXGSum.has(goalieID)) {
            goaliesXGSum.set(goalieID, { isGoal: 0, xG: 0 });
          }

          goaliesXGSum.get(goalieID)["xG"] += xG;
          goaliesXGSum.get(goalieID)["isGoal"] += isGoal;
        }
      }

      const goalieSumArray = await Promise.all(
        Array.from(goaliesXGSum, async ([goalieID, values]) => {
          let nameRow = await dbGetAsync(
            `SELECT * FROM goalies${season}
            WHERE player_id = ?`,
            goalieID
          );

          if (!nameRow) {
            const info = await (
              await fetch(
                `https://statsapi.web.nhl.com/api/v1/people/${goalieID}/`
              )
            ).json();
            nameRow = { fullName: info["people"][0]["fullName"] };
          } else {
            nameRow = { fullName: nameRow.firstName + " " + nameRow.lastName };
          }

          return {
            goalieID,
            gsax: values.xG - values.isGoal,
            name: nameRow.fullName,
          };
        })
      );

      const best_goalies = goalieSumArray
        .sort((a, b) => b.gsax - a.gsax)
        .slice(0, 3);
      const worst_goalies = goalieSumArray
        .sort((a, b) => a.gsax - b.gsax)
        .slice(0, 3);

      res.status(200).json({
        bestxGs: best_xGs,
        worstxGs: worst_xGs,
        worstGoalies: worst_goalies,
        bestGoalies: best_goalies,
      });
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/game/:year/:gamePk", (req, res, next) => {
  const gamePk = req.params.gamePk;
  const year = req.params.year;
  let shots = [];

  fs.createReadStream(`./seasons/${year}_shots.csv`)
    .pipe(csvParser())
    .on("data", (shot) => {
      shots.push(shot);
    })
    .on("end", () => {
      shots = shots.filter((shot) => {
        return shot.gameID == gamePk;
      });
      res.status(200).json(shots);
    })
    .on("error", (err) => {
      // Handle error if there's any issue reading or parsing the CSV file
      console.error("Error reading CSV:", err);
      res.status(500).json({ error: "Internal Server Error" });
    });
});

app.get("/scores/:year/:gamepk", async (req, res, next) => {
  const gamepk = req.query.gamepk;
});

app.get("/teams/:id", (req, res, next) => {
    const id = Number(req.query.id);

    db.get(
      `SELECT * FROM teams
                WHERE team_id = ?`,
      [id],
      (err, row) => {
        if (err) {
          res.status(400).json({ error: err.message });
          return;
        }

        if (row) {
          const response = {
            teamName: row.team_name,
            teamId: Number(row.team_id),
            location: row.location,
            teamAbbr: row.team_abbr,
            conference: row.conference,
            division: row.division,
            primaryColor: row.primary_color,
            secondaryColor: row.secondary_color,
          };
          res.status(200).json(response);
        }
      }
    );
  });

  app.get("/teams/roster/:id" , async (req, res, next) => {
    const id = Number(req.params.id);
    const teamIdsToAbbr = ({
        1: "ANA", 2: "ARI", 3: "BOS", 4: "BUF", 5: "CGY", 6: "CAR", 7: "CHI", 8: "COL",
        9: "CBJ", 10: "DAL", 11: "DET", 12: "EDM", 13: "FLA", 14: "LAK", 15: "MIN",
        16: "MTL", 17: "NSH", 18: "NJD", 19: "NYI", 20: "NYR", 21: "OTT", 22: "PHI",
        23: "PIT", 24: "SJS", 25: "SEA", 26: "STL", 27: "TBL", 28: "TOR", 29: "VAN",
        30: "VGK", 31: "WSH", 32: "WPG"});
    const teamAbbr = teamIdsToAbbr[id];
    const data = await (
      await fetch(`https://api-web.nhle.com/v1/roster/${teamAbbr}/current`)
    ).json();
    if (!data || !data.forwards || !data.defensemen || !data.goalies) {
      return res.status(500).json({ error: "Internal Server Error" });
    }

    let forwards = [];
    let defense = [];
    let goalies = [];

    if (data.forwards && data.forwards.length > 0) {
        forwards = data.forwards.map(forward => ({
          playerId: forward.id,
          headshot: forward.headshot,
          fullName: `${forward.firstName.default} ${forward.lastName.default}`,
          sweaterNumber: forward.sweaterNumber,
          positionCode: forward.positionCode,
          shootsCatches: forward.shootsCatches,
        }));
      }

    if (data.goalies && data.goalies.length > 0) {
        goalies = data.goalies.map(goalie => ({
          playerId: goalie.id,
          headshot: goalie.headshot,
          fullName: `${goalie.firstName.default} ${goalie.lastName.default}`,
          sweaterNumber: goalie.sweaterNumber,
          positionCode: goalie.positionCode,
          shootsCatches: goalie.shootsCatches,
        }));
    }

    if (data.defensemen && data.defensemen.length > 0) {
        defense = data.defensemen.map(defenseman => ({
          playerId: defenseman.id,
          headshot: defenseman.headshot,
          fullName: `${defenseman.firstName.default} ${defenseman.lastName.default}`,
          sweaterNumber: defenseman.sweaterNumber,
          positionCode: defenseman.positionCode,
          shootsCatches: defenseman.shootsCatches,
        }));
      }

      const roster = {
        "goalies": goalies,
        "forwards": forwards,
        "defense": defense,
    };

    res.status(200).json(roster);
  });


app.get("/teams/standings/:id", (req, res, next) => {
    const id = Number(req.params.id);
    standings_db.get(
      `SELECT * FROM standings
       WHERE team_id = ?
       AND last_updated = (SELECT MAX(last_updated) FROM standings2 WHERE team_id = ?)`,
      [id, id],
      (err, row) => {
        if (err) {
          res.status(400).json({ error: err.message });
          return;
        }

        if (row) {
          const response = {
            teamId: Number(row.team_id),
            teamName: row.team,
            simulatedPoints: row.simulated_points,
            actualPoints: row.actual_points,
            division: row.division,
            lastUpdated: row.last_updated,
          };
          res.status(200).json(response);
        }
      }
    );
  });

  app.get("/teams/card/:id", (req, res, next) => {
    const id = Number(req.params.id);
    const season = 20232024;
    teams_db.get(
      `SELECT * FROM teams
       WHERE team_id = ? and season = ?`,
      [id, season],
      (err, row) => {
        if (err) {
          res.status(400).json({ error: err.message });
          return;
        }

        if (row) {
          const response = {
            teamId: Number(row.team_id),
            teamName: row.team_name,
            season: row.season,
            wins: row.wins,
            losses: row.losses,
            otl: row.otl,
            gf: row.gf,
            ga: row.ga,
            points: row.points,
            gamesPlayed: row.games_played,
            division: row.division,
            ev_xGF: row.ev_xGF,
            ev_xGA: row.ev_xGA,
            xGF: row.xGF,
            xGA: row.xGA,
            l10Wins: row.l10Wins,
            l10Losses: row.l10Losses,
            l10Otl: row.l10Otl,
            leagueRank: row.leagueRank,
            divisionRank: row.divisionRank,
            pp: row.pp,
            pk: row.pk,
            gfNonEmpty: row.gf_non_empty,
            gaNonEmpty: row.ga_non_empty,
            finishing: row.finishing,
            gsax: row.gsax,
            xGPercentage: row.xGPercentage,
          };
          res.status(200).json(response);
        }
      }
    );
  });
