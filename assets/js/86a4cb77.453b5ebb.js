"use strict";(self.webpackChunkdocs=self.webpackChunkdocs||[]).push([[838],{2126:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>p,contentTitle:()=>l,default:()=>m,frontMatter:()=>o,metadata:()=>i,toc:()=>s});var r=n(7896),a=(n(2784),n(876));const o={},l="Max Tokens",i={unversionedId:"plugins/max-tokens",id:"plugins/max-tokens",title:"Max Tokens",description:"Limit the number of tokens in a GraphQL document.",source:"@site/docs/plugins/max-tokens.md",sourceDirName:"plugins",slug:"/plugins/max-tokens",permalink:"/graphql-armor/docs/plugins/max-tokens",draft:!1,editUrl:"https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/docs/plugins/max-tokens.md",tags:[],version:"current",frontMatter:{},sidebar:"tutorialSidebar",previous:{title:"Max Directives",permalink:"/graphql-armor/docs/plugins/max-directives"}},p={},s=[{value:"Configuring for GraphQL Armor",id:"configuring-for-graphql-armor",level:2},{value:"Standalone usage",id:"standalone-usage",level:2},{value:"Installation",id:"installation",level:3},{value:"With <code>@graphql/graphql-js</code>",id:"with-graphqlgraphql-js",level:3},{value:"With <code>@envelop/core</code> from <code>@the-guild-org</code>",id:"with-envelopcore-from-the-guild-org",level:3},{value:"References",id:"references",level:2}],u={toc:s},c="wrapper";function m(e){let{components:t,...n}=e;return(0,a.kt)(c,(0,r.Z)({},u,n,{components:t,mdxType:"MDXLayout"}),(0,a.kt)("h1",{id:"max-tokens"},"Max Tokens"),(0,a.kt)("p",null,(0,a.kt)("strong",{parentName:"p"},"Limit")," the number of ",(0,a.kt)("strong",{parentName:"p"},"tokens")," in a GraphQL document."),(0,a.kt)("p",null,"It is used to prevent ",(0,a.kt)("strong",{parentName:"p"},"DOS attack"),", ",(0,a.kt)("strong",{parentName:"p"},"heap overflow")," or ",(0,a.kt)("strong",{parentName:"p"},"server overloading"),"."),(0,a.kt)("p",null,"The token limit is often limited by the graphql parser, but this is not always the case and would lead to a fatal heap overflow."),(0,a.kt)("ul",null,(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("a",{parentName:"li",href:"#max-tokens"},"Max Tokens"),(0,a.kt)("ul",{parentName:"li"},(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("a",{parentName:"li",href:"#configuring-for-graphql-armor"},"Configuring for GraphQL Armor")),(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("a",{parentName:"li",href:"#standalone-usage"},"Standalone usage"),(0,a.kt)("ul",{parentName:"li"},(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("a",{parentName:"li",href:"#installation"},"Installation")),(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("a",{parentName:"li",href:"#with-graphqlgraphql-js"},"With ",(0,a.kt)("inlineCode",{parentName:"a"},"@graphql/graphql-js"))),(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("a",{parentName:"li",href:"#with-envelopcore-from-the-guild-org"},"With ",(0,a.kt)("inlineCode",{parentName:"a"},"@envelop/core")," from ",(0,a.kt)("inlineCode",{parentName:"a"},"@the-guild-org"))))),(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("a",{parentName:"li",href:"#references"},"References"))))),(0,a.kt)("h2",{id:"configuring-for-graphql-armor"},"Configuring for GraphQL Armor"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-ts"},"GraphQLArmorConfig({\n  maxTokens: {\n    // Toogle the plugin | default: true\n    enabled?: boolean,\n    \n    // Tokens threshold | default: 1000\n    n?: int,\n\n    // Callbacks that are ran whenever a Query is accepted\n    onAccept?: GraphQLArmorAcceptCallback[],\n\n    // Callbacks that are ran whenever a Query is rejected\n    onReject?: GraphQLArmorRejectCallback[],\n\n    // Do you want to propagate the rejection to the client? | default: true\n    propagateOnRejection?: boolean,\n  }\n})\n")),(0,a.kt)("h2",{id:"standalone-usage"},"Standalone usage"),(0,a.kt)("h3",{id:"installation"},"Installation"),(0,a.kt)("admonition",{type:"note"},(0,a.kt)("p",{parentName:"admonition"},"If you want to use the ",(0,a.kt)("inlineCode",{parentName:"p"},"maxTokens")," plugin out of GraphQL Armor, you can install it from npm:")),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-bash"},"# npm\nnpm install @escape.tech/graphql-armor-max-tokens\n\n# yarn\nyarn add @escape.tech/graphql-armor-max-tokens\n")),(0,a.kt)("h3",{id:"with-graphqlgraphql-js"},"With ",(0,a.kt)("inlineCode",{parentName:"h3"},"@graphql/graphql-js")),(0,a.kt)("p",null,"You can directly use the ",(0,a.kt)("inlineCode",{parentName:"p"},"maxTokens")," option:"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-ts"},"import { parse } from '@graphql/graphql-js';\nparse('{ foo }', { maxTokens: 2 }));\n")),(0,a.kt)("h3",{id:"with-envelopcore-from-the-guild-org"},"With ",(0,a.kt)("inlineCode",{parentName:"h3"},"@envelop/core")," from ",(0,a.kt)("inlineCode",{parentName:"h3"},"@the-guild-org")),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-ts"},"import { envelop } from '@envelop/core';\nimport { maxTokensPlugin } from '@escape.tech/graphql-armor-max-tokens';\n\nconst getEnveloped = envelop({\n  plugins: [\n    // ... other plugins ...\n    maxTokensPlugin({\n        maxTokenCount: 1000,\n    }),\n  ]\n});\n")),(0,a.kt)("h2",{id:"references"},"References"),(0,a.kt)("ul",null,(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("a",{parentName:"li",href:"https://github.com/graphql/graphql-js/pull/3684"},"https://github.com/graphql/graphql-js/pull/3684")),(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("a",{parentName:"li",href:"https://github.com/advisories/GHSA-p4qx-6w5p-4rj2"},"https://github.com/advisories/GHSA-p4qx-6w5p-4rj2"))))}m.isMDXComponent=!0},876:(e,t,n)=>{n.d(t,{Zo:()=>u,kt:()=>g});var r=n(2784);function a(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function o(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function l(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?o(Object(n),!0).forEach((function(t){a(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):o(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function i(e,t){if(null==e)return{};var n,r,a=function(e,t){if(null==e)return{};var n,r,a={},o=Object.keys(e);for(r=0;r<o.length;r++)n=o[r],t.indexOf(n)>=0||(a[n]=e[n]);return a}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(r=0;r<o.length;r++)n=o[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(a[n]=e[n])}return a}var p=r.createContext({}),s=function(e){var t=r.useContext(p),n=t;return e&&(n="function"==typeof e?e(t):l(l({},t),e)),n},u=function(e){var t=s(e.components);return r.createElement(p.Provider,{value:t},e.children)},c="mdxType",m={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},h=r.forwardRef((function(e,t){var n=e.components,a=e.mdxType,o=e.originalType,p=e.parentName,u=i(e,["components","mdxType","originalType","parentName"]),c=s(n),h=a,g=c["".concat(p,".").concat(h)]||c[h]||m[h]||o;return n?r.createElement(g,l(l({ref:t},u),{},{components:n})):r.createElement(g,l({ref:t},u))}));function g(e,t){var n=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var o=n.length,l=new Array(o);l[0]=h;var i={};for(var p in t)hasOwnProperty.call(t,p)&&(i[p]=t[p]);i.originalType=e,i[c]="string"==typeof e?e:a,l[1]=i;for(var s=2;s<o;s++)l[s]=n[s];return r.createElement.apply(null,l)}return r.createElement.apply(null,n)}h.displayName="MDXCreateElement"}}]);