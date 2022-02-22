using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace IA.MagicSuite.Migrations
{
    public partial class magicflow : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "IAMKT_Vendors",
                columns: table => new
                {
                    Id = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Acronym = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    IsActive = table.Column<bool>(type: "bit", nullable: false),
                    TenantId = table.Column<int>(type: "int", nullable: true),
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
                    table.PrimaryKey("PK_IAMKT_Vendors", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "IASYS_AppStatus",
                columns: table => new
                {
                    Id = table.Column<long>(type: "bigint", nullable: false),
                    TenantId = table.Column<int>(type: "int", nullable: true),
                    NumericCode = table.Column<int>(type: "int", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(120)", maxLength: 120, nullable: false),
                    SystemIcon = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: true),
                    IconUrl = table.Column<string>(type: "nvarchar(400)", maxLength: 400, nullable: true),
                    IsActive = table.Column<bool>(type: "bit", nullable: false),
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
                    table.PrimaryKey("PK_IASYS_AppStatus", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "IASYS_AppTypes",
                columns: table => new
                {
                    Id = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    SystemIcon = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_IASYS_AppTypes", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "IASYS_AppVersionHistoryItemCategories",
                columns: table => new
                {
                    Id = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    TenantId = table.Column<int>(type: "int", nullable: true),
                    Code = table.Column<string>(type: "nvarchar(10)", maxLength: 10, nullable: false),
                    Name = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Description = table.Column<string>(type: "nvarchar(400)", maxLength: 400, nullable: true),
                    LanguageId = table.Column<int>(type: "int", nullable: true),
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
                    table.PrimaryKey("PK_IASYS_AppVersionHistoryItemCategories", x => x.Id);
                    table.ForeignKey(
                        name: "FK_IASYS_AppVersionHistoryItemCategories_AbpLanguages_LanguageId",
                        column: x => x.LanguageId,
                        principalTable: "AbpLanguages",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "IASYS_Controls",
                columns: table => new
                {
                    Id = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(150)", maxLength: 150, nullable: false),
                    Category = table.Column<string>(type: "nvarchar(150)", maxLength: 150, nullable: false),
                    Description = table.Column<string>(type: "nvarchar(400)", maxLength: 400, nullable: true),
                    SubCategory = table.Column<string>(type: "nvarchar(150)", maxLength: 150, nullable: false),
                    IconUrl = table.Column<string>(type: "nvarchar(400)", maxLength: 400, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_IASYS_Controls", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "IASYS_DataOwnerShips",
                columns: table => new
                {
                    Id = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    DisplayName = table.Column<string>(type: "nvarchar(150)", maxLength: 150, nullable: false),
                    SystemIcon = table.Column<string>(type: "nvarchar(150)", maxLength: 150, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_IASYS_DataOwnerShips", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "IASYS_DestinationDeviceType",
                columns: table => new
                {
                    Id = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    SystemIcon = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_IASYS_DestinationDeviceType", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "IASYS_EntityFieldCalculationTypes",
                columns: table => new
                {
                    Id = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(150)", maxLength: 150, nullable: false),
                    Description = table.Column<string>(type: "nvarchar(400)", maxLength: 400, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_IASYS_EntityFieldCalculationTypes", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "IASYS_EntityFieldDataTypes",
                columns: table => new
                {
                    Id = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Description = table.Column<string>(type: "nvarchar(400)", maxLength: 400, nullable: true),
                    SystemIcon = table.Column<string>(type: "nvarchar(150)", maxLength: 150, nullable: true),
                    IconUrl = table.Column<string>(type: "nvarchar(400)", maxLength: 400, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_IASYS_EntityFieldDataTypes", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "IASYS_EntityFieldRequirements",
                columns: table => new
                {
                    Id = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(150)", maxLength: 150, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_IASYS_EntityFieldRequirements", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "IASYS_EntityViewTypes",
                columns: table => new
                {
                    Id = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Description = table.Column<string>(type: "nvarchar(400)", maxLength: 400, nullable: false),
                    SystemIcon = table.Column<string>(type: "nvarchar(150)", maxLength: 150, nullable: true),
                    IconUrl = table.Column<string>(type: "nvarchar(400)", maxLength: 400, nullable: true),
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
                    table.PrimaryKey("PK_IASYS_EntityViewTypes", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "IASYS_PageTypes",
                columns: table => new
                {
                    Id = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    IconUrl = table.Column<string>(type: "nvarchar(400)", maxLength: 400, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_IASYS_PageTypes", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "IASYS_Permissions",
                columns: table => new
                {
                    Id = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    TenantId = table.Column<int>(type: "int", nullable: true),
                    Name = table.Column<string>(type: "nvarchar(400)", maxLength: 400, nullable: false),
                    DisplayName = table.Column<string>(type: "nvarchar(150)", maxLength: 150, nullable: true),
                    LocalizationName = table.Column<string>(type: "nvarchar(150)", maxLength: 150, nullable: true),
                    Description = table.Column<string>(type: "nvarchar(400)", maxLength: 400, nullable: true),
                    DescriptionLocalizationName = table.Column<string>(type: "nvarchar(150)", maxLength: 150, nullable: true),
                    MultiTenancySides = table.Column<string>(type: "nvarchar(150)", maxLength: 150, nullable: true),
                    FeatureDependency = table.Column<string>(type: "nvarchar(400)", maxLength: 400, nullable: true),
                    IsActive = table.Column<bool>(type: "bit", nullable: false),
                    ParentId = table.Column<string>(type: "nvarchar(450)", nullable: true),
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
                    table.PrimaryKey("PK_IASYS_Permissions", x => x.Id);
                    table.ForeignKey(
                        name: "FK_IASYS_Permissions_IASYS_Permissions_ParentId",
                        column: x => x.ParentId,
                        principalTable: "IASYS_Permissions",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "IASYS_Solutions",
                columns: table => new
                {
                    Id = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    TenantId = table.Column<int>(type: "int", nullable: true),
                    Name = table.Column<string>(type: "nvarchar(150)", maxLength: 150, nullable: false),
                    Description = table.Column<string>(type: "nvarchar(400)", maxLength: 400, nullable: true),
                    IsActive = table.Column<bool>(type: "bit", nullable: false),
                    ColorOrClassName = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: true),
                    SystemIcon = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: true),
                    IconUrl = table.Column<string>(type: "nvarchar(400)", maxLength: 400, nullable: true),
                    AppsAreOnlyEditableByAppOwner = table.Column<bool>(type: "bit", nullable: false),
                    OwnerId = table.Column<long>(type: "bigint", nullable: false),
                    VendorId = table.Column<string>(type: "nvarchar(450)", nullable: true),
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
                    table.PrimaryKey("PK_IASYS_Solutions", x => x.Id);
                    table.ForeignKey(
                        name: "FK_IASYS_Solutions_AbpUsers_OwnerId",
                        column: x => x.OwnerId,
                        principalTable: "AbpUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_IASYS_Solutions_IAMKT_Vendors_VendorId",
                        column: x => x.VendorId,
                        principalTable: "IAMKT_Vendors",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "IASYS_Apps",
                columns: table => new
                {
                    Id = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    TenantId = table.Column<int>(type: "int", nullable: true),
                    Name = table.Column<string>(type: "nvarchar(150)", maxLength: 150, nullable: false),
                    Description = table.Column<string>(type: "nvarchar(400)", maxLength: 400, nullable: true),
                    OwnerId = table.Column<long>(type: "bigint", nullable: false),
                    ActiveVersion = table.Column<string>(type: "nvarchar(10)", maxLength: 10, nullable: true),
                    ColorOrClassName = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: true),
                    UseDefaultIcon = table.Column<bool>(type: "bit", nullable: false),
                    SystemIcon = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: true),
                    IconUrl = table.Column<string>(type: "nvarchar(400)", maxLength: 400, nullable: true),
                    IsActive = table.Column<bool>(type: "bit", nullable: false),
                    IsSystemApp = table.Column<bool>(type: "bit", nullable: false),
                    SolutionId = table.Column<string>(type: "nvarchar(450)", nullable: true),
                    AppTypeId = table.Column<string>(type: "nvarchar(450)", nullable: true),
                    AppStatusId = table.Column<long>(type: "bigint", nullable: true),
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
                    table.PrimaryKey("PK_IASYS_Apps", x => x.Id);
                    table.ForeignKey(
                        name: "FK_IASYS_Apps_AbpUsers_OwnerId",
                        column: x => x.OwnerId,
                        principalTable: "AbpUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_IASYS_Apps_IASYS_AppStatus_AppStatusId",
                        column: x => x.AppStatusId,
                        principalTable: "IASYS_AppStatus",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_IASYS_Apps_IASYS_AppTypes_AppTypeId",
                        column: x => x.AppTypeId,
                        principalTable: "IASYS_AppTypes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_IASYS_Apps_IASYS_Solutions_SolutionId",
                        column: x => x.SolutionId,
                        principalTable: "IASYS_Solutions",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "IASYS_Entities",
                columns: table => new
                {
                    Id = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    TenantId = table.Column<int>(type: "int", nullable: true),
                    Name = table.Column<string>(type: "nvarchar(150)", maxLength: 150, nullable: false),
                    DisplayName = table.Column<string>(type: "nvarchar(150)", maxLength: 150, nullable: false),
                    PluralDisplayName = table.Column<string>(type: "nvarchar(151)", maxLength: 151, nullable: false),
                    Description = table.Column<string>(type: "nvarchar(400)", maxLength: 400, nullable: true),
                    IsVirtualEntity = table.Column<bool>(type: "bit", nullable: false),
                    ColorOrClassName = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: true),
                    SystemIcon = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    IconUrl = table.Column<string>(type: "nvarchar(400)", maxLength: 400, nullable: true),
                    IsActivityEntity = table.Column<bool>(type: "bit", nullable: false),
                    IsDisplayInActivityMenus = table.Column<bool>(type: "bit", nullable: false),
                    AutomaticDisplayMenus = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    UseBusinessProcess = table.Column<bool>(type: "bit", nullable: false),
                    DefaultBusinessProcessId = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    StatusFieldName = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: true),
                    UseNotes = table.Column<bool>(type: "bit", nullable: false),
                    UseActivites = table.Column<bool>(type: "bit", nullable: false),
                    UseDocuments = table.Column<bool>(type: "bit", nullable: false),
                    UseFollowers = table.Column<bool>(type: "bit", nullable: false),
                    UseConnections = table.Column<bool>(type: "bit", nullable: false),
                    AllowAddInQueues = table.Column<bool>(type: "bit", nullable: false),
                    AutoAddNewRecordInQueues = table.Column<bool>(type: "bit", nullable: false),
                    ConnectionName = table.Column<string>(type: "nvarchar(150)", maxLength: 150, nullable: true),
                    DbTableOrViewName = table.Column<string>(type: "nvarchar(150)", maxLength: 150, nullable: true),
                    IdFieldName = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: true),
                    DisplayFieldName = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: true),
                    SystemIconFieldName = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: true),
                    IconUrlFieldName = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: true),
                    ImageFieldName = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: true),
                    DefaultSelectSql = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    AllowInsert = table.Column<bool>(type: "bit", nullable: false),
                    AllowUpdate = table.Column<bool>(type: "bit", nullable: false),
                    AllowDelete = table.Column<bool>(type: "bit", nullable: false),
                    AllowOData = table.Column<bool>(type: "bit", nullable: false),
                    AutoGenCrudSql = table.Column<bool>(type: "bit", nullable: false),
                    InsertSql = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    UpdateSql = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    DeleteSql = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    IsDefaultSelectSqlSP = table.Column<bool>(type: "bit", nullable: false),
                    IsInsertSqlSP = table.Column<bool>(type: "bit", nullable: false),
                    IsUpdateSqlSP = table.Column<bool>(type: "bit", nullable: false),
                    IsDeleteSqlSP = table.Column<bool>(type: "bit", nullable: false),
                    InsertIdGeneratorId = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    CrudIgnoreFields = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    InsertOnlyIgnoreFields = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    UpdateOnlyIgnoreFields = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    AutoGenCrudSelectSql = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    EnableForMobile = table.Column<bool>(type: "bit", nullable: false),
                    ReadOnlyInMobile = table.Column<bool>(type: "bit", nullable: false),
                    EnableOfflineMode = table.Column<bool>(type: "bit", nullable: false),
                    UseCustomHelp = table.Column<bool>(type: "bit", nullable: false),
                    CustomHelpUrl = table.Column<string>(type: "nvarchar(400)", maxLength: 400, nullable: true),
                    IsActive = table.Column<bool>(type: "bit", nullable: false),
                    MayHaveTenant = table.Column<bool>(type: "bit", nullable: false),
                    IsFullAudited = table.Column<bool>(type: "bit", nullable: false),
                    TrackChangesHistory = table.Column<bool>(type: "bit", nullable: false),
                    IsHostEntity = table.Column<bool>(type: "bit", nullable: false),
                    DisableCrossSiteAccess = table.Column<bool>(type: "bit", nullable: false),
                    UseConfidentiality = table.Column<bool>(type: "bit", nullable: false),
                    ConfidentialityFieldName = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: true),
                    UseSecurityLevel = table.Column<bool>(type: "bit", nullable: false),
                    DefaultSecurityLevel = table.Column<int>(type: "int", nullable: true),
                    SecurityLevelFieldName = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: true),
                    AccessPermissionName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CreatePermissionName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    EditPermissionName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    DeletePermissionName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    UseSelectedFieldsOnly = table.Column<bool>(type: "bit", nullable: false),
                    PreviewHtmlTemplate = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    SolutionId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    DataOwnerShipId = table.Column<string>(type: "nvarchar(450)", nullable: true),
                    DefaultFormId = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    DefaultPreviewReportId = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    DefaultQuickCreateFormId = table.Column<string>(type: "nvarchar(max)", nullable: true),
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
                    table.PrimaryKey("PK_IASYS_Entities", x => x.Id);
                    table.ForeignKey(
                        name: "FK_IASYS_Entities_IASYS_DataOwnerShips_DataOwnerShipId",
                        column: x => x.DataOwnerShipId,
                        principalTable: "IASYS_DataOwnerShips",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_IASYS_Entities_IASYS_Solutions_SolutionId",
                        column: x => x.SolutionId,
                        principalTable: "IASYS_Solutions",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "IASYS_SolutionAdministrators",
                columns: table => new
                {
                    Id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    TenantId = table.Column<int>(type: "int", nullable: true),
                    IsActive = table.Column<bool>(type: "bit", nullable: false),
                    IsCoowner = table.Column<bool>(type: "bit", nullable: false),
                    UserId = table.Column<long>(type: "bigint", nullable: false),
                    SolutionId = table.Column<string>(type: "nvarchar(450)", nullable: true),
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
                    table.PrimaryKey("PK_IASYS_SolutionAdministrators", x => x.Id);
                    table.ForeignKey(
                        name: "FK_IASYS_SolutionAdministrators_AbpUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AbpUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_IASYS_SolutionAdministrators_IASYS_Solutions_SolutionId",
                        column: x => x.SolutionId,
                        principalTable: "IASYS_Solutions",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "IASYS_SolutionConnections",
                columns: table => new
                {
                    Id = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    TenantId = table.Column<int>(type: "int", nullable: true),
                    Name = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    ConnectionString = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    IsActive = table.Column<bool>(type: "bit", nullable: false),
                    SolutionId = table.Column<string>(type: "nvarchar(450)", nullable: false),
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
                    table.PrimaryKey("PK_IASYS_SolutionConnections", x => x.Id);
                    table.ForeignKey(
                        name: "FK_IASYS_SolutionConnections_IASYS_Solutions_SolutionId",
                        column: x => x.SolutionId,
                        principalTable: "IASYS_Solutions",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "IASYS_AppAdditionnalElements",
                columns: table => new
                {
                    Id = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    TenantId = table.Column<int>(type: "int", nullable: true),
                    Name = table.Column<string>(type: "nvarchar(150)", maxLength: 150, nullable: false),
                    Type = table.Column<string>(type: "nvarchar(150)", maxLength: 150, nullable: false),
                    StringValue = table.Column<string>(type: "nvarchar(max)", maxLength: 2147483647, nullable: true),
                    binaryValue = table.Column<byte[]>(type: "varbinary(max)", nullable: true),
                    NumericValue = table.Column<double>(type: "float", nullable: true),
                    DateValue = table.Column<DateTime>(type: "datetime2", nullable: true),
                    OrderNumber = table.Column<int>(type: "int", nullable: true),
                    LinkedObjectName = table.Column<string>(type: "nvarchar(150)", maxLength: 150, nullable: true),
                    ParentId = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    AppId = table.Column<string>(type: "nvarchar(450)", nullable: true),
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
                    table.PrimaryKey("PK_IASYS_AppAdditionnalElements", x => x.Id);
                    table.ForeignKey(
                        name: "FK_IASYS_AppAdditionnalElements_IASYS_Apps_AppId",
                        column: x => x.AppId,
                        principalTable: "IASYS_Apps",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "IASYS_AppFonctionalityCategories",
                columns: table => new
                {
                    Id = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    TenantId = table.Column<int>(type: "int", nullable: true),
                    Name = table.Column<string>(type: "nvarchar(250)", maxLength: 250, nullable: false),
                    Description = table.Column<string>(type: "nvarchar(800)", maxLength: 800, nullable: true),
                    IsActive = table.Column<bool>(type: "bit", nullable: false),
                    IsOptional = table.Column<bool>(type: "bit", nullable: false),
                    AppId = table.Column<string>(type: "nvarchar(450)", nullable: true),
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
                    table.PrimaryKey("PK_IASYS_AppFonctionalityCategories", x => x.Id);
                    table.ForeignKey(
                        name: "FK_IASYS_AppFonctionalityCategories_IASYS_Apps_AppId",
                        column: x => x.AppId,
                        principalTable: "IASYS_Apps",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "IASYS_AppVersionHistories",
                columns: table => new
                {
                    Id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    TenantId = table.Column<int>(type: "int", nullable: true),
                    VersionName = table.Column<string>(type: "nvarchar(10)", maxLength: 10, nullable: false),
                    VersionDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    AppId = table.Column<string>(type: "nvarchar(450)", nullable: true),
                    VersionObject = table.Column<string>(type: "nvarchar(max)", maxLength: 2147483647, nullable: true),
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
                    table.PrimaryKey("PK_IASYS_AppVersionHistories", x => x.Id);
                    table.ForeignKey(
                        name: "FK_IASYS_AppVersionHistories_IASYS_Apps_AppId",
                        column: x => x.AppId,
                        principalTable: "IASYS_Apps",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "IASYS_TenantApps",
                columns: table => new
                {
                    Id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    TenantId = table.Column<int>(type: "int", nullable: false),
                    VersionName = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    InstallDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    IsActive = table.Column<bool>(type: "bit", nullable: false),
                    AppId = table.Column<string>(type: "nvarchar(450)", nullable: true),
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
                    table.PrimaryKey("PK_IASYS_TenantApps", x => x.Id);
                    table.ForeignKey(
                        name: "FK_IASYS_TenantApps_IASYS_Apps_AppId",
                        column: x => x.AppId,
                        principalTable: "IASYS_Apps",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "IASYS_AppEntities",
                columns: table => new
                {
                    Id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    TenantId = table.Column<int>(type: "int", nullable: true),
                    AppId = table.Column<string>(type: "nvarchar(450)", nullable: true),
                    EntityId = table.Column<string>(type: "nvarchar(450)", nullable: true),
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
                    table.PrimaryKey("PK_IASYS_AppEntities", x => x.Id);
                    table.ForeignKey(
                        name: "FK_IASYS_AppEntities_IASYS_Apps_AppId",
                        column: x => x.AppId,
                        principalTable: "IASYS_Apps",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_IASYS_AppEntities_IASYS_Entities_EntityId",
                        column: x => x.EntityId,
                        principalTable: "IASYS_Entities",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "IASYS_EntityFieldGroups",
                columns: table => new
                {
                    Id = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    TenantId = table.Column<int>(type: "int", nullable: true),
                    Name = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    DisplayName = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: true),
                    LocalizationName = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: true),
                    Description = table.Column<string>(type: "nvarchar(400)", maxLength: 400, nullable: true),
                    SystemIcon = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: true),
                    IconUrl = table.Column<string>(type: "nvarchar(400)", maxLength: 400, nullable: true),
                    EntityId = table.Column<string>(type: "nvarchar(450)", nullable: true),
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
                    table.PrimaryKey("PK_IASYS_EntityFieldGroups", x => x.Id);
                    table.ForeignKey(
                        name: "FK_IASYS_EntityFieldGroups_IASYS_Entities_EntityId",
                        column: x => x.EntityId,
                        principalTable: "IASYS_Entities",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "IASYS_EntityVariables",
                columns: table => new
                {
                    Id = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    TenantId = table.Column<int>(type: "int", nullable: true),
                    Name = table.Column<string>(type: "nvarchar(150)", maxLength: 150, nullable: false),
                    DisplayName = table.Column<string>(type: "nvarchar(150)", maxLength: 150, nullable: true),
                    LocalizationName = table.Column<string>(type: "nvarchar(150)", maxLength: 150, nullable: true),
                    EntityId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    DataTypeId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Description = table.Column<string>(type: "nvarchar(400)", maxLength: 400, nullable: true),
                    IsActive = table.Column<bool>(type: "bit", nullable: false),
                    IsRequired = table.Column<bool>(type: "bit", nullable: false),
                    Regex = table.Column<string>(type: "nvarchar(150)", maxLength: 150, nullable: true),
                    ValidationRules = table.Column<string>(type: "nvarchar(max)", maxLength: 2147483647, nullable: true),
                    DefaultValue = table.Column<string>(type: "nvarchar(max)", maxLength: 2147483647, nullable: true),
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
                    table.PrimaryKey("PK_IASYS_EntityVariables", x => x.Id);
                    table.ForeignKey(
                        name: "FK_IASYS_EntityVariables_IASYS_Entities_EntityId",
                        column: x => x.EntityId,
                        principalTable: "IASYS_Entities",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_IASYS_EntityVariables_IASYS_EntityFieldDataTypes_DataTypeId",
                        column: x => x.DataTypeId,
                        principalTable: "IASYS_EntityFieldDataTypes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "IASYS_EntityViews",
                columns: table => new
                {
                    Id = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    TenantId = table.Column<int>(type: "int", nullable: true),
                    Name = table.Column<string>(type: "nvarchar(150)", maxLength: 150, nullable: false),
                    Description = table.Column<string>(type: "nvarchar(400)", maxLength: 400, nullable: true),
                    ViewOptions = table.Column<string>(type: "nvarchar(max)", maxLength: 2147483647, nullable: true),
                    IsActive = table.Column<bool>(type: "bit", nullable: false),
                    AdditionalData = table.Column<string>(type: "nvarchar(max)", maxLength: 2147483647, nullable: true),
                    EntityId = table.Column<string>(type: "nvarchar(450)", nullable: true),
                    ViewTypeId = table.Column<string>(type: "nvarchar(450)", nullable: true),
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
                    table.PrimaryKey("PK_IASYS_EntityViews", x => x.Id);
                    table.ForeignKey(
                        name: "FK_IASYS_EntityViews_IASYS_Entities_EntityId",
                        column: x => x.EntityId,
                        principalTable: "IASYS_Entities",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_IASYS_EntityViews_IASYS_EntityViewTypes_ViewTypeId",
                        column: x => x.ViewTypeId,
                        principalTable: "IASYS_EntityViewTypes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "IASYS_MagicEntityRelations",
                columns: table => new
                {
                    Id = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    TenantId = table.Column<int>(type: "int", nullable: true),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    DisplayName = table.Column<string>(type: "nvarchar(150)", maxLength: 150, nullable: true),
                    LocalizationName = table.Column<string>(type: "nvarchar(150)", maxLength: 150, nullable: true),
                    Description = table.Column<string>(type: "nvarchar(400)", maxLength: 400, nullable: true),
                    IsActive = table.Column<bool>(type: "bit", nullable: true),
                    EntityId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    EntityFieldName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ChildEntityId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    ChildEntityFieldName = table.Column<string>(type: "nvarchar(max)", nullable: false),
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
                    table.PrimaryKey("PK_IASYS_MagicEntityRelations", x => x.Id);
                    table.ForeignKey(
                        name: "FK_IASYS_MagicEntityRelations_IASYS_Entities_ChildEntityId",
                        column: x => x.ChildEntityId,
                        principalTable: "IASYS_Entities",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.NoAction);
                    table.ForeignKey(
                        name: "FK_IASYS_MagicEntityRelations_IASYS_Entities_EntityId",
                        column: x => x.EntityId,
                        principalTable: "IASYS_Entities",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "IASYS_Pages",
                columns: table => new
                {
                    Id = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    TenantId = table.Column<int>(type: "int", nullable: true),
                    Name = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    LocalizationName = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: true),
                    Description = table.Column<string>(type: "nvarchar(400)", maxLength: 400, nullable: true),
                    ActiveVersion = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    IsActive = table.Column<bool>(type: "bit", nullable: false),
                    SystemIcon = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: true),
                    IconUrl = table.Column<string>(type: "nvarchar(400)", maxLength: 400, nullable: true),
                    IsPublic = table.Column<bool>(type: "bit", nullable: false),
                    AccessPermissionName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    SolutionId = table.Column<string>(type: "nvarchar(450)", nullable: true),
                    PageTypeId = table.Column<string>(type: "nvarchar(450)", nullable: true),
                    PageUsedTypeId = table.Column<string>(type: "nvarchar(450)", nullable: true),
                    EntityId = table.Column<string>(type: "nvarchar(450)", nullable: true),
                    DestinationDeviceTypeId = table.Column<string>(type: "nvarchar(450)", nullable: true),
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
                    table.PrimaryKey("PK_IASYS_Pages", x => x.Id);
                    table.ForeignKey(
                        name: "FK_IASYS_Pages_IASYS_DestinationDeviceType_DestinationDeviceTypeId",
                        column: x => x.DestinationDeviceTypeId,
                        principalTable: "IASYS_DestinationDeviceType",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_IASYS_Pages_IASYS_Entities_EntityId",
                        column: x => x.EntityId,
                        principalTable: "IASYS_Entities",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_IASYS_Pages_IASYS_PageTypes_PageTypeId",
                        column: x => x.PageTypeId,
                        principalTable: "IASYS_PageTypes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_IASYS_Pages_IASYS_PageTypes_PageUsedTypeId",
                        column: x => x.PageUsedTypeId,
                        principalTable: "IASYS_PageTypes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_IASYS_Pages_IASYS_Solutions_SolutionId",
                        column: x => x.SolutionId,
                        principalTable: "IASYS_Solutions",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "IASYS_AppFonctionalities",
                columns: table => new
                {
                    Id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    TenantId = table.Column<int>(type: "int", nullable: true),
                    Name = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    Description = table.Column<string>(type: "nvarchar(800)", maxLength: 800, nullable: true),
                    AppVersion = table.Column<string>(type: "nvarchar(10)", maxLength: 10, nullable: true),
                    PlannedIntegrationDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    IntegrationDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    PlannedDevStartingDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    DevStartingDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    PlannedDevEndingDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    PlannedTestStart = table.Column<DateTime>(type: "datetime2", nullable: true),
                    PlannedTestEndingDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    DevEndingDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    TestEndingDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    AppFonctionalityCategoryId = table.Column<string>(type: "nvarchar(450)", nullable: true),
                    AppId = table.Column<string>(type: "nvarchar(450)", nullable: true),
                    OwnerId = table.Column<long>(type: "bigint", nullable: true),
                    TestOwnerId = table.Column<long>(type: "bigint", nullable: true),
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
                    table.PrimaryKey("PK_IASYS_AppFonctionalities", x => x.Id);
                    table.ForeignKey(
                        name: "FK_IASYS_AppFonctionalities_AbpUsers_OwnerId",
                        column: x => x.OwnerId,
                        principalTable: "AbpUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_IASYS_AppFonctionalities_AbpUsers_TestOwnerId",
                        column: x => x.TestOwnerId,
                        principalTable: "AbpUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_IASYS_AppFonctionalities_IASYS_AppFonctionalityCategories_AppFonctionalityCategoryId",
                        column: x => x.AppFonctionalityCategoryId,
                        principalTable: "IASYS_AppFonctionalityCategories",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_IASYS_AppFonctionalities_IASYS_Apps_AppId",
                        column: x => x.AppId,
                        principalTable: "IASYS_Apps",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "IASYS_AppVersionHistoryItems",
                columns: table => new
                {
                    Id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    TenantId = table.Column<int>(type: "int", nullable: true),
                    Name = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    AppId = table.Column<string>(type: "nvarchar(450)", nullable: true),
                    VersionHistoryId = table.Column<long>(type: "bigint", nullable: false),
                    CategoryId = table.Column<string>(type: "nvarchar(450)", nullable: true),
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
                    table.PrimaryKey("PK_IASYS_AppVersionHistoryItems", x => x.Id);
                    table.ForeignKey(
                        name: "FK_IASYS_AppVersionHistoryItems_IASYS_Apps_AppId",
                        column: x => x.AppId,
                        principalTable: "IASYS_Apps",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_IASYS_AppVersionHistoryItems_IASYS_AppVersionHistories_VersionHistoryId",
                        column: x => x.VersionHistoryId,
                        principalTable: "IASYS_AppVersionHistories",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_IASYS_AppVersionHistoryItems_IASYS_AppVersionHistoryItemCategories_CategoryId",
                        column: x => x.CategoryId,
                        principalTable: "IASYS_AppVersionHistoryItemCategories",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "IASYS_EntityFields",
                columns: table => new
                {
                    Id = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    TenantId = table.Column<int>(type: "int", nullable: true),
                    Name = table.Column<string>(type: "nvarchar(150)", maxLength: 150, nullable: false),
                    DbFieldName = table.Column<string>(type: "nvarchar(150)", maxLength: 150, nullable: true),
                    DisplayName = table.Column<string>(type: "nvarchar(150)", maxLength: 150, nullable: true),
                    LocalizationName = table.Column<string>(type: "nvarchar(150)", maxLength: 150, nullable: true),
                    Regex = table.Column<string>(type: "nvarchar(150)", maxLength: 150, nullable: true),
                    IsEntityKey = table.Column<bool>(type: "bit", nullable: false),
                    IsSearchable = table.Column<bool>(type: "bit", nullable: false),
                    ShowInAdvancedSearch = table.Column<bool>(type: "bit", nullable: false),
                    Description = table.Column<string>(type: "nvarchar(400)", maxLength: 400, nullable: true),
                    ReadOnly = table.Column<bool>(type: "bit", nullable: true),
                    DefaultValue = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    FieldGroupId = table.Column<string>(type: "nvarchar(450)", nullable: true),
                    DataTypeId = table.Column<string>(type: "nvarchar(450)", nullable: true),
                    RequirementId = table.Column<string>(type: "nvarchar(450)", nullable: true),
                    UseFieldSecurity = table.Column<bool>(type: "bit", nullable: false),
                    UseAutomaticFieldSecurityPermissionNaming = table.Column<bool>(type: "bit", nullable: false),
                    ReadPermissionValue = table.Column<string>(type: "nvarchar(400)", maxLength: 400, nullable: true),
                    UpdatePermissionValue = table.Column<string>(type: "nvarchar(400)", maxLength: 400, nullable: true),
                    CreatePermissionValue = table.Column<string>(type: "nvarchar(400)", maxLength: 400, nullable: true),
                    CalculationFormula = table.Column<string>(type: "nvarchar(max)", maxLength: 2147483647, nullable: true),
                    ExludeFromTrackChangesHistory = table.Column<bool>(type: "bit", nullable: false),
                    LinkedDirectSql = table.Column<string>(type: "nvarchar(max)", maxLength: 2147483647, nullable: true),
                    EntityId = table.Column<string>(type: "nvarchar(450)", nullable: true),
                    LinkedEntityId = table.Column<string>(type: "nvarchar(450)", nullable: true),
                    LinkedEntityFieldName = table.Column<string>(type: "nvarchar(450)", nullable: true),
                    LinkedEntityFieldDisplayName = table.Column<string>(type: "nvarchar(450)", nullable: true),
                    CalculationTypeId = table.Column<string>(type: "nvarchar(450)", nullable: true),
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
                    table.PrimaryKey("PK_IASYS_EntityFields", x => x.Id);
                    table.ForeignKey(
                        name: "FK_IASYS_EntityFields_IASYS_Entities_EntityId",
                        column: x => x.EntityId,
                        principalTable: "IASYS_Entities",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_IASYS_EntityFields_IASYS_Entities_LinkedEntityId",
                        column: x => x.LinkedEntityId,
                        principalTable: "IASYS_Entities",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_IASYS_EntityFields_IASYS_EntityFieldCalculationTypes_CalculationTypeId",
                        column: x => x.CalculationTypeId,
                        principalTable: "IASYS_EntityFieldCalculationTypes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_IASYS_EntityFields_IASYS_EntityFieldDataTypes_DataTypeId",
                        column: x => x.DataTypeId,
                        principalTable: "IASYS_EntityFieldDataTypes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_IASYS_EntityFields_IASYS_EntityFieldGroups_FieldGroupId",
                        column: x => x.FieldGroupId,
                        principalTable: "IASYS_EntityFieldGroups",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_IASYS_EntityFields_IASYS_EntityFieldRequirements_RequirementId",
                        column: x => x.RequirementId,
                        principalTable: "IASYS_EntityFieldRequirements",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_IASYS_EntityFields_IASYS_EntityFields_LinkedEntityFieldDisplayName",
                        column: x => x.LinkedEntityFieldDisplayName,
                        principalTable: "IASYS_EntityFields",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_IASYS_EntityFields_IASYS_EntityFields_LinkedEntityFieldName",
                        column: x => x.LinkedEntityFieldName,
                        principalTable: "IASYS_EntityFields",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "IASYS_AppPages",
                columns: table => new
                {
                    Id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    TenantId = table.Column<int>(type: "int", nullable: true),
                    AppId = table.Column<string>(type: "nvarchar(450)", nullable: true),
                    EntityId = table.Column<string>(type: "nvarchar(450)", nullable: true),
                    PageId = table.Column<string>(type: "nvarchar(450)", nullable: true),
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
                    table.PrimaryKey("PK_IASYS_AppPages", x => x.Id);
                    table.ForeignKey(
                        name: "FK_IASYS_AppPages_IASYS_Apps_AppId",
                        column: x => x.AppId,
                        principalTable: "IASYS_Apps",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_IASYS_AppPages_IASYS_Entities_EntityId",
                        column: x => x.EntityId,
                        principalTable: "IASYS_Entities",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_IASYS_AppPages_IASYS_Pages_PageId",
                        column: x => x.PageId,
                        principalTable: "IASYS_Pages",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "IASYS_PageVersions",
                columns: table => new
                {
                    Id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    TenantId = table.Column<int>(type: "int", nullable: true),
                    Name = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    PageJSON = table.Column<string>(type: "nvarchar(max)", maxLength: 2147483647, nullable: true),
                    Description = table.Column<string>(type: "nvarchar(400)", maxLength: 400, nullable: true),
                    PageId = table.Column<string>(type: "nvarchar(450)", nullable: true),
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
                    table.PrimaryKey("PK_IASYS_PageVersions", x => x.Id);
                    table.ForeignKey(
                        name: "FK_IASYS_PageVersions_IASYS_Pages_PageId",
                        column: x => x.PageId,
                        principalTable: "IASYS_Pages",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_IAMKT_Vendors_Acronym",
                table: "IAMKT_Vendors",
                column: "Acronym",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_IAMKT_Vendors_Name",
                table: "IAMKT_Vendors",
                column: "Name",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_IAMKT_Vendors_TenantId",
                table: "IAMKT_Vendors",
                column: "TenantId",
                unique: true,
                filter: "[TenantId] IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "IX_IASYS_AppAdditionnalElements_AppId",
                table: "IASYS_AppAdditionnalElements",
                column: "AppId");

            migrationBuilder.CreateIndex(
                name: "IX_IASYS_AppAdditionnalElements_TenantId",
                table: "IASYS_AppAdditionnalElements",
                column: "TenantId");

            migrationBuilder.CreateIndex(
                name: "IX_IASYS_AppEntities_AppId",
                table: "IASYS_AppEntities",
                column: "AppId");

            migrationBuilder.CreateIndex(
                name: "IX_IASYS_AppEntities_EntityId",
                table: "IASYS_AppEntities",
                column: "EntityId");

            migrationBuilder.CreateIndex(
                name: "IX_IASYS_AppEntities_TenantId",
                table: "IASYS_AppEntities",
                column: "TenantId");

            migrationBuilder.CreateIndex(
                name: "IX_IASYS_AppFonctionalities_AppFonctionalityCategoryId",
                table: "IASYS_AppFonctionalities",
                column: "AppFonctionalityCategoryId");

            migrationBuilder.CreateIndex(
                name: "IX_IASYS_AppFonctionalities_AppId",
                table: "IASYS_AppFonctionalities",
                column: "AppId");

            migrationBuilder.CreateIndex(
                name: "IX_IASYS_AppFonctionalities_OwnerId",
                table: "IASYS_AppFonctionalities",
                column: "OwnerId");

            migrationBuilder.CreateIndex(
                name: "IX_IASYS_AppFonctionalities_TenantId",
                table: "IASYS_AppFonctionalities",
                column: "TenantId");

            migrationBuilder.CreateIndex(
                name: "IX_IASYS_AppFonctionalities_TestOwnerId",
                table: "IASYS_AppFonctionalities",
                column: "TestOwnerId");

            migrationBuilder.CreateIndex(
                name: "IX_IASYS_AppFonctionalityCategories_AppId",
                table: "IASYS_AppFonctionalityCategories",
                column: "AppId");

            migrationBuilder.CreateIndex(
                name: "IX_IASYS_AppFonctionalityCategories_TenantId",
                table: "IASYS_AppFonctionalityCategories",
                column: "TenantId");

            migrationBuilder.CreateIndex(
                name: "IX_IASYS_AppPages_AppId_PageId",
                table: "IASYS_AppPages",
                columns: new[] { "AppId", "PageId" },
                unique: true,
                filter: "[AppId] IS NOT NULL AND [PageId] IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "IX_IASYS_AppPages_EntityId",
                table: "IASYS_AppPages",
                column: "EntityId");

            migrationBuilder.CreateIndex(
                name: "IX_IASYS_AppPages_PageId",
                table: "IASYS_AppPages",
                column: "PageId");

            migrationBuilder.CreateIndex(
                name: "IX_IASYS_AppPages_TenantId",
                table: "IASYS_AppPages",
                column: "TenantId");

            migrationBuilder.CreateIndex(
                name: "IX_IASYS_Apps_AppStatusId",
                table: "IASYS_Apps",
                column: "AppStatusId");

            migrationBuilder.CreateIndex(
                name: "IX_IASYS_Apps_AppTypeId",
                table: "IASYS_Apps",
                column: "AppTypeId");

            migrationBuilder.CreateIndex(
                name: "IX_IASYS_Apps_OwnerId",
                table: "IASYS_Apps",
                column: "OwnerId");

            migrationBuilder.CreateIndex(
                name: "IX_IASYS_Apps_SolutionId",
                table: "IASYS_Apps",
                column: "SolutionId");

            migrationBuilder.CreateIndex(
                name: "IX_IASYS_Apps_TenantId",
                table: "IASYS_Apps",
                column: "TenantId");

            migrationBuilder.CreateIndex(
                name: "IX_IASYS_Apps_TenantId_Name",
                table: "IASYS_Apps",
                columns: new[] { "TenantId", "Name" },
                unique: true,
                filter: "[TenantId] IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "IX_IASYS_AppStatus_TenantId",
                table: "IASYS_AppStatus",
                column: "TenantId");

            migrationBuilder.CreateIndex(
                name: "IX_IASYS_AppStatus_TenantId_Name",
                table: "IASYS_AppStatus",
                columns: new[] { "TenantId", "Name" },
                unique: true,
                filter: "[TenantId] IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "IX_IASYS_AppVersionHistories_AppId",
                table: "IASYS_AppVersionHistories",
                column: "AppId");

            migrationBuilder.CreateIndex(
                name: "IX_IASYS_AppVersionHistories_TenantId",
                table: "IASYS_AppVersionHistories",
                column: "TenantId");

            migrationBuilder.CreateIndex(
                name: "IX_IASYS_AppVersionHistoryItemCategories_LanguageId",
                table: "IASYS_AppVersionHistoryItemCategories",
                column: "LanguageId");

            migrationBuilder.CreateIndex(
                name: "IX_IASYS_AppVersionHistoryItemCategories_TenantId",
                table: "IASYS_AppVersionHistoryItemCategories",
                column: "TenantId");

            migrationBuilder.CreateIndex(
                name: "IX_IASYS_AppVersionHistoryItems_AppId",
                table: "IASYS_AppVersionHistoryItems",
                column: "AppId");

            migrationBuilder.CreateIndex(
                name: "IX_IASYS_AppVersionHistoryItems_CategoryId",
                table: "IASYS_AppVersionHistoryItems",
                column: "CategoryId");

            migrationBuilder.CreateIndex(
                name: "IX_IASYS_AppVersionHistoryItems_TenantId",
                table: "IASYS_AppVersionHistoryItems",
                column: "TenantId");

            migrationBuilder.CreateIndex(
                name: "IX_IASYS_AppVersionHistoryItems_VersionHistoryId",
                table: "IASYS_AppVersionHistoryItems",
                column: "VersionHistoryId");

            migrationBuilder.CreateIndex(
                name: "IX_IASYS_Entities_DataOwnerShipId",
                table: "IASYS_Entities",
                column: "DataOwnerShipId");

            migrationBuilder.CreateIndex(
                name: "IX_IASYS_Entities_SolutionId",
                table: "IASYS_Entities",
                column: "SolutionId");

            migrationBuilder.CreateIndex(
                name: "IX_IASYS_Entities_TenantId",
                table: "IASYS_Entities",
                column: "TenantId");

            migrationBuilder.CreateIndex(
                name: "IX_IASYS_Entities_TenantId_Name",
                table: "IASYS_Entities",
                columns: new[] { "TenantId", "Name" },
                unique: true,
                filter: "[TenantId] IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "IX_IASYS_EntityFieldGroups_EntityId",
                table: "IASYS_EntityFieldGroups",
                column: "EntityId");

            migrationBuilder.CreateIndex(
                name: "IX_IASYS_EntityFieldGroups_TenantId",
                table: "IASYS_EntityFieldGroups",
                column: "TenantId");

            migrationBuilder.CreateIndex(
                name: "IX_IASYS_EntityFields_CalculationTypeId",
                table: "IASYS_EntityFields",
                column: "CalculationTypeId");

            migrationBuilder.CreateIndex(
                name: "IX_IASYS_EntityFields_DataTypeId",
                table: "IASYS_EntityFields",
                column: "DataTypeId");

            migrationBuilder.CreateIndex(
                name: "IX_IASYS_EntityFields_EntityId_Name",
                table: "IASYS_EntityFields",
                columns: new[] { "EntityId", "Name" },
                unique: true,
                filter: "[EntityId] IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "IX_IASYS_EntityFields_FieldGroupId",
                table: "IASYS_EntityFields",
                column: "FieldGroupId");

            migrationBuilder.CreateIndex(
                name: "IX_IASYS_EntityFields_LinkedEntityFieldDisplayName",
                table: "IASYS_EntityFields",
                column: "LinkedEntityFieldDisplayName");

            migrationBuilder.CreateIndex(
                name: "IX_IASYS_EntityFields_LinkedEntityFieldName",
                table: "IASYS_EntityFields",
                column: "LinkedEntityFieldName");

            migrationBuilder.CreateIndex(
                name: "IX_IASYS_EntityFields_LinkedEntityId",
                table: "IASYS_EntityFields",
                column: "LinkedEntityId");

            migrationBuilder.CreateIndex(
                name: "IX_IASYS_EntityFields_RequirementId",
                table: "IASYS_EntityFields",
                column: "RequirementId");

            migrationBuilder.CreateIndex(
                name: "IX_IASYS_EntityFields_TenantId",
                table: "IASYS_EntityFields",
                column: "TenantId");

            migrationBuilder.CreateIndex(
                name: "IX_IASYS_EntityVariables_DataTypeId",
                table: "IASYS_EntityVariables",
                column: "DataTypeId");

            migrationBuilder.CreateIndex(
                name: "IX_IASYS_EntityVariables_EntityId",
                table: "IASYS_EntityVariables",
                column: "EntityId");

            migrationBuilder.CreateIndex(
                name: "IX_IASYS_EntityViews_EntityId",
                table: "IASYS_EntityViews",
                column: "EntityId");

            migrationBuilder.CreateIndex(
                name: "IX_IASYS_EntityViews_TenantId",
                table: "IASYS_EntityViews",
                column: "TenantId");

            migrationBuilder.CreateIndex(
                name: "IX_IASYS_EntityViews_ViewTypeId",
                table: "IASYS_EntityViews",
                column: "ViewTypeId");

            migrationBuilder.CreateIndex(
                name: "IX_IASYS_MagicEntityRelations_ChildEntityId",
                table: "IASYS_MagicEntityRelations",
                column: "ChildEntityId");

            migrationBuilder.CreateIndex(
                name: "IX_IASYS_MagicEntityRelations_EntityId",
                table: "IASYS_MagicEntityRelations",
                column: "EntityId");

            migrationBuilder.CreateIndex(
                name: "IX_IASYS_Pages_DestinationDeviceTypeId",
                table: "IASYS_Pages",
                column: "DestinationDeviceTypeId");

            migrationBuilder.CreateIndex(
                name: "IX_IASYS_Pages_EntityId",
                table: "IASYS_Pages",
                column: "EntityId");

            migrationBuilder.CreateIndex(
                name: "IX_IASYS_Pages_PageTypeId",
                table: "IASYS_Pages",
                column: "PageTypeId");

            migrationBuilder.CreateIndex(
                name: "IX_IASYS_Pages_PageUsedTypeId",
                table: "IASYS_Pages",
                column: "PageUsedTypeId");

            migrationBuilder.CreateIndex(
                name: "IX_IASYS_Pages_SolutionId",
                table: "IASYS_Pages",
                column: "SolutionId");

            migrationBuilder.CreateIndex(
                name: "IX_IASYS_Pages_TenantId",
                table: "IASYS_Pages",
                column: "TenantId");

            migrationBuilder.CreateIndex(
                name: "IX_IASYS_Pages_TenantId_Name",
                table: "IASYS_Pages",
                columns: new[] { "TenantId", "Name" },
                unique: true,
                filter: "[TenantId] IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "IX_IASYS_PageVersions_PageId",
                table: "IASYS_PageVersions",
                column: "PageId");

            migrationBuilder.CreateIndex(
                name: "IX_IASYS_PageVersions_TenantId",
                table: "IASYS_PageVersions",
                column: "TenantId");

            migrationBuilder.CreateIndex(
                name: "IX_IASYS_Permissions_ParentId",
                table: "IASYS_Permissions",
                column: "ParentId");

            migrationBuilder.CreateIndex(
                name: "IX_IASYS_SolutionAdministrators_SolutionId_UserId",
                table: "IASYS_SolutionAdministrators",
                columns: new[] { "SolutionId", "UserId" },
                unique: true,
                filter: "[SolutionId] IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "IX_IASYS_SolutionAdministrators_TenantId",
                table: "IASYS_SolutionAdministrators",
                column: "TenantId");

            migrationBuilder.CreateIndex(
                name: "IX_IASYS_SolutionAdministrators_UserId",
                table: "IASYS_SolutionAdministrators",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_IASYS_SolutionConnections_SolutionId",
                table: "IASYS_SolutionConnections",
                column: "SolutionId");

            migrationBuilder.CreateIndex(
                name: "IX_IASYS_SolutionConnections_TenantId",
                table: "IASYS_SolutionConnections",
                column: "TenantId");

            migrationBuilder.CreateIndex(
                name: "IX_IASYS_Solutions_OwnerId",
                table: "IASYS_Solutions",
                column: "OwnerId");

            migrationBuilder.CreateIndex(
                name: "IX_IASYS_Solutions_TenantId",
                table: "IASYS_Solutions",
                column: "TenantId");

            migrationBuilder.CreateIndex(
                name: "IX_IASYS_Solutions_TenantId_Name",
                table: "IASYS_Solutions",
                columns: new[] { "TenantId", "Name" },
                unique: true,
                filter: "[TenantId] IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "IX_IASYS_Solutions_VendorId",
                table: "IASYS_Solutions",
                column: "VendorId");

            migrationBuilder.CreateIndex(
                name: "IX_IASYS_TenantApps_AppId",
                table: "IASYS_TenantApps",
                column: "AppId");

            migrationBuilder.CreateIndex(
                name: "IX_IASYS_TenantApps_TenantId",
                table: "IASYS_TenantApps",
                column: "TenantId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "IASYS_AppAdditionnalElements");

            migrationBuilder.DropTable(
                name: "IASYS_AppEntities");

            migrationBuilder.DropTable(
                name: "IASYS_AppFonctionalities");

            migrationBuilder.DropTable(
                name: "IASYS_AppPages");

            migrationBuilder.DropTable(
                name: "IASYS_AppVersionHistoryItems");

            migrationBuilder.DropTable(
                name: "IASYS_Controls");

            migrationBuilder.DropTable(
                name: "IASYS_EntityFields");

            migrationBuilder.DropTable(
                name: "IASYS_EntityVariables");

            migrationBuilder.DropTable(
                name: "IASYS_EntityViews");

            migrationBuilder.DropTable(
                name: "IASYS_MagicEntityRelations");

            migrationBuilder.DropTable(
                name: "IASYS_PageVersions");

            migrationBuilder.DropTable(
                name: "IASYS_Permissions");

            migrationBuilder.DropTable(
                name: "IASYS_SolutionAdministrators");

            migrationBuilder.DropTable(
                name: "IASYS_SolutionConnections");

            migrationBuilder.DropTable(
                name: "IASYS_TenantApps");

            migrationBuilder.DropTable(
                name: "IASYS_AppFonctionalityCategories");

            migrationBuilder.DropTable(
                name: "IASYS_AppVersionHistories");

            migrationBuilder.DropTable(
                name: "IASYS_AppVersionHistoryItemCategories");

            migrationBuilder.DropTable(
                name: "IASYS_EntityFieldCalculationTypes");

            migrationBuilder.DropTable(
                name: "IASYS_EntityFieldGroups");

            migrationBuilder.DropTable(
                name: "IASYS_EntityFieldRequirements");

            migrationBuilder.DropTable(
                name: "IASYS_EntityFieldDataTypes");

            migrationBuilder.DropTable(
                name: "IASYS_EntityViewTypes");

            migrationBuilder.DropTable(
                name: "IASYS_Pages");

            migrationBuilder.DropTable(
                name: "IASYS_Apps");

            migrationBuilder.DropTable(
                name: "IASYS_DestinationDeviceType");

            migrationBuilder.DropTable(
                name: "IASYS_Entities");

            migrationBuilder.DropTable(
                name: "IASYS_PageTypes");

            migrationBuilder.DropTable(
                name: "IASYS_AppStatus");

            migrationBuilder.DropTable(
                name: "IASYS_AppTypes");

            migrationBuilder.DropTable(
                name: "IASYS_DataOwnerShips");

            migrationBuilder.DropTable(
                name: "IASYS_Solutions");

            migrationBuilder.DropTable(
                name: "IAMKT_Vendors");
        }
    }
}
