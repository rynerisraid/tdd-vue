import RouterLink from "./RouterLink"
import RouterView from './RouterView'
import { ref } from "vue"
export function createRouter(options) {

    //创建router实例
    const router = {
        options, //保存配置项
        current: ref(window.location.hash.slice(1)||'/'),
        install(app){
            const router = this
            //1.注册两个全局组件
            app.component("RouterLink",RouterLink)
            app.component("RouterView",RouterView)

            //2.注册 $router
            app.config.globalProperties.$router = router

        }
    }

    //监听事件
    window.addEventListener('hashchange',()=>{
        console.log(router.current.value)
        //将当前url变化的地方摘出来，保存到路由器实例上
        //变化保存到current，并触发RouterView更新
        router.current.value = window.location.hash.slice(1)
    })

    return router
}