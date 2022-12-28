export let activeEffect = null;
export function effect(fn){
    activeEffect = fn;
    fn();
}