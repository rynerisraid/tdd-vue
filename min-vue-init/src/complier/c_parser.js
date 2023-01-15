/**
 * 
 * @param {*} 
 * @returns 解析后的语法树
 */

export function parse(template){

    //上下文
    const context = {
        source:template,
        advance(num){
            //消费模板内容
            //根据指定num，截取位置num后面部分的模板内容，并替换source
            context.source = context.source.slice(num)
        },
        advanceSpaces(){
            const match = /^[\t\r\n\f ]+/.exec(context.source);
            if (match) {
                context.source = context.source.slice(match[0].length)
            }
        }
    }

    const ast = parseChildren(context,[])

    return ast
}


function parseChildren(context, stack){
    //存储 解析到的ast节点
    let nodes = []

    while(!isEnd(context, stack)){
        // node保存单次解析结果
        let node
        if(context.source[0]==='<'){
            if(context.source[1]==='/'){
                //结束标签
                console.error('无效的结束标签')
                continue
            }else if(/[a-z]/i.test(context.source[1])){
                node = parseElement(context, stack)
            }
        }
        if(!node){

        }
    
        nodes.push(node)

    }


    
    //解析完毕返回结果
    return nodes
}


function isEnd(context, stack) {
    //模板内容解析完毕
    if(!context.source){
        return true
    }

    //遇到结束标签，且stack中存在同名开始标签
    const parent = stack[stack.length - 1]
    if(parent && context.source.startsWith(`</${parent.tag}`)){
        return true
    }

}


function parseElement(context, stack){
    //解析开始标签
    const ele = parseTag(context)

    //自闭
    if(ele.isUnary){
        return ele
    }

    //父级标签入栈，用于结束判断
    stack.push(ele)

    //递归解析子节点
    ele.children = parseChildren(context, stack)

    //子节点解析结束，父级标签出栈
    stack.pop()


  // 解析结束标签
  if (context.source.startsWith(`</${ele.tag}`)) {
    parseTag(context, 'end')
  } else {
    // 非正常闭合标签
    console.error(`${ele.tag}标签缺少闭合标签`)
  }
  return ele
}


// parseTag同时用来解析开始标签和结束标签，用type以示区分，默认是开始标签start
function parseTag(context, type = 'start') {
    // 处理开始、结束标签的正则不同
    const pattern =
      type === 'start'
        ? /^<([a-z][^\t\r\n\f />]*)/i
        : /^<\/([a-z][^\t\r\n\f />]*)/i
    const match = pattern.exec(context.source)
    // 匹配成功，第一个分组的值为标签名称
    let tag
    if(match){
      tag = match[1]
      // 消费匹配部分全部内容，例如<div
      context.advance(match[0].length)
    }
  
  
    // 消费标签后面空格
    context.advanceSpaces()
    // 解析属性
    const props = parseAttrs(context);
  
    // 消费结束，如果字符串以/>开头，说明是自闭合标签
    const isUnary = context.source.startsWith('/>')
    // 消费掉标签名后面的/>或者>
    context.advance(isUnary ? 2 : 1)
    // 返回标签节点
    return {
      type: 'Element',
      tag,
      props: props,
      children: [],
      isUnary
    }
}


//parseAttrs

//需要消费的字符串为 id="foo" v-show="isShow"
/**
 * 
 * @param {*} context 
 * @returns 返回解析的结果
 * 需要消费的字符串为
 * 并返回结果 id="foo" v-show="isShow"
 * [
        {
          type: "Attribute",
          name: "id",
          value: "foo",
        },
        {
          type: "Attribute",
          name: "v-show",
          value: "isShow",
        },
      ] 
 */
function parseAttrs(context) {

    const props = []
    
    if(context.source.startsWith('/>')) return []

    while(!context.source.startsWith('>')){
        const pattern = /[a-z\-]*=[a-zA-Z0-9\"]*/g
        const match = pattern.exec(context.source)
        let attr
        if(match){
            attr = match[0]
            // 消费匹配部分全部内容，例如<div
            context.advance(match[0].length)
            
            props.push({
                type: "Attribute",
                name: attr.split('=')[0].replace(/"/g,''),
                value: attr.split('=')[1].replace(/"/g,'')
            })
        }
        context.advanceSpaces()
        
    }

    return props
    
}
