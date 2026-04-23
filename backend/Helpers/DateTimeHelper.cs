using System;

namespace backend.Helpers
{
    public static class DateTimeHelper
    {
        public static DateTime GetVietnamNow()
        {
            return DateTime.UtcNow.AddHours(7);
        }

        public static DateOnly GetVietnamToday()
        {
            return DateOnly.FromDateTime(GetVietnamNow());
        }
    }
}
