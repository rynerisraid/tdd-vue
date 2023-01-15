/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/effect/effect.js":
/*!******************************!*\
  !*** ./src/effect/effect.js ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"activeEffect\": () => (/* binding */ activeEffect),\n/* harmony export */   \"effect\": () => (/* binding */ effect),\n/* harmony export */   \"track\": () => (/* binding */ track),\n/* harmony export */   \"trigger\": () => (/* binding */ trigger)\n/* harmony export */ });\n//effect.js\r\nlet activeEffect\r\nconst effectStack = []\r\n\r\nfunction effect(fn, options = {}) {\r\n  // 封装一个effectFn用于扩展功能\r\n  const effectFn = () => {\r\n    try{\r\n      effectStack.push(effectFn);\r\n      activeEffect = effectFn\r\n      fn()\r\n    }finally{\r\n      effectStack.pop();\r\n      activeEffect = effectStack[effectStack.length - 1];\r\n\r\n    }\r\n    // activeEffect = effectFn\r\n    // fn()\r\n  }\r\n  effectFn.options = options // 增加选项以备trigger时使用\r\n  effectFn()\r\n}\r\n\r\nconst targetMap = new WeakMap()\r\n\r\nfunction track(target, key) {\r\n  if (activeEffect) {\r\n    let depsMap = targetMap.get(target)\r\n\r\n    if (!depsMap) {\r\n      targetMap.set(target, (depsMap = new Map()))\r\n    }\r\n\r\n    let deps = depsMap.get(key)\r\n    if (!deps) {\r\n      depsMap.set(key, (deps = new Set()))\r\n    }\r\n\r\n    deps.add(activeEffect)\r\n  }\r\n}\r\n\r\nfunction trigger(target, key) {\r\n  const depsMap = targetMap.get(target)\r\n\r\n  if (depsMap) {\r\n    const deps = depsMap.get(key)\r\n\r\n    // 增加scheduler判断\r\n    if(deps){\r\n      deps.forEach(dep => {\r\n        if (dep.options.scheduler) {\r\n          dep.options.scheduler(dep)\r\n        } else {\r\n          dep()\r\n        }\r\n      })\r\n    }\r\n    \r\n  }\r\n}\n\n//# sourceURL=webpack://mini-vue/./src/effect/effect.js?");

/***/ }),

/***/ "./src/reactive/reactive.js":
/*!**********************************!*\
  !*** ./src/reactive/reactive.js ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"reactive\": () => (/* binding */ reactive)\n/* harmony export */ });\n/* harmony import */ var _effect_effect__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../effect/effect */ \"./src/effect/effect.js\");\n\r\n\r\n// reactive返回传入obj的代理对象，值更新时使app更新\r\nfunction reactive(obj) {\r\n  return new Proxy(obj, {\r\n    get(target, key) {\r\n      const result = Reflect.get(target, key);\r\n      (0,_effect_effect__WEBPACK_IMPORTED_MODULE_0__.track)(target, key)\r\n      return result\r\n    },\r\n    set(target, key, value) {\r\n      const result = Reflect.set(target, key, value);\r\n      (0,_effect_effect__WEBPACK_IMPORTED_MODULE_0__.trigger)(target, key)\r\n      return result\r\n    },\r\n    deleteProperty(target, key) {\r\n      const result = Reflect.deleteProperty(target, key);\r\n      (0,_effect_effect__WEBPACK_IMPORTED_MODULE_0__.trigger)(target, key)\r\n      return result\r\n    },\r\n  });\r\n}\n\n//# sourceURL=webpack://mini-vue/./src/reactive/reactive.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./src/reactive/reactive.js");
/******/ 	
/******/ })()
;