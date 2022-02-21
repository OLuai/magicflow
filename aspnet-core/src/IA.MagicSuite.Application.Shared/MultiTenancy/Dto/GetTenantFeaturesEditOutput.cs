using System.Collections.Generic;
using Abp.Application.Services.Dto;
using IA.MagicSuite.Editions.Dto;

namespace IA.MagicSuite.MultiTenancy.Dto
{
    public class GetTenantFeaturesEditOutput
    {
        public List<NameValueDto> FeatureValues { get; set; }

        public List<FlatFeatureDto> Features { get; set; }
    }
}