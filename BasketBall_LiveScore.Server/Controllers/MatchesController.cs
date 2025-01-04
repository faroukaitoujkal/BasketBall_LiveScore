using BasketBall_LiveScore.Server.Data;
using BasketBall_LiveScore.Server.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System.Threading.Tasks;
using System.Linq;

namespace BasketBall_LiveScore.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MatchesController : ControllerBase
    {
        private readonly BasketballContext _context;
        private readonly ILogger<MatchesController> _logger;

        public MatchesController(BasketballContext context, ILogger<MatchesController> logger)
        {
            _context = context;
            _logger = logger;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Match>>> GetMatches()
        {
            var matches = await _context.Matches
                .Include(m => m.HomeTeam)
                .Include(m => m.AwayTeam)
                .ToListAsync();

            _logger.LogInformation("Matches retrieved: {Matches}", matches);

            return Ok(matches);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Match>> GetMatch(int id)
        {
            var match = await _context.Matches
                .Include(m => m.HomeTeam)
                .Include(m => m.AwayTeam)
                .FirstOrDefaultAsync(m => m.Id == id);

            if (match == null)
            {
                return NotFound();
            }

            return Ok(match);
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
        public async Task<ActionResult<Match>> PostMatch(Match match)
        {
            _logger.LogInformation("Received match data: {MatchData}", match);

            if (match.HomeTeamStartingPlayers == null || match.HomeTeamStartingPlayers.Count != 5)
            {
                return BadRequest("Home team must have exactly 5 starting players.");
            }

            if (match.AwayTeamStartingPlayers == null || match.AwayTeamStartingPlayers.Count != 5)
            {
                return BadRequest("Away team must have exactly 5 starting players.");
            }

            var homeTeam = await _context.Teams.FindAsync(match.HomeTeamId);
            var awayTeam = await _context.Teams.FindAsync(match.AwayTeamId);

            if (homeTeam == null || awayTeam == null)
            {
                return BadRequest("Invalid HomeTeamId or AwayTeamId.");
            }

            // Vérification et attachement des joueurs des deux équipes
            foreach (var playerId in match.HomeTeamStartingPlayers)
            {
                var player = await _context.Players.FindAsync(playerId);
                if (player == null)
                {
                    return BadRequest($"Invalid player ID {playerId} in HomeTeamStartingPlayers.");
                }
                else
                {
                    // Vérifier si le joueur est déjà suivi, sinon l'attacher
                    var entry = _context.Entry(player);
                    if (entry.State == EntityState.Detached)
                    {
                        _context.Players.Attach(player);
                    }
                }
            }

            foreach (var playerId in match.AwayTeamStartingPlayers)
            {
                var player = await _context.Players.FindAsync(playerId);
                if (player == null)
                {
                    return BadRequest($"Invalid player ID {playerId} in AwayTeamStartingPlayers.");
                }
                else
                {
                    // Vérifier si le joueur est déjà suivi, sinon l'attacher
                    var entry = _context.Entry(player);
                    if (entry.State == EntityState.Detached)
                    {
                        _context.Players.Attach(player);
                    }
                }
            }

            // Ajouter le match à la base de données
            _context.Matches.Add(match);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetMatch", new { id = match.Id }, match);
        }

        [HttpPut("{id}/finish")]
        public async Task<IActionResult> FinishMatch(int id)
        {
            var match = await _context.Matches.FindAsync(id);
            if (match == null)
            {
                return NotFound();
            }

            if (match.IsFinished)
            {
                return BadRequest("Le match est déjà terminé.");
            }

            match.IsFinished = true;
            await _context.SaveChangesAsync();

            return NoContent(); 
        }

        [HttpPut("{id}/currentQuarter")]
        public async Task<IActionResult> UpdateCurrentQuarter(int id, [FromBody] int currentQuarter)
        {
            var match = await _context.Matches.FindAsync(id);
            if (match == null)
            {
                return NotFound($"Match with ID {id} not found.");
            }

            match.CurrentQuarter = currentQuarter;
            _context.Matches.Update(match);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutMatch(int id, Match match)
        {
            if (id != match.Id)
            {
                return BadRequest();
            }

            var homeTeam = await _context.Teams.FindAsync(match.HomeTeamId);
            var awayTeam = await _context.Teams.FindAsync(match.AwayTeamId);

            if (homeTeam == null || awayTeam == null)
            {
                return BadRequest("Invalid HomeTeamId or AwayTeamId.");
            }

            match.HomeTeam = homeTeam;
            match.AwayTeam = awayTeam;

            _context.Entry(match).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!MatchExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteMatch(int id)
        {
            var match = await _context.Matches.FindAsync(id);
            if (match == null)
            {
                return NotFound();
            }

            _context.Matches.Remove(match);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool MatchExists(int id)
        {
            return _context.Matches.Any(e => e.Id == id);
        }
    }
}
