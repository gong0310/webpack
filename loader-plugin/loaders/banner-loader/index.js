const schema = require("./schema.json");

module.exports = function (content) {
  // 获取loader的options，同时对options内容进行校验
  // schema是options的校验规则（符合 JSON schema 规则）
  const options = this.getOptions(schema);

  const prefix = `
    /*
    * Author: '${options.author}'
    */
  `;

  return `${prefix} \n ${content}`;
};


// additionalProperties: false ,不能在options里面追加属性，只能有author一个