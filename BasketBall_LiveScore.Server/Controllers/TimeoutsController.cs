using BasketBall_LiveScore.Server.Data;
using BasketBall_LiveScore.Server.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BasketBall_LiveScore.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TimeoutsController : ControllerBase
    {
        private readonly BasketballContext _context;

        public TimeoutsController(BasketballContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<TimeoutMatch>>> GetTimeouts()
        {
            return await _context.Timeouts.ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<TimeoutMatch>> GetTimeout(int id)
        {
            var timeout = await _context.Timeouts.FindAsync(id);

            if (timeout == null)
            {
                return NotFound();
            }

            return timeout;
        }

        /*[HttpPost]
        public async Task<ActionResult<TimeoutMatch>> PostTimeout(TimeoutMatch timeout)
        {
            _context.Timeouts.Add(timeout);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetTimeout", new { id = timeout.Id }, timeout);
        }*/

        [HttpPost("create-from-match/{matchId}")]
        public async Task<ActionResult<TimeoutMatch>> CreateTimeoutFromMatch(int matchId, [FromBody] TimeoutMatch timeout)
        {
            // Récupérer le match correspondant à matchId
            var match = await _context.Matches.FindAsync(matchId);
            if (match == null)
            {
                return NotFound($"Match avec ID {matchId} introuvable.");
            }

            // Associez l'ID du Match au timeout
            timeout.MatchId = matchId;

            // Assurez-vous que le timeout n'a pas de référence directe au match (éviter les conflits d'entités)
            timeout.Match = null;

            // Ajouter et sauvegarder dans la base de données
            _context.Timeouts.Add(timeout);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetTimeout), new { id = timeout.Id }, timeout);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutTimeout(int id, TimeoutMatch timeout)
        {
            if (id != timeout.Id)
            {
                return BadRequest();
            }

            _context.Entry(timeout).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!TimeoutExists(id))
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
        public async Task<IActionResult> DeleteTimeout(int id)
        {
            var timeout = await _context.Timeouts.FindAsync(id);
            if (timeout == null)
            {
                return NotFound();
            }

            _context.Timeouts.Remove(timeout);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool TimeoutExists(int id)
        {
            return _context.Timeouts.Any(e => e.Id == id);
        }
    }
}
