export const formatLocalIsoDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
};

export const getWeekStart = (date) => {
    const base = new Date(date);
    const day = base.getDay();
    const diff = base.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(base.setDate(diff));
};

export const getWeekRange = (date) => {
    const monday = getWeekStart(date);
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);

    return {
        fromDate: formatLocalIsoDate(monday),
        toDate: formatLocalIsoDate(sunday),
        monday,
        sunday,
    };
};

export const getWeekDays = (date) => {
    const monday = getWeekStart(date);
    const todayIso = formatLocalIsoDate(new Date());
    const dayNames = [
        "Thứ 2",
        "Thứ 3",
        "Thứ 4",
        "Thứ 5",
        "Thứ 6",
        "Thứ 7",
        "Chủ nhật",
    ];

    return Array.from({ length: 7 }).map((_, index) => {
        const current = new Date(monday);
        current.setDate(monday.getDate() + index);

        return {
            index,
            isoDate: formatLocalIsoDate(current),
            label: dayNames[index],
            shortLabel: index === 6 ? "CN" : `T${index + 2}`,
            dateNumber: String(current.getDate()).padStart(2, "0"),
            monthNumber: String(current.getMonth() + 1).padStart(2, "0"),
            isToday: formatLocalIsoDate(current) === todayIso,
        };
    });
};

export const formatWeekRangeLabel = (date) => {
    const { monday, sunday } = getWeekRange(date);
    const sameMonth = monday.getMonth() === sunday.getMonth();
    const sameYear = monday.getFullYear() === sunday.getFullYear();

    if (sameMonth && sameYear) {
        return `${String(monday.getDate()).padStart(2, "0")} - ${String(
            sunday.getDate(),
        ).padStart(2, "0")}/${String(sunday.getMonth() + 1).padStart(2, "0")}/${sunday.getFullYear()}`;
    }

    return `${String(monday.getDate()).padStart(2, "0")}/${String(
        monday.getMonth() + 1,
    ).padStart(2, "0")}/${monday.getFullYear()} - ${String(
        sunday.getDate(),
    ).padStart(2, "0")}/${String(sunday.getMonth() + 1).padStart(2, "0")}/${sunday.getFullYear()}`;
};
