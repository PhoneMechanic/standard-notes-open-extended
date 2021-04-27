!function(e){"object"==typeof exports&&"object"==typeof module?e(require("../../lib/codemirror")):"function"==typeof define&&define.amd?define(["../../lib/codemirror"],e):e(CodeMirror)}((function(e){"use strict";e.TernServer=function(r){var a=this;this.options=r||{};var c=this.options.plugins||(this.options.plugins={});c.doc_comment||(c.doc_comment=!0),this.docs=Object.create(null),this.options.useWorker?this.server=new T(this):this.server=new tern.Server({getFile:function(e,t){return o(a,e,t)},async:!0,defs:this.options.defs||[],plugins:c}),this.trackChange=function(e,t){!function(e,t,n){var o=i(e,t),r=e.cachedArgHints;r&&r.doc==t&&p(r.start,n.to)>=0&&(e.cachedArgHints=null);var a=o.changed;null==a&&(o.changed=a={from:n.from.line,to:n.from.line});var c=n.from.line+(n.text.length-1);n.from.line<a.to&&(a.to=a.to-(n.to.line-c)),c>=a.to&&(a.to=c+1),a.from>n.from.line&&(a.from=n.from.line),t.lineCount()>250&&n.to-a.from>100&&setTimeout((function(){o.changed&&o.changed.to-o.changed.from>100&&s(e,o)}),200)}(a,e,t)},this.cachedArgHints=null,this.activeArgHints=null,this.jumpStack=[],this.getHint=function(o,i){return function(o,i,r){o.request(i,{type:"completions",types:!0,docs:!0,urls:!0},(function(s,a){if(s)return x(o,i,s);var c,l,u=[],f="",d=a.start,p=a.end;'["'==i.getRange(t(d.line,d.ch-2),d)&&'"]'!=i.getRange(p,t(p.line,p.ch+2))&&(f='"]');for(var h=0;h<a.completions.length;++h){var g=a.completions[h],m=(c=g.type,l=void 0,l="?"==c?"unknown":"number"==c||"string"==c||"bool"==c?c:/^fn\(/.test(c)?"fn":/^\[/.test(c)?"array":"object",n+"completion "+n+"completion-"+l);a.guess&&(m+=" "+n+"guess"),u.push({text:g.name+f,displayText:g.displayName||g.name,className:m,data:g})}var v={from:d,to:p,list:u},w=null;e.on(v,"close",(function(){C(w)})),e.on(v,"update",(function(){C(w)})),e.on(v,"select",(function(e,t){C(w);var r=o.options.completionTip?o.options.completionTip(e.data):e.data.doc;r&&((w=y(t.parentNode.getBoundingClientRect().right+window.pageXOffset,t.getBoundingClientRect().top+window.pageYOffset,r,i)).className+=" "+n+"hint-doc")})),r(v)}))}(a,o,i)},this.getHint.async=!0},e.TernServer.prototype={addDoc:function(t,n){var o={doc:n,name:t,changed:null};return this.server.addFile(t,b(this,o)),e.on(n,"change",this.trackChange),this.docs[t]=o},delDoc:function(t){var n=r(this,t);n&&(e.off(n.doc,"change",this.trackChange),delete this.docs[n.name],this.server.delFile(n.name))},hideDoc:function(e){w(this);var t=r(this,e);t&&t.changed&&s(this,t)},complete:function(e){e.showHint({hint:this.getHint})},showType:function(e,t,n){a(this,e,t,"type",n)},showDocs:function(e,t,n){a(this,e,t,"documentation",n)},updateArgHints:function(n){!function(n,o){if(w(n),!o.somethingSelected()){var i=o.getTokenAt(o.getCursor()).state,r=e.innerMode(o.getMode(),i);if("javascript"==r.mode.name){var s=r.state.lexical;if("call"==s.info){for(var a,u=s.pos||0,f=o.getOption("tabSize"),d=o.getCursor().line,h=Math.max(0,d-9),g=!1;d>=h;--d){for(var m=o.getLine(d),v=0,y=0;;){var C=m.indexOf("\t",y);if(-1==C)break;v+=f-(C+v)%f-1,y=C+1}if(a=s.column-v,"("==m.charAt(a)){g=!0;break}}if(g){var x=t(d,a),b=n.cachedArgHints;if(b&&b.doc==o.getDoc()&&0==p(x,b.start))return c(n,o,u);n.request(o,{type:"type",preferFunction:!0,end:x},(function(e,t){!e&&t.type&&/^fn\(/.test(t.type)&&(n.cachedArgHints={start:x,type:l(t.type),name:t.exprName||t.name||"fn",guess:t.guess,doc:o.getDoc()},c(n,o,u))}))}}}}}(this,n)},jumpToDef:function(e){!function(e,n){function o(o){var r={type:"definition",variable:o||null},s=i(e,n.getDoc());e.server.request(d(e,s,r),(function(o,i){if(o)return x(e,n,o);if(i.file||!i.url){if(i.file){var r,a=e.docs[i.file];if(a&&(r=function(e,n){for(var o=n.context.slice(0,n.contextOffset).split("\n"),i=n.start.line-(o.length-1),r=t(i,(1==o.length?n.start.ch:e.getLine(i).length)-o[0].length),s=e.getLine(i).slice(r.ch),a=i+1;a<e.lineCount()&&s.length<n.context.length;++a)s+="\n"+e.getLine(a);if(s.slice(0,n.context.length)==n.context)return n;for(var c,l=e.getSearchCursor(n.context,0,!1),u=1/0;l.findNext();){var f=l.from(),d=1e4*Math.abs(f.line-r.line);d||(d=Math.abs(f.ch-r.ch)),d<u&&(c=f,u=d)}if(!c)return null;if(1==o.length?c.ch+=o[0].length:c=t(c.line+(o.length-1),o[o.length-1].length),n.start.line==n.end.line)var p=t(c.line,c.ch+(n.end.ch-n.start.ch));else p=t(c.line+(n.end.line-n.start.line),n.end.ch);return{start:c,end:p}}(a.doc,i)))return e.jumpStack.push({file:s.name,start:n.getCursor("from"),end:n.getCursor("to")}),void u(e,s,a,r.start,r.end)}x(e,n,"Could not find a definition.")}else window.open(i.url)}))}!function(e){var t=e.getCursor("end"),n=e.getTokenAt(t);return!(n.start<t.ch&&"comment"==n.type)&&/[\w)\]]/.test(e.getLine(t.line).slice(Math.max(t.ch-1,0),t.ch+1))}(n)?g(n,"Jump to variable",(function(e){e&&o(e)})):o()}(this,e)},jumpBack:function(e){!function(e,t){var n=e.jumpStack.pop(),o=n&&e.docs[n.file];o&&u(e,i(e,t.getDoc()),o,n.start,n.end)}(this,e)},rename:function(e){!function(e,t){var n=t.getTokenAt(t.getCursor());if(!/\w/.test(n.string))return x(e,t,"Not at a variable");g(t,"New name for "+n.string,(function(n){e.request(t,{type:"rename",newName:n,fullDocs:!0},(function(n,o){if(n)return x(e,t,n);!function(e,t){for(var n=Object.create(null),o=0;o<t.length;++o)(n[(c=t[o]).file]||(n[c.file]=[])).push(c);for(var i in n){var r=e.docs[i],s=n[i];if(r){s.sort((function(e,t){return p(t.start,e.start)}));var a="*rename"+ ++f;for(o=0;o<s.length;++o){var c=s[o];r.doc.replaceRange(c.text,c.start,c.end,a)}}}}(e,o.changes)}))}))}(this,e)},selectName:function(e){!function(e,t){var n=i(e,t.doc).name;e.request(t,{type:"refs"},(function(o,i){if(o)return x(e,t,o);for(var r=[],s=0,a=t.getCursor(),c=0;c<i.refs.length;c++){var l=i.refs[c];l.file==n&&(r.push({anchor:l.start,head:l.end}),p(a,l.start)>=0&&p(a,l.end)<=0&&(s=r.length-1))}t.setSelections(r,s)}))}(this,e)},request:function(e,t,n,o){var r=this,s=i(this,e.getDoc()),a=d(this,s,t,o),c=a.query&&this.options.queryOptions&&this.options.queryOptions[a.query.type];if(c)for(var l in c)a.query[l]=c[l];this.server.request(a,(function(e,o){!e&&r.options.responseFilter&&(o=r.options.responseFilter(s,t,a,e,o)),n(e,o)}))},destroy:function(){w(this),this.worker&&(this.worker.terminate(),this.worker=null)}};var t=e.Pos,n="CodeMirror-Tern-";function o(e,t,n){var o=e.docs[t];o?n(b(e,o)):e.options.getFile?e.options.getFile(t,n):n(null)}function i(e,t,n){for(var o in e.docs){var i=e.docs[o];if(i.doc==t)return i}if(!n)for(var r=0;;++r)if(o="[doc"+(r||"")+"]",!e.docs[o]){n=o;break}return e.addDoc(n,t)}function r(t,n){return"string"==typeof n?t.docs[n]:(n instanceof e&&(n=n.getDoc()),n instanceof e.Doc?i(t,n):void 0)}function s(e,t){e.server.request({files:[{type:"full",name:t.name,text:b(e,t)}]},(function(e){e?window.console.error(e):t.changed=null}))}function a(e,t,n,o,i){e.request(t,o,(function(n,o){if(n)return x(e,t,n);if(e.options.typeTip)var r=e.options.typeTip(o);else if(r=h("span",null,h("strong",null,o.type||"not found")),o.doc&&r.appendChild(document.createTextNode(" — "+o.doc)),o.url){r.appendChild(document.createTextNode(" "));var s=r.appendChild(h("a",null,"[docs]"));s.href=o.url,s.target="_blank"}m(t,r,e),i&&i()}),n)}function c(e,t,o){w(e);for(var i=e.cachedArgHints,r=i.type,s=h("span",i.guess?n+"fhint-guess":null,h("span",n+"fname",i.name),"("),a=0;a<r.args.length;++a){a&&s.appendChild(document.createTextNode(", "));var c=r.args[a];s.appendChild(h("span",n+"farg"+(a==o?" "+n+"farg-current":""),c.name||"?")),"?"!=c.type&&(s.appendChild(document.createTextNode(": ")),s.appendChild(h("span",n+"type",c.type)))}s.appendChild(document.createTextNode(r.rettype?") -> ":")")),r.rettype&&s.appendChild(h("span",n+"type",r.rettype));var l=t.cursorCoords(null,"page"),u=e.activeArgHints=y(l.right+1,l.bottom,s,t);setTimeout((function(){u.clear=v(t,(function(){e.activeArgHints==u&&w(e)}))}),20)}function l(e){var t=[],n=3;function o(t){for(var o=0,i=n;;){var r=e.charAt(n);if(t.test(r)&&!o)return e.slice(i,n);/[{\[\(]/.test(r)?++o:/[}\]\)]/.test(r)&&--o,++n}}if(")"!=e.charAt(n))for(;;){var i=e.slice(n).match(/^([^, \(\[\{]+): /);if(i&&(n+=i[0].length,i=i[1]),t.push({name:i,type:o(/[\),]/)}),")"==e.charAt(n))break;n+=2}var r=e.slice(n).match(/^\) -> (.*)$/);return{args:t,rettype:r&&r[1]}}function u(e,t,n,o,i){n.doc.setSelection(o,i),t!=n&&e.options.switchToDoc&&(w(e),e.options.switchToDoc(n.name,n.doc))}var f=0;function d(n,o,i,r){var s=[],a=0,c=!i.fullDocs;c||delete i.fullDocs,"string"==typeof i&&(i={type:i}),i.lineCharPositions=!0,null==i.end&&(i.end=r||o.doc.getCursor("end"),o.doc.somethingSelected()&&(i.start=o.doc.getCursor("start")));var l=i.start||i.end;for(var u in o.changed?o.doc.lineCount()>250&&!1!==c&&o.changed.to-o.changed.from<100&&o.changed.from<=l.line&&o.changed.to>i.end.line?(s.push(function(n,o,i){for(var r,s=n.doc,a=null,c=null,l=o.line-1,u=Math.max(0,l-50);l>=u;--l){var f=s.getLine(l);if(!(f.search(/\bfunction\b/)<0)){var d=e.countColumn(f,null,4);null!=a&&a<=d||(a=d,c=l)}}null==c&&(c=u);var p=Math.min(s.lastLine(),i.line+20);if(null==a||a==e.countColumn(s.getLine(o.line),null,4))r=p;else for(r=i.line+1;r<p&&!((d=e.countColumn(s.getLine(r),null,4))<=a);++r);var h=t(c,0);return{type:"part",name:n.name,offsetLines:h.line,text:s.getRange(h,t(r,i.line==r?null:0))}}(o,l,i.end)),i.file="#0",a=s[0].offsetLines,null!=i.start&&(i.start=t(i.start.line- -a,i.start.ch)),i.end=t(i.end.line-a,i.end.ch)):(s.push({type:"full",name:o.name,text:b(n,o)}),i.file=o.name,o.changed=null):i.file=o.name,n.docs){var f=n.docs[u];f.changed&&f!=o&&(s.push({type:"full",name:f.name,text:b(n,f)}),f.changed=null)}return{query:i,files:s}}var p=e.cmpPos;function h(e,t){var n=document.createElement(e);t&&(n.className=t);for(var o=2;o<arguments.length;++o){var i=arguments[o];"string"==typeof i&&(i=document.createTextNode(i)),n.appendChild(i)}return n}function g(e,t,n){e.openDialog?e.openDialog(t+": <input type=text>",n):n(prompt(t,""))}function m(t,n,o){t.state.ternTooltip&&C(t.state.ternTooltip);var i=t.cursorCoords(),r=t.state.ternTooltip=y(i.right+1,i.bottom,n,t);function s(){var e;t.state.ternTooltip=null,r.parentNode&&((e=r).style.opacity="0",setTimeout((function(){C(e)}),1100)),l()}var a=!1,c=!1;e.on(r,"mousemove",(function(){a=!0})),e.on(r,"mouseout",(function(t){var n=t.relatedTarget||t.toElement;n&&e.contains(r,n)||(c?s():a=!1)})),setTimeout((function(){c=!0,a||s()}),o.options.hintDelay?o.options.hintDelay:1700);var l=v(t,s)}function v(e,t){return e.on("cursorActivity",t),e.on("blur",t),e.on("scroll",t),e.on("setDoc",t),function(){e.off("cursorActivity",t),e.off("blur",t),e.off("scroll",t),e.off("setDoc",t)}}function y(e,t,o,i){var r=h("div",n+"tooltip",o);return r.style.left=e+"px",r.style.top=t+"px",(((i.options||{}).hintOptions||{}).container||document.body).appendChild(r),r}function C(e){var t=e&&e.parentNode;t&&t.removeChild(e)}function x(e,t,n){e.options.showError?e.options.showError(t,n):m(t,String(n),e)}function w(e){e.activeArgHints&&(e.activeArgHints.clear&&e.activeArgHints.clear(),C(e.activeArgHints),e.activeArgHints=null)}function b(e,t){var n=t.doc.getValue();return e.options.fileFilter&&(n=e.options.fileFilter(n,t.name,t.doc)),n}function T(e){var t=e.worker=new Worker(e.options.workerScript);t.postMessage({type:"init",defs:e.options.defs,plugins:e.options.plugins,scripts:e.options.workerDeps});var n=0,i={};function r(e,o){o&&(e.id=++n,i[n]=o),t.postMessage(e)}t.onmessage=function(t){var n=t.data;"getFile"==n.type?o(e,n.name,(function(e,t){r({type:"getFile",err:String(e),text:t,id:n.id})})):"debug"==n.type?window.console.log(n.message):n.id&&i[n.id]&&(i[n.id](n.err,n.body),delete i[n.id])},t.onerror=function(e){for(var t in i)i[t](e);i={}},this.addFile=function(e,t){r({type:"add",name:e,text:t})},this.delFile=function(e){r({type:"del",name:e})},this.request=function(e,t){r({type:"req",body:e},t)}}}));