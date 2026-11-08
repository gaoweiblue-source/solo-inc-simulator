import fs from 'node:fs';import path from 'node:path';import {CONTACTS} from './dist/contacts.js';
const RULES={
'coffee-owner':{authority:95,familiarity:24,weights:{delivery:.45,insight:.35,content:.1,outreach:.1}},
'shop-ops':{authority:60,familiarity:18,weights:{delivery:.3,insight:.5,content:.1,outreach:.1}},
'market-assistant':{authority:25,familiarity:20,weights:{delivery:.25,insight:.2,content:.45,outreach:.1}},
'studio-partner':{authority:90,familiarity:28,weights:{delivery:.6,insight:.25,content:.05,outreach:.1}},
'tech-product':{authority:45,familiarity:12,weights:{delivery:.35,insight:.5,content:.05,outreach:.1}},
'editor-founder':{authority:95,familiarity:25,weights:{delivery:.2,insight:.25,content:.45,outreach:.1}}
};
export function customerContext(profileId,skills,previous){const profile=CONTACTS.find(c=>c.id===profileId);if(!profile)throw Error('客户档案不存在');const rule=RULES[profile.ruleId||profileId];return {profile,authority:rule.authority,fit:Math.round(Object.entries(rule.weights).reduce((n,[k,w])=>n+skills[k]*w,0)),familiarity:previous?.profileId===profileId?previous.familiarity:rule.familiarity}}
export function judgeOpportunity(context,result){const delta=result.decision==='rejected'?-12:Math.round((result.scores.trust+result.scores.needs)/3)-5;const familiarity=Math.max(0,Math.min(100,context.familiarity+delta));let decision=result.decision;let hint='继续了解需求，建立信任。';if(context.fit<40)hint='目前的能力与客户需求不够匹配。';else if(context.authority<55)hint='对方需要将方案交给有决策权的负责人。';else if(familiarity<35)hint='对方想先看看简单样例，增加一点信任。';else if(result.score<70)hint='简单说说你能怎么帮忙，以及下一步做什么。';else hint='双方具备进一步推进合作的基础。';if(decision==='converted'&&(context.fit<40||context.authority<55||familiarity<35||result.score<70))decision='followup';const reply=decision!==result.decision?'谢谢你的方案。'+(context.authority<55?'这件事我还不能直接拍板，需要交给负责人评估。':context.fit<40?'我还想确认，你是否有能力完成我们最关键的需求。':'方向我理解了，可以先给我看看一个简单样例吗？'):result.reply;return {publicResult:{...result,reply,decision,relationship:{stage:decision==='converted'?'合作意向明确':context.authority<55?'等待内部确认':familiarity>=35?'逐渐熟悉':'初次接触',hint}},state:{profileId:context.profile.id,familiarity}}}
export function readRelations(dir){try{return JSON.parse(fs.readFileSync(path.join(dir,'customer-relations.json'),'utf8'))}catch(e){if(e.code==='ENOENT')return {};throw Error('客户关系记录读取失败')}}
export function writeRelations(dir,data){fs.mkdirSync(dir,{recursive:true,mode:0o700});const f=path.join(dir,'customer-relations.json'),tmp=f+'.tmp';fs.writeFileSync(tmp,JSON.stringify(data),{mode:0o600});fs.chmodSync(tmp,0o600);fs.renameSync(tmp,f)}
