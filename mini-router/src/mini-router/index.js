// 导入页面组件
import Home from '../views/Home.vue'
import About from '../views/About.vue'
import { createRouter } from './router';


//2.定义路由
const routes = [
    {path:'/', component: Home},
    {path:'/about', component: About},
]

const router = createRouter({
    routes
})

export default router