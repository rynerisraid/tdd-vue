import {createRenderer,Text} from "../src/runtime-core";
import { nodeOps } from "../src/runtime-dom/nodeOps";




describe("renderer", () => {

  it("renderer.render", () => {
    const renderer = createRenderer({});
    const container = document.createElement("div");
    const vnode = {
      tag: "div",
      children: "hello",
    };
    renderer.render(vnode, container);
    expect(container.innerHTML).toBe("<div>hello</div>");
  });



  it("render text", () => {
    const renderer = createRenderer({});
    const container = document.createElement("div");
    const vnode = {
      tag: Text, // Text是一个Symbol
      children: "hello",
    };
    renderer.render(vnode, container);
    expect(container.innerHTML).toBe("hello");
  });

  
  it("render text and element", () => {
    const renderer = createRenderer(nodeOps);
    const container = document.createElement("div");
    const vnode = {
      tag: "div",
      children: [
        { tag: Text, children: "hello" },
        { tag: "span", children: "vue" },
      ],
    };
    renderer.render(vnode, container);
    expect(container.innerHTML).toBe("<div>hello<span>vue</span></div>");
  });

  it("set element attributes", () => {
    const renderer = createRenderer(nodeOps);
    const container = document.createElement("div");
    const onClick = jest.fn();
    const vnode = {
      tag: "div",
      props: { id: "box", class: "box", onClick },
      children: "hello",
    };
    renderer.render(vnode, container);
    expect(container.innerHTML).toMatch(
      '<div id="box" class="box">hello</div>'
    );
    const div = container.firstElementChild;
    div.dispatchEvent(new Event("click"));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("render component", () => {
    const renderer = createRenderer(nodeOps);
    const container = document.createElement("div");
    const vnode = {
      tag: {
        template: "<div>component</div>",
      },
    };
    renderer.render(vnode, container);
    expect(container.innerHTML).toBe("<div>component</div>");
  });

  it("render component with dynamic data", () => {
    const renderer = createRenderer(nodeOps);
    const container = document.createElement("div");
    const vnode = {
      tag: {
        template: "<div>{{title}}</div>",
        data() {
          return { title: "this is a component" };
        },
      },
    };
    renderer.render(vnode, container);
    expect(container.innerHTML).toBe("<div>this is a component</div>");
  });

  // // runtime-dom
  // // createApp()
  
  it("createApp of renderer", () => {
    const renderer = createRenderer(nodeOps);
    const container = document.createElement("div");
    renderer.createApp({
      template: "<div>{{title}}</div>",
      data() {
        return {
          title: "hello, mini-vue!",
        };
      },
    }).mount(container);
    expect(container.innerHTML).toBe("<div>hello, mini-vue!</div>");
  });

  it('unmount', () => {
    const renderer = createRenderer(nodeOps);
    const container = document.createElement("div");
    const vnode = {
      tag:'div',
      children: "hello",
    };
    renderer.render(vnode,container)
    expect(container.innerHTML).toBe("<div>hello</div>")
    renderer.render(null,container)
    expect(container.innerHTML).toBe("")
    
    
  });
  
  it('node type change', () => {
    //如果节点类型发生变化
    const renderer = createRenderer(nodeOps);
    const container = document.createElement("div");
    const oldVnode = {
      tag:'div',
      children: "hello",
    };
    const newVnode = {
      tag:'p',
      children: "hello",
    };
    
    renderer.render(oldVnode,container)
    expect(container.innerHTML).toBe("<div>hello</div>")
    //renderer.render(null,container)
    renderer.render(newVnode,container)
    expect(container.innerHTML).toBe("<p>hello</p>")
  });

  it('update text', () => {
    //如果节点类型发生变化
    const renderer = createRenderer(nodeOps);
    const container = document.createElement("div");
    const oldVnode = {
      tag:Text,
      children: "hello",
    };
    const newVnode = {
      tag:Text,
      children: "olleh",
    };
    
    renderer.render(oldVnode,container)
    expect(container.innerHTML).toBe("hello")
    //renderer.render(null,container)
    renderer.render(newVnode,container)
    expect(container.innerHTML).toBe("olleh")
  });
  
  it('update props', () => {
    const renderer = createRenderer(nodeOps);
    const container = document.createElement("div");
    const oldVnode = {
      tag:'div',
      props: {id:'box', class:'box', title:'box'}
    };
    const newVnode = {
      tag:'div',
      props: {id:'box', class:'box active'}
    };
    
    renderer.render(oldVnode,container)
    expect(container.innerHTML).toBe(
      '<div id="box" class="box" title="box"></div>')
    //renderer.render(null,container)
    renderer.render(newVnode,container)
    expect(container.innerHTML).toBe(
      '<div id="box" class="box active"></div>')
  });
  
  //子元素更新，文本节点和dom节点
  it('update element text', () => {
    //如果节点类型发生变化
    const renderer = createRenderer(nodeOps);
    const container = document.createElement("div");
    const oldVnode = {
      tag:"div",
      children: "hello",
    };
    const newVnode = {
      tag:"div",
      children: "olleh",
    };
    
    renderer.render(oldVnode,container)
    expect(container.innerHTML).toBe("<div>hello</div>")
    //renderer.render(null,container)
    renderer.render(newVnode,container)
    expect(container.innerHTML).toBe("<div>olleh</div>")
  });

  it('update element array children to text', () => {
    //如果节点类型发生变化
    const renderer = createRenderer(nodeOps);
    const container = document.createElement("div");
    const oldVnode = {
      tag:"div",
      children: [
        {
          tag:"span",
          children:"child"
        }
      ]
    };
    const newVnode = {
      tag:"div",
      children: "child",
    };
    
    renderer.render(oldVnode,container)
    expect(container.innerHTML).toBe("<div><span>child</span></div>")
    //renderer.render(null,container)
    renderer.render(newVnode,container)
    expect(container.innerHTML).toBe("<div>child</div>")
  });

  it('update element text children to array', () => {
    //如果节点类型发生变化
    const renderer = createRenderer(nodeOps);
    const container = document.createElement("div");
    const oldVnode = {
      tag:"div",
      children: "child",
    };
    const newVnode = {
      tag:"div",
      children: [
        {
          tag:"span",
          children:"child"
        }
      ]
    };

    
    renderer.render(oldVnode,container)
    expect(container.innerHTML).toBe("<div>child</div>")
    //renderer.render(null,container)
    renderer.render(newVnode,container)
    expect(container.innerHTML).toBe("<div><span>child</span></div>")
  });

  it('diff node move', () => {
    //如果节点类型发生变化
    //diff算法
    const renderer = createRenderer(nodeOps);
    const container = document.createElement("div");
    const oldVnode = {
      tag:"div",
      children: [
        {
          tag:"p",
          children:'p1'
        },
        {
          tag:"p",
          children:'p2'
        },
        {
          tag:"p",
          children:'p3'
        }
      ]
    };
    const newVnode = {
      tag:"div",
      children: [
        {
          tag:"p",
          children:'p3'
        },
        {
          tag:"p",
          children:'p1'
        },
        {
          tag:"p",
          children:'p2'
        }
      ]
    };

    
    renderer.render(oldVnode,container)
    expect(container.innerHTML).toBe("<div><p>p1</p><p>p2</p><p>p3</p></div>")
    //renderer.render(null,container)
    renderer.render(newVnode,container)
    expect(container.innerHTML).toBe("<div><p>p3</p><p>p1</p><p>p2</p></div>")
  });

});


