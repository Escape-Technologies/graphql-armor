"use strict";(self.webpackChunkdocs=self.webpackChunkdocs||[]).push([[927],{5428:(e,r,t)=>{t.r(r),t.d(r,{assets:()=>p,contentTitle:()=>c,default:()=>u,frontMatter:()=>o,metadata:()=>l,toc:()=>i});var a=t(8427),n=(t(2784),t(876));const o={},c="Types",l={unversionedId:"api/types",id:"api/types",title:"Types",description:"Callbacks",source:"@site/docs/api/types.md",sourceDirName:"api",slug:"/api/types",permalink:"/graphql-armor/docs/api/types",draft:!1,editUrl:"https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/docs/api/types.md",tags:[],version:"current",frontMatter:{},sidebar:"tutorialSidebar",previous:{title:"API",permalink:"/graphql-armor/docs/category/api"},next:{title:"Configuration",permalink:"/graphql-armor/docs/category/configuration"}},p={},i=[{value:"Callbacks",id:"callbacks",level:2},{value:"GraphQLArmorAcceptCallback",id:"graphqlarmoracceptcallback",level:3},{value:"GraphQLArmorRejectCallback",id:"graphqlarmorrejectcallback",level:3}],s={toc:i};function u(e){let{components:r,...t}=e;return(0,n.kt)("wrapper",(0,a.Z)({},s,t,{components:r,mdxType:"MDXLayout"}),(0,n.kt)("h1",{id:"types"},"Types"),(0,n.kt)("h2",{id:"callbacks"},"Callbacks"),(0,n.kt)("h3",{id:"graphqlarmoracceptcallback"},"GraphQLArmorAcceptCallback"),(0,n.kt)("pre",null,(0,n.kt)("code",{parentName:"pre",className:"language-ts"},"import type { ValidationContext } from 'graphql';\n\nexport type GraphQLArmorAcceptCallback = (ctx: ValidationContext | null, details: any) => void;\n")),(0,n.kt)("h3",{id:"graphqlarmorrejectcallback"},"GraphQLArmorRejectCallback"),(0,n.kt)("pre",null,(0,n.kt)("code",{parentName:"pre",className:"language-ts"},"import type { GraphQLError, ValidationContext } from 'graphql';\n\nexport type GraphQLArmorRejectCallback = (ctx: ValidationContext | null, error: GraphQLError) => void;\n")))}u.isMDXComponent=!0},876:(e,r,t)=>{t.d(r,{Zo:()=>s,kt:()=>d});var a=t(2784);function n(e,r,t){return r in e?Object.defineProperty(e,r,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[r]=t,e}function o(e,r){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);r&&(a=a.filter((function(r){return Object.getOwnPropertyDescriptor(e,r).enumerable}))),t.push.apply(t,a)}return t}function c(e){for(var r=1;r<arguments.length;r++){var t=null!=arguments[r]?arguments[r]:{};r%2?o(Object(t),!0).forEach((function(r){n(e,r,t[r])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):o(Object(t)).forEach((function(r){Object.defineProperty(e,r,Object.getOwnPropertyDescriptor(t,r))}))}return e}function l(e,r){if(null==e)return{};var t,a,n=function(e,r){if(null==e)return{};var t,a,n={},o=Object.keys(e);for(a=0;a<o.length;a++)t=o[a],r.indexOf(t)>=0||(n[t]=e[t]);return n}(e,r);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(a=0;a<o.length;a++)t=o[a],r.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(e,t)&&(n[t]=e[t])}return n}var p=a.createContext({}),i=function(e){var r=a.useContext(p),t=r;return e&&(t="function"==typeof e?e(r):c(c({},r),e)),t},s=function(e){var r=i(e.components);return a.createElement(p.Provider,{value:r},e.children)},u={inlineCode:"code",wrapper:function(e){var r=e.children;return a.createElement(a.Fragment,{},r)}},m=a.forwardRef((function(e,r){var t=e.components,n=e.mdxType,o=e.originalType,p=e.parentName,s=l(e,["components","mdxType","originalType","parentName"]),m=i(t),d=n,y=m["".concat(p,".").concat(d)]||m[d]||u[d]||o;return t?a.createElement(y,c(c({ref:r},s),{},{components:t})):a.createElement(y,c({ref:r},s))}));function d(e,r){var t=arguments,n=r&&r.mdxType;if("string"==typeof e||n){var o=t.length,c=new Array(o);c[0]=m;var l={};for(var p in r)hasOwnProperty.call(r,p)&&(l[p]=r[p]);l.originalType=e,l.mdxType="string"==typeof e?e:n,c[1]=l;for(var i=2;i<o;i++)c[i]=t[i];return a.createElement.apply(null,c)}return a.createElement.apply(null,t)}m.displayName="MDXCreateElement"}}]);