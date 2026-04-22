import React, { useMemo } from "react";
import { getWeekDays } from "../utils/schedule";

const SESSIONS = [
    { id: "Sáng", label: "Sáng", time: "07:00 - 11:59" },
    { id: "Chiều", label: "Chiều", time: "12:00 - 17:59" },
    { id: "Tối", label: "Tối", time: "18:00 - 21:30" },
];

const TYPE_THEME = {
    theory: {
        label: "Chính khóa",
        surface: "#eef6ff",
        accent: "#0d6efd",
        badge: "rgba(13, 110, 253, 0.12)",
        badgeText: "#0a58ca",
    },
    practice: {
        label: "Bổ trợ",
        surface: "#f1fff2",
        accent: "#198754",
        badge: "rgba(25, 135, 84, 0.14)",
        badgeText: "#157347",
    },
    exam: {
        label: "Thi / kiểm tra",
        surface: "#fff8eb",
        accent: "#fd7e14",
        badge: "rgba(253, 126, 20, 0.14)",
        badgeText: "#c55a11",
    },
};

const normalizeType = (type) => {
    const normalized = String(type || "").trim().toLowerCase();

    if (
        normalized === "practice" ||
        normalized.includes("bổ trợ") ||
        normalized.includes("bo tro")
    ) {
        return "practice";
    }

    if (
        normalized === "exam" ||
        normalized.includes("thi") ||
        normalized.includes("kiểm") ||
        normalized.includes("kiem")
    ) {
        return "exam";
    }

    return "theory";
};

