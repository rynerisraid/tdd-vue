export function createVnode(tag, props, children) {
    return {tag, props, children}
}

export function createTextVnode(text) {
    return createVnode(Text, null, text)
}