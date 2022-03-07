using Abp.Application.Services.Dto;
using Abp.AspNetCore.Mvc.Authorization;
using Abp.Domain.Repositories;
using IA.MagicSuite.MagicSys;
using IA.MagicSuite.MagicSys.Dtos;
using IA.MagicSuite.Web.Areas.App.Models.MagicFlow;
using IA.MagicSuite.Web.Controllers;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace IA.MagicSuite.Web.Areas.App.Controllers
{
    [Area("App")]
    public class MagicFlowController : MagicSuiteControllerBase
    {
        private readonly IRepository<MagicFlowType, string> _flowTypesRepository;

        public MagicFlowController(IRepository<MagicFlowType, string> flowTypeRepository)
        {
            _flowTypesRepository = flowTypeRepository;
        }
        public ActionResult Index()
        {
            var flowTypes = _flowTypesRepository
                .GetAll()
                .OrderBy(fltp => fltp.Name)
                .ToList();


            IndexViewModel model = new IndexViewModel
            {
                FlowTypes = new ListResultDto<MagicFlowTypeDto>(ObjectMapper.Map<List<MagicFlowTypeDto>>(flowTypes))
            };

            return View(model);
        }

        public ActionResult Editor
            (string Id)
        {
            return View();
        }
    }
}
