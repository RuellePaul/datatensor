const getInitials = (name: string = '') => {
    if (!name)
        return '';

    return name
        .replace(/\s+/, ' ')
        .split(' ')
        .slice(0, 2)
        .map(v => v && v[0].toUpperCase())
        .join('');
};

export default getInitials;
