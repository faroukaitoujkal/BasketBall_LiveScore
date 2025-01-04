using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;
using System.Collections.Generic;

namespace BasketBall_LiveScore.Server.Models
{
    public class Match
    {
        public int Id { get; set; }

        [Required]
        public DateTime MatchDate { get; set; }

        [Required]
        public string? Location { get; set; }

        [Required]
        public int HomeTeamId { get; set; }

        [Required]
        public int AwayTeamId { get; set; }

        [JsonIgnore]
        public Team? HomeTeam { get; set; }

        [JsonIgnore]
        public Team? AwayTeam { get; set; }

        [Required]
        public int NumberOfQuarters { get; set; }

        [Required]
        public int QuarterDuration { get; set; }

        [Required]
        public double TimeoutDuration { get; set; }

        [Required]
        public string? EncodedBy { get; set; }

        public int CurrentQuarter { get; set; } = 1; 

        public List<PlayerScore> PlayerScores { get; set; } = new List<PlayerScore>();
        public List<Foul> Fouls { get; set; } = new List<Foul>();
        public List<Substitution> Substitutions { get; set; } = new List<Substitution>();
        public List<Quarter> Quarters { get; set; } = new List<Quarter>();
        public List<TimeoutMatch> Timeouts { get; set; } = new List<TimeoutMatch>();
        public List<string> LiveEncoders { get; set; } = new List<string>();

        public List<int>? HomeTeamStartingPlayers { get; set; } 
        public List<int>? AwayTeamStartingPlayers { get; set; }

        public int HomeTeamScore { get; set; } = 0;
        public int AwayTeamScore { get; set; } = 0;

        public bool IsFinished { get; set; } = false; 

    }
}
