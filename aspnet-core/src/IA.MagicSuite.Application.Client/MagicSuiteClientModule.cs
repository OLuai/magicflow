﻿using Abp.Modules;
using Abp.Reflection.Extensions;

namespace IA.MagicSuite
{
    public class MagicSuiteClientModule : AbpModule
    {
        public override void Initialize()
        {
            IocManager.RegisterAssemblyByConvention(typeof(MagicSuiteClientModule).GetAssembly());
        }
    }
}
