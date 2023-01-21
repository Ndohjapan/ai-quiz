module.exports = (obj) => {
    let newObj = {};
    for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
            let newKey = key.replace(/[A-Z]/g, function (match) {
                return "_" + match.toLowerCase();
            });
            newObj[newKey] = obj[key];
        }
    }
    return newObj;
}
