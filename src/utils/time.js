function toVNTime(date) {
  return new Date(date).toLocaleString('sv-SE', {
    timeZone: 'Asia/Ho_Chi_Minh',
  });
}

module.exports = { toVNTime };