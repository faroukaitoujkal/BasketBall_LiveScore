using BasketBall_LiveScore.Server.Models;
using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using System.IO;

namespace BasketBall_LiveScore.Server.Data
{
    public static class DataSeeder
    {
        public static async Task InitializeAsync(BasketballContext context)
        {
            if (context.Teams.Count() >= 30)
            {
                return; // DB has been seeded with NBA data
            }

            // Clear old data
            context.Matches.RemoveRange(context.Matches);
            context.Players.RemoveRange(context.Players);
            context.Teams.RemoveRange(context.Teams);
            await context.SaveChangesAsync();

            string seedDir = Path.Combine(Directory.GetCurrentDirectory(), "Data", "Seed");

            // 1. Load Teams
            string teamsFile = Path.Combine(seedDir, "teams.json");
            if (!File.Exists(teamsFile)) return;

            var teamsDoc = JsonDocument.Parse(await File.ReadAllTextAsync(teamsFile));
            var teamsArray = teamsDoc.RootElement.GetProperty("sports")[0].GetProperty("leagues")[0].GetProperty("teams");

            var espnIdToDbTeam = new Dictionary<string, Team>();
            
            foreach (var teamEl in teamsArray.EnumerateArray())
            {
                var t = teamEl.GetProperty("team");
                var espnId = t.GetProperty("id").GetString();
                var displayName = t.GetProperty("displayName").GetString();
                var location = t.GetProperty("location").GetString();
                var color = t.TryGetProperty("color", out var c) ? c.GetString() : "000000";
                
                var team = new Team
                {
                    Name = displayName ?? "Unknown",
                    City = location ?? "Unknown",
                    CoachName = "TBD",
                    PrimaryColor = "#" + color
                };
                
                context.Teams.Add(team);
                if (espnId != null)
                {
                    espnIdToDbTeam[espnId] = team;
                }
            }
            
            await context.SaveChangesAsync();

            // 2. Load Rosters
            var allPlayers = new List<Player>();
            foreach (var kvp in espnIdToDbTeam)
            {
                var espnId = kvp.Key;
                var dbTeam = kvp.Value;

                string rosterFile = Path.Combine(seedDir, $"roster_{espnId}.json");
                if (!File.Exists(rosterFile)) continue;

                var rosterDoc = JsonDocument.Parse(await File.ReadAllTextAsync(rosterFile));
                if (rosterDoc.RootElement.TryGetProperty("athletes", out var athletes))
                {
                    foreach (var ath in athletes.EnumerateArray())
                    {
                        var fullName = ath.GetProperty("fullName").GetString();
                        var weightLbs = ath.TryGetProperty("weight", out var w) ? w.GetDouble() : 200;
                        var pos = ath.TryGetProperty("position", out var p) && p.TryGetProperty("abbreviation", out var pa) ? pa.GetString() : "N/A";
                        var jersey = ath.TryGetProperty("jersey", out var j) ? j.GetString() : "0";
                        int.TryParse(jersey, out int jerseyNum);

                        var heightInches = ath.TryGetProperty("height", out var h) ? h.GetDouble() : 78;
                        var heightMeters = Math.Round(heightInches * 0.0254, 2);

                        allPlayers.Add(new Player
                        {
                            Name = fullName ?? "Unknown",
                            Number = jerseyNum,
                            Position = pos ?? "N/A",
                            Height = heightMeters,
                            Weight = (int)(weightLbs * 0.453592),
                            TeamId = dbTeam.Id
                        });
                    }
                }
            }
            
            context.Players.AddRange(allPlayers);
            await context.SaveChangesAsync();

            // 3. Load Scoreboard (Matches)
            string scoreboardFile = Path.Combine(seedDir, "scoreboard.json");
            if (File.Exists(scoreboardFile))
            {
                var scoreDoc = JsonDocument.Parse(await File.ReadAllTextAsync(scoreboardFile));
                if (scoreDoc.RootElement.TryGetProperty("events", out var events))
                {
                    var matchesToSeed = new List<Match>();
                    foreach (var ev in events.EnumerateArray())
                    {
                        var dateStr = ev.GetProperty("date").GetString();
                        DateTime.TryParse(dateStr, out DateTime matchDate);
                        
                        var comps = ev.GetProperty("competitions")[0];
                        var statusStr = comps.GetProperty("status").GetProperty("type").GetProperty("name").GetString();
                        var competitors = comps.GetProperty("competitors");
                        
                        string homeId = null, awayId = null;
                        int homeScore = 0, awayScore = 0;
                        
                        foreach (var comp in competitors.EnumerateArray())
                        {
                            var teamId = comp.GetProperty("team").GetProperty("id").GetString();
                            var homeAway = comp.GetProperty("homeAway").GetString();
                            var score = comp.TryGetProperty("score", out var sc) ? sc.GetString() : "0";
                            int.TryParse(score, out int parsedScore);
                            
                            if (homeAway == "home") { homeId = teamId; homeScore = parsedScore; }
                            else { awayId = teamId; awayScore = parsedScore; }
                        }
                        
                        if (homeId != null && awayId != null && espnIdToDbTeam.ContainsKey(homeId) && espnIdToDbTeam.ContainsKey(awayId))
                        {
                            var status = MatchStatus.Scheduled;
                            if (statusStr != null)
                            {
                                if (statusStr.Contains("IN_PROGRESS")) status = MatchStatus.InProgress;
                                if (statusStr.Contains("FINAL")) status = MatchStatus.Finished;
                            }
                            
                            matchesToSeed.Add(new Match
                            {
                                MatchDate = matchDate,
                                Location = "NBA Arena",
                                HomeTeamId = espnIdToDbTeam[homeId].Id,
                                AwayTeamId = espnIdToDbTeam[awayId].Id,
                                NumberOfQuarters = 4,
                                QuarterDuration = 12,
                                TimeoutDuration = 1,
                                Status = status,
                                Season = "2024-2025",
                                HomeTeamScore = homeScore,
                                AwayTeamScore = awayScore,
                                EncodedBy = "System ESPN API"
                            });
                        }
                    }
                    
                    context.Matches.AddRange(matchesToSeed);
                    await context.SaveChangesAsync();
                }
            }
        }
    }
}
