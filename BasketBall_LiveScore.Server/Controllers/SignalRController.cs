using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using BasketBall_LiveScore.Server;

namespace BasketBall_LiveScore.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SignalRController : ControllerBase
    {
        private readonly IHubContext<BasketBallHub> _hubContext;

        // Injection de dépendance du Hub SignalR
        public SignalRController(IHubContext<BasketBallHub> hubContext)
        {
            _hubContext = hubContext;
        }

        // Endpoint pour envoyer un message à tous les clients connectés via SignalR
        [HttpPost("send-message")]
        public async Task<IActionResult> SendMessage([FromBody] string message)
        {
            if (string.IsNullOrEmpty(message))
            {
                return BadRequest("Le message ne peut pas être vide.");
            }

            // Envoi du message à tous les clients connectés
            await _hubContext.Clients.All.SendAsync("ReceiveMessage", message);

            return Ok(new { Status = "Message envoyé", Message = message });
        }
    }
}
