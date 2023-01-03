import { createRenderer } from '../runtime-core'
// 创建app实例

// runtime-dom
let renderer;

//dom平台特有的操作
const rendererOptions = {
    querySelector(selecrot){
        return document.querySelector(selecrot)
    },
    insert(child,parent,anchor){
        parent.insertBefore(child, anchor|| null)
    },
    setElementText(el,text){
        el.textContent = text
    }
}

//确保 render 单例
function ensureRenderer(){
    return renderer || (renderer = createRenderer(rendererOptions))
}

export function createApp(rootComponent){
    //接收根组件，返回App实例
    //console.log(rootComponent)
    //renderer全局单例
    //const renderer = createRenderer(options)
    return ensureRenderer().createApp(rootComponent)
}
