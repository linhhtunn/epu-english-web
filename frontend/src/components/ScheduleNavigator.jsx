import React from "react";
import { formatWeekRangeLabel } from "../utils/schedule";

const ScheduleNavigator = ({
    currentDate,
    onPrev,
    onNext,
    onToday,
    accent = "#0d6efd",
}) => {
    return (
        <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 rounded-4 border bg-white px-3 py-3 shadow-sm">
            <div>
                <div className="text-uppercase text-muted fw-semibold small mb-1">
                    Khung thời gian
                </div>
                <div className="fw-bold text-dark" style={{ letterSpacing: "-0.02em" }}>
                    Tuần {formatWeekRangeLabel(currentDate)}
                </div>
            </div>

            <div className="d-flex align-items-center gap-2 flex-wrap">
                <button
                    className="btn rounded-pill px-4 fw-semibold text-white shadow-sm"
                    onClick={onToday}
                    style={{ backgroundColor: accent, borderColor: accent }}
                >
                    Hôm nay
                </button>

                <div className="d-flex align-items-center rounded-pill border bg-light-subtle px-2 py-1">
                    <button
                        className="btn btn-link text-dark text-decoration-none px-3 fw-semibold"
                        onClick={onPrev}
                    >
                        <i className="bi bi-arrow-left me-2" />
                        Tuần trước
                    </button>

                    <div className="vr my-1 opacity-25" />

                    <button
                        className="btn btn-link text-dark text-decoration-none px-3 fw-semibold"
                        onClick={onNext}
                    >
                        Tuần sau
                        <i className="bi bi-arrow-right ms-2" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ScheduleNavigator;
