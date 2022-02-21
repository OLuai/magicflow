using Abp.IdentityServer4vNext;
using Abp.Zero.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using IA.MagicSuite.Authorization.Delegation;
using IA.MagicSuite.Authorization.Roles;
using IA.MagicSuite.Authorization.Users;
using IA.MagicSuite.Chat;
using IA.MagicSuite.Editions;
using IA.MagicSuite.Friendships;
using IA.MagicSuite.MultiTenancy;
using IA.MagicSuite.MultiTenancy.Accounting;
using IA.MagicSuite.MultiTenancy.Payments;
using IA.MagicSuite.Storage;
using IA.MagicSuite.MagicSys;
//using IA.MagicSuite.MagicMarket;

namespace IA.MagicSuite.EntityFrameworkCore
{
    public class MagicSuiteDbContext : AbpZeroDbContext<Tenant, Role, User, MagicSuiteDbContext>, IAbpPersistedGrantDbContext
    {
        public virtual DbSet<MagicPermission> MagicPermissions { get; set; }

        public virtual DbSet<MagicAppEntity> MagicAppEntities { get; set; }

        public virtual DbSet<MagicPageVersion> MagicPageVersions { get; set; }

        public virtual DbSet<MagicDestinationDeviceType> MagicDestinationDeviceTypes { get; set; }

        public virtual DbSet<MagicSolutionConnection> MagicSolutionConnections { get; set; }

        public virtual DbSet<MagicAppAdditionnalElement> MagicAppAdditionnalElements { get; set; }

        public virtual DbSet<MagicTenantApp> MagicTenantApps { get; set; }

        public virtual DbSet<MagicEntityFieldGroup> MagicEntityFieldGroups { get; set; }

        public virtual DbSet<MagicAppPage> MagicAppPages { get; set; }

        public virtual DbSet<MagicEntityView> MagicEntityViews { get; set; }

        public virtual DbSet<MagicEntityVariable> MagicEntityVariables { get; set; }

        public virtual DbSet<MagicEntityViewType> MagicEntityViewTypes { get; set; }

        public virtual DbSet<MagicEntityField> MagicEntityFields { get; set; }

        public virtual DbSet<MagicEntityRelation> MagicEntityRelations { get; set; }

        public virtual DbSet<MagicEntityFieldDataType> MagicEntityFieldDataTypes { get; set; }

        public virtual DbSet<MagicEntityFieldCalculationType> MagicEntityFieldCalculationTypes { get; set; }

        public virtual DbSet<MagicEntityFieldRequirement> MagicEntityFieldRequirements { get; set; }

        public virtual DbSet<MagicPage> MagicPages { get; set; }

        public virtual DbSet<MagicPageType> MagicPageTypes { get; set; }

        public virtual DbSet<MagicEntity> MagicEntities { get; set; }

        public virtual DbSet<MagicAppVersionHistoryItem> MagicAppVersionHistoryItems { get; set; }

        public virtual DbSet<MagicAppVersionHistoryItemCategory> MagicAppVersionHistoryItemCategories { get; set; }

        public virtual DbSet<MagicAppVersionHistory> MagicAppVersionHistories { get; set; }

        public virtual DbSet<MagicAppFonctionality> MagicAppFonctionalities { get; set; }

        public virtual DbSet<MagicAppFonctionalityCategory> MagicAppFonctionalityCategories { get; set; }

        public virtual DbSet<MagicApp> MagicApps { get; set; }

        public virtual DbSet<MagicAppStatus> MagicAppStatus { get; set; }

        public virtual DbSet<MagicControl> MagicControls { get; set; }

        public virtual DbSet<MagicAppType> MagicAppTypes { get; set; }

        public virtual DbSet<MagicDataOwnerShip> MagicDataOwnerShips { get; set; }

        public virtual DbSet<MagicSolutionAdministrator> MagicSolutionAdministrators { get; set; }

        public virtual DbSet<MagicSolution> MagicSolutions { get; set; }

