using Microsoft.AspNetCore.SignalR;
using Serilog;

namespace BasketBall_LiveScore.Server
{
    public class BasketBallHub : Hub
    {
        public async Task SendMessage(string message)
        {
            Log.Information("SendMessage called with message: {Message}", message);
            await Clients.All.SendAsync("ReceiveMessage", message);
        }
    }
}
