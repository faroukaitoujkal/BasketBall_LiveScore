using Microsoft.AspNetCore.SignalR;
using Serilog;

namespace BasketBall_LiveScore.Server
{
    public class BasketBallHub : Hub
    {
        public string GetConnectionId()
        {
            Log.Information("ConnectionId requested: {ConnectionId}", Context.ConnectionId);
            return Context.ConnectionId ?? "No connection ID available";
        }

        public override async Task OnConnectedAsync()
        {
            Log.Information("Client connected with ConnectionId: {ConnectionId}", Context.ConnectionId);
            await base.OnConnectedAsync();
        }

        public async Task UpdateQuarter(int matchId, int currentQuarter)
        {
            await Clients.All.SendAsync("QuarterUpdated", currentQuarter);
        }

        public async Task SendMessage(string message)
        {
            Log.Information("SendMessage called with message: {Message}", message);
            await Clients.All.SendAsync("ReceiveMessage", message);
        }
    }
}
