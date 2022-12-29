import { reactive } from '../src/reactive/reactive';
import { effect } from '../src/effect/effect';
describe("jest test", () => {
    it("reactive()", () => {
        const original = {foo:'foo'}
        const observed = reactive(original)
        observed.foo = 'foo~'
        expect(observed.foo).toBe('foo~')
        observed.bar = 'bar'
        expect(original.bar).toBe('bar')
    })

    it("effect",()=>{
        let dummy
        const counter = reactive({ num: 0 })
        // spy 如果被调用了，统计被调用的次数

        const fnSpy = jest.fn(() => {
          dummy = counter.num
        })

        //创建的时候立即调用一次
        effect(fnSpy)

        expect(fnSpy).toHaveBeenCalledTimes(1)
        expect(dummy).toBe(0)
        //函数内部有变化了
        counter.num = 1
        expect(fnSpy).toHaveBeenCalledTimes(2)
        expect(dummy).toBe(1)
    })
})