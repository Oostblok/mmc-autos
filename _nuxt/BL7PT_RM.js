import{a as s,K as o,f as i,k as c,i as d,an as p,U as l,l as m}from"./aZpSMTAY.js";const f=["src"],_=s({__name:"IframeContainer",props:{src:{type:String,required:!0},aspectRatio:{type:String,default:"1:2",validator:e=>!!e&&/\d+:\d+$/.test(e.toString())}},setup(e){const r=o(()=>{const[a,t]=e.aspectRatio.split(":").map(n=>parseInt(n,10));return a&&t?`${t/a*100}%`:"100%"});return(a,t)=>(c(),i("div",{class:"iframe-container",style:p({"padding-top":l(r)})},[d("iframe",{src:e.src,frameborder:"0",scrolling:"no",tabindex:"0"},null,8,f)],4))}}),g=Object.assign(m(_,[["__scopeId","data-v-a0a31ca2"]]),{__name:"IframeContainer"});export{g as default};
