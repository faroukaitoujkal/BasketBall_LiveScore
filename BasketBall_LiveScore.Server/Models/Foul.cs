namespace BasketBall_LiveScore.Server.Models
{
    public class Foul
    {
        public int Id { get; set; }
        public int PlayerId { get; set; }
        public Player Player { get; set; }
        public string FoulType { get; set; } // P0, P1, P2, P3
        public int Quarter { get; set; }
        public TimeSpan GameTime { get; set; }
        public int MatchId { get; set; }  // Identifiant du match auquel la faute appartient

    }
}
