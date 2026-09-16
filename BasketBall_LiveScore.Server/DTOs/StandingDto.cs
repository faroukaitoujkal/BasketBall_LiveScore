namespace BasketBall_LiveScore.Server.DTOs
{
    public class StandingDto
    {
        public int TeamId { get; set; }
        public string TeamName { get; set; }
        public string? TeamLogoUrl { get; set; }
        public int GamesPlayed { get; set; }
        public int Wins { get; set; }
        public int Losses { get; set; }
        public int PointsFor { get; set; }
        public int PointsAgainst { get; set; }
        public int PointDifferential => PointsFor - PointsAgainst;
        public double WinPercentage => GamesPlayed == 0 ? 0 : (double)Wins / GamesPlayed;
    }
}
