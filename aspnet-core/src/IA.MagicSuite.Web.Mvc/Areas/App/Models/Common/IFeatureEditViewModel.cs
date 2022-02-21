using System.Collections.Generic;
using Abp.Application.Services.Dto;
using IA.MagicSuite.Editions.Dto;

namespace IA.MagicSuite.Web.Areas.App.Models.Common
{
    public interface IFeatureEditViewModel
    {
        List<NameValueDto> FeatureValues { get; set; }

        List<FlatFeatureDto> Features { get; set; }
    }
}