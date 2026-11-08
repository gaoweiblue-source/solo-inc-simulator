import test from 'node:test';
import assert from 'node:assert/strict';
import {initial,accept,performAction,nextDay} from '../dist/engine.js';
test('deposit and final payment sum to the exact agreed price',()=>{
 for(const price of [1005,1005.25,2300]){
 const s=initial();const lead=s.leads[0];lead.status='converted';lead.price=price;lead.hours=1;
 const before=s.cash;accept(s,lead.id);performAction(s,'delivery',{target:lead.id});
 assert.equal(Math.round((s.cash-before)*100),Math.round(price*100));
 assert.equal(s.journey.paidProjects[0].amount,price);
 }
});
test('expired converted leads cannot be signed and do not mutate state',()=>{
 const s=initial();const lead=s.leads[0];lead.status='converted';lead.expires=s.week;
 const before=structuredClone(s);assert.throws(()=>accept(s,lead.id),/失效/);assert.deepEqual(s,before);
});
test('day seven applies the same overnight recovery as other days',()=>{
 for(const actions of [0,1,2]){
 const values=[];for(const day of [6,7]){const s=initial();s.day=day;s.energy=30;s.dayActions=actions;nextDay(s);values.push(s.energy)}
 assert.equal(values[0],values[1]);assert.equal(values[1],35+(2-actions)*3);
 }
});
