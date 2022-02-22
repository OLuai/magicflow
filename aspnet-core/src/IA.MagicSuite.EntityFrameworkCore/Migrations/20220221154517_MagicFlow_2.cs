using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace IA.MagicSuite.Migrations
{
    public partial class MagicFlow_2 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "IASYS_FlowTypes",
                columns: table => new
                {
                    Id = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Description = table.Column<string>(type: "nvarchar(400)", maxLength: 400, nullable: true),
                    IconUrl = table.Column<string>(type: "nvarchar(400)", maxLength: 400, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_IASYS_FlowTypes", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "IASYS_Flows",
                columns: table => new
                {
                    Id = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    TenantId = table.Column<int>(type: "int", nullable: true),
                    Name = table.Column<string>(type: "nvarchar(150)", maxLength: 150, nullable: false),
                    FlowDataIsConfidential = table.Column<bool>(type: "bit", nullable: false),
                    FlowJSON = table.Column<string>(type: "nvarchar(max)", maxLength: 2147483647, nullable: true),
                    Description = table.Column<string>(type: "nvarchar(400)", maxLength: 400, nullable: true),
                    FlowTypeId = table.Column<string>(type: "nvarchar(450)", nullable: true),
                    SolutionId = table.Column<string>(type: "nvarchar(450)", nullable: true),
                    EntityId = table.Column<string>(type: "nvarchar(450)", nullable: true),
                    IsActive = table.Column<bool>(type: "bit", nullable: false),
                    TrackingEnabled = table.Column<bool>(type: "bit", nullable: false),
                    ExecutionPermissionName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CreationTime = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CreatorUserId = table.Column<long>(type: "bigint", nullable: true),
                    LastModificationTime = table.Column<DateTime>(type: "datetime2", nullable: true),
                    LastModifierUserId = table.Column<long>(type: "bigint", nullable: true),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false),
                    DeleterUserId = table.Column<long>(type: "bigint", nullable: true),
                    DeletionTime = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_IASYS_Flows", x => x.Id);
                    table.ForeignKey(
                        name: "FK_IASYS_Flows_IASYS_Entities_EntityId",
                        column: x => x.EntityId,
                        principalTable: "IASYS_Entities",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_IASYS_Flows_IASYS_FlowTypes_FlowTypeId",
                        column: x => x.FlowTypeId,
                        principalTable: "IASYS_FlowTypes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_IASYS_Flows_IASYS_Solutions_SolutionId",
                        column: x => x.SolutionId,
                        principalTable: "IASYS_Solutions",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_IASYS_Flows_EntityId",
                table: "IASYS_Flows",
                column: "EntityId");

            migrationBuilder.CreateIndex(
                name: "IX_IASYS_Flows_FlowTypeId",
                table: "IASYS_Flows",
                column: "FlowTypeId");

            migrationBuilder.CreateIndex(
                name: "IX_IASYS_Flows_SolutionId",
                table: "IASYS_Flows",
                column: "SolutionId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "IASYS_Flows");

            migrationBuilder.DropTable(
                name: "IASYS_FlowTypes");
        }
    }
}
