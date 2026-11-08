import {validSave} from './engine.js';
import {userSaveKey} from './users.js';
export const RANK_METRICS={income:'收入榜',profit:'利润榜',customers:'客户榜',completed:'交付榜',sales:'销量榜',reputation:'信誉榜'};
export function rankCompanies(storage,users,metric='income'){
 if(!Object.hasOwn(RANK_METRICS,metric))metric='income';
 const rows=[],skipped=[];
 for(const user of users){try{
 const raw=storage.getItem(userSaveKey(user.id));if(!raw)continue;
 const s=JSON.parse(raw);if(!validSave(s)||![s.totalIncome,s.totalExpense,s.completed,s.sales,s.reputation].every(Number.isFinite))throw Error('存档无效');
 const clients=[...s.projects,...(s.library||[]).filter(p=>p.kind==='客户项目'&&p.status==='已交付')].map(p=>p.client?.trim()).filter(Boolean);
 rows.push({id:user.id,user:user.name,company:s.name,week:Math.min(52,s.week),day:s.day||1,status:s.ended==='bankrupt'?'已破产':s.ended==='victory'?'创业通关':s.ended==='year'?'年度挑战结束':'经营中',income:s.totalIncome,profit:s.totalIncome-s.totalExpense,customers:new Set(clients).size,completed:s.completed,sales:s.sales,reputation:s.reputation});
 }catch{skipped.push(user.name);}}
 rows.sort((a,b)=>b[metric]-a[metric]||a.id.localeCompare(b.id));
 rows.forEach((row,i)=>row.rank=i&&row[metric]===rows[i-1][metric]?rows[i-1].rank:i+1);
 return {rows,skipped,metric};
}
