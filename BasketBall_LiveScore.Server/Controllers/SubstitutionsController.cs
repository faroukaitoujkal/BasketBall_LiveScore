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

        // Récupérer toutes les substitutions
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Substitution>>> GetSubstitutions()
        {
            return await _context.Substitutions
                .Include(s => s.PlayerIn)  // Inclure les détails du joueur entrant
                .Include(s => s.PlayerOut) // Inclure les détails du joueur sortant
                .ToListAsync();
        }

        // Récupérer une substitution par son ID
        [HttpGet("{id}")]
        public async Task<ActionResult<Substitution>> GetSubstitution(int id)
        {
            var substitution = await _context.Substitutions
                .Include(s => s.PlayerIn)
                .Include(s => s.PlayerOut)
                .FirstOrDefaultAsync(s => s.Id == id);

            if (substitution == null)
            {
                return NotFound();
            }

            return substitution;
        }

        [HttpPost]
        public async Task<ActionResult<Substitution>> PostSubstitution(Substitution substitution)
        {
            if (substitution.PlayerInId == substitution.PlayerOutId)
            {
                return BadRequest("Un joueur ne peut pas entrer et sortir en même temps.");
            }

            // Vérifier que les joueurs existent dans la base de données
            var playerIn = await _context.Players.FindAsync(substitution.PlayerInId);
            var playerOut = await _context.Players.FindAsync(substitution.PlayerOutId);

            if (playerIn == null || playerOut == null)
            {
                return NotFound("Un ou plusieurs joueurs non trouvés.");
            }

            // Vérifier que matchId est bien défini
            if (substitution.MatchId == 0)
            {
                return BadRequest("Le matchId ne peut pas être nul ou invalide.");
            }

            // Vérifier si le match existe
            var match = await _context.Matches.FindAsync(substitution.MatchId);
            if (match == null)
            {
                return NotFound("Le match spécifié n'a pas été trouvé.");
            }

            // Ajouter la substitution à la base de données
            _context.Substitutions.Add(substitution);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetSubstitution", new { id = substitution.Id }, substitution);
        }

        // Mettre à jour une substitution existante
        [HttpPut("{id}")]
        public async Task<IActionResult> PutSubstitution(int id, Substitution substitution)
        {
            if (id != substitution.Id)
            {
                return BadRequest();
            }

            // Vérifier si la substitution existe dans la base
            var existingSubstitution = await _context.Substitutions.FindAsync(id);
            if (existingSubstitution == null)
            {
                return NotFound();
            }

            // Vérifier que les joueurs sont valides
            var playerIn = await _context.Players.FindAsync(substitution.PlayerInId);
            var playerOut = await _context.Players.FindAsync(substitution.PlayerOutId);
            if (playerIn == null || playerOut == null)
            {
                return NotFound("Un ou plusieurs joueurs non trouvés.");
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

        // Supprimer une substitution par son ID
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

        // Vérifier si une substitution existe dans la base de données
        private bool SubstitutionExists(int id)
        {
            return _context.Substitutions.Any(e => e.Id == id);
        }
    }
}
