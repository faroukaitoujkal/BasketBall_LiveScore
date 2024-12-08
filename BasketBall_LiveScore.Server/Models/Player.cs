namespace BasketBall_LiveScore.Server.Models
{
    public class Player
    {
        public int PlayerId { get; set; } // Primary key
        public string Name { get; set; } = string.Empty;
        public int Number { get; set; }

        // Relationships
        public int TeamId { get; set; } // Foreign key
        public Team Team { get; set; } = null!;
    }
}
