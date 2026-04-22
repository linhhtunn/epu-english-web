using System.Globalization;
using System.Text.RegularExpressions;

namespace backend.Utilities;

public sealed record ParsedScheduleItem(string DisplayDay, int Thu, TimeOnly GioBatDau, TimeOnly GioKetThuc, string? ShiftKey = null);

public static class ClassScheduleParser
{
    private static readonly Dictionary<string, int> DayToThu = new(StringComparer.OrdinalIgnoreCase)
    {
        ["Sunday"] = 1,
        ["Sun"] = 1,
        ["Monday"] = 2,
        ["Mon"] = 2,
        ["Tuesday"] = 3,
        ["Tue"] = 3,
        ["Tues"] = 3,
        ["Wednesday"] = 4,
        ["Wed"] = 4,
        ["Thursday"] = 5,
        ["Thu"] = 5,
        ["Thur"] = 5,
        ["Thurs"] = 5,
        ["Friday"] = 6,
        ["Fri"] = 6,
        ["Saturday"] = 7,
        ["Sat"] = 7,
    };

    private static readonly Dictionary<int, string> ThuToDay = new()
    {
        [1] = "Sunday",
        [2] = "Monday",
        [3] = "Tuesday",
        [4] = "Wednesday",
        [5] = "Thursday",
        [6] = "Friday",
        [7] = "Saturday",
    };

    public static readonly IReadOnlyDictionary<string, (TimeOnly Start, TimeOnly End)> ShiftMap =
        new Dictionary<string, (TimeOnly Start, TimeOnly End)>(StringComparer.OrdinalIgnoreCase)
        {
            ["shift1"] = (new TimeOnly(7, 30), new TimeOnly(9, 30)),
            ["shift2"] = (new TimeOnly(9, 45), new TimeOnly(11, 45)),
            ["shift3"] = (new TimeOnly(13, 30), new TimeOnly(15, 30)),
            ["shift4"] = (new TimeOnly(15, 45), new TimeOnly(17, 45)),
            ["shift5"] = (new TimeOnly(18, 0), new TimeOnly(20, 0)),
            ["shift6"] = (new TimeOnly(20, 15), new TimeOnly(22, 15)),
        };

    public static List<ParsedScheduleItem> Parse(string? lichHoc)
    {
        var result = new List<ParsedScheduleItem>();
        if (string.IsNullOrWhiteSpace(lichHoc))
        {
            return result;
        }

        var parts = lichHoc.Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries);
        foreach (var rawPart in parts)
        {
            var part = rawPart.Trim();
            if (TryParseShiftPattern(part, out var shiftItems))
            {
                result.AddRange(shiftItems);
                continue;
            }

            if (TryParseTimePattern(part, out var timeItems))
            {
                result.AddRange(timeItems);
            }
        }

        return result;
    }

    public static string? Normalize(string? lichHoc)
    {
        var items = Parse(lichHoc);
        if (items.Count == 0)
        {
            return string.IsNullOrWhiteSpace(lichHoc) ? null : lichHoc;
        }

        return BuildDisplayText(items);
    }

    public static string? BuildDisplayText(IEnumerable<ParsedScheduleItem> lichDays, string? fallback = null)
    {
        var items = lichDays.ToList();
        if (items.Count == 0)
        {
            return fallback;
        }

        return string.Join(", ", items.Select(FormatItem));
    }

    public static string FormatItem(ParsedScheduleItem item)
    {
        if (!string.IsNullOrWhiteSpace(item.ShiftKey))
        {
            return $"{item.DisplayDay} ({item.ShiftKey})";
        }

        return $"{item.DisplayDay} {item.GioBatDau:HH\\:mm}-{item.GioKetThuc:HH\\:mm}";
    }

    public static string GetDisplayDay(int thu)
    {
        return ThuToDay.TryGetValue(thu, out var day) ? day : $"Day-{thu}";
    }

    private static bool TryParseShiftPattern(string part, out List<ParsedScheduleItem> items)
    {
        items = new List<ParsedScheduleItem>();
        var match = Regex.Match(part, @"^(.+?)\s*\((.+?)\)$");
        if (!match.Success)
        {
            return false;
        }

        var dayKey = match.Groups[1].Value.Trim();
        var shiftKey = match.Groups[2].Value.Trim();

        if (!DayToThu.TryGetValue(dayKey, out var thu) || !ShiftMap.TryGetValue(shiftKey, out var shift))
        {
            return false;
        }

        items.Add(new ParsedScheduleItem(GetDisplayDay(thu), thu, shift.Start, shift.End, shiftKey));
        return true;
    }

    private static bool TryParseTimePattern(string part, out List<ParsedScheduleItem> items)
    {
        items = new List<ParsedScheduleItem>();
        var match = Regex.Match(part, @"^(.+?)\s+(\d{1,2}:\d{2})\s*-\s*(\d{1,2}:\d{2})$");
        if (!match.Success)
        {
            return false;
        }

        if (!TimeOnly.TryParseExact(match.Groups[2].Value, "H:mm", CultureInfo.InvariantCulture, DateTimeStyles.None, out var start) &&
            !TimeOnly.TryParseExact(match.Groups[2].Value, "HH:mm", CultureInfo.InvariantCulture, DateTimeStyles.None, out start))
        {
            return false;
        }

        if (!TimeOnly.TryParseExact(match.Groups[3].Value, "H:mm", CultureInfo.InvariantCulture, DateTimeStyles.None, out var end) &&
            !TimeOnly.TryParseExact(match.Groups[3].Value, "HH:mm", CultureInfo.InvariantCulture, DateTimeStyles.None, out end))
        {
            return false;
        }

        var rawDays = match.Groups[1].Value
            .Split('-', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries);

        foreach (var rawDay in rawDays)
        {
            if (!DayToThu.TryGetValue(rawDay, out var thu))
            {
                return false;
            }

            var shiftKey = ShiftMap.FirstOrDefault(x => x.Value.Start == start && x.Value.End == end).Key;
            items.Add(new ParsedScheduleItem(GetDisplayDay(thu), thu, start, end, shiftKey));
        }

        return items.Count > 0;
    }
}
