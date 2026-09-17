using BasketBall_LiveScore.Server.Data;
using BasketBall_LiveScore.Server.Models;
using BasketBall_LiveScore.Server.DTOs;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;
using Microsoft.AspNetCore.SignalR;

namespace BasketBall_LiveScore.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MatchesController : ControllerBase
    {
        private readonly BasketballContext _context;
        private readonly IHubContext<BasketBallHub> _hubContext;
        private readonly ILogger<MatchesController> _logger;

        public MatchesController(BasketballContext context, IHubContext<BasketBallHub> hubContext, ILogger<MatchesController> logger)
        {
            _context = context;
            _hubContext = hubContext;
            _logger = logger;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<MatchDto>>> GetMatches()
        {
            var matches = await _context.Matches
                .Include(m => m.HomeTeam)
                .Include(m => m.AwayTeam)
                .ToListAsync();

            return Ok(matches.Select(m => m.ToDto()));
        }

        [HttpGet("live")]
        public async Task<ActionResult<IEnumerable<MatchDto>>> GetLiveMatches()
        {
            var matches = await _context.Matches
                .Include(m => m.HomeTeam)
                .Include(m => m.AwayTeam)
                .Where(m => m.Status == MatchStatus.InProgress)
                .ToListAsync();

            return Ok(matches.Select(m => m.ToDto()));
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<MatchDto>> GetMatch(int id)
        {
            var match = await _context.Matches
                .Include(m => m.HomeTeam)
                .Include(m => m.AwayTeam)
                .FirstOrDefaultAsync(m => m.Id == id);

            if (match == null)
            {
                return NotFound();
            }

            return Ok(match.ToDto());
        }

        [HttpGet("{id}/scores")]
        public async Task<ActionResult<object>> GetMatchScores(int id)
        {
            var match = await _context.Matches.FindAsync(id);
            if (match == null)
            {
                return NotFound($"Match avec ID {id} introuvable.");
            }

            return new
            {
                HomeTeamScore = match.HomeTeamScore,
                AwayTeamScore = match.AwayTeamScore
            };
        }

        [HttpPost]
        public async Task<ActionResult<MatchDto>> PostMatch(Match match)
        {
            _logger.LogInformation("Received match data: {MatchData}", match);

            if (match.HomeTeamStartingPlayers == null || match.HomeTeamStartingPlayers.Count != 5)
                return BadRequest("Home team must have exactly 5 starting players.");

            if (match.AwayTeamStartingPlayers == null || match.AwayTeamStartingPlayers.Count != 5)
                return BadRequest("Away team must have exactly 5 starting players.");

            var homeTeam = await _context.Teams.FindAsync(match.HomeTeamId);
            var awayTeam = await _context.Teams.FindAsync(match.AwayTeamId);

            if (homeTeam == null || awayTeam == null)
                return BadRequest("Invalid HomeTeamId or AwayTeamId.");

            foreach (var playerId in match.HomeTeamStartingPlayers)
            {
                var player = await _context.Players.FindAsync(playerId);
                if (player == null) return BadRequest($"Invalid player ID {playerId} in HomeTeamStartingPlayers.");
            }

            foreach (var playerId in match.AwayTeamStartingPlayers)
            {
                var player = await _context.Players.FindAsync(playerId);
                if (player == null) return BadRequest($"Invalid player ID {playerId} in AwayTeamStartingPlayers.");
            }

            _context.Matches.Add(match);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetMatch", new { id = match.Id }, match.ToDto());
        }

        [HttpPut("{id}/finish")]
        public async Task<IActionResult> FinishMatch(int id)
        {
            var match = await _context.Matches.FindAsync(id);
            if (match == null) return NotFound();

            if (match.Status == MatchStatus.Finished)
                return BadRequest("Le match est déjà terminé.");

            match.Status = MatchStatus.Finished;
            await _context.SaveChangesAsync();

            await _hubContext.Clients.All.SendAsync("MatchStatusUpdated", id, MatchStatus.Finished);

            return NoContent(); 
        }

        [HttpPut("{id}/currentQuarter")]
        public async Task<IActionResult> UpdateCurrentQuarter(int id, [FromBody] int currentQuarter)
        {
            var match = await _context.Matches.FindAsync(id);
            if (match == null) return NotFound($"Match with ID {id} not found.");

            match.CurrentQuarter = currentQuarter;
            _context.Matches.Update(match);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutMatch(int id, Match match)
        {
            if (id != match.Id) return BadRequest();

            var homeTeam = await _context.Teams.FindAsync(match.HomeTeamId);
            var awayTeam = await _context.Teams.FindAsync(match.AwayTeamId);

            if (homeTeam == null || awayTeam == null) return BadRequest("Invalid HomeTeamId or AwayTeamId.");

            match.HomeTeam = homeTeam;
            match.AwayTeam = awayTeam;

            _context.Entry(match).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!MatchExists(id)) return NotFound();
                else throw;
            }

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteMatch(int id)
        {
            var match = await _context.Matches.FindAsync(id);
            if (match == null) return NotFound();

            _context.Matches.Remove(match);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpGet("upcoming")]
        public async Task<ActionResult<object>> GetUpcomingMatches()
        {
            try
            {
                using var httpClient = new System.Net.Http.HttpClient();
                httpClient.DefaultRequestHeaders.Add("User-Agent", "curl/7.68.0");
                httpClient.DefaultRequestHeaders.Add("Accept", "*/*");
                
                // 1. Fetch base scoreboard to get the calendar
                var baseResponse = await httpClient.GetStringAsync("https://site.api.espn.com/apis/site/v2/sports/basketball/nba/scoreboard");
                var rootNode = System.Text.Json.Nodes.JsonNode.Parse(baseResponse);
                
                var calendarArray = rootNode["leagues"]?[0]?["calendar"]?.AsArray();
                if (calendarArray == null) return Content(baseResponse, "application/json");

                var todayStr = System.DateTime.UtcNow.ToString("yyyy-MM-dd");
                var upcomingDates = new List<string>();

                foreach (var dateNode in calendarArray)
                {
                    var dateStr = dateNode.ToString();
                    if (string.Compare(dateStr, todayStr) >= 0)
                    {
                        // ESPN dates look like "2026-10-03T07:00Z". Convert to "20261003"
                        var yyyyMMdd = dateStr.Substring(0, 10).Replace("-", "");
                        upcomingDates.Add(yyyyMMdd);
                        if (upcomingDates.Count >= 7) break; // Fetch next 7 match days
                    }
                }

                if (upcomingDates.Count == 0) return Content(baseResponse, "application/json");

                var fetchTasks = upcomingDates.Select(date => 
                    httpClient.GetStringAsync($"https://site.api.espn.com/apis/site/v2/sports/basketball/nba/scoreboard?dates={date}")
                ).ToList();

                var responses = await Task.WhenAll(fetchTasks);
                var allEvents = new System.Text.Json.Nodes.JsonArray();

                foreach (var responseStr in responses)
                {
                    var dayNode = System.Text.Json.Nodes.JsonNode.Parse(responseStr);
                    var dayEvents = dayNode?["events"]?.AsArray();
                    if (dayEvents != null)
                    {
                        foreach (var ev in dayEvents)
                        {
                            // Clone node by parsing its string representation to add to a new array
                            var evClone = System.Text.Json.Nodes.JsonNode.Parse(ev.ToJsonString());
                            allEvents.Add(evClone);
                        }
                    }
                }

                // Replace the events array in the base response with our merged array
                rootNode["events"] = allEvents;

                return Content(rootNode.ToJsonString(), "application/json");
            }
            catch (System.Exception ex)
            {
                _logger.LogError(ex, "Failed to fetch upcoming matches from ESPN.");
                return StatusCode(500, "Failed to fetch upcoming matches.");
            }
        }

        private bool MatchExists(int id) => _context.Matches.Any(e => e.Id == id);
    }
}
