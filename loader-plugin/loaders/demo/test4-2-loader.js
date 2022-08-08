// pitch  loader

module.exports = function (content, map, meta) {
  console.log("\n test4-2-loader==========", content, map, meta);
  return content;
};
module.exports.pitch = function (remainingRequest, precedingRequest, data) {
  console.log(
    "\n pitch loader 4-2 ==========",
    remainingRequest,
    "||||||",
    precedingRequest,
    "||||||",
    data
  );
};
