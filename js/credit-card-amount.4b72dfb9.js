(function(t){function e(e){for(var a,i,u=e[0],s=e[1],l=e[2],d=0,m=[];d<u.length;d++)i=u[d],Object.prototype.hasOwnProperty.call(o,i)&&o[i]&&m.push(o[i][0]),o[i]=0;for(a in s)Object.prototype.hasOwnProperty.call(s,a)&&(t[a]=s[a]);c&&c(e);while(m.length)m.shift()();return r.push.apply(r,l||[]),n()}function n(){for(var t,e=0;e<r.length;e++){for(var n=r[e],a=!0,u=1;u<n.length;u++){var s=n[u];0!==o[s]&&(a=!1)}a&&(r.splice(e--,1),t=i(i.s=n[0]))}return t}var a={},o={"credit-card-amount":0},r=[];function i(e){if(a[e])return a[e].exports;var n=a[e]={i:e,l:!1,exports:{}};return t[e].call(n.exports,n,n.exports,i),n.l=!0,n.exports}i.m=t,i.c=a,i.d=function(t,e,n){i.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:n})},i.r=function(t){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},i.t=function(t,e){if(1&e&&(t=i(t)),8&e)return t;if(4&e&&"object"===typeof t&&t&&t.__esModule)return t;var n=Object.create(null);if(i.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var a in t)i.d(n,a,function(e){return t[e]}.bind(null,a));return n},i.n=function(t){var e=t&&t.__esModule?function(){return t["default"]}:function(){return t};return i.d(e,"a",e),e},i.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},i.p="";var u=window["webpackJsonp"]=window["webpackJsonp"]||[],s=u.push.bind(u);u.push=e,u=u.slice();for(var l=0;l<u.length;l++)e(u[l]);var c=s;r.push([1,"chunk-vendors"]),n()})({"0476":function(t,e,n){"use strict";var a=n("1684"),o=n.n(a);o.a},"0b4b":function(t,e,n){"use strict";var a=n("f5f5"),o=n.n(a);o.a},1:function(t,e,n){t.exports=n("2462")},1449:function(t,e,n){n("0d03"),n("4d63"),n("ac1f"),n("25f0"),n("5319");var a=n("7037");Array.prototype.insertionSearch=function(t){var e,n,o,r=this,i=0,u=this.length-1,s=function(t){return o?r[t][o]:r[t]};if("object"===a(t))for(var l in t){o=l,t=t[l];break}while(i<=u)if(e=Math.floor(i+(t-s(i))/(s(u)-s(i))*(u-i)),n=s(e),n<t)i=e+1;else{if(!(n>t))return e;u=e-1}return-1},Date.prototype.format=function(t){var e={"M+":this.getMonth()+1,"D+":this.getDate(),"H+":this.getHours(),"h+":this.getHours()%12===0?12:this.getHours()%12,"m+":this.getMinutes(),"s+":this.getSeconds(),"q+":Math.floor((this.getMonth()+3)/3),S:this.getMilliseconds()},n={0:"Sun",1:"Mon",2:"Tue",3:"Wed",4:"Thu",5:"Fri",6:"Sat"};for(var a in e)new RegExp("("+a+")").test(t)&&(t=t.replace(RegExp.$1,1===RegExp.$1.length?e[a]:("00"+e[a]).substr((""+e[a]).length)));return/(Y+)/.test(t)&&(t=t.replace(RegExp.$1,(this.getFullYear()+"").substr(4-RegExp.$1.length))),/(E+)/.test(t)&&(t=t.replace(RegExp.$1,n[this.getDay()+""])),t},console.area=function(){console.log("\n"),console.log("-- start --"),console.info.apply(void 0,arguments),console.log("--  end  --"),console.log("\n")}},1684:function(t,e,n){},2272:function(t,e,n){"use strict";n("5a8b"),n("acc7")},2462:function(t,e,n){"use strict";n.r(e);n("e260"),n("e6cf"),n("cca6"),n("a79d");var a=n("2b0e"),o=(n("1449"),n("2272"),function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"container"},[n("Title",[t._v("Credit Card Amount")]),n("div",{staticClass:"wrapper"},[n("CreditCardAmountOptions",{on:{update:t.update}}),n("CreditCardAmountSetting",{attrs:{list:t.data.amountList},on:{update:t.update}})],1),n("CreditCardAmountPreview",{attrs:{data:t.data}})],1)}),r=[],i=n("43b3"),u=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("ul",{staticClass:"options"},[t._m(0),n("li",[n("label",[t._v("Max Amount")]),t._v("： "),n("input",{directives:[{name:"model",rawName:"v-model.number",value:t.maxAmount,expression:"maxAmount",modifiers:{number:!0}}],attrs:{type:"text"},domProps:{value:t.maxAmount},on:{input:function(e){e.target.composing||(t.maxAmount=t._n(e.target.value))},blur:function(e){return t.$forceUpdate()}}})]),n("li",[n("label",[t._v("Workday")]),t._v("： "),n("label",[t._v("Day Count")]),t._v("： "),n("input",{directives:[{name:"model",rawName:"v-model.number",value:t.workdayCount,expression:"workdayCount",modifiers:{number:!0}}],staticClass:"small-input",attrs:{type:"text"},domProps:{value:t.workdayCount},on:{input:function(e){e.target.composing||(t.workdayCount=t._n(e.target.value))},blur:function(e){return t.$forceUpdate()}}})]),n("li",[n("label"),t._v("： "),n("label",[t._v("Min Amount")]),t._v("： "),n("input",{directives:[{name:"model",rawName:"v-model.number",value:t.workdayMinMoney,expression:"workdayMinMoney",modifiers:{number:!0}}],staticClass:"small-input",attrs:{type:"text"},domProps:{value:t.workdayMinMoney},on:{input:function(e){e.target.composing||(t.workdayMinMoney=t._n(e.target.value))},blur:function(e){return t.$forceUpdate()}}})]),n("li",[n("label"),t._v("： "),n("label",[t._v("Max Amount")]),t._v("： "),n("input",{directives:[{name:"model",rawName:"v-model.number",value:t.workdayMaxMoney,expression:"workdayMaxMoney",modifiers:{number:!0}}],staticClass:"small-input",attrs:{type:"text"},domProps:{value:t.workdayMaxMoney},on:{input:function(e){e.target.composing||(t.workdayMaxMoney=t._n(e.target.value))},blur:function(e){return t.$forceUpdate()}}})]),n("li",[n("label",[t._v("Weekend")]),t._v("： "),n("label",[t._v("Day Count")]),t._v("： "),n("input",{directives:[{name:"model",rawName:"v-model.number",value:t.weekendCount,expression:"weekendCount",modifiers:{number:!0}}],staticClass:"small-input",attrs:{type:"text"},domProps:{value:t.weekendCount},on:{input:function(e){e.target.composing||(t.weekendCount=t._n(e.target.value))},blur:function(e){return t.$forceUpdate()}}})]),n("li",[n("label"),t._v("： "),n("label",[t._v("Min Amount")]),t._v("： "),n("input",{directives:[{name:"model",rawName:"v-model.number",value:t.weekendMinMoney,expression:"weekendMinMoney",modifiers:{number:!0}}],staticClass:"small-input",attrs:{type:"text"},domProps:{value:t.weekendMinMoney},on:{input:function(e){e.target.composing||(t.weekendMinMoney=t._n(e.target.value))},blur:function(e){return t.$forceUpdate()}}})]),n("li",[n("label"),t._v("： "),n("label",[t._v("Max Amount")]),t._v("： "),n("input",{directives:[{name:"model",rawName:"v-model.number",value:t.weekendMaxMoney,expression:"weekendMaxMoney",modifiers:{number:!0}}],staticClass:"small-input",attrs:{type:"text"},domProps:{value:t.weekendMaxMoney},on:{input:function(e){e.target.composing||(t.weekendMaxMoney=t._n(e.target.value))},blur:function(e){return t.$forceUpdate()}}})]),n("li",[n("label",[t._v("Begin Date")]),t._v("： "),n("input",{directives:[{name:"model",rawName:"v-model",value:t.startDate,expression:"startDate"}],attrs:{type:"text",placeholder:"yyyy/mm/dd"},domProps:{value:t.startDate},on:{input:function(e){e.target.composing||(t.startDate=e.target.value)}}})]),n("li",[n("label",[t._v("Float")]),t._v("： "),n("input",{directives:[{name:"model",rawName:"v-model",value:t.isFloat,expression:"isFloat"}],attrs:{type:"checkbox"},domProps:{checked:Array.isArray(t.isFloat)?t._i(t.isFloat,null)>-1:t.isFloat},on:{change:function(e){var n=t.isFloat,a=e.target,o=!!a.checked;if(Array.isArray(n)){var r=null,i=t._i(n,r);a.checked?i<0&&(t.isFloat=n.concat([r])):i>-1&&(t.isFloat=n.slice(0,i).concat(n.slice(i+1)))}else t.isFloat=o}}})]),n("li",[n("button",{staticClass:"button",on:{click:t.handleCreateData}},[t._v("Create Data")])])])},s=[function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("li",[n("h2",{staticClass:"subtitle"},[t._v("Options")])])}],l=(n("4de4"),n("a15b"),n("d81d"),n("13d5"),n("0d03"),n("ac1f"),n("1276"),{name:"AmountOptions",data:function(){return{maxAmount:1e4,workdayCount:1,workdayMinMoney:300,workdayMaxMoney:500,weekendCount:2,weekendMinMoney:700,weekendMaxMoney:1e3,startDate:(new Date).format("YYYY/MM/DD"),isFloat:!1}},mounted:function(){this.handleCreateData()},methods:{handleCreateData:function(){var t=this.init();t&&this.$emit("update",t)},init:function(){var t=this.maxAmount,e=this.workdayCount,n=this.workdayMinMoney,a=this.workdayMaxMoney,o=this.weekendCount,r=this.weekendMinMoney,i=this.weekendMaxMoney,u=this.startDate,s=[],l=u||(new Date).format("YYYY/MM/DD"),c=0,d=0;if(!(t<=0)){while(c<t){var m=l.split("/"),p=new Date(m),f={date:p.format("YYYY-MM-DD"),week:p.format("EEE"),millisecond:p.getTime(),moneys:[]},v=[],b=0;if(v=0===p.getDay()||6===p.getDay()?o<=0?[]:this.getRandomMoneys(o,r,i):e<=0?[]:this.getRandomMoneys(e,n,a),b=c+(0===v.length?0:v.reduce((function(t,e){return t+e}))),b>t)break;c=b,d+=v.length,f.moneys=v.join("、"),s.push(f),l=new Date(p.getTime()+864e5).format("YYYY/MM/DD")}return{amountList:s.filter((function(t){return t.moneys.length>0})),totalAmount:Math.round(100*c)/100,totalCount:d}}},getRandomMoneys:function(t,e,n){var a=this,o=function(){var t=Math.random()*(n-e)+e;return a.isFloat?Math.round(100*t)/100:Math.round(t)};return Array.apply(null,{length:t}).map((function(){return o()}))}}}),c=l,d=(n("8c4b"),n("2877")),m=Object(d["a"])(c,u,s,!1,null,null,null),p=m.exports,f=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("ul",{staticClass:"setting"},[t._m(0),t._l(t.data,(function(e){return n("li",{key:e.date},[n("label",[t._v(t._s(e.date)+" "+t._s(e.week))]),t._v("： "),n("input",{directives:[{name:"model",rawName:"v-model",value:e.moneys,expression:"item.moneys"}],attrs:{type:"text"},domProps:{value:e.moneys},on:{input:function(n){n.target.composing||t.$set(e,"moneys",n.target.value)}}})])})),n("li",[n("button",{staticClass:"button",on:{click:t.comfirm}},[t._v("Comfirm")])])],2)},v=[function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("li",[n("h2",{staticClass:"subtitle"},[t._v("Setting")])])}];n("4160"),n("a9e3"),n("159b"),n("d3b7"),n("25f0"),n("5319");function b(t){var e=Object.prototype.toString,n={"[object Boolean]":"boolean","[object Number]":"number","[object String]":"string","[object Function]":"function","[object Array]":"array","[object Date]":"date","[object RegExp]":"regExp","[object Undefined]":"undefined","[object Null]":"null","[object Object]":"object"};return n[e.call(t)]}function h(t){var e,n=b(t);if("array"===n)e=[];else{if("object"!==n)return t;e={}}if("array"===n)for(var a=0;a<t.length;a++)e.push(h(t[a]));else if("object"===n)for(var o in t)t.hasOwnProperty(o)&&(e[o]=h(t[o]));return e}function y(t,e){var n=document.createElement("a");n.download=t,n.href=e,document.body.appendChild(n),n.click(),n.remove()}var g={name:"AmountSetting",props:{list:Array},data:function(){return{data:[]}},watch:{list:function(t){this.data=h(t)}},methods:{comfirm:function(){this.$emit("update",this.computeTotal())},computeTotal:function(){var t=0,e=0;return this.data.forEach((function(n){var a=n.moneys.split("、");t+=Number(a.reduce((function(t,e){return Number(t)+Number(e)}))),e+=a.length})),{amountList:this.data.filter((function(t){return t.moneys.length>0})),totalAmount:Math.round(100*t)/100,totalCount:e}}}},_=g,M=(n("442b"),Object(d["a"])(_,f,v,!1,null,null,null)),w=M.exports,C=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticStyle:{width:"100%"}},[t._m(0),n("table",{ref:"table",staticClass:"table"},[t._m(1),n("tbody",t._l(t.data.amountList,(function(e){return n("tr",{key:e.date},[n("td",[t._v(t._s(e.date)+" "+t._s(e.week))]),n("td",[t._v(t._s(e.moneys))])])})),0),n("tfoot",[n("tr",[n("td",{attrs:{align:"right"}},[t._v("Total Amount")]),n("td",[t._v(t._s(t.data.totalAmount))])]),n("tr",[n("td",{attrs:{align:"right"}},[t._v("Total Count")]),n("td",[t._v(t._s(t.data.totalCount))])]),n("tr",[n("td",{attrs:{align:"right"}},[t._v("Crated Date")]),n("td",[t._v(t._s((new Date).format("YYYY.MM.DD")))])])])]),t.pictureVisible?n("div",{staticClass:"picture-frame",on:{click:function(e){t.pictureVisible=!1}}},[n("p",{staticClass:"pictrue-tooltip"},[t._v("Long press to save the picture")]),n("img",{staticClass:"picture-img",attrs:{src:t.pictrue,alt:""}})]):t._e(),n("div",{staticClass:"wrapper"},[n("button",{staticClass:"button",on:{click:t.handleExportPicture}},[t._v("Export Picture")])])])},x=[function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"wrapper"},[n("h2",{staticClass:"subtitle"},[t._v("Preview")])])},function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("thead",[n("tr",[n("th",{attrs:{colspan:"2"}},[t._v("Credit Card Amount")])]),n("tr",[n("th",{staticStyle:{"min-width":"90px"},attrs:{align:"center"}},[t._v("Date")]),n("th",[t._v("Amount")])])])}],k=(n("466d"),n("c0e9")),D=n.n(k),A={name:"AmountPreview",props:{data:Object},data:function(){return{pictrue:"",pictureVisible:!1}},methods:{handleExportPicture:function(){var t=this,e=this.$refs.table,n={logging:!1,scale:2,scrollX:0,scrollY:0};e.className="table screenshot",D()(e,n).then((function(n){e.className="table";var a=n.toDataURL("image/png");navigator.userAgent.match(/(iPhone|iPod|Android|ios|SymbianOS)/i)?(t.pictrue=a,t.pictureVisible=!0):y((new Date).format("YYYY-MM-DD.png"),a)}))}}},j=A,P=(n("f678"),Object(d["a"])(j,C,x,!1,null,null,null)),Y=P.exports,E={name:"CreditCardAmount",components:{Title:i["a"],CreditCardAmountOptions:p,CreditCardAmountSetting:w,CreditCardAmountPreview:Y},data:function(){return{data:{amountList:[],totalAmount:0,totalCount:0}}},methods:{update:function(t){this.data=t}}},O=E,$=(n("0476"),Object(d["a"])(O,o,r,!1,null,null,null)),S=$.exports;a["a"].config.productionTip=!1,new a["a"]({render:function(t){return t(S)}}).$mount("#app")},"43b3":function(t,e,n){"use strict";var a=function(t,e){var n=e._c;return n("h1",{staticClass:"title"},[e._t("default")],2)},o=[],r={name:"Title"},i=r,u=(n("0b4b"),n("2877")),s=Object(u["a"])(i,a,o,!0,null,null,null);e["a"]=s.exports},"442b":function(t,e,n){"use strict";var a=n("91ac"),o=n.n(a);o.a},"5a8b":function(t,e,n){},"8c4b":function(t,e,n){"use strict";var a=n("ead5"),o=n.n(a);o.a},"91ac":function(t,e,n){},acc7:function(t,e,n){},dab3:function(t,e,n){},ead5:function(t,e,n){},f5f5:function(t,e,n){},f678:function(t,e,n){"use strict";var a=n("dab3"),o=n.n(a);o.a}});