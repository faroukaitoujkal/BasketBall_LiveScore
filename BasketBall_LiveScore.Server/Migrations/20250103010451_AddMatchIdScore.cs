using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BasketBall_LiveScore.Server.Migrations
{
    /// <inheritdoc />
    public partial class AddMatchIdScore : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_PlayerScores_Matches_MatchId",
                table: "PlayerScores");

            migrationBuilder.AlterColumn<int>(
                name: "MatchId",
                table: "PlayerScores",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_PlayerScores_Matches_MatchId",
                table: "PlayerScores",
                column: "MatchId",
                principalTable: "Matches",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_PlayerScores_Matches_MatchId",
                table: "PlayerScores");

            migrationBuilder.AlterColumn<int>(
                name: "MatchId",
                table: "PlayerScores",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AddForeignKey(
                name: "FK_PlayerScores_Matches_MatchId",
                table: "PlayerScores",
                column: "MatchId",
                principalTable: "Matches",
                principalColumn: "Id");
        }
    }
}
