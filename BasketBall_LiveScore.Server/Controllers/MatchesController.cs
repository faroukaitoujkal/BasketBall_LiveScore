using BasketBall_LiveScore.Server.Data;
using BasketBall_LiveScore.Server.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System.Threading.Tasks;

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

            return matches;
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

            return match;
        }

        [HttpPost]
        public async Task<ActionResult<Match>> PostMatch(Match match)
        {
            _logger.LogInformation("Received match data: {MatchData}", match);

            var homeTeam = await _context.Teams.FindAsync(match.HomeTeamId);
            var awayTeam = await _context.Teams.FindAsync(match.AwayTeamId);

            if (homeTeam == null || awayTeam == null)
            {
                return BadRequest("Invalid HomeTeamId or AwayTeamId.");
            }

            match.HomeTeam = homeTeam;
            match.AwayTeam = awayTeam;

            _context.Matches.Add(match);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetMatch", new { id = match.Id }, match);
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
