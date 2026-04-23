/**
 * Lấy thời gian hiện tại theo múi giờ Việt Nam (UTC+7)
 * @returns {Date}
 */
export const getVietnamNow = () => {
    const now = new Date();
    // Chuyển đổi sang UTC+7 bất kể múi giờ trình duyệt
    const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
    return new Date(utc + (3600000 * 7));
};

/**
 * Định dạng ngày tháng hiển thị chuẩn Việt Nam
 * @param {string|Date} date 
 * @param {boolean} includeTime 
 * @returns {string}
 */
export const formatVietnamDateTime = (date, includeTime = true) => {
    if (!date) return "---";
    const d = new Date(date);
    
    const options = {
        timeZone: "Asia/Ho_Chi_Minh",
        year: "numeric",
        month: "numeric",
        day: "numeric",
    };

    if (includeTime) {
        options.hour = "2-digit";
        options.minute = "2-digit";
        options.second = "2-digit";
        options.hour12 = false;
    }

    return d.toLocaleString("vi-VN", options);
};

/**
 * So sánh hai ngày trong múi giờ Việt Nam
 * @param {string|Date} date1 
 * @param {string|Date} date2 
 * @returns {number} -1 nếu date1 < date2, 1 nếu date1 > date2, 0 nếu bằng
 */
export const compareVietnamDates = (date1, date2) => {
    const d1 = new Date(date1).getTime();
    const d2 = new Date(date2).getTime();
    if (d1 < d2) return -1;
    if (d1 > d2) return 1;
    return 0;
};
