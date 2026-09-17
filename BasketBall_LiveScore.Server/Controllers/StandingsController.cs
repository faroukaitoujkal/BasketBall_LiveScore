using BasketBall_LiveScore.Server.Data;
using BasketBall_LiveScore.Server.DTOs;
using BasketBall_LiveScore.Server.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BasketBall_LiveScore.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class StandingsController : ControllerBase
    {
        private readonly BasketballContext _context;

        public StandingsController(BasketballContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<StandingDto>>> GetStandings()
        {
            try
            {
                using var httpClient = new System.Net.Http.HttpClient();
                httpClient.DefaultRequestHeaders.Add("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36");
                var response = await httpClient.GetStringAsync("https://site.api.espn.com/apis/v2/sports/basketball/nba/standings");
                var doc = System.Text.Json.JsonDocument.Parse(response);
                var standingsList = new List<StandingDto>();

                var children = doc.RootElement.GetProperty("children");
                foreach (var conf in children.EnumerateArray())
                {
                    var standingsArray = conf.GetProperty("standings").GetProperty("entries");
                    foreach (var entry in standingsArray.EnumerateArray())
                    {
                        var team = entry.GetProperty("team");
                        var stats = entry.GetProperty("stats");

                        var name = team.GetProperty("displayName").GetString();
                        var logo = "";
                        if (team.TryGetProperty("logos", out var logos) && logos.GetArrayLength() > 0)
                        {
                            logo = logos[0].GetProperty("href").GetString();
                        }
                        
                        var teamId = 0;
                        int.TryParse(team.GetProperty("id").GetString(), out teamId);

                        int wins = 0, losses = 0, gamesPlayed = 0, pf = 0, pa = 0;

                        foreach (var stat in stats.EnumerateArray())
                        {
                            var statName = stat.GetProperty("name").GetString();
                            if (statName == "wins") wins = (int)stat.GetProperty("value").GetDouble();
                            if (statName == "losses") losses = (int)stat.GetProperty("value").GetDouble();
                            if (statName == "gamesPlayed") gamesPlayed = (int)stat.GetProperty("value").GetDouble();
                            if (statName == "pointsFor") pf = (int)stat.GetProperty("value").GetDouble();
                            if (statName == "pointsAgainst") pa = (int)stat.GetProperty("value").GetDouble();
                        }

                        standingsList.Add(new StandingDto
                        {
                            TeamId = teamId,
                            TeamName = name,
                            TeamLogoUrl = logo,
                            GamesPlayed = gamesPlayed,
                            Wins = wins,
                            Losses = losses,
                            PointsFor = pf,
                            PointsAgainst = pa
                        });
                    }
                }

                var sortedStandings = standingsList
                    .OrderByDescending(s => s.WinPercentage)
                    .ThenByDescending(s => s.PointDifferential)
                    .ToList();

                return Ok(sortedStandings);
            }
            catch (Exception ex)
            {
                // Fallback to local DB calculation if ESPN API fails
                var teams = await _context.Teams.ToListAsync();
                var matches = await _context.Matches.Where(m => m.Status == MatchStatus.Finished).ToListAsync();

                var standings = new List<StandingDto>();

                foreach (var team in teams)
                {
                    var teamMatches = matches.Where(m => m.HomeTeamId == team.Id || m.AwayTeamId == team.Id).ToList();
                    
                    int wins = 0;
                    int losses = 0;
                    int pointsFor = 0;
                    int pointsAgainst = 0;

                    foreach (var match in teamMatches)
                    {
                        bool isHome = match.HomeTeamId == team.Id;
                        int teamScore = isHome ? match.HomeTeamScore : match.AwayTeamScore;
                        int opponentScore = isHome ? match.AwayTeamScore : match.HomeTeamScore;

                        pointsFor += teamScore;
                        pointsAgainst += opponentScore;

                        if (teamScore > opponentScore) wins++;
                        else if (teamScore < opponentScore) losses++;
                    }

                    standings.Add(new StandingDto
                    {
                        TeamId = team.Id,
                        TeamName = team.Name,
                        TeamLogoUrl = team.LogoUrl,
                        GamesPlayed = teamMatches.Count,
                        Wins = wins,
                        Losses = losses,
                        PointsFor = pointsFor,
                        PointsAgainst = pointsAgainst
                    });
                }

                var sortedStandings = standings
                    .OrderByDescending(s => s.WinPercentage)
                    .ThenByDescending(s => s.PointDifferential)
                    .ToList();

                return Ok(sortedStandings);
            }
        }
    }
}
