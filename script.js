(function(){
const F=c=>({t:'f',c}),D=c=>({t:'d',c});
const root=D({home:D({user:D({
 'readme.txt':F('Welcome to the terminal!\nType help to see all available commands.'),
 'todo.txt':F('- Learn terminal commands\n- Start a project'),
 projects:D({'hello.js':F("console.log('Hello, world');")}),
 docs:D({})
})})});
let cwd=['home','user'],hist=[],hi=0;
const term=document.getElementById('term'),cwdEl=document.getElementById('cwd');
const HOME='/home/user';
const abs=p=>'/'+p.join('/');
const show=p=>{const a=abs(p);return a===HOME?'~':a.startsWith(HOME+'/')?'~'+a.slice(HOME.length):a};
function parts(p){
 if(p==='~'||p.startsWith('~/'))p=HOME+p.slice(1);
 const r=p.startsWith('/')?[]:cwd.slice();
 for(const s of p.split('/')){if(!s||s==='.')continue;if(s==='..')r.pop();else r.push(s)}
 return r}
function get(pp){let n=root;for(const s of pp){if(n.t!=='d'||!(s in n.c))return null;n=n.c[s]}return n}
function print(t,cls){const d=document.createElement('div');d.className='l '+(cls||'');d.textContent=t;term.appendChild(d);return d}
function promptEl(){return '<b></b>'}
function makePrompt(){
 const row=document.createElement('div');row.className='pl';
 const ps=document.createElement('span');ps.className='ps';
 ps.append('user@terminal:');const b=document.createElement('b');b.textContent=show(cwd);ps.append(b,' $');
 const inp=document.createElement('input');inp.autocapitalize='off';inp.autocomplete='off';inp.spellcheck=false;inp.setAttribute('aria-label','command');
 row.append(ps,inp);term.appendChild(row);cwdEl.textContent=show(cwd);inp.focus();term.scrollTop=term.scrollHeight;
 inp.addEventListener('keydown',e=>onKey(e,inp,row,ps));
}
function freeze(inp,row,ps){const s=document.createElement('span');s.textContent=inp.value;row.classList.add('hist');inp.replaceWith(s)}
function onKey(e,inp,row,ps){
 if(e.key==='Enter'){const v=inp.value;freeze(inp,row,ps);if(v.trim()){hist.push(v);}hi=hist.length;run(v);makePrompt()}
 else if(e.key==='ArrowUp'){e.preventDefault();if(hi>0){hi--;inp.value=hist[hi]}}
 else if(e.key==='ArrowDown'){e.preventDefault();if(hi<hist.length-1){hi++;inp.value=hist[hi]}else{hi=hist.length;inp.value=''}}
 else if(e.key==='Tab'){e.preventDefault();complete(inp)}
 else if(e.ctrlKey&&e.key==='l'){e.preventDefault();term.innerHTML='';makePrompt()}
 else if(e.ctrlKey&&e.key==='c'){e.preventDefault();freeze(inp,row,ps);const s=row.lastChild;s.textContent+='^C';makePrompt()}
}
function complete(inp){
 const v=inp.value,m=v.match(/^(.*?)(\S*)$/),pre=m[1],w=m[2];let cands;
 if(!pre.trim()){cands=Object.keys(C).filter(c=>c.startsWith(w))}
 else{const i=w.lastIndexOf('/'),dirp=i<0?'':w.slice(0,i+1),base=w.slice(i+1);
  const n=get(parts(dirp||'.'));cands=n&&n.t==='d'?Object.keys(n.c).filter(k=>k.startsWith(base)).map(k=>dirp+k+(n.c[k].t==='d'?'/':'')):[]}
 if(cands.length===1)inp.value=pre+cands[0]+(pre.trim()&&cands[0].endsWith('/')?'':' ');
 else if(cands.length>1){print(cands.join('   '),'dim')}
}
function tok(s){return (s.match(/"([^"]*)"|'([^']*)'|\S+/g)||[]).map(x=>/^["']/.test(x)?x.slice(1,-1):x)}
function run(line){
 const a=tok(line);if(!a.length)return;
 const c=a[0],args=a.slice(1);
 if(!C[c]){print(c+': command not found. Type help for a list of commands.','err');return}
 try{C[c](args)}catch(e){print(c+': '+e.message,'err')}
}
function need(args,n,name){if(args.length<n)throw new Error('missing argument ('+name+')')}
function dirOf(args){const p=args.filter(x=>!x.startsWith('-'))[0]||'.';const n=get(parts(p));if(!n)throw new Error(p+': no such file or directory');return n}
const clone=n=>n.t==='f'?F(n.c):D(Object.fromEntries(Object.entries(n.c).map(([k,v])=>[k,clone(v)])));
const count=n=>n.t==='f'?1:Object.values(n.c).reduce((a,v)=>a+count(v),0);
function fileText(p){const n=get(parts(p));if(!n)throw new Error(p+': no such file');if(n.t==='d')throw new Error(p+': is a directory');return n.c}
function lines(args,fn){let n=10,f=[];for(let i=0;i<args.length;i++){if(args[i]==='-n')n=+args[++i]||10;else f.push(args[i])}
 need(f,1,'file name');fn(fileText(f[0]).split('\n'),n).forEach(l=>print(l))}
const C={
 help(){
  [['help','show this help'],['ls [-a] [path]','list files'],['cd [path]','change directory'],['pwd','print working directory'],
   ['cat file','show file contents'],['mkdir name','create a directory'],['touch name','create an empty file'],['rm [-r] name','remove a file or directory'],
   ['echo text [> file]','print text or write to a file (>> appends)'],['calc expr','calculator, e.g. calc 2*(3+4)'],
   ['cp src dest','copy a file or directory'],['mv src dest','move or rename'],['head|tail [-n N] file','first or last lines of a file'],
   ['wc file','count lines, words, characters'],['grep pattern file','find matching lines'],['tree [path]','show directory tree'],
   ['js expression','run JavaScript, e.g. js [1,2,3].map(x=>x*2)'],['neofetch','system info'],['uname / hostname','system and host name'],
   ['date','current date and time'],['whoami','current user'],['history','previous commands'],['theme [dark|light]','switch theme'],['clear','clear the screen (Ctrl+L)']
  ].forEach(([a,b])=>print(a.padEnd(22)+' '+b));
  print('Tab: autocomplete   Up/Down: history','dim')},
 ls(args){const n=dirOf(args),all=args.includes('-a');
  if(n.t==='f'){print(args.filter(x=>x[0]!=='-')[0]);return}
  const k=Object.keys(n.c).sort();if(all)k.unshift('.','..');
  if(!k.length)return;
  const row=document.createElement('div');row.className='l';
  k.forEach(x=>{const s=document.createElement('span');const isD=x==='.'||x==='..'||n.c[x].t==='d';s.textContent=x+(isD?'/':'');if(isD)s.className='d';row.append(s,'   ')});
  term.appendChild(row)},
 cd(args){const p=args[0]||'~',pp=parts(p),n=get(pp);
  if(!n)throw new Error(p+': no such directory');if(n.t!=='d')throw new Error(p+': not a directory');cwd=pp},
 pwd(){print(abs(cwd))},
 cat(args){need(args,1,'file name');for(const p of args){const n=get(parts(p));if(!n)throw new Error(p+': no such file');if(n.t==='d')throw new Error(p+': is a directory');print(n.c)}},
 mkdir(args){need(args,1,'name');for(const p of args){const pp=parts(p),name=pp.pop(),par=get(pp);
  if(!par||par.t!=='d')throw new Error(p+': invalid path');if(name in par.c)throw new Error(p+': already exists');par.c[name]=D({})}},
 touch(args){need(args,1,'name');for(const p of args){const pp=parts(p),name=pp.pop(),par=get(pp);
  if(!par||par.t!=='d')throw new Error(p+': invalid path');if(!(name in par.c))par.c[name]=F('')}},
 rm(args){const fl=args.filter(x=>!x.startsWith('-'));need(fl,1,'name');for(const p of fl){const pp=parts(p),name=pp.pop(),par=get(pp);
  if(!par||!(name in par.c))throw new Error(p+': not found');
  if(par.c[name].t==='d'&&!args.includes('-r')&&Object.keys(par.c[name].c).length)throw new Error(p+': directory not empty (use rm -r)');
  delete par.c[name]}},
 echo(args){let i=args.findIndex(x=>x==='>'||x==='>>');
  if(i<0){print(args.join(' '));return}
  const txt=args.slice(0,i).join(' '),p=args[i+1];need(args.slice(i),2,'file name');
  const pp=parts(p),name=pp.pop(),par=get(pp);if(!par||par.t!=='d')throw new Error(p+': invalid path');
  if(par.c[name]&&par.c[name].t==='d')throw new Error(p+': is a directory');
  const old=par.c[name]?par.c[name].c:'';
  par.c[name]=F(args[i]==='>>'&&old?old+'\n'+txt:txt)},
 calc(args){const e=args.join(' ').replace(/\^/g,'**');
  if(!e||!/^[0-9+\-*/().%\s*]+$/.test(e))throw new Error('invalid expression');
  const r=Function('"use strict";return ('+e+')')();print(String(r),'ok')},
 date(){print(new Date().toLocaleString('en-US',{dateStyle:'full',timeStyle:'medium'}))},
 whoami(){print('user')},
 history(){hist.forEach((h,i)=>print(String(i+1).padStart(4)+'  '+h))},
 theme(args){const t=args[0];if(t!=='dark'&&t!=='light')throw new Error('use dark or light');document.documentElement.dataset.theme=t},
 cp(args){need(args,2,'source and destination');const sp=parts(args[0]),sn=get(sp);if(!sn)throw new Error(args[0]+': no such file or directory');
  const dp=parts(args[1]);let dn=get(dp),par,name;
  if(dn&&dn.t==='d'){par=dn;name=sp[sp.length-1]}else{name=dp.pop();par=get(dp);if(!par||par.t!=='d')throw new Error(args[1]+': invalid path')}
  par.c[name]=clone(sn)},
 mv(args){need(args,2,'source and destination');const sp=parts(args[0]);C.cp(args);const name=sp.pop(),par=get(sp);
  const dst=parts(args[1]);if(abs(dst)!==abs(sp.concat(name)))delete par.c[name]},
 head(args){lines(args,(l,n)=>l.slice(0,n))},
 tail(args){lines(args,(l,n)=>l.slice(-n))},
 wc(args){need(args,1,'file name');const t=fileText(args[0]);print((t?t.split('\n').length:0)+' lines  '+(t.trim()?t.trim().split(/\s+/).length:0)+' words  '+t.length+' chars  '+args[0])},
 grep(args){need(args,2,'pattern and file');const re=new RegExp(args[0],'i');const t=fileText(args[1]);
  const m=t.split('\n').filter(l=>re.test(l));if(!m.length)print('no matches','dim');m.forEach(l=>print(l))},
 tree(args){const n=dirOf(args);if(n.t!=='d'){print(args[0]);return}print('.','d');(function w(n,pre){const k=Object.keys(n.c).sort();
  k.forEach((x,i)=>{const last=i===k.length-1,d=n.c[x].t==='d';print(pre+(last?'└── ':'├── ')+x+(d?'/':''),d?'d':'');if(d)w(n.c[x],pre+(last?'    ':'│   '))})})(n,'')},
 js(args){need(args,1,'expression');const r=Function('"use strict";return ('+args.join(' ')+')')();
  print(typeof r==='object'&&r!==null?JSON.stringify(r):String(r),'ok')},
 neofetch(){['user@terminal','-------------','OS:      JSOS 1.0 (browser)','Shell:   jsh','Browser: '+(navigator.userAgent.match(/(Firefox|Edg|Chrome|Safari)\/[\d.]+/)||['unknown'])[0],
  'Screen:  '+innerWidth+'x'+innerHeight,'Lang:    '+navigator.language,'Files:   '+count(root)].forEach(l=>print(l,'ok'))},
 uname(){print('JSOS 1.0 (browser)')},
 hostname(){print('terminal')},
 clear(){term.innerHTML=''}
};
term.addEventListener('click',()=>{if(!getSelection().toString()){const i=term.querySelector('input');i&&i.focus()}});
print('Simulated terminal (files live only in this page\'s memory)','dim');
print('Type help to get started.','dim');
makePrompt();
})();
