import {reactive} from '../src/reactive/reactive'
describe("jest test", () => {
    it("reactive()", () => {
        const original = {foo:'foo'}
        const observed = reactive(original)
        observed.foo = 'foo~'
        expect(observed.foo).toBe('foo~')
        observed.bar = 'bar'
        expect(original.bar).toBe('bar')
    })

})