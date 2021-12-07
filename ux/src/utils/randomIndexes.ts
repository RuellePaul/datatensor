const randomIndexes = (size: number, min: number = 0, max: number) => {

    if (min >= max)
        return null;
    if (size > max)
        return null;

    let indexes = [];
    while (indexes.length < size) {
        let index = Math.floor(Math.random() * max);
        if (indexes.indexOf(index) === -1) indexes.push(index);
    }
    return indexes
};

export default randomIndexes;