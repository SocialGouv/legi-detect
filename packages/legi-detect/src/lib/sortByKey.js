const sortByKey = key => (a, b) => {
  if (a[key] < b[key]) {
    return 1;
  } else if (a[key] > b[key]) {
    return -1;
  }
  return 0;
};

module.exports = sortByKey;
