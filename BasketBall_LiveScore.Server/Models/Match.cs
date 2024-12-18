namespace BasketBall_LiveScore.Server.Models
{
    public class Match
    {
        public int Id { get; set; }
        public DateTime MatchDate { get; set; }
        public string Location { get; set; }

        public int HomeTeamId { get; set; }
        public Team HomeTeam { get; set; }

        public int AwayTeamId { get; set; }
        public Team AwayTeam { get; set; }

        public List<PlayerScore> PlayerScores { get; set; } = new List<PlayerScore>();
        public List<Foul> Fouls { get; set; } = new List<Foul>();
        public List<Substitution> Substitutions { get; set; } = new List<Substitution>();
        public List<Quarter> Quarters { get; set; } = new List<Quarter>();
        public List<TimeoutMatch> Timeouts { get; set; } = new List<TimeoutMatch>();

        public string EncodedBy { get; set; }
        public List<string> LiveEncoders { get; set; } = new List<string>();
    }
}
