webpackJsonp([12],{afhI:function(n,e,t){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var i=t("vLgD"),s={name:"office",data:()=>({visible:!1,config:{},jsUrl:""}),methods:{getData(n){Object(i.a)({url:"/office/preview",method:"get",params:{id:n}}).then(n=>{console.log(n),this.config=n.model,this.jsUrl=n.documentServerUrl,this.config.height="1000px"}).catch(n=>{console.log(n)})},init(n,e){const t=document.createElement("script");t.type="text/javascript",t.src=this.jsUrl,document.body.appendChild(t),t.onload=(()=>{new DocsAPI.DocEditor("placeholder",e)})}},created(){this.$root.$on("open-office",n=>{this.visible=n.visible});let n=this.$store.getters.resources.tableSelections;n=n.map(n=>n.id),this.getData(n[0]),this.init(this.jsUrl,this.config)}},o={render:function(){var n=this.$createElement;return(this._self._c||n)("div",{directives:[{name:"show",rawName:"v-show",value:this.visible,expression:"visible"}],staticStyle:{height:"1600px"},attrs:{id:"placeholder"}})},staticRenderFns:[]};var r=t("VU/8")(s,o,!1,function(n){t("hHpR")},"data-v-5dd7b210",null);e.default=r.exports},e6u8:function(n,e,t){(n.exports=t("FZ+f")(!1)).push([n.i,"\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n",""])},hHpR:function(n,e,t){var i=t("e6u8");"string"==typeof i&&(i=[[n.i,i,""]]),i.locals&&(n.exports=i.locals);t("rjj0")("8bb9a122",i,!0)}});