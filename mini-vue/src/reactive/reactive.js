import { track,trigger } from "./effect";

export function reactive(target){
    
    if(!isObject(target)){
        return target
    }

    const proxy = new Proxy(target,{
        get(target,key,receiver){
            const res = Reflect.get(target,key,receiver);
            //在get中收集依赖
            track();
            return res;
        },
        set(target,key,value,receiver){
            const res = Reflect.set(target,key,value,receiver);
            //在set中触发更新
            trigger()
            return res;
        }
    })

    return proxy;
}