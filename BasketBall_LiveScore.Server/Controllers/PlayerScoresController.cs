using BasketBall_LiveScore.Server.Data;
using BasketBall_LiveScore.Server.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;

namespace BasketBall_LiveScore.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PlayerScoresController : ControllerBase
    {
        private readonly BasketballContext _context;
        private readonly IHubContext<BasketBallHub> _hubContext;


        public PlayerScoresController(BasketballContext context, IHubContext<BasketBallHub> hubContext)
        {
            _context = context;
            _hubContext = hubContext;
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

        [HttpGet("match/{matchId}")]
        public async Task<ActionResult<IEnumerable<PlayerScore>>> GetScoresByMatch(int matchId)
        {
            var scores = await _context.PlayerScores
                                       .Where(ps => ps.MatchId == matchId)
                                       .ToListAsync();

            if (scores == null || scores.Count == 0)
            {
                return NotFound($"Aucun score trouvé pour le match avec l'ID {matchId}.");
            }

            return Ok(scores);
        }

        [HttpPost("add-score")]
        public async Task<ActionResult<PlayerScore>> AddScore([FromBody] PlayerScore playerScore)
        {
            // Vérifier si le joueur existe
            var player = await _context.Players.FindAsync(playerScore.PlayerId);
            if (player == null)
            {
                return NotFound($"Joueur avec ID {playerScore.PlayerId} introuvable.");
            }

            // Vérifier si le match existe
            var match = await _context.Matches.FindAsync(playerScore.MatchId);
            if (match == null)
            {
                return NotFound($"Match avec ID {playerScore.MatchId} introuvable.");
            }

            // Définir le scoreTime pour le moment actuel
            playerScore.ScoreTime = DateTime.UtcNow;

            // Ajouter le score du joueur
            _context.PlayerScores.Add(playerScore);

            // Incrémenter le score de l'équipe correspondante
            if (player.TeamId == match.HomeTeamId)
            {
                match.HomeTeamScore += playerScore.Points;
            }
            else if (player.TeamId == match.AwayTeamId)
            {
                match.AwayTeamScore += playerScore.Points;
            }

            // Sauvegarder les changements
            await _context.SaveChangesAsync();

            // Diffuser les informations de mise à jour via SignalR
            var updatedData = new
            {
                matchId = playerScore.MatchId,
                homeTeamScore = match.HomeTeamScore,
                awayTeamScore = match.AwayTeamScore,
                playerScore
            };

            await _hubContext.Clients.All.SendAsync("ScoreUpdated", updatedData);

            // Retourner le résultat
            return CreatedAtAction(nameof(GetPlayerScore), new { id = playerScore.Id }, playerScore);
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
