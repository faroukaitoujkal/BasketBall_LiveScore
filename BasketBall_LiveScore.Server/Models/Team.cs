namespace BasketBall_LiveScore.Server.Models
{
    public class Team
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string? City { get; set; }
        public string? CoachName { get; set; }
        public string? LogoUrl { get; set; }
        public string? PrimaryColor { get; set; }
        public List<Player> Players { get; set; } = new List<Player>();
    }
}
