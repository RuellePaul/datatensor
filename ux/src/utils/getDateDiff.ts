const getDateDiff = (date1, date2) => {
    let diff = (new Date(date2).getTime()) - (new Date(date1).getTime());

    const sec = Math.floor(diff / 1000) % 60;
    const min = Math.floor((Math.floor(diff / 1000) - sec) / 60);

    if (min > 0)
        return `${min}m${sec}s`;
    else
        return `${sec}s`
}

export default getDateDiff;