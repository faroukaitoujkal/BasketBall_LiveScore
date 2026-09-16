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

            // Sort by win percentage, then point differential
            var sortedStandings = standings
                .OrderByDescending(s => s.WinPercentage)
                .ThenByDescending(s => s.PointDifferential)
                .ToList();

            return Ok(sortedStandings);
        }
    }
}
