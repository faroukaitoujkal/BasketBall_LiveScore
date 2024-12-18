using BasketBall_LiveScore.Server.Data;
using BasketBall_LiveScore.Server.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BasketBall_LiveScore.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FoulsController : ControllerBase
    {
        private readonly BasketballContext _context;

        public FoulsController(BasketballContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Foul>>> GetFouls()
        {
            return await _context.Fouls.ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Foul>> GetFoul(int id)
        {
            var foul = await _context.Fouls.FindAsync(id);

            if (foul == null)
            {
                return NotFound();
            }

            return foul;
        }

        [HttpPost]
        public async Task<ActionResult<Foul>> PostFoul(Foul foul)
        {
            _context.Fouls.Add(foul);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetFoul", new { id = foul.Id }, foul);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutFoul(int id, Foul foul)
        {
            if (id != foul.Id)
            {
                return BadRequest();
            }

            _context.Entry(foul).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!FoulExists(id))
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
        public async Task<IActionResult> DeleteFoul(int id)
        {
            var foul = await _context.Fouls.FindAsync(id);
            if (foul == null)
            {
                return NotFound();
            }

            _context.Fouls.Remove(foul);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool FoulExists(int id)
        {
            return _context.Fouls.Any(e => e.Id == id);
        }
    }
}
