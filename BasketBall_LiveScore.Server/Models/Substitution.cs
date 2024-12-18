namespace BasketBall_LiveScore.Server.Models
{
    public class Substitution
    {
        public int Id { get; set; }
        public int PlayerInId { get; set; }
        public Player PlayerIn { get; set; }
        public int PlayerOutId { get; set; }
        public Player PlayerOut { get; set; }
        public int Quarter { get; set; }
        public TimeSpan GameTime { get; set; }
    }
}