const ScheduleTable = ({ data = [], currentViewDate }) => {
    const weekDays = useMemo(() => getWeekDays(currentViewDate), [currentViewDate]);

    const scheduleMap = useMemo(() => {
        return data.reduce((acc, item) => {
            const key = `${item.date}_${item.slot}`;
            if (!acc[key]) {
                acc[key] = [];
            }
            acc[key].push(item);
            return acc;
        }, {});
    }, [data]);

    const totalSessions = data.length;
    const classCount = new Set(data.map((item) => item.code)).size;

    return (
        <div className="rounded-4 border bg-white shadow-sm overflow-hidden">
            <div className="d-flex flex-wrap justify-content-between gap-3 px-4 py-4 border-bottom bg-light-subtle">
                <div>
                    <div className="text-uppercase text-muted fw-semibold small mb-1">
                        Lịch theo tuần
                    </div>
                    <h4 className="fw-bold text-dark mb-0">Bảng hiển thị lịch học</h4>
                </div>

                <div className="d-flex flex-wrap gap-2">
                    <span className="badge text-bg-light border px-3 py-2">
                        {totalSessions} buổi trong tuần
                    </span>
                    <span className="badge text-bg-light border px-3 py-2">
                        {classCount} lớp / môn
                    </span>
                </div>
            </div>

            <div className="table-responsive">
                <table
                    className="table align-middle mb-0"
                    style={{ minWidth: "1160px", tableLayout: "fixed" }}
                >
                    <thead>
                        <tr className="border-0">
                            <th
                                className="border-0 px-4 py-3 bg-white"
                                style={{ width: "140px" }}
                            >
                                <div className="text-uppercase text-muted small fw-semibold">
                                    Khung giờ
                                </div>
                            </th>

                            {weekDays.map((day) => (
                                <th
                                    key={day.isoDate}
                                    className="border-0 px-3 py-3 bg-white"
                                >
                                    <div
                                        className={`rounded-4 border px-3 py-3 ${
                                            day.isToday ? "shadow-sm" : ""
                                        }`}
                                        style={{
                                            backgroundColor: day.isToday
                                                ? "#ecf4ff"
                                                : "#f8fafc",
                                            borderColor: day.isToday
                                                ? "#bfdbfe"
                                                : "#e2e8f0",
                                        }}
                                    >
                                        <div className="d-flex align-items-center justify-content-between mb-1">
                                            <span className="fw-bold text-dark">
                                                {day.label}
                                            </span>
                                            {day.isToday && (
                                                <span className="badge text-bg-primary rounded-pill">
                                                    Hôm nay
                                                </span>
                                            )}
                                        </div>
                                        <div className="text-muted small">
                                            {day.dateNumber}/{day.monthNumber}
                                        </div>
                                    </div>
                                </th>
                            ))}
                        </tr>
                    </thead>

                    <tbody>
                        {SESSIONS.map((session) => (
                            <tr key={session.id}>
                                <td className="px-4 py-3 bg-light-subtle border-end">
                                    <div className="fw-bold text-dark">{session.label}</div>
                                    <div className="small text-muted">{session.time}</div>
                                </td>

                                {weekDays.map((day) => {
                                    const key = `${day.isoDate}_${session.id}`;
                                    const sessionsInCell = scheduleMap[key] || [];

                                    return (
                                        <td
                                            key={key}
                                            className="p-3 align-top"
                                            style={{ backgroundColor: "#fcfdff" }}
                                        >
                                            <div
                                                className="d-flex flex-column gap-2"
                                                style={{ minHeight: "180px" }}
                                            >
                                                {sessionsInCell.length === 0 && (
                                                    <div
                                                        className="rounded-4 border border-dashed text-center text-muted d-flex flex-column justify-content-center px-3 py-4 h-100"
                                                        style={{
                                                            minHeight: "160px",
                                                            backgroundColor: "#f8fafc",
                                                            borderStyle: "dashed",
                                                        }}
                                                    >
                                                        <div className="fw-semibold mb-1">
                                                            Trống lịch
                                                        </div>
                                                        <div className="small">
                                                            Không có buổi học trong khung này
                                                        </div>
                                                    </div>
                                                )}

                                                {sessionsInCell.map((item, index) => {
                                                    const theme =
                                                        TYPE_THEME[normalizeType(item.type)];

                                                    return (
                                                        <div
                                                            key={`${item.code}_${item.time}_${index}`}
                                                            className="rounded-4 border shadow-sm p-3"
                                                            style={{
                                                                backgroundColor: theme.surface,
                                                                borderLeft: `5px solid ${theme.accent}`,
                                                                borderColor: "rgba(15, 23, 42, 0.08)",
                                                            }}
                                                        >
                                                            <div className="d-flex justify-content-between align-items-start gap-2 mb-2">
                                                                <div>
                                                                    <div className="fw-bold text-dark mb-1">
                                                                        {item.subject}
                                                                    </div>
                                                                    <div className="small text-muted">
                                                                        {item.code}
                                                                    </div>
                                                                </div>

                                                                <span
                                                                    className="badge rounded-pill px-3 py-2"
                                                                    style={{
                                                                        backgroundColor:
                                                                            theme.badge,
                                                                        color: theme.badgeText,
                                                                    }}
                                                                >
                                                                    {theme.label}
                                                                </span>
                                                            </div>

                                                            <div className="d-flex flex-column gap-1 small text-dark">
                                                                <div>
                                                                    <i className="bi bi-clock me-2 text-muted" />
                                                                    {item.time}
                                                                </div>
                                                                <div>
                                                                    <i className="bi bi-grid me-2 text-muted" />
                                                                    Tiết {item.period}
                                                                </div>
                                                                <div>
                                                                    <i className="bi bi-geo-alt me-2 text-muted" />
                                                                    {item.room}
                                                                </div>
                                                                <div>
                                                                    <i className="bi bi-person me-2 text-muted" />
                                                                    {item.teacher}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </td>
                                    );
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="d-flex flex-wrap gap-3 px-4 py-3 border-top bg-white">
                {Object.entries(TYPE_THEME).map(([key, theme]) => (
                    <div key={key} className="d-flex align-items-center gap-2 small">
                        <span
                            className="rounded-pill"
                            style={{
                                width: "18px",
                                height: "18px",
                                backgroundColor: theme.surface,
                                borderLeft: `4px solid ${theme.accent}`,
                                display: "inline-block",
                            }}
                        />
                        <span className="text-muted">{theme.label}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ScheduleTable;
