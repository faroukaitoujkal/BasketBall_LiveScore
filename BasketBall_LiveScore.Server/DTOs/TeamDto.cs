namespace BasketBall_LiveScore.Server.DTOs
{
    public class TeamDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string? City { get; set; }
        public string? CoachName { get; set; }
        public string? LogoUrl { get; set; }
        public string? PrimaryColor { get; set; }
    }
}
