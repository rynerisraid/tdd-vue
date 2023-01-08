// import { parse} from "../src/complier/parse"
import { parse } from "../src/complier/c_parser";

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

});
