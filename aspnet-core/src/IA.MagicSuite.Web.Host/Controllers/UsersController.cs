﻿using Abp.AspNetCore.Mvc.Authorization;
using IA.MagicSuite.Authorization;
using IA.MagicSuite.Storage;
using Abp.BackgroundJobs;

namespace IA.MagicSuite.Web.Controllers
{
    [AbpMvcAuthorize(AppPermissions.Pages_Administration_Users)]
    public class UsersController : UsersControllerBase
    {
        public UsersController(IBinaryObjectManager binaryObjectManager, IBackgroundJobManager backgroundJobManager)
            : base(binaryObjectManager, backgroundJobManager)
        {
        }
    }
}