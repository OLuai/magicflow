using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using IA.MagicSuite.MultiTenancy.HostDashboard.Dto;

namespace IA.MagicSuite.MultiTenancy.HostDashboard
{
    public interface IIncomeStatisticsService
    {
        Task<List<IncomeStastistic>> GetIncomeStatisticsData(DateTime startDate, DateTime endDate,
            ChartDateInterval dateInterval);
    }
}