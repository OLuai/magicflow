using System.Collections.Generic;
using Abp;
using IA.MagicSuite.Chat.Dto;
using IA.MagicSuite.Dto;

namespace IA.MagicSuite.Chat.Exporting
{
    public interface IChatMessageListExcelExporter
    {
        FileDto ExportToFile(UserIdentifier user, List<ChatMessageExportDto> messages);
    }
}
