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

        // Récupérer tous les quart-temps
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Quarter>>> GetQuarters()
        {
            return await _context.Quarters.ToListAsync();
        }

        // Récupérer un quart-temps spécifique par ID
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

        // Créer un quart-temps
        [HttpPost]
        public async Task<ActionResult<Quarter>> PostQuarter(Quarter quarter)
        {
            // Vérifier si le match existe dans la base de données
            if (quarter.MatchId == null || !await _context.Matches.AnyAsync(m => m.Id == quarter.MatchId))
            {
                return BadRequest("Le match spécifié n'existe pas.");
            }

            // Valider que le numéro de quart-temps est valide (doit être entre 1 et 4)
            if (quarter.QuarterNumber <= 0 || quarter.QuarterNumber > 4)
            {
                return BadRequest("Le numéro de quart-temps doit être entre 1 et 4.");
            }

            // Vérifier que la durée du quart-temps est valide (non nulle et supérieure à zéro)
            if (quarter.Duration.TotalSeconds <= 0)
            {
                return BadRequest("La durée du quart-temps doit être supérieure à zéro.");
            }

            // Ajouter le quart-temps à la base de données
            _context.Quarters.Add(quarter);

            // Sauvegarder les changements dans la base de données
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetQuarter", new { id = quarter.Id }, quarter);
        }

        // Mettre à jour un quart-temps
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

        // Supprimer un quart-temps
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

        // Vérifier si un quart-temps existe
        private bool QuarterExists(int id)
        {
            return _context.Quarters.Any(e => e.Id == id);
        }
    }
}
