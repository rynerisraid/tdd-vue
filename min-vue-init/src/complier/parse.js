export function parse(template) {
  // 上下文
  const context = {
    source: template, // 保存模版，用于后续消费过程
    advance(num) {// 消费模版内容
      // 根据指定num，截取位置num后面部分的模版内容，并替换source
      context.source = context.source.slice(num)
    },
    advanceSpaces(){
      //消费消费掉若干个空格 /^[\t\r\n\f ]+/.
      const match = /^[\t\r\n\f ]+/.exec(context.source);
      if (match) {
          context.source = context.source.slice(match[0].length)
      }
      //context.source = context.source.replace(/^[\t\r\n\f]*$/,'')

    }
  }

  // 解析子节点解析
  return parseChildren(context, [])
}

function parseChildren(context, stack) {
  // 存储解析获得的所有ast节点
  let nodes = []

  // 开启状态机，只要满足条件就会一直对字符串进行解析，状态类型取决于节点类型数量
  // 1.标签，例如<div>
  // 2.文本插值，例如{{val}}
  // 3.普通文本，例如text
  while (!isEnd(context, stack)) {
    // node保存单次解析结果
    let node
    // 模版以<起始，可能是开始标签或者无效的结束标签
    if (context.source[0] === '<') {
      if (context.source[1] === '/') {
        // 结束标签
        console.error('无效的结束标签')
        continue
      } else if (/[a-z]/i.test(context.source[1])) {
        // 开始标签
        node = parseElement(context, stack)
      }
    } else if (context.source.startsWith('{{')) {
      // 插值文本
      node = parseInterpolation(context)
    }

    // 没有node，则既不是标签也不是插值，所以只能是文本状态
    if (!node) {
      node = parseText(context)
    }

    // 将解析结果存入nodes
    nodes.push(node)
  }

  // 循环结束说明解析完毕
  return nodes
}

function isEnd(context, stack) {
  // 模版内容解析完毕
  if (!context.source) {
    return true
  }

  // 遇到结束标签，且stack中存在同名开始标签
  const parent = stack[stack.length - 1]
  if (parent && context.source.startsWith(`</${parent.tag}`)) {
    return true
  }
}

function parseElement(context, stack) {
  // 解析开始标签
  const ele = parseTag(context)
  // 自闭和情况，不需要后续解析
  if (ele.isUnary) {
    return ele
  }

  // 作为父级标签入栈，用于结束判断
  stack.push(ele)
  // 递归解析子节点
  ele.children = parseChildren(context, stack)
  // 子节点解析结束，父级标签出栈
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


  //消费标签后面空格
  context.advanceSpaces()
  //解析属性
  const props = parseAttrs(context);

  // 消费结束，如果字符串以/>开头，说明是自闭合标签
  const isUnary = context.source.startsWith('/>')
  // 消费掉标签名后面的/>或者>
  context.advance(isUnary ? 2 : 1)
  // 返回标签节点
  return {
    type: 'Element',
    tag,
    props,//[],
    children: [],
    isUnary
  }
}

function parseAttrs(context) {
  const { advance, advanceSpaces } = context
  
  const props = []
  //只要不遇到 > 或者 /> 就不停下来，不断循环消费模板内容

  while(!context.source.startsWith('>') && !context.source.startsWith('/>') ){
    //解析属性的正则  /^[^\t\r\n\f />][^\t\r\n\f />=]*/.
    const match =  /^[^\t\r\n\f />][^\t\r\n\f />=]*/.exec(context.source)
    //1.获取属性名称
    //2.消费属性名称
    const name = match[0]
    // 消费属性名
    advance(name.length)
    // 消费等号
    advance(1)
    // 消费空白符
    advanceSpaces()

    //属性值
    let value = ''
    // 获取首字符
    const quote = context.source[0]
    // 如果是引号"或'
    const isQuot = quote === '"' || quote === "'"


    if(isQuot){
      //消费头一个引号
      advance(1)
      // 获取下一个引号
      const endQuoteIndex = context.source.indexOf(quote)
      if(endQuoteIndex>-1){
        //截取中间部分
        value = context.source.slice(0, endQuoteIndex)
        // 消费属性值和引号
        advance(value.length + 1)
      }else{
        console.error('缺少引号')
      }
      
    }else{
      // 属性值没被引号包裹，下一个空格或>之前的值为属性值
      const match = /^[^\t\r\n\f >]+/.exec(context.source)
      // 获取并消费属性值
      value = match[0]
      advance(value.length)

    }

    // 消费属性后面空格
    advanceSpaces()


    props.push({
      type: "Attribute",
      name: name,
      value: value
    })
  }


  return props
}


/**
 * 处理插值文本，有可能出现 {{}}
 * @param {*} context 
 * @returns 
 */
function parseText(context){

  let endIndex = context.source.length
  //查找 <
  const ltIndex = context.source.indexOf('<')

  //查找 {{
  const delimiterIndex = context.source.indexOf('{{')

  if(ltIndex > -1 && ltIndex < endIndex){
    endIndex = ltIndex
  }

  if(delimiterIndex > -1 && delimiterIndex < endIndex){
    endIndex = delimiterIndex
  }

  // 截取最终文本内容
  const content = context.source.slice(0, endIndex)
  // 消费文本内容
  context.advance(content.length)

  // 构造文本节点并返回
  return {
    type: 'Text',
    content
  }

  //const match = /^[A-Za-z0-9_\s]*/.exec(context.source)
  /*
  let content
  if(match){
    content = match[0]
      // 消费匹配部分全部内容，例如<div
      context.advance(match[0].length)
      
      return {
        type: 'Text',
        content: content
      }
  }
  return {}
  */
}

function parseInterpolation(context){
  // 消费开始分隔符{{
    context.advance(2)
  //context.source.startsWith('{{')
  // 找到结束分隔符}}
  const closeIndex = context.source.indexOf('}}')
  if (closeIndex < 0) {
    console.error('插值表达式缺少结束分隔符');
  }

  // 截取表达式部分
  const content = context.source.slice(0, closeIndex)
  // 消费内容部分
  context.advance(content.length)
  // 消费结束分隔符}}
  context.advance(2)

  return {
    type: 'Interpolation',
    content:{
      type:'Expression',
      content
    }
  }

}