namespace BasketBall_LiveScore.Server.Models
{
    public class Match
    {
        public int MatchId { get; set; } // Primary key
        public string MatchNumber { get; set; } = string.Empty;
        public string Competition { get; set; } = string.Empty;
        public DateTime DateTime { get; set; }
        public string Hall { get; set; } = string.Empty;
        public string City { get; set; } = string.Empty;
        public string Country { get; set; } = string.Empty;
        public int NumberOfPeriods { get; set; }
        public int PeriodDuration { get; set; }
        public int OvertimeDuration { get; set; }

        // Relationships
        public List<Team> Teams { get; set; } = new();
        public List<MatchEvent> MatchEvents { get; set; } = new();
    }
}
