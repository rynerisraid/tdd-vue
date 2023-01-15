

export function generate(ast){
    //递归ast
    const code = genNode(ast[0])
    
    return `return ${code}`
}

/**
 * 
 * 
 * 
 * 
 * @param {*} ast 
 * @returns 
 */

function genNode(ast){
    
    if(ast.type=== 'Element'){
        return genElement(ast)
    }else if(ast.type=== 'Text'){
        return genText(ast)
    }else if(ast.type=='Interpolation'){
        return genText(ast.content)
    }

    return ''
}
//return this._c('div',{},'xxx')
function genElement(ast){
    //解析标签
    const tag = `'${ast.tag}'`;
    //解析属性
    const props = genProps(ast)
    //解析children()
    const cNode = genChildren(ast)
    const children = cNode === undefined?"":cNode
    const code = `this._c(${tag},${props},${children})`;
    return code;
}

function genProps(ast) {
    if (ast.props.length > 0) {
      // 遍历el.props，返回{key:val}
      const result = {};
      for (const prop of ast.props) {
        result[prop.name] = prop.value;
      }
      return JSON.stringify(result);
    }
    return null;
}

function genChildren(ast){
    const children = ast.children
    if (children.length > 0) {
        // 如果只有一个类型为Text的子元素，则处理为字符串形式：_c('div',null,'text')
        if (children.length === 1 
                &&(children[0].type === "Text" || children[0].type === "Interpolation")) {
          return children[0].type === "Text"? 
            `'${children[0].content}'`
            :`this.${children[0].content.content}`;
        }
        // 其他情况处理为数组形式：_c('div',null,[_c('span',null,'text')])
        return `[${children.map((c) => genNode(c)).join(",")}]`;
    }
}

function genText(text){
    const content = text.type === "Expression"?
                    `this.${text.content}`
                    :`'${text.content}'`;
    return `this._v(${content})`
}