export function parse(template) {
  // 上下文
  const context = {
    source: template, // 保存模版，用于后续消费过程
    advance(num) {// 消费模版内容
      // 根据指定num，截取位置num后面部分的模版内容，并替换source
      context.source = context.source.slice(num)
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
    }else if (/[a-z]/i.test(context.source[1])) {
      // 开始标签
      node = parseElement(context, stack)

    } else if (context.source.startsWith('{{')) {
      // 插值文本
      node = parseInterpolation(context)
    }

    // 没有node，则既不是标签也不是插值，所以只能是文本状态
    if (!node) {
      // node = parseText(context)
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


  // 消费标签后面空格
  // context.advanceSpaces()
  // 解析属性
  // const props = parseAttrs(context);

  // 消费结束，如果字符串以/>开头，说明是自闭合标签
  const isUnary = context.source.startsWith('/>')
  // 消费掉标签名后面的/>或者>
  context.advance(isUnary ? 2 : 1)
  // 返回标签节点
  return {
    type: 'Element',
    tag,
    props: [],
    children: [],
    isUnary
  }
}

