namespace BasketBall_LiveScore.Server.Models
{
    public class Team
    {
        public int TeamId { get; set; } // Primary key
        public string Name { get; set; } = string.Empty;

        // Relationships
        public List<Player> Players { get; set; } = new();
        public int MatchId { get; set; } // Foreign key
        public Match Match { get; set; } = null!;
    }
}
