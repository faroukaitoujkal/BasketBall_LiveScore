namespace BasketBall_LiveScore.Server.Models
{
    public class Quarter
    {
        public int Id { get; set; }
        public int MatchId { get; set; }
        public Match? Match { get; set; }
        public int QuarterNumber { get; set; }
        public TimeSpan Duration { get; set; }
    }
}
