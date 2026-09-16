using BasketBall_LiveScore.Server.Models;

namespace BasketBall_LiveScore.Server.DTOs
{
    public class MatchDto
    {
        public int Id { get; set; }
        public DateTime MatchDate { get; set; }
        public string Location { get; set; }
        
        public int HomeTeamId { get; set; }
        public TeamDto? HomeTeam { get; set; }
        public int AwayTeamId { get; set; }
        public TeamDto? AwayTeam { get; set; }
        
        public int NumberOfQuarters { get; set; }
        public int QuarterDuration { get; set; }
        public double TimeoutDuration { get; set; }
        
        public int CurrentQuarter { get; set; }
        public int HomeTeamScore { get; set; }
        public int AwayTeamScore { get; set; }
        public MatchStatus Status { get; set; }
        public string? Season { get; set; }
    }
}
