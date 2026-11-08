import test from 'node:test';
import assert from 'node:assert/strict';
import {initial,performAction,dayUsed,marketingOutcome} from '../dist/engine.js';
import {evaluateMarketing,parseMarketing} from '../marketing-llm.mjs';
const rating=(n,trust=n)=>({relevance:n,usefulness:n,trust,feedback:'读者反馈来自实际内容'});
test('article quality changes reach, inquiries and reputation for the same founder',()=>{
 const good=initial(),average=initial(),bad=initial();
 for(const [s,e] of [[good,rating(90)],[average,rating(60)],[bad,rating(20)]])performAction(s,'market',{content:'给店主的预约管理内容',marketing:e});
 assert.ok(good.reach>average.reach&&average.reach>bad.reach);
 assert.ok(good.leads.length>average.leads.length);assert.equal(average.leads.filter(l=>l.source==='内容咨询').length,1);assert.equal(bad.leads.filter(l=>l.source==='内容咨询').length,0);
 assert.equal(good.reputation,11);assert.equal(bad.reputation,8);
 assert.equal(dayUsed(good),1);assert.equal(dayUsed(bad),1);
 assert.equal(good.cash,bad.cash);
 assert.equal(marketingOutcome(initial(),rating(20,70)).reputation,0);assert.equal(marketingOutcome(initial(),{...rating(90),usefulness:20}).inquiries,0);
});
test('invalid article ratings cause no game changes',()=>{
 const s=initial(),before=structuredClone(s);
 assert.throws(()=>performAction(s,'market',{content:'正常文章标题及正文',marketing:rating(101)}),/评估无效/);
 assert.deepEqual(s,before);
 assert.throws(()=>parseMarketing('{}'));assert.throws(()=>parseMarketing('not json'));
});
test('marketing independently evaluates actual content and rejects invalid provider responses',async()=>{
 const result=await evaluateMarketing({apiKey:'test'},{content:'店主如何用预约记录减少撞单',context:{}},async(url,options)=>{
 const body=JSON.parse(options.body);assert.match(body.messages[1].content,/减少撞单/);assert.match(body.messages[0].content,/不根据选项位置/);
 return {ok:true,json:async()=>({choices:[{finish_reason:'stop',message:{content:JSON.stringify(rating(85))}}]})};
 });assert.equal(result.relevance,85);
 await assert.rejects(evaluateMarketing({apiKey:''},{content:'这是准备发布的文章'}),/尚未配置/);
});
