const parseQueryArgs = key => {
    let query = window.location.search.substr(1);
    let result = {};
    query.split('&').forEach(function(part) {
        let item = part.split('=');
        result[item[0]] = decodeURIComponent(item[1]);
    });
    return result[key];
};

export default parseQueryArgs;
