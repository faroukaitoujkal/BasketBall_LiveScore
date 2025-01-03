using BasketBall_LiveScore.Server.Data;
using BasketBall_LiveScore.Server.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

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

        // Récupérer toutes les fautes
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Foul>>> GetFouls()
        {
            return await _context.Fouls.Include(f => f.Player).ToListAsync();
        }

        // Récupérer une faute spécifique par ID
        [HttpGet("{id}")]
        public async Task<ActionResult<Foul>> GetFoul(int id)
        {
            var foul = await _context.Fouls.Include(f => f.Player).FirstOrDefaultAsync(f => f.Id == id);

            if (foul == null)
            {
                return NotFound();
            }

            return foul;
        }

        // Ajouter une faute
        [HttpPost]
        public async Task<ActionResult<Foul>> PostFoul(Foul foul)
        {
            // Vérifier si le joueur existe
            var player = await _context.Players.FindAsync(foul.PlayerId);
            if (player == null)
            {
                // Si le joueur n'existe pas, retourner une erreur
                return NotFound(new { message = "Joueur non trouvé." });
            }

            // Vérifier si l'entité Player est déjà suivie
            var entry = _context.Entry(player);
            if (entry.State == EntityState.Detached)
            {
                // Si l'entité est détachée, l'attacher
                _context.Players.Attach(player);
            }

            // Associer la faute au joueur existant
            foul.Player = player;

            // Ajouter la faute à la base de données
            _context.Fouls.Add(foul);
            await _context.SaveChangesAsync();

            // Retourner la faute avec un code de statut "Created"
            return CreatedAtAction("GetFoul", new { id = foul.Id }, foul);
        }

        // Mettre à jour une faute existante
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

        // Supprimer une faute
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
