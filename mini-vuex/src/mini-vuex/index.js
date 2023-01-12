import {reactive,computed,watch} from 'vue'
export function createStore(options){
    
    //Store实例
    const store = {
        //响应式
        _state: reactive(options.state()),
        get state(){
            return this._state
        },
        set state(v){
            console.error('please use replaceState() to reset state')
        },
        
        _mutations: options.mutations,
        //dispath的实现
        _actions: options.actions,
        //严格模式的处理
        _commit: false, //提交的标识符，如果通过commit方式修改状态，则设置为true
        _withCommit(fn){
            //fn 就是用户设置的 mutation 执行函数
            this._commit = true;
            fn()
            this._commit = false;
        }
    };
    //commit的实现
    function commit(type, payload){
        const entry = this._mutations[type]
        if(!entry){
            console.error(`unknown mutation typs ${entry}`)
            return ;
        }
        //要使用withCommit的方式去提交
        this._withCommit(()=>{
            entry.call(this.state, this.state,payload)
        })
    }

    function dispatch(type,payload){
        const entry = this._actions[type]
        if(!entry){
            console.error(`unknown mutation typs ${entry}`)
            return ;
        }
        return entry.call(this,this,payload)
    };

    store.commit = commit.bind(store)
    store.dispatch = dispatch.bind(store)
    
    //定义 store.getters
    store.getters = {}
    //遍历用户定义的getters
    Object.keys(options.getters).forEach(key=>{
        //定义计算属性
        const result = computed(() => {
            const getter = options.getters[key]
            if(getter){
                return getter.call(store, store.state)
            }else{
                console.error('unknown getter type:' + key)
                return ''
            }
        })
        //动态定义store.getters.xxx
        //值来自于用户定义的getter函数的返回值
        Object.defineProperty(store.getters, key, {
            // 只读
            get(){
                return result
            }
        })
    })
    
    // strict 模式
    if(options.strict){
        //监听store.state变化
        watch(store.state,()=>{
            if(!store._commit){
                console.warn("please use commit to mutate state");
                
            }
        },{
            deep:true,
            flush: 'sync'
        })
    }


    //插件，实现要求的install 方法
    store.install = function(app){
        //注册$router
        const store = this
        app.config.globalProperties.$store = store
    }


    return store
}