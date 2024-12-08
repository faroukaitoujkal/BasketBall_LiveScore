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

        public DbSet<Match> Matches { get; set; } = null!;
        public DbSet<Team> Teams { get; set; } = null!;
        public DbSet<Player> Players { get; set; } = null!;
        public DbSet<MatchEvent> MatchEvents { get; set; } = null!;


        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Configure relationships
            modelBuilder.Entity<Team>()
                .HasOne(t => t.Match)
                .WithMany(m => m.Teams)
                .HasForeignKey(t => t.MatchId)
                .OnDelete(DeleteBehavior.Restrict); // Évite la suppression en cascade

            modelBuilder.Entity<Player>()
                .HasOne(p => p.Team)
                .WithMany(t => t.Players)
                .HasForeignKey(p => p.TeamId)
                .OnDelete(DeleteBehavior.Cascade); // Si une équipe est supprimée, ses joueurs peuvent être supprimés

            modelBuilder.Entity<MatchEvent>()
                .HasOne(e => e.Match)
                .WithMany(m => m.MatchEvents)
                .HasForeignKey(e => e.MatchId)
                .OnDelete(DeleteBehavior.Cascade); // Si un match est supprimé, ses événements peuvent être supprimés

            modelBuilder.Entity<MatchEvent>()
                .HasOne(e => e.Player)
                .WithMany()
                .HasForeignKey(e => e.PlayerId)
                .OnDelete(DeleteBehavior.SetNull); // Permet de ne pas supprimer les événements si un joueur est supprimé
        }
    }
}
