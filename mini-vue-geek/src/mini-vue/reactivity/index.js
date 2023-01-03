//接收需要做响应式处理的对象obj，返回一个代理对象
let activeEffect;
export function effect(fn){
    activeEffect = fn
    
}

export function reactive(obj){

    return new Proxy(obj,{
        get(target, key){
            const value =  Reflect.get(target,key)
            //依赖的跟踪
            track(target,key)
            return value
        },
        set(target, key, value){
            const result = Reflect.set(target,key,value)
            //依赖触发
            trigger(target, key)
            return result
        },
        deleteProperty(target,key){
            const result = Reflect.deleteProperty(target,key)
            trigger(target, key)
            return result
        }
    })

}

//创建一个map来保存依赖关系
/**
 * { target: {key: [fn1, fn2]}} 
 */

const targetMap = new WeakMap()

export function track(target, key){
    if(activeEffect){
        let depsMap = targetMap.get(target)
        //首次desMap可能是不存在的，需要创建
        if(!depsMap){
            targetMap.set(target,(depsMap = new Map()))
        }
        //获取 depsMap中key对应的值
        let deps = depsMap.get(key)
        //首次deps 是不存在的，需要创建
        if(!deps){
            depsMap.set(key, (deps=new Set()))
        }
        //添加当前的激活的副作用
        deps.add(activeEffect)

    }
}

export function trigger(target, key){
    const depsMap = targetMap.get(target)
    if(depsMap){
        const deps = depsMap.get(key)
        if(deps){
            deps.forEach(dep=>dep())
        }
    }
}