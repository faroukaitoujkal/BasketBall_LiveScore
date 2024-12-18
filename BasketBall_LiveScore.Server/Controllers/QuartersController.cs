using BasketBall_LiveScore.Server.Data;
using BasketBall_LiveScore.Server.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BasketBall_LiveScore.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class QuartersController : ControllerBase
    {
        private readonly BasketballContext _context;

        public QuartersController(BasketballContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Quarter>>> GetQuarters()
        {
            return await _context.Quarters.ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Quarter>> GetQuarter(int id)
        {
            var quarter = await _context.Quarters.FindAsync(id);

            if (quarter == null)
            {
                return NotFound();
            }

            return quarter;
        }

        [HttpPost]
        public async Task<ActionResult<Quarter>> PostQuarter(Quarter quarter)
        {
            _context.Quarters.Add(quarter);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetQuarter", new { id = quarter.Id }, quarter);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutQuarter(int id, Quarter quarter)
        {
            if (id != quarter.Id)
            {
                return BadRequest();
            }

            _context.Entry(quarter).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!QuarterExists(id))
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
        public async Task<IActionResult> DeleteQuarter(int id)
        {
            var quarter = await _context.Quarters.FindAsync(id);
            if (quarter == null)
            {
                return NotFound();
            }

            _context.Quarters.Remove(quarter);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool QuarterExists(int id)
        {
            return _context.Quarters.Any(e => e.Id == id);
        }
    }
}
