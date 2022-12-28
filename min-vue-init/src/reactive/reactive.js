import { activeEffect } from "../effect/effect";
let list = new Set()
export function reactive(params){
    const proxyObj = new Proxy(params,{
        get(targer, property, receiver){
            //list.push(activeEffect);
            let ref = Reflect.get(targer, property, receiver)
            return 
        },
        set(targer, property, receiver){
            let result = Reflect.set(targer, property, receiver)
            list.forEach(fn=>{
                fn()
            })
            return result
        },
        deleteProperty(target, key){
            list.forEach(fn=>{
                fn()
            })
            return Reflect.deleteProperty(target,key)
        }
    })

    return proxyObj;
}

function track(params, key) {
    // 获取map，查看有没有
    let depsmap = targetMap.get(params);
    if(!depsmap) {
        depsmap = new Map();
        targetMap.set(params, depsmap);
    }
    // 这是一个set
    let deps = depsmap.get(key);
    if(!deps) {
        deps = new Set();
        depsmap.set(key, deps);
    }
    deps.add(activeEffect);

}

function trigger(target, key) {
    if(targetMap.has(target)) {
       const deps = targetMap.get(target).get(key);
        if(deps) {
            deps.forEach(dep => {
                dep();
            })
        }
    }
}

