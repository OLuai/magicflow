using System.Data.Common;
using Microsoft.EntityFrameworkCore;

namespace IA.MagicSuite.EntityFrameworkCore
{
    public static class MagicSuiteDbContextConfigurer
    {
        public static void Configure(DbContextOptionsBuilder<MagicSuiteDbContext> builder, string connectionString)
        {
            builder.UseSqlServer(connectionString);
        }

        public static void Configure(DbContextOptionsBuilder<MagicSuiteDbContext> builder, DbConnection connection)
        {
            builder.UseSqlServer(connection);
        }
    }
}