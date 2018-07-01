!function(e){var t={};function n(r){if(t[r])return t[r].exports;var o=t[r]={i:r,l:!1,exports:{}};return e[r].call(o.exports,o,o.exports,n),o.l=!0,o.exports}n.m=e,n.c=t,n.d=function(e,t,r){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:r})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var r=Object.create(null);if(n.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var o in e)n.d(r,o,function(t){return e[t]}.bind(null,o));return r},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="",n(n.s=1)}([function(e,t,n){"use strict";!function(){function t(e){return new Promise(function(t,n){e.onsuccess=function(){t(e.result)},e.onerror=function(){n(e.error)}})}function n(e,n,r){var o,c=new Promise(function(c,i){t(o=e[n].apply(e,r)).then(c,i)});return c.request=o,c}function r(e,t,n){n.forEach(function(n){Object.defineProperty(e.prototype,n,{get:function(){return this[t][n]},set:function(e){this[t][n]=e}})})}function o(e,t,r,o){o.forEach(function(o){o in r.prototype&&(e.prototype[o]=function(){return n(this[t],o,arguments)})})}function c(e,t,n,r){r.forEach(function(r){r in n.prototype&&(e.prototype[r]=function(){return this[t][r].apply(this[t],arguments)})})}function i(e,t,r,o){o.forEach(function(o){o in r.prototype&&(e.prototype[o]=function(){return function(e,t,r){var o=n(e,t,r);return o.then(function(e){if(e)return new a(e,o.request)})}(this[t],o,arguments)})})}function u(e){this._index=e}function a(e,t){this._cursor=e,this._request=t}function s(e){this._store=e}function l(e){this._tx=e,this.complete=new Promise(function(t,n){e.oncomplete=function(){t()},e.onerror=function(){n(e.error)},e.onabort=function(){n(e.error)}})}function p(e,t,n){this._db=e,this.oldVersion=t,this.transaction=new l(n)}function f(e){this._db=e}r(u,"_index",["name","keyPath","multiEntry","unique"]),o(u,"_index",IDBIndex,["get","getKey","getAll","getAllKeys","count"]),i(u,"_index",IDBIndex,["openCursor","openKeyCursor"]),r(a,"_cursor",["direction","key","primaryKey","value"]),o(a,"_cursor",IDBCursor,["update","delete"]),["advance","continue","continuePrimaryKey"].forEach(function(e){e in IDBCursor.prototype&&(a.prototype[e]=function(){var n=this,r=arguments;return Promise.resolve().then(function(){return n._cursor[e].apply(n._cursor,r),t(n._request).then(function(e){if(e)return new a(e,n._request)})})})}),s.prototype.createIndex=function(){return new u(this._store.createIndex.apply(this._store,arguments))},s.prototype.index=function(){return new u(this._store.index.apply(this._store,arguments))},r(s,"_store",["name","keyPath","indexNames","autoIncrement"]),o(s,"_store",IDBObjectStore,["put","add","delete","clear","get","getAll","getKey","getAllKeys","count"]),i(s,"_store",IDBObjectStore,["openCursor","openKeyCursor"]),c(s,"_store",IDBObjectStore,["deleteIndex"]),l.prototype.objectStore=function(){return new s(this._tx.objectStore.apply(this._tx,arguments))},r(l,"_tx",["objectStoreNames","mode"]),c(l,"_tx",IDBTransaction,["abort"]),p.prototype.createObjectStore=function(){return new s(this._db.createObjectStore.apply(this._db,arguments))},r(p,"_db",["name","version","objectStoreNames"]),c(p,"_db",IDBDatabase,["deleteObjectStore","close"]),f.prototype.transaction=function(){return new l(this._db.transaction.apply(this._db,arguments))},r(f,"_db",["name","version","objectStoreNames"]),c(f,"_db",IDBDatabase,["close"]),["openCursor","openKeyCursor"].forEach(function(e){[s,u].forEach(function(t){t.prototype[e.replace("open","iterate")]=function(){var t=function(e){return Array.prototype.slice.call(e)}(arguments),n=t[t.length-1],r=this._store||this._index,o=r[e].apply(r,t.slice(0,-1));o.onsuccess=function(){n(o.result)}}})}),[u,s].forEach(function(e){e.prototype.getAll||(e.prototype.getAll=function(e,t){var n=this,r=[];return new Promise(function(o){n.iterateCursor(e,function(e){e?(r.push(e.value),void 0===t||r.length!=t?e.continue():o(r)):o(r)})})})});var d={open:function(e,t,r){var o=n(indexedDB,"open",[e,t]),c=o.request;return c.onupgradeneeded=function(e){r&&r(new p(c.result,e.oldVersion,c.transaction))},o.then(function(e){return new f(e)})},delete:function(e){return n(indexedDB,"deleteDatabase",[e])}};e.exports=d}()},function(e,t,n){"use strict";n.r(t);var r=n(0);let o=n.n(r).a.open("CurrencyDb",1,e=>{if(!e.objectStoreNames.contains("Currencies")){e.createObjectStore("Currencies",{keyPath:"Id_currency",autoIncrement:!0})}if(!e.objectStoreNames.contains("conversionRates")){e.createObjectStore("conversionRates",{keyPath:"rateId"})}});const c=document.querySelector("#fromCurr"),i=document.querySelector("#toCurr"),u=document.querySelector("#queryCurrency"),a=document.querySelector("#resCurrency"),s=document.querySelector("#convert"),l=document.querySelector("#error");let p=c.value,f=i.value;window.addEventListener("load",e=>{queryCurrency.focus(),"serviceWorker"in navigator&&navigator.serviceWorker.register("sw.js").then(()=>console.log("serviceWorker Registered")).catch(()=>console.log("serviceWorker Registration Failed")),async function(){await fetch("https://free.currencyconverterapi.com/api/v5/currencies").then(async e=>{const t=await e.json();let n=Array.from(function*(e){for(let t of Object.keys(e))yield e[t]}(t.results));c.innerHTML=n.map(e=>`<option value="${e.id}">${e.currencyName} (${e.currencySymbol})</option>`),i.innerHTML=n.map(e=>`<option value="${e.id}">${e.currencyName} (${e.currencySymbol})</option>`),o.then(e=>{let t=e.transaction("Currencies","readwrite"),r=t.objectStore("Currencies");return r.put(n),t.complete}).then(()=>{console.log("Currencies added")})}).catch(()=>{o.then(e=>{let t=e.transaction("Currencies","readonly"),n=t.objectStore("Currencies");return n.getAll()}).then(e=>{const t=e[0];c.innerHTML=t.map(e=>`<option value="${e.id}">${e.currencyName} (${e.currencySymbol})</option>`),i.innerHTML=t.map(e=>`<option value="${e.id}">${e.currencyName} (${e.currencySymbol})</option>`)})})}(),c.addEventListener("change",e=>{p=e.target.value}),i.addEventListener("change",e=>{f=e.target.value}),s.addEventListener("click",()=>{l.innerHTML="",u.value?(!async function(e,t){await fetch(`https://free.currencyconverterapi.com/api/v5/convert?q=${e}_${t}&compact=ultra`).then(async n=>{const r=await n.json(),c=r[`${e}_${t}`];a.value=(u.value*parseFloat(c)).toFixed(2),o.then(n=>{let r=n.transaction("conversionRates","readwrite"),o=r.objectStore("conversionRates");return o.put({rateId:e+"_"+t,rate:c}),o.put({rateId:t+"_"+e,rate:1/parseFloat(c)}),r.complete}).then(()=>{console.log("Rates Added")})}).catch(()=>{o.then(n=>{let r=n.transaction("conversionRates","readonly"),o=r.objectStore("conversionRates");return o.get(`${e}_${t}`)}).then(e=>{a.value=(u.value*parseFloat(e.rate)).toFixed(2)})})}(p,f),queryCurrency.focus()):l.innerHTML="**ERROR: Empty input field**"})})}]);