        //public virtual DbSet<MagicVendor> MagicVendors { get; set; }


        /* Define an IDbSet for each entity of the application */

        public virtual DbSet<BinaryObject> BinaryObjects { get; set; }

        public virtual DbSet<Friendship> Friendships { get; set; }

        public virtual DbSet<ChatMessage> ChatMessages { get; set; }

        public virtual DbSet<SubscribableEdition> SubscribableEditions { get; set; }

        public virtual DbSet<SubscriptionPayment> SubscriptionPayments { get; set; }

        public virtual DbSet<Invoice> Invoices { get; set; }

        public virtual DbSet<PersistedGrantEntity> PersistedGrants { get; set; }

        public virtual DbSet<SubscriptionPaymentExtensionData> SubscriptionPaymentExtensionDatas { get; set; }

        public virtual DbSet<UserDelegation> UserDelegations { get; set; }

        public MagicSuiteDbContext(DbContextOptions<MagicSuiteDbContext> options)
            : base(options)
        {

        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            //MagicMarket tables *********************************************************
            //modelBuilder.Entity<MagicVendor>(v =>
            //{
            //    //Ajouter les uniques constraints de la table des vendors
            //    v.HasIndex(e => new { e.Acronym }).IsUnique();
            //    v.HasIndex(e => new { e.Name }).IsUnique();
            //    v.HasIndex(e => new { e.TenantId }).IsUnique();
            //});

            //MagicSolution tables *********************************************************
            modelBuilder.Entity<MagicSolution>(m =>
            {
                m.HasIndex(e => new { e.TenantId });
                m.HasIndex(e => new { e.TenantId, e.Name }).IsUnique();
            });
            modelBuilder.Entity<MagicSolutionAdministrator>(m =>
            {
                m.HasIndex(e => new { e.TenantId });
                m.HasIndex(e => new { e.SolutionId, e.UserId }).IsUnique();
            });
            modelBuilder.Entity<MagicSolutionConnection>(m =>
            {
                m.HasIndex(e => new { e.TenantId });
                m.HasIndex(e => new { e.SolutionId });
            });



            //MagicEntity tables ********************************************************
            modelBuilder.Entity<MagicEntity>(m =>
            {
                m.HasIndex(e => new { e.TenantId });
                m.HasIndex(e => new { e.TenantId, e.Name }).IsUnique();
                m.HasIndex(e => new { e.SolutionId });
            });
            modelBuilder.Entity<MagicEntityFieldGroup>(m =>
            {
                m.HasIndex(e => new { e.TenantId });
                m.HasIndex(e => new { e.EntityId });
            });
            modelBuilder.Entity<MagicEntityView>(m =>
            {
                m.HasIndex(e => new { e.TenantId });
                m.HasIndex(e => new { e.EntityId });
            });
            modelBuilder.Entity<MagicEntityField>(m =>
            {
                m.HasIndex(e => new { e.TenantId });
                m.HasIndex(e => new { e.EntityId, e.Name }).IsUnique();
            });

            //MagicPage tables ************************************************************
            modelBuilder.Entity<MagicPage>(m =>
            {
                m.HasIndex(e => new { e.TenantId });
                m.HasIndex(e => new { e.TenantId, e.Name }).IsUnique();
                m.HasIndex(e => new { e.SolutionId });

            });
            modelBuilder.Entity<MagicPageVersion>(m =>
            {
                m.HasIndex(e => new { e.TenantId });
                m.HasIndex(e => new { e.PageId });
                //Création de l'index unique               
                // m.HasOne(e => e.MagicPageFk).WithMany(p => p.MagicPageVersions).HasForeignKey(pv => pv.PageUniqueName).HasPrincipalKey(p => p.UniqueName);
            });

            //MagicApp tables *************************************************************
            modelBuilder.Entity<MagicApp>(m =>
            {
                m.HasIndex(e => new { e.TenantId });
                m.HasIndex(e => new { e.TenantId, e.Name }).IsUnique();
                m.HasIndex(e => new { e.SolutionId });
            });
            modelBuilder.Entity<MagicAppPage>(m =>
            {
                //m.Property(e => e.Id).ValueGeneratedNever();
                m.HasIndex(e => new { e.TenantId });
                m.HasIndex(e => new { e.AppId, e.PageId }).IsUnique();

            });
            modelBuilder.Entity<MagicAppEntity>(a =>
            {
                a.HasIndex(e => new { e.TenantId });
                a.HasIndex(e => new { e.AppId });

            });
            modelBuilder.Entity<MagicAppAdditionnalElement>(m =>
            {
                m.HasIndex(e => new { e.TenantId });
                m.HasIndex(e => new { e.AppId });
            });
            modelBuilder.Entity<MagicTenantApp>(m =>
            {
                m.HasIndex(e => new { e.TenantId });
            });
            modelBuilder.Entity<MagicAppVersionHistoryItem>(m =>
            {
                m.HasIndex(e => new { e.TenantId });
            });
            modelBuilder.Entity<MagicAppVersionHistoryItemCategory>(m =>
            {
                m.HasIndex(e => new { e.TenantId });
            });
            modelBuilder.Entity<MagicAppVersionHistory>(m =>
            {
                m.HasIndex(e => new { e.TenantId });
                m.HasIndex(e => new { e.AppId });
            });
            modelBuilder.Entity<MagicAppFonctionality>(m =>
            {
                m.HasIndex(e => new { e.TenantId });
                m.HasIndex(e => new { e.AppId });
            });
            modelBuilder.Entity<MagicAppFonctionalityCategory>(m =>
            {
                m.HasIndex(e => new { e.TenantId });
                m.HasIndex(e => new { e.AppId });
            });
            modelBuilder.Entity<MagicAppStatus>(m =>
            {
                m.Property(e => e.Id).ValueGeneratedNever();
                m.HasIndex(e => new { e.TenantId });
                m.HasIndex(e => new { e.TenantId, e.Name }).IsUnique();
            });



            //Zero tables elements ***********************************************************************
            modelBuilder.Entity<BinaryObject>(b =>
            {
                b.HasIndex(e => new { e.TenantId });
            });

            modelBuilder.Entity<ChatMessage>(b =>
            {
                b.HasIndex(e => new { e.TenantId, e.UserId, e.ReadState });
                b.HasIndex(e => new { e.TenantId, e.TargetUserId, e.ReadState });
                b.HasIndex(e => new { e.TargetTenantId, e.TargetUserId, e.ReadState });
                b.HasIndex(e => new { e.TargetTenantId, e.UserId, e.ReadState });
            });

            modelBuilder.Entity<Friendship>(b =>
            {
                b.HasIndex(e => new { e.TenantId, e.UserId });
                b.HasIndex(e => new { e.TenantId, e.FriendUserId });
                b.HasIndex(e => new { e.FriendTenantId, e.UserId });
                b.HasIndex(e => new { e.FriendTenantId, e.FriendUserId });
            });

            modelBuilder.Entity<Tenant>(b =>
            {
                b.HasIndex(e => new { e.SubscriptionEndDateUtc });
                b.HasIndex(e => new { e.CreationTime });
            });

            modelBuilder.Entity<SubscriptionPayment>(b =>
            {
                b.HasIndex(e => new { e.Status, e.CreationTime });
                b.HasIndex(e => new { PaymentId = e.ExternalPaymentId, e.Gateway });
            });

            modelBuilder.Entity<SubscriptionPaymentExtensionData>(b =>
            {
                b.HasQueryFilter(m => !m.IsDeleted)
                    .HasIndex(e => new { e.SubscriptionPaymentId, e.Key, e.IsDeleted })
                    .IsUnique();
            });

            modelBuilder.Entity<UserDelegation>(b =>
            {
                b.HasIndex(e => new { e.TenantId, e.SourceUserId });
                b.HasIndex(e => new { e.TenantId, e.TargetUserId });
            });

            modelBuilder.ConfigurePersistedGrantEntity();
        }
    }
}
