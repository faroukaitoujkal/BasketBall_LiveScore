using System.Text.Json.Serialization;

namespace BasketBall_LiveScore.Server.Models
{
    public class Player
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public int Number { get; set; }
        public int TeamId { get; set; }
        [JsonIgnore] 
        public Team? Team { get; set; }
    }
}
