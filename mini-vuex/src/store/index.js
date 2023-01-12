// import { createStore } from 'vuex';
import { createStore } from "../mini-vuex"

//创建 Store 实例
const store = createStore({
    strict: true,
    state(){
        return {
            count:1
        }
    },
    mutations:{
        //state 从何而来
        add(state){
            
            state.count++
        }
    },
    getters:{
        doubleCouter(state){
            return state.count *2
        }
    },
    actions:{
        //典型的就是异步常见
        add({commit}){
            setTimeout(() => {
                commit('add')
            }, 1000);
        }
    }
})

export {store}