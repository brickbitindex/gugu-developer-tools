function getSign() {
  const d = new Date();
  return parseInt(d / 1000 / 60 / 60, 10) * 1000 * 60 * 60;
}

const querys = {
};

export default querys;
