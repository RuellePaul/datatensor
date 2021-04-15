/* eslint-disable no-restricted-properties */
const bytesToSize = (bytes: number, decimals: number = 2) => {
    if (bytes === 0) return '0o';

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['o', 'Ko', 'Mo', 'Go', 'To'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
};

export default bytesToSize;
