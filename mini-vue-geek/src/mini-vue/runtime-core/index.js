/**
 * 自定义渲染器 api
 * 负责渲染组件内容 
 */
import { effect,reactive } from "../reactivity"

// runtime-core
export function createRenderer(options){
    const render =(rootComponent,selector)=>{            
        //1.获取数主
        const container = options.querySelector(selector)
        //2.渲染视图
        const observed = reactive(rootComponent.data())
        //3.为组件顶一个更新函数
        const componentUpdateFn=()=>{
            const el = rootComponent.render.call(observed)
            options.setElementText(container,'')
            //4.追加到宿主
            //container.appendChild(el)
            options.insert(el,container)
        }
        
        //设置激活的副作用
        effect(componentUpdateFn)

        //初始化执行一次  
        componentUpdateFn()

        //挂载钩子
        if(rootComponent.mounted){
            rootComponent.mounted.call(observed)
        }

    };

    //返回一个渲染器实例
    return {
        render,
        //提供给用户一个createApp方法，让用户去使用
        createApp: createAppAPI(render)
    }
    
}


export function createAppAPI(render){
    return function createAPP(rootComponent){
        const app = {
            mount(selector){
                render(rootComponent,selector)
            }
        }
        return app 
    }
}