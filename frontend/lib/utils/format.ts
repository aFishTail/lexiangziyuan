const zhDateFormatter = new Intl.DateTimeFormat("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
});

export function formatDate(input: string | Date) {
    const date = typeof input === "string" ? new Date(input) : input;

    if (Number.isNaN(date.getTime())) {
        return "--";
    }

    return zhDateFormatter.format(date);
}

export function formatReadingTime(minutes?: number) {
    if (!minutes) {
        return "";
    }

    return `${minutes} 分钟阅读`;
}
