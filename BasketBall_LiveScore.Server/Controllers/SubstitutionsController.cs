using BasketBall_LiveScore.Server.Data;
using BasketBall_LiveScore.Server.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BasketBall_LiveScore.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SubstitutionsController : ControllerBase
    {
        private readonly BasketballContext _context;

        public SubstitutionsController(BasketballContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Substitution>>> GetSubstitutions()
        {
            return await _context.Substitutions.ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Substitution>> GetSubstitution(int id)
        {
            var substitution = await _context.Substitutions.FindAsync(id);

            if (substitution == null)
            {
                return NotFound();
            }

            return substitution;
        }

        [HttpPost]
        public async Task<ActionResult<Substitution>> PostSubstitution(Substitution substitution)
        {
            _context.Substitutions.Add(substitution);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetSubstitution", new { id = substitution.Id }, substitution);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutSubstitution(int id, Substitution substitution)
        {
            if (id != substitution.Id)
            {
                return BadRequest();
            }

            _context.Entry(substitution).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!SubstitutionExists(id))
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
        public async Task<IActionResult> DeleteSubstitution(int id)
        {
            var substitution = await _context.Substitutions.FindAsync(id);
            if (substitution == null)
            {
                return NotFound();
            }

            _context.Substitutions.Remove(substitution);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool SubstitutionExists(int id)
        {
            return _context.Substitutions.Any(e => e.Id == id);
        }
    }
}
