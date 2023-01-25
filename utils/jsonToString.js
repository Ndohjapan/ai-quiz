module.exports = (json) => {
    let str = Object.entries(json).map(([key, value]) => `${key} = '${value}'`).join(" and ");
    return str;
}
