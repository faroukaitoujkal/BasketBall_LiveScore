namespace BasketBall_LiveScore.Server.Models
{
    public class TimeoutMatch
    {
        public int Id { get; set; }
        public int MatchId { get; set; }
        public Match Match { get; set; }
        public int Quarter { get; set; }
        public TimeSpan GameTime { get; set; }
        public TimeSpan Duration { get; set; }
    }
}
