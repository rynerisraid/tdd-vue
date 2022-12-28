import { reactive } from '../src/reactive/reactive';
import { effect } from '../src/effect/effect';
describe("jest test", () => {
    it("reactive()", () => {
        const original = {foo:'foo'}
        const observed = reactive({foo:'foo~~'})
        observed.foo = 'foo~'
        expect(observed.foo).toBe('foo~')
        observed.bar = 'bar'
        expect(original.bar).toBe('bar')
    })

    it('should observe multiple properties', () => {
        let dummy
        const counter = reactive({ num1: 0, num2: 0 })
        effect(() => (dummy = counter.num1 + counter.num1 + counter.num2))
      
        expect(dummy).toBe(0)
        counter.num1 = counter.num2 = 7
        expect(dummy).toBe(21)
      })
      
      it('should handle multiple effects', () => {
        let dummy1, dummy2
        const counter = reactive({ num: 0 })
        effect(() => (dummy1 = counter.num))
        effect(() => (dummy2 = counter.num))
      
        expect(dummy1).toBe(0)
        expect(dummy2).toBe(0)
        counter.num++
        expect(dummy1).toBe(1)
        expect(dummy2).toBe(1)
      })


      it('effect should linked to the exact key', () => {
        const observe = reactive({ foo: 'foo', bar: 'bar' })
        const fnSpy = jest.fn(() => {
          observe.foo
        });
      
        effect(fnSpy)
        observe.bar = 'barrr'
        observe.foo = 'foooo'
        expect(fnSpy).toHaveBeenCalledTimes(2)
      });


      it("调度执行", () => {
        const obj = reactive({ foo: 1 });
        const arr = [];
        jest.useFakeTimers(); // 开启模拟定时器
        effect(() => arr.push(obj.foo), {
          scheduler(fn) {
            setTimeout(fn);
          },
        });
        obj.foo++;
        arr.push("over");
      
        jest.runAllTimers(); // 等待所有定时器执行
        expect(arr[0]).toBe(1);
        expect(arr[1]).toBe("over");
        expect(arr[2]).toBe(2);
      });
  });
  