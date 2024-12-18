using BasketBall_LiveScore.Server.Data;
using BasketBall_LiveScore.Server.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BasketBall_LiveScore.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PlayerScoresController : ControllerBase
    {
        private readonly BasketballContext _context;

        public PlayerScoresController(BasketballContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<PlayerScore>>> GetPlayerScores()
        {
            return await _context.PlayerScores.ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<PlayerScore>> GetPlayerScore(int id)
        {
            var playerScore = await _context.PlayerScores.FindAsync(id);

            if (playerScore == null)
            {
                return NotFound();
            }

            return playerScore;
        }

        [HttpPost]
        public async Task<ActionResult<PlayerScore>> PostPlayerScore(PlayerScore playerScore)
        {
            _context.PlayerScores.Add(playerScore);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetPlayerScore", new { id = playerScore.Id }, playerScore);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutPlayerScore(int id, PlayerScore playerScore)
        {
            if (id != playerScore.Id)
            {
                return BadRequest();
            }

            _context.Entry(playerScore).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!PlayerScoreExists(id))
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
        public async Task<IActionResult> DeletePlayerScore(int id)
        {
            var playerScore = await _context.PlayerScores.FindAsync(id);
            if (playerScore == null)
            {
                return NotFound();
            }

            _context.PlayerScores.Remove(playerScore);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool PlayerScoreExists(int id)
        {
            return _context.PlayerScores.Any(e => e.Id == id);
        }
    }
}
