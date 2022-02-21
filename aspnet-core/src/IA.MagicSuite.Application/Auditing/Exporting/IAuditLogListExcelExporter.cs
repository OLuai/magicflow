using System.Collections.Generic;
using IA.MagicSuite.Auditing.Dto;
using IA.MagicSuite.Dto;

namespace IA.MagicSuite.Auditing.Exporting
{
    public interface IAuditLogListExcelExporter
    {
        FileDto ExportToFile(List<AuditLogListDto> auditLogListDtos);

        FileDto ExportToFile(List<EntityChangeListDto> entityChangeListDtos);
    }
}
