import { defineComponent, h, unref } from "vue"


export default defineComponent({

    props:{
        to:{
            type: String,
            require: true
        }
    },

    setup(props){
        

        return ()=> {
            const to = unref(props.to)

            return h(
                'a',
                {
                    href: '#' + to,
                },
                'router-link'
                // slots.default()
            );
        };
    },
});
