export const nodeOps = {
    createElement(tag) {
      return document.createElement(tag);
    },
    createText(text) {
      return document.createTextNode(text);
    },
    setElementText(el, text) {
      el.textContent = text;
    },
    setText(el, text) {
      el.nodeValue = text;
    },
    insert(child, parent, anchor) {
      parent.insertBefore(child, anchor || null);
    },
    patchProp(el, key, prevValue, nextValue) {
      if (/^on/.test(key)) {
        const event = key.slice(2).toLowerCase();
         // 事件
        if(nextValue){
          el.removeEventListener(event,prevValue)
        }

        el.addEventListener(event, nextValue);
       
      } else {
        if(nextValue){
          el.setAttribute(key, nextValue);
        }else{
          el.removeAttribute(key)
          
        }
       
      }
    },
  };
  