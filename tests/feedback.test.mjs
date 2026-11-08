import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
import {initial,performAction,nextDay,dayUsed} from '../dist/engine.js';

test('feedback is inside the active dialog top layer, and returns to body outside a dialog',()=>{
 const source=readFileSync(new URL('../dist/app.js',import.meta.url),'utf8');
 const toast=source.slice(source.indexOf('function toast('),source.indexOf('\nfunction show('));
 let parent;
 const el={classList:{add(){},remove(){}}};
 const modal={open:true,append(node){assert.equal(node,el);parent='dialog'}};
 const context={modal,document:{querySelector(){return el},body:{append(){parent='body'}}},clearTimeout(){},setTimeout(){return 1},toastTimer:null};
 vm.createContext(context);vm.runInContext(toast,context);
 context.toast('今天最多完成两件事，请进入下一天');
 assert.equal(parent,'dialog');assert.match(el.textContent,/下一天/);
 modal.open=false;context.toast('发布成功');assert.equal(parent,'body');
});
test('publishing uses one slot; a blocked publish preserves state and works next day',()=>{
 const s=initial();const content='标题：选题清单\n用清单组织你的内容和发布时间。';
 performAction(s,'rest');performAction(s,'rest');
 const before=structuredClone(s);
 assert.throws(()=>performAction(s,'market',{content}),/今天最多完成两件事/);
 assert.deepEqual(s,before);
 nextDay(s);const reach=s.reach;performAction(s,'market',{content});
 assert.equal(dayUsed(s),1);assert.ok(s.reach>reach);
});
