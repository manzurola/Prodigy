var ERRORS={NOT_IMPLEMENTED:"method not implemented"};Array.prototype.shuffle=function(){var b=this.length,a,d,c;if(b==0){return this}while(--b){a=Math.floor(Math.random()*(b+1));d=this[b];c=this[a];this[b]=c;this[a]=d}return this};Array.prototype.clone=function(){return this.slice(0)};var entity=function(j,d){var g={};var k={},a=true,b=j&&j.hasOwnProperty("style")?j.style.display:null,e=j&&j.hasOwnProperty("parentNode")?j.parentNode:null;(function(){if(j){i()}}());g.fireEvent=function(q){var r,p,o,n,m;m=typeof q==="string"?q:q.type;if(k.hasOwnProperty(m)){r=k[m];for(var l=0;l<r.length;l++){n=r[l];p=n.method;o=n.parameters||this;p.apply(this,[o])}}return this};g.setInnerText=function(l){j.innerText=""+l;return this};g.getInnerText=function(){return j.innerText};g.getView=function(){return j};g.enableSelectEvents=function(){i();return this};g.disableSelectEvents=function(){logIt("disabling select events");c();return this};g.show=function(){if(!a){j.style.visibility="visible";a=true}return this};g.hide=function(){if(a){j.style.visibility="hidden";a=false}return this};g.remove=function(){if(e){e.removeChild(j);e=null}return this};g.appendTo=function(l){e=l.getView();e.appendChild(j);return this};g.isShowing=function(){return f()};g.on=function(m,o,n){var l={method:o,parameters:n};if(k.hasOwnProperty(m)){k[m].push(l)}else{k[m]=[l]}return this};g.getData=function(){return d};g.setData=function(l){for(var m in l){if(l.hasOwnProperty(m)&&d.hasOwnProperty(m)){d[m]=l[m]}}return this};function f(){return j.style.display!=="none"}function i(){j.onclick=h}function c(){j.onclick=null}function h(l){l.stopPropagation();g.fireEvent("select")}return g};