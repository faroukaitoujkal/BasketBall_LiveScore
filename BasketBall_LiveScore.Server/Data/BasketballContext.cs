using BasketBall_LiveScore.Server.Models;
using Microsoft.EntityFrameworkCore;

namespace BasketBall_LiveScore.Server.Data
{
    public class BasketballContext : DbContext
    {

        public BasketballContext(DbContextOptions<BasketballContext> options)
            : base(options)
        {
        }

        public DbSet<Match> Matches { get; set; }
        public DbSet<Team> Teams { get; set; }
        public DbSet<Player> Players { get; set; }
        public DbSet<PlayerScore> PlayerScores { get; set; }
        public DbSet<Foul> Fouls { get; set; }
        public DbSet<Substitution> Substitutions { get; set; }
        public DbSet<Quarter> Quarters { get; set; }
        public DbSet<TimeoutMatch> Timeouts { get; set; }


        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configurer les relations
            modelBuilder.Entity<Match>()
                .HasOne(m => m.HomeTeam)
                .WithMany()
                .HasForeignKey(m => m.HomeTeamId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Match>()
                .HasOne(m => m.AwayTeam)
                .WithMany()
                .HasForeignKey(m => m.AwayTeamId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<PlayerScore>()
                .HasOne(ps => ps.Player)
                .WithMany()
                .HasForeignKey(ps => ps.PlayerId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Foul>()
                .HasOne(f => f.Player)
                .WithMany()
                .HasForeignKey(f => f.PlayerId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Substitution>()
                .HasOne(s => s.PlayerIn)
                .WithMany()
                .HasForeignKey(s => s.PlayerInId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Substitution>()
                .HasOne(s => s.PlayerOut)
                .WithMany()
                .HasForeignKey(s => s.PlayerOutId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Quarter>()
                .HasOne(q => q.Match)
                .WithMany(m => m.Quarters)
                .HasForeignKey(q => q.MatchId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<TimeoutMatch>()
                .HasOne(t => t.Match)
                .WithMany(m => m.Timeouts)
                .HasForeignKey(t => t.MatchId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
