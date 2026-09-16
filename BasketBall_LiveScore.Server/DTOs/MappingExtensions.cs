using System.Linq;
using BasketBall_LiveScore.Server.Models;

namespace BasketBall_LiveScore.Server.DTOs
{
    public static class MappingExtensions
    {
        public static TeamDto ToDto(this Team team)
        {
            if (team == null) return null;
            return new TeamDto
            {
                Id = team.Id,
                Name = team.Name,
                City = team.City,
                CoachName = team.CoachName,
                LogoUrl = team.LogoUrl,
                PrimaryColor = team.PrimaryColor
            };
        }

        public static TeamDetailDto ToDetailDto(this Team team)
        {
            if (team == null) return null;
            return new TeamDetailDto
            {
                Id = team.Id,
                Name = team.Name,
                City = team.City,
                CoachName = team.CoachName,
                LogoUrl = team.LogoUrl,
                PrimaryColor = team.PrimaryColor,
                Players = team.Players?.Select(p => p.ToDto()).ToList() ?? new List<PlayerDto>()
            };
        }

        public static PlayerDto ToDto(this Player player)
        {
            if (player == null) return null;
            return new PlayerDto
            {
                Id = player.Id,
                Name = player.Name,
                Number = player.Number,
                Position = player.Position,
                Height = player.Height,
                Weight = player.Weight,
                ImageUrl = player.ImageUrl,
                TeamId = player.TeamId,
                Team = player.Team != null ? player.Team.ToDto() : null
            };
        }

        public static MatchDto ToDto(this Match match)
        {
            if (match == null) return null;
            return new MatchDto
            {
                Id = match.Id,
                MatchDate = match.MatchDate,
                Location = match.Location,
                HomeTeamId = match.HomeTeamId,
                HomeTeam = match.HomeTeam?.ToDto(),
                AwayTeamId = match.AwayTeamId,
                AwayTeam = match.AwayTeam?.ToDto(),
                NumberOfQuarters = match.NumberOfQuarters,
                QuarterDuration = match.QuarterDuration,
                TimeoutDuration = match.TimeoutDuration,
                CurrentQuarter = match.CurrentQuarter,
                HomeTeamScore = match.HomeTeamScore,
                AwayTeamScore = match.AwayTeamScore,
                Status = match.Status,
                Season = match.Season
            };
        }
    }
}
