using Abp.Dependency;
using GraphQL.Types;
using GraphQL.Utilities;
using IA.MagicSuite.Queries.Container;
using System;

namespace IA.MagicSuite.Schemas
{
    public class MainSchema : Schema, ITransientDependency
    {
        public MainSchema(IServiceProvider provider) :
            base(provider)
        {
            Query = provider.GetRequiredService<QueryContainer>();
        }
    }
}