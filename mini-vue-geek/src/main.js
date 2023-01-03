// import { createApp } from 'vue'
import { createApp } from './mini-vue'
import './style.css'
// import App from './App.vue'


// createApp(App).mount('#app');


createApp({
    data(){
        return {
            title: 'hello, mini-vue'
        }
    },
    render(){
        const h3 = document.createElement('h3')
        h3.textContent = this.title
        return h3;
    },
    mounted(){
        setTimeout(()=>{
            this.title = 'wow, data change!'
        },2000)
    }
}).mount('#app');