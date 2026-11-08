import {evaluateMarketing} from './marketing-llm.mjs';
import {generateChoices} from './choices.mjs';
import {developDemo,evaluateProduct} from './product-llm.mjs';
import {readRelations,writeRelations} from './customer-rules.mjs';
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {ApiError,publicConfig,readConfig,saveConfig,completion,evaluate,validateChat} from './llm.mjs';
const project=path.dirname(fileURLToPath(import.meta.url)),root=path.join(project,'dist'),configDir=path.join(project,'.local');
const mime={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.png':'image/png','.webp':'image/webp'};
const hosts=new Set(['127.0.0.1:4173','localhost:4173']);let busy=false;
function json(res,status,data){res.writeHead(status,{'Content-Type':'application/json; charset=utf-8'});res.end(JSON.stringify(data))}
async function body(req){const chunks=[];let bytes=0;for await(const chunk of req){const data=Buffer.isBuffer(chunk)?chunk:Buffer.from(chunk);bytes+=data.length;if(bytes>160000)throw new ApiError('请求内容过长',413);chunks.push(data)}try{return JSON.parse(Buffer.concat(chunks).toString('utf8'))}catch{throw new ApiError('请求必须是 JSON')}}
const server=http.createServer(async(req,res)=>{
 res.setHeader('Cache-Control','no-store');res.setHeader('X-Content-Type-Options','nosniff');res.setHeader('Referrer-Policy','no-referrer');
 if(!hosts.has(req.headers.host))return json(res,403,{error:'仅允许本机访问'});
 let pathname;try{pathname=decodeURIComponent(new URL(req.url,'http://127.0.0.1').pathname)}catch{return json(res,400,{error:'无效路径'})}
 if(pathname.startsWith('/api/')){
  const origin=req.headers.origin;if(origin&&!['http://127.0.0.1:4173','http://localhost:4173'].includes(origin))return json(res,403,{error:'不允许跨站请求'});
  try{
   if(req.method==='GET'&&pathname==='/api/settings')return json(res,200,publicConfig(configDir));
   if(req.method!=='POST'||req.headers['x-solo-local']!=='1'||!req.headers['content-type']?.startsWith('application/json'))throw new ApiError('不允许的请求',403);
   const input=await body(req);
   if(pathname==='/api/settings'){if(busy)throw new ApiError('请等待当前模型请求结束',409);return json(res,200,saveConfig(configDir,input))}
   if(!['/api/test-connection','/api/customer-chat','/api/product-evaluate','/api/product-demo','/api/game-choices','/api/marketing-evaluate'].includes(pathname))throw new ApiError('接口不存在',404);
   if(busy)throw new ApiError('有一个模型请求正在处理中，请稍候。',429);busy=true;
   try{if(pathname==='/api/marketing-evaluate')return json(res,200,await evaluateMarketing(readConfig(configDir),input));if(pathname==='/api/game-choices')return json(res,200,await generateChoices(readConfig(configDir),input));if(pathname==='/api/product-demo')return json(res,200,await developDemo(readConfig(configDir),input));if(pathname==='/api/product-evaluate')return json(res,200,await evaluateProduct(readConfig(configDir),input));if(pathname==='/api/test-connection'){await completion(readConfig(configDir),[{role:'user',content:'请只回复 OK。'}]);return json(res,200,{ok:true,message:'DeepSeek 连接成功，模型已响应。'})}const checked=validateChat(input),key=checked.campaignId+':'+checked.lead.id;const relations=readRelations(configDir);const judged=await evaluate(readConfig(configDir),input,fetch,relations[key]);relations[key]=judged.state;writeRelations(configDir,relations);return json(res,200,judged.publicResult)}finally{busy=false}
  }catch(e){return json(res,e instanceof ApiError?e.status:500,{error:e instanceof ApiError?e.message:'本地服务处理失败，请重试。'})}
 }
 if(!['GET','HEAD'].includes(req.method)){res.writeHead(405);res.end();return}
 if(pathname==='/health')return json(res,200,{app:'solo-inc-local',version:'0.6'});
 const p=path.resolve(root,'.'+(pathname==='/'?'/index.html':pathname));if(!p.startsWith(root+path.sep)){res.writeHead(403);res.end();return}
 fs.readFile(p,(err,data)=>{if(err){res.writeHead(404);res.end('Not found');return}res.setHeader('Content-Type',mime[path.extname(p)]||'application/octet-stream');res.end(req.method==='HEAD'?undefined:data)});
});
server.on('error',e=>{console.error(e.code==='EADDRINUSE'?'端口 4173 已被占用，请停止旧服务后重试。':'本地服务启动失败：'+e.code);process.exitCode=1});
server.listen(4173,'127.0.0.1',()=>console.log('一人公司模拟器已启动\n游戏：http://127.0.0.1:4173\nLLM 后台：http://127.0.0.1:4173/admin.html\n按 Control+C 停止服务。'));
