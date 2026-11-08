import test from 'node:test';
import assert from 'node:assert/strict';
import {initial,migrateSave} from '../dist/engine.js';
import {CONTACTS} from '../dist/contacts.js';
import {customerContext} from '../customer-rules.mjs';
import {validateChat} from '../llm.mjs';
test('every career acquaintance resolves to matching customer profile and valid chat context',()=>{
 for(const role of ['development','product','operations','sales']){
 const s=initial('公司',role);
 for(const lead of s.leads){const profile=CONTACTS.find(c=>c.id===lead.profileId);assert.equal(lead.client,profile.company);assert.equal(lead.title,profile.need);assert.ok(Number.isFinite(customerContext(lead.profileId,s.skills).authority));const input=validateChat({campaignId:s.campaignId,lead,skills:s.skills,message:'好久不见，最近经营怎么样？'});assert.equal(input.lead.acquaintance,lead.acquaintance);}
 }
});
test('existing saved contact lists are not reseeded on load',()=>{const s=initial();s.leads=[];assert.deepEqual(migrateSave(s).leads,[]);});
