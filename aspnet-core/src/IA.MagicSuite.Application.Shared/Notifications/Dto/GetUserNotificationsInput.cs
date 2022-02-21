using System;
using Abp.Notifications;
using IA.MagicSuite.Dto;

namespace IA.MagicSuite.Notifications.Dto
{
    public class GetUserNotificationsInput : PagedInputDto
    {
        public UserNotificationState? State { get; set; }

        public DateTime? StartDate { get; set; }

        public DateTime? EndDate { get; set; }
    }
}