import "./css/index.css";

const index = 3;
console.log("index===", index);

const sum = (...agrs) => {
  return agrs.reduce((pre, cur) => pre + cur, 0);
};
