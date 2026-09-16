using System.Collections.Generic;

namespace BasketBall_LiveScore.Server.DTOs
{
    public class TeamDetailDto : TeamDto
    {
        public List<PlayerDto> Players { get; set; } = new List<PlayerDto>();
    }
}
