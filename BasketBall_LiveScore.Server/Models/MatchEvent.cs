namespace BasketBall_LiveScore.Server.Models
{
    public class MatchEvent
    {
        public int MatchEventId { get; set; } // Primary key
        public string EventType { get; set; } = string.Empty; // e.g., "Basket", "Foul"
        public int? PlayerId { get; set; } // Permet les valeurs NULL
        public Player Player { get; set; } = null!;
        public int MatchId { get; set; } // Foreign key
        public Match Match { get; set; } = null!;
        public int Quarter { get; set; } // Quarter during which the event occurred
        public TimeSpan Time { get; set; } // Time of the event
    }
}
