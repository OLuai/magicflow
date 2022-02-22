using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace IA.MagicSuite.Migrations
{
    public partial class start_magicflow_services : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "IASYS_FlowExecutionStatus",
                columns: table => new
                {
                    Id = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Description = table.Column<string>(type: "nvarchar(400)", maxLength: 400, nullable: true),
                    IconUrl = table.Column<string>(type: "nvarchar(400)", maxLength: 400, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_IASYS_FlowExecutionStatus", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "IASYS_FlowLinks",
                columns: table => new
                {
                    Id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    TenantId = table.Column<int>(type: "int", nullable: true),
                    Name = table.Column<string>(type: "nvarchar(150)", maxLength: 150, nullable: false),
                    FlowJSON = table.Column<string>(type: "nvarchar(max)", maxLength: 2147483647, nullable: true),
                    Description = table.Column<string>(type: "nvarchar(400)", maxLength: 400, nullable: true),
                    FlowId = table.Column<string>(type: "nvarchar(450)", nullable: true),
                    ObjectType = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ObjectDataId = table.Column<string>(type: "nvarchar(max)", nullable: true),
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
                    table.PrimaryKey("PK_IASYS_FlowLinks", x => x.Id);
                    table.ForeignKey(
                        name: "FK_IASYS_FlowLinks_IASYS_Flows_FlowId",
                        column: x => x.FlowId,
                        principalTable: "IASYS_Flows",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "IASYS_FlowExecutions",
                columns: table => new
                {
                    Id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    TenantId = table.Column<int>(type: "int", nullable: true),
                    FlowId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    FlowJSON = table.Column<string>(type: "nvarchar(max)", maxLength: 2147483647, nullable: true),
                    EntityId = table.Column<string>(type: "nvarchar(450)", nullable: true),
                    EntityDataId = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    InputData = table.Column<string>(type: "nvarchar(max)", maxLength: 2147483647, nullable: true),
                    OutputData = table.Column<string>(type: "nvarchar(max)", maxLength: 2147483647, nullable: true),
                    FlowDataIsConfidential = table.Column<bool>(type: "bit", nullable: false),
                    StatusId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    LastActionId = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Deadline = table.Column<DateTime>(type: "datetime2", nullable: false),
                    StartedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    EndedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    ErrorMessage = table.Column<string>(type: "nvarchar(4000)", maxLength: 4000, nullable: true),
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
                    table.PrimaryKey("PK_IASYS_FlowExecutions", x => x.Id);
                    table.ForeignKey(
                        name: "FK_IASYS_FlowExecutions_IASYS_Entities_EntityId",
                        column: x => x.EntityId,
                        principalTable: "IASYS_Entities",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_IASYS_FlowExecutions_IASYS_FlowExecutionStatus_StatusId",
                        column: x => x.StatusId,
                        principalTable: "IASYS_FlowExecutionStatus",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_IASYS_FlowExecutions_IASYS_Flows_FlowId",
                        column: x => x.FlowId,
                        principalTable: "IASYS_Flows",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "IASYS_FlowExecutionActions",
                columns: table => new
                {
                    Id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    TenantId = table.Column<int>(type: "int", nullable: true),
                    FlowExecutionId = table.Column<long>(type: "bigint", nullable: false),
                    ActionId = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    InputData = table.Column<string>(type: "nvarchar(max)", maxLength: 2147483647, nullable: true),
                    OutputData = table.Column<string>(type: "nvarchar(max)", maxLength: 2147483647, nullable: true),
                    ActionDataIsConfidential = table.Column<bool>(type: "bit", nullable: false),
                    StatusId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Deadline = table.Column<DateTime>(type: "datetime2", nullable: false),
                    StartedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    EndedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    ErrorMessage = table.Column<string>(type: "nvarchar(4000)", maxLength: 4000, nullable: true),
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
                    table.PrimaryKey("PK_IASYS_FlowExecutionActions", x => x.Id);
                    table.ForeignKey(
                        name: "FK_IASYS_FlowExecutionActions_IASYS_FlowExecutions_FlowExecutionId",
                        column: x => x.FlowExecutionId,
                        principalTable: "IASYS_FlowExecutions",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_IASYS_FlowExecutionActions_IASYS_FlowExecutionStatus_StatusId",
                        column: x => x.StatusId,
                        principalTable: "IASYS_FlowExecutionStatus",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_IASYS_FlowExecutionActions_FlowExecutionId",
                table: "IASYS_FlowExecutionActions",
                column: "FlowExecutionId");

            migrationBuilder.CreateIndex(
                name: "IX_IASYS_FlowExecutionActions_StatusId",
                table: "IASYS_FlowExecutionActions",
                column: "StatusId");

            migrationBuilder.CreateIndex(
                name: "IX_IASYS_FlowExecutions_EntityId",
                table: "IASYS_FlowExecutions",
                column: "EntityId");

            migrationBuilder.CreateIndex(
                name: "IX_IASYS_FlowExecutions_FlowId",
                table: "IASYS_FlowExecutions",
                column: "FlowId");

            migrationBuilder.CreateIndex(
                name: "IX_IASYS_FlowExecutions_StatusId",
                table: "IASYS_FlowExecutions",
                column: "StatusId");

            migrationBuilder.CreateIndex(
                name: "IX_IASYS_FlowLinks_FlowId",
                table: "IASYS_FlowLinks",
                column: "FlowId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "IASYS_FlowExecutionActions");

            migrationBuilder.DropTable(
                name: "IASYS_FlowLinks");

            migrationBuilder.DropTable(
                name: "IASYS_FlowExecutions");

            migrationBuilder.DropTable(
                name: "IASYS_FlowExecutionStatus");
        }
    }
}
