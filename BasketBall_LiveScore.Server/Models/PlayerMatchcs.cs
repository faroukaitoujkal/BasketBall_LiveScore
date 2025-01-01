namespace BasketBall_LiveScore.Server.Models
{
    public class PlayerMatch
    {
        public int PlayerId { get; set; }
        public Player Player { get; set; }

        public int MatchId { get; set; }
        public Match Match { get; set; }
    }
}
