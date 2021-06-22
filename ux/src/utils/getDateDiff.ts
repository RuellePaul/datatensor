const getDateDiff = (date1, date2, format: 'duration' | 'passed_event' = 'duration') => {
    let diff = Math.abs((new Date(date2).getTime()) - (new Date(date1).getTime()));
    diff = Math.abs(Math.floor(diff / 1000));

    const sec = diff % 60;
    const min = Math.floor((diff - sec) / 60);
    const hours = Math.floor((diff - min) / (60 * 60));
    const days = Math.floor((diff - hours) / (24 * 60 * 60));

    if (format === 'duration') {
        if (days > 0)
            return `${days}day${days > 1 ? 's': ''} ${hours}h`;
        else if (hours > 0)
            return `${hours}h ${min}m`;
        else if (min > 0)
            return `${min}m ${sec}s`;
        else
            return `${sec}s`
    }

    if (format === 'passed_event') {
        if (days > 0)
            return `${days} day${days > 1 ? 's': ''} ago`;
        else if (hours > 0)
            return `${hours} hour${hours > 1 ? 's': ''} ago`;
        else if (min > 0)
            return `${min} minute${min > 1 ? 's': ''} ago`;
        else
            return `now`
    }
}

export default getDateDiff;