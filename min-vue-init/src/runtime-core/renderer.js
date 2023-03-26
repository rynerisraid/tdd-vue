import { compile } from "../complier";
import { createTextVnode, createVnode } from "./vnode";
export const Text = Symbol('text')
export function createRenderer(options) {
    const {
        createElement,
        setElementText,
        createText,
        setText,
        insert,
        patchProp,
    } = options;



    const patch = (oldVnode,vnode, container) => {
        
        const { tag,children, props } = vnode;
        const oldTag = oldVnode?.tag;

        if(oldVnode&&(oldTag!==tag)){
            //标签不相同
            unmount(oldVnode)
            oldVnode = null
        }


        if (typeof tag === 'string') {
            //vnode存在，挂载更新
            if(oldVnode){
                
                patchElement(oldVnode,vnode,container)

            }else{
                mountElement(vnode, container)
            }
            
        } else if (tag === Text) {
            //挂载文本
            if(oldVnode){
                setText(oldVnode.el,vnode.children)

            }else{
                const el = (vnode.el = createText(vnode.children));
                insert(el, container)
            }
            
        } else if (typeof tag === 'object') {
            if(oldVnode){

            }else{
                mountComponent(vnode, container)
            }
            
        }
    }

    const render = (vnode, container) => {
        // const { tag } = vnode
        // if(typeof tag ==='string'){
        //     //挂载元素
        //     mountElement(vnode,container)
        // }else if(tag === Text){
        //     //挂载文本节点
        //     mountTextElement(vnode, container)
        // }else{
        //     container.innerHTML = ''
        // }
        // 存储vnode作为下次更新时的old vnode

        if (vnode) {
            patch(container._vnode,vnode, container);
        } else {
            //删除相关，直接把整个内容清空了
            //container.innerHTML = ''
            if (container._vnode) {
                unmount(container._vnode)
            }
        }

        container._vnode = vnode
    }

    //卸载节点，找到节点，remove child把节点删掉
    const unmount = function (node) {
        const father = node.el.parentNode
        if (father) {
            father.removeChild(node.el)
        }

    }

    //
    const patchElement = (oldVnode,vnode, container) =>{
        
        const el = vnode.el = oldVnode.el;
        const { props }= vnode;
        const oldProps = oldVnode?.props;
        //更新props
        for(const key in props){
            if(props[key] !== oldProps[key]){
                //el, key, prevValue, nextValue
                patchProp(el, key, oldProps[key], props[key]); //
            }
        }
        for(const key in oldProps){
            //老的存在，新的不存在
            if(!props[key]){
                patchProp(el, key, oldProps[key], null);
            }
        }
        //更新子节点
        patchChildren(oldVnode,vnode, container)
    }

    const patchChildren = (oldVnode,newVnode, container)=>{
        if(typeof newVnode.children ==='string'){
            if(typeof oldVnode.children ==='string'){
                setElementText(oldVnode.el,newVnode.children)
            }else{
                oldVnode.children.forEach((item)=>{
                    unmount(item)
                })
                setElementText(oldVnode.el,newVnode.children)
            }
        }else{
            if(typeof oldVnode.children ==='string'){
                //文本更新为数组
                setElementText(oldVnode.el,null)
                newVnode.children.forEach((item)=>{
                    patch(null,item,newVnode.el)
                })
            }else{
                //两个数组的时候，数组更新为数据
                updateChildren(oldVnode.children,newVnode.children,oldVnode.el)

            }

        }
    }
    
    const updateChildren = (preChildren = [], nextChildren = [], container) =>{
        const len = Math.min(preChildren.length,nextChildren.length)
        for(let i =0; i<len;++i){
            patch(preChildren[i],nextChildren[i],container)
        }

        if(nextChildren.length > preChildren.length){
            nextChildren.slice(len).forEach(newChild=>{
                patch(null,newChild,container)
            })
        }else{
            preChildren.slice(len).forEach(oldChild=>{
                unmount(oldChild)
            })
        }
    }

    //挂载元素
    const mountElement = (vnode, container) => {

        // 根据节点类型创建节点
        const el = (vnode.el = createElement(vnode.tag));

        const { props } = vnode;
        if (props) {
            for (const key in props) {
                const val = props[key];
                patchProp(el, key, null, val);

                // if (/^on/.test(key)) {
                //   // 事件
                //   const event = key.slice(2).toLowerCase();
                //   el.addEventListener(event, val);
                // } else {
                //   el.setAttribute(key, val);
                // }
            }
        }

        // children为文本
        if (typeof vnode.children === "string") {
            // el.textContent = vnode.children;
            setElementText(el, vnode.children);
        } else {
            // children为数组，递归暂时调用mountElement，后续需调整
            vnode.children?.forEach((child) => patch(null,child, el));
        }

        // 插入元素
        // container.appendChild(el);
        insert(el, container);

    }

    const mountComponent = (vnode, container) => {
        // tag是组件配置选项
        const options = vnode.tag;

        // 如果render不存在，则需要通过编译template选项获取
        if (!options.render) {
            options.render = compile(options.template).render;
        }

        // 设置渲染函数需要的工具方法
        const ctx = { _c: createVnode, _v: createTextVnode };
        if (options.data) {
            Object.assign(ctx, options.data());
        }

        // 执行render获取组件vnode子树
        const subtree = options.render.call(ctx);
        //{return this._c('div',null,'component')}
        // 向下递归
        patch(null,subtree, container);
    };


    const createApp = (vnode) => {
        const mount = (container) => {
            render({ tag: vnode }, container)
        }
        return {
            mount
        }
    };

    return {
        render,
        createApp
    }
}


