/**
 * effect是副作用函数，第一次立即执行
 * 在 proxy   代理的对象中
 * track()    get收集响应式对象，把副作用和副作用的依赖收集起来
 * trigger()  set中触发更新
 */

//当前正在执行的副作用函数
let activeEffect;
export function effect(fn){
    const effectFn = ()=>{
        try{
            activeEffect = effectFn;
            return fn();
        }finally{
            //todo
        }
    }
    effectFn();
    return effectFn;  
}


/**
 * targetMap用于存储副作用，并建立副作用和依赖的对应关系
 * 一个副作用可能依赖多个响应式对象，一个响应式对象可能依赖多个属性
 * 同一个属性又可能被多个副作用依赖，因此targetMap的结构设计如下
 * {
 *  [target]:{
 *      [key]:[]
 *  }
 * }
 * 
 */
const targetMap = new WeakMap();

export function track(target,key){
    if(!activeEffect){
        return ;
    }
    let depsMap = targetMap.get(target);
    if(!depsMap){
        targetMap.set(target,(depsMap = new Map()));
    }

    let deps = depsMap.get(key);
    if(!deps){
        depsMap.set(key,(depsMap = new Map()));
    }
    deps.add(activeEffect);
}

export function trigger(target,key){
    const depsMap = targetMap.get(target);
    if(!depsMap){
        return ;
    }
    const deps = depsMap.get(key);
    if(!deps){
        return;
    }
    
}