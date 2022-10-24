"use strict";(self.webpackChunkdocs=self.webpackChunkdocs||[]).push([[914],{4858:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>s,contentTitle:()=>l,default:()=>g,frontMatter:()=>o,metadata:()=>i,toc:()=>u});var r=n(8427),a=(n(2784),n(876));const o={},l="Block field suggestions",i={unversionedId:"plugins/block-field-suggestions",id:"plugins/block-field-suggestions",title:"Block field suggestions",description:"Prevent returning field suggestions and leaking your schema to unauthorized actors.",source:"@site/docs/plugins/block-field-suggestions.md",sourceDirName:"plugins",slug:"/plugins/block-field-suggestions",permalink:"/graphql-armor/docs/plugins/block-field-suggestions",draft:!1,editUrl:"https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/docs/plugins/block-field-suggestions.md",tags:[],version:"current",frontMatter:{},sidebar:"tutorialSidebar",previous:{title:"Plugins",permalink:"/graphql-armor/docs/category/plugins"},next:{title:"Character Limit",permalink:"/graphql-armor/docs/plugins/character-limit"}},s={},u=[{value:"Configuring for GraphQL Armor",id:"configuring-for-graphql-armor",level:2},{value:"Standalone usage",id:"standalone-usage",level:2},{value:"Installation",id:"installation",level:3},{value:"With <code>@envelop/core</code> from <code>@the-guild-org</code>",id:"with-envelopcore-from-the-guild-org",level:3},{value:"Using the default mask",id:"using-the-default-mask",level:4},{value:"Using custom mask",id:"using-custom-mask",level:4}],p={toc:u};function g(e){let{components:t,...n}=e;return(0,a.kt)("wrapper",(0,r.Z)({},p,n,{components:t,mdxType:"MDXLayout"}),(0,a.kt)("h1",{id:"block-field-suggestions"},"Block field suggestions"),(0,a.kt)("p",null,"Prevent ",(0,a.kt)("strong",{parentName:"p"},"returning field suggestions")," and ",(0,a.kt)("strong",{parentName:"p"},"leaking your schema")," to unauthorized actors."),(0,a.kt)("p",null,"In production, this can lead to Schema leak even if the introspection is disabled."),(0,a.kt)("ul",null,(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("a",{parentName:"li",href:"#configuring-for-graphql-armor"},"Configurating through GraphQL Armor")),(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("a",{parentName:"li",href:"#standalone-usage"},"Standalone usage"),(0,a.kt)("ul",{parentName:"li"},(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("a",{parentName:"li",href:"#installation"},"Installation")),(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("a",{parentName:"li",href:"#with-envelopcore-from-the-guild-org"},"With ",(0,a.kt)("inlineCode",{parentName:"a"},"@envelop/core")," from ",(0,a.kt)("inlineCode",{parentName:"a"},"@the-guild-org")),(0,a.kt)("ul",{parentName:"li"},(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("a",{parentName:"li",href:"#using-the-default-mask"},"Using the default mask")),(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("a",{parentName:"li",href:"#using-custom-mask"},"Using custom mask"))))))),(0,a.kt)("h2",{id:"configuring-for-graphql-armor"},"Configuring for GraphQL Armor"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-ts"},"GraphQLArmor({\n  blockFieldSuggestions: {\n    // Toogle the plugin | default: true\n    enabled?: boolean,\n    \n    // Mask applied to the error message | default: '[Suggestion hidden]'\n    mask?: string,\n  }\n})\n")),(0,a.kt)("h2",{id:"standalone-usage"},"Standalone usage"),(0,a.kt)("h3",{id:"installation"},"Installation"),(0,a.kt)("admonition",{type:"note"},(0,a.kt)("p",{parentName:"admonition"},"If you want to use the ",(0,a.kt)("inlineCode",{parentName:"p"},"blockFieldSuggestions")," plugin out of GraphQL Armor, you can install it from npm:")),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-bash"},"# npm\nnpm install @escape.tech/graphql-armor-block-field-suggestions\n\n# yarn\nyarn add @escape.tech/graphql-armor-block-field-suggestions\n")),(0,a.kt)("h3",{id:"with-envelopcore-from-the-guild-org"},"With ",(0,a.kt)("inlineCode",{parentName:"h3"},"@envelop/core")," from ",(0,a.kt)("inlineCode",{parentName:"h3"},"@the-guild-org")),(0,a.kt)("h4",{id:"using-the-default-mask"},"Using the default mask"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-ts"},"import { envelop } from '@envelop/core';\nimport { blockFieldSuggestions } from '@escape.tech/graphql-armor-block-field-suggestions';\n\nconst getEnveloped = envelop({\n  plugins: [\n    // ... other plugins ...\n    blockFieldSuggestions(),\n  ]\n});\n")),(0,a.kt)("h4",{id:"using-custom-mask"},"Using custom mask"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-ts"},"import { envelop } from '@envelop/core';\nimport { blockFieldSuggestions } from '@escape.tech/graphql-armor-block-field-suggestions';\n\nconst getEnveloped = envelop({\n  plugins: [\n    // ... other plugins ...\n    blockFieldSuggestions({\n        mask: '<[REDACTED]>'\n    }),\n  ]\n});\n")))}g.isMDXComponent=!0},876:(e,t,n)=>{n.d(t,{Zo:()=>p,kt:()=>m});var r=n(2784);function a(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function o(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function l(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?o(Object(n),!0).forEach((function(t){a(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):o(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function i(e,t){if(null==e)return{};var n,r,a=function(e,t){if(null==e)return{};var n,r,a={},o=Object.keys(e);for(r=0;r<o.length;r++)n=o[r],t.indexOf(n)>=0||(a[n]=e[n]);return a}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(r=0;r<o.length;r++)n=o[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(a[n]=e[n])}return a}var s=r.createContext({}),u=function(e){var t=r.useContext(s),n=t;return e&&(n="function"==typeof e?e(t):l(l({},t),e)),n},p=function(e){var t=u(e.components);return r.createElement(s.Provider,{value:t},e.children)},g={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},c=r.forwardRef((function(e,t){var n=e.components,a=e.mdxType,o=e.originalType,s=e.parentName,p=i(e,["components","mdxType","originalType","parentName"]),c=u(n),m=a,d=c["".concat(s,".").concat(m)]||c[m]||g[m]||o;return n?r.createElement(d,l(l({ref:t},p),{},{components:n})):r.createElement(d,l({ref:t},p))}));function m(e,t){var n=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var o=n.length,l=new Array(o);l[0]=c;var i={};for(var s in t)hasOwnProperty.call(t,s)&&(i[s]=t[s]);i.originalType=e,i.mdxType="string"==typeof e?e:a,l[1]=i;for(var u=2;u<o;u++)l[u]=n[u];return r.createElement.apply(null,l)}return r.createElement.apply(null,n)}c.displayName="MDXCreateElement"}}]);