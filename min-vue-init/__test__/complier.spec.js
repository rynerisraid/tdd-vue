import { parse} from "../src/complier/parse";
//import { parse } from "../src/complier/c_parser";
import { generate } from "../src/complier/generate";

/**
 * complier:
 * 1.解析       template -> ast
 * 2.转换       ast -> ast *
 * 3.代码生成   ast -> js  function
 */

describe('complier', () => {

    it('parse element', () => {
        const template = '<div></div>'
        // parse 解析抽象语法树
        // 接收 html 字符串，返回js对象能够表达的html结构

        const ast = parse(template)

        expect(ast[0]).toEqual({
            tag:'div',
            type:'Element',
            props: [],
            children:[],
            isUnary: false
        })
    });

    it('parse complicated tag',()=>{
      const template = `<input v-model="data.message"/>
      <button @click="reverse">{{data.message}}</button>
      `
      const ast = parse(template)
      console.log(ast)
    })

    it("parse unary element", () => {
        const template = "<img/>";
        const ast = parse(template);
        expect(ast[0]).toEqual({
          tag: "img",
          type: "Element",
          props: [],
          children: [],
          isUnary: true,
        });
    });


    it("parse nested elements", () => {
        const template = "<div><span></span></div>";
        const ast = parse(template);
        expect(ast[0]).toEqual({
          tag: "div",
          type: "Element",
          props: [],
          children: [
            {
              tag: "span",
              type: "Element",
              props: [],
              children: [],
              isUnary: false,
            },
          ],
          isUnary: false,
        });
    });

    it("parse props and directive", () => {
        const template = '<div id="foo" v-show="isShow"></div>';
        const ast = parse(template);
        expect(ast[0]).toEqual({
          tag: "div",
          type: "Element",
          props: [
            {
              type: "Attribute",
              name: "id",
              value: "foo",
            },
            {
              type: "Attribute",
              name: "v-show",
              value: "isShow",
            },
          ],
          children: [],
          isUnary: false,
        });
    });


    it('parse plain text', () => {
      const template = '<div>some text</div>'
      const ast = parse(template)
      expect(ast[0]).toEqual({
        tag: 'div',
        type: 'Element',
        props: [],
        children: [
          {
            type: 'Text',
            content: 'some text'
          }
        ],
        isUnary: false
      })
    });


    it('parse interpolation', () => {
      const template = '<div>{{foo}}</div>'
      const ast = parse(template)
      expect(ast[0]).toEqual({
        tag: 'div',
        type: 'Element',
        props: [],
        children: [
          {
            type: 'Interpolation',
            content: {
              type: 'Expression',
              content: 'foo'
            }
          }
        ],
        isUnary: false
      })
    });


    
    it("generate element with text", () => {
      const ast = [
        {
          type: "Element",
          tag: "div",
          props: [],
          isUnary: false,
          children: [{ type: "Text", content: "foo" }],
        },
      ];
      const code = generate(ast);
      expect(code).toMatch(`return this._c('div',null,'foo')`);
    });
    
    it("generate element with expression", () => {
      const ast = [
        {
          type: "Element",
          tag: "div",
          props: [],
          isUnary: false,
          children: [
            {
              type: "Interpolation",
              content: { type: "Expression", content: "foo" },
            },
          ],
        },
      ];
      const code = generate(ast);
      expect(code).toMatch(`return this._c('div',null,this.foo)`);
    });
    
    it("generate element with muti children", () => {
      const ast = [
        {
          type: "Element",
          tag: "div",
          props: [],
          isUnary: false,
          children: [
            { type: "Text", content: "foo" },
            {
              type: "Element",
              tag: "span",
              props: [],
              isUnary: false,
              children: [{ type: "Text", content: "bar" }],
            },
          ],
        },
      ];
      const code = generate(ast);
      expect(code).toMatch(
        `return this._c('div',null,[this._v('foo'),this._c('span',null,'bar')])`
      );
    });
    
});
