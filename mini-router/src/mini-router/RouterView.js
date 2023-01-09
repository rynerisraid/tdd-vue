import { defineComponent, h, getCurrentInstance,unref } from "vue"

export default defineComponent({
    setup(){
        // 获取组件实例
        const { proxy: {$router} } = getCurrentInstance()
        //1.获取配置项 routes
        //2.通过current这个地址，找到匹配的项

        return ()=> {
            let component;
            const route = $router.options.routes.find(
                (route)=> route.path === unref($router.current)
            )
            if(route){
                component = route.component
                return h(component,'router-view')
            }else{
                console.warn('no match component')
                return h('div','')
            }
            
        }
    }
})
