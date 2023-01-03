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
    },
    createElement(tag){
        return document.createElement(tag)
    },
    remove(el){
        const parent = el.parentNode
        if (parent) {
            parent.removeChild(el)
        }
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
    const app = ensureRenderer().createApp(rootComponent);
    const mount = app.mount
    app.mount = function(selectorOrContainer){
        const container = document.querySelector(selectorOrContainer)
        mount(container)
    }
    return app;
}
