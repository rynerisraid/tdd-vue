import { effect } from '../src/effect/effect';
import { reactive } from '../src/reactive/reactive';

describe("jest test", () => {
    it('effect', () => {
        let dummy
        const counter = reactive({ num: 0 })
        const fnSpy = jest.fn(() => {
          dummy = counter.num
        })
        //依赖收集过程，立即执行一次spy函数
        //读取一次spy函数内部响应式数据
        effect(fnSpy)
        //立即执行一次
        expect(fnSpy).toHaveBeenCalledTimes(1)
        expect(dummy).toBe(0)
        
        counter.num = 1
        expect(fnSpy).toHaveBeenCalledTimes(2)
        expect(dummy).toBe(1)
    })     
  },


);
  


