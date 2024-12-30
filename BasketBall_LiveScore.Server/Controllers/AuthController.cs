using BasketBall_LiveScore.Server.Data;
using BasketBall_LiveScore.Server.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading.Tasks;

namespace BasketBall_LiveScore.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly BasketballContext _context;

        public AuthController(BasketballContext context)
        {
            _context = context;
        }

        [HttpPost("register")]
        public async Task<ActionResult<User>> Register(User user)
        {
            if (_context.Users.Any(u => u.Email == user.Email))
            {
                return BadRequest("Email is already taken");
            }

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return Ok(user); // Renvoie une réponse Ok avec l'utilisateur créé
        }

        [HttpPost("login")]
        public async Task<ActionResult<User>> Login(User login)
        {
            var user = await _context.Users
                .SingleOrDefaultAsync(u => u.Email == login.Email && u.Password == login.Password);

            if (user == null)
            {
                return Unauthorized();
            }

            return Ok(user);
        }

        private bool UserExists(int id)
        {
            return _context.Users.Any(e => e.Id == id);
        }
    }
}
