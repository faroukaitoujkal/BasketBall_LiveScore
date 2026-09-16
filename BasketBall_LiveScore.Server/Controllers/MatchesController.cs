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

        private bool MatchExists(int id) => _context.Matches.Any(e => e.Id == id);
    }
}
