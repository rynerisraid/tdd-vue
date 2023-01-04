import { parse} from "../src/complier/parse"


describe('complier', () => {
    it('parse element', () => {
        const template = '<div></div>'
        const ast = parse(template)

        expect(ast[0]).toEqual({
            tag:'div',
            type:'Element',
            children:[],
            isUnary: false
        })
    });
    
});
