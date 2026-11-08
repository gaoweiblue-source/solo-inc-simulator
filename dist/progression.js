// Deterministic game rules; salary presets are difficulty settings, not market salary data.
export const SALARY_PRESETS={development:12000,product:12000,operations:9000,sales:10000};
export const MONTH_DAYS=28;
const gameDay=s=>(s.week-1)*7+(s.day||1);
const cents=n=>Math.round(n*100)/100;
export function initJourney(s,salary=SALARY_PRESETS[s.background]){
 if(!Number.isInteger(salary)||salary<3000||salary>50000)throw Error('原月薪请设为 3,000–50,000 元的整数，开局后锁定。');
 s.journey={version:1,salary,startedDay:gameDay(s),months:{},paidProjects:[],unlocked:{},productDays:[],lastSettledDay:gameDay(s)-1,productId:0,salesCarry:0};return s.journey;
}
export function migrateJourney(s){
 if(s.journey)return s.journey;
 const j=initJourney(s);j.legacy=true;
 // Only preserved receipts count. Never invent daily sales from old weekly totals.
 for(const row of s.ledger||[])recordReceipt(s,row.amount,row.note,(row.week-1)*7+(row.day||1));
 for(const p of s.projects||[]){const deposit=(s.ledger||[]).find(r=>r.note===p.title+' · 30% 预付款'&&r.amount===Math.round(p.price*.3));if(deposit)p.depositPaid=deposit.amount;}
 const delivered=(s.library||[]).filter(p=>p.kind==='客户项目'&&p.status==='已交付');
 for(const p of delivered){const rows=s.ledger||[],deposit=rows.find(r=>r.note===p.title+' · 30% 预付款'&&r.amount>0),balance=rows.find(r=>r.note===p.title+' · 70% 尾款'&&r.amount>0);if(deposit&&balance&&!j.paidProjects.some(x=>x.id===p.id))j.paidProjects.push({id:p.id,title:p.title,amount:cents(deposit.amount+balance.amount),day:(balance.week-1)*7+(balance.day||1)});}
 if(s.product===100)s.productLaunchedDay=gameDay(s)-1;
 updateJourney(s);return j;
}
export function recordReceipt(s,amount,note,day=gameDay(s)){
 if(!s.journey)return;
 const business=amount>0||/退预付款/.test(note);if(!business)return;
 const month=Math.floor((day-1)/MONTH_DAYS)+1;
 s.journey.months[month]=cents((s.journey.months[month]||0)+amount);
}
export function productDemand(s){
 const price=s.productPlan?.price,e=s.productEvaluation;
 if(s.product!==100||!Number.isFinite(price)||price<1||!e||e.conversion<60||e.fit<60)return 0;
 // Existing audience supplies self-service traffic; high prices reduce conversion quadratically.
 return Math.max(0,s.reach)/120*(s.productFit/100)*(e.conversion/100)*(.8+Math.max(0,s.reputation)/100)/(1+(price/199)**2);
}
export function journeyStatus(s){
 const j=s.journey,day=Math.min(364,gameDay(s)),month=Math.floor((day-1)/28)+1;
 if(!j)return null;
 const rows=j.productDays.filter(r=>r.productId===j.productId).sort((a,b)=>a.day-b.day);
 let streak=0,last=0;for(const r of rows){streak=r.revenue>0?(r.day===last+1?streak+1:1):0;last=r.day;}
 const end=j.lastSettledDay,window=rows.filter(r=>r.day>end-28&&r.day<=end),recurring=cents(window.reduce((a,r)=>a+r.revenue,0));
 return {month,monthIncome:j.months[month]||0,bestMonth:Math.max(0,...Object.values(j.months)),streak,recurring,consistent:window.length===28&&streak>=28,salary:j.salary,done:Object.keys(j.unlocked).length,next:[1,2,3,4,5].find(i=>!j.unlocked[i])||null};
}
export function updateJourney(s,achievementDay=gameDay(s)){
 const j=s.journey;if(!j)return [];
 const q=journeyStatus(s),conditions=[j.paidProjects.length>0,q.bestMonth>=j.salary,q.streak>=7,q.consistent&&q.recurring>j.salary,q.consistent&&q.recurring>=j.salary*2],earned=[];
 for(let i=1;i<=5;i++){if(!conditions[i-1]&&!j.unlocked[i])break;if(!j.unlocked[i]){j.unlocked[i]={day:achievementDay,value:i===1?j.paidProjects[0].amount:i===2?q.bestMonth:i===3?q.streak:q.recurring};earned.push(i);s.logs.unshift({week:s.week,text:'里程碑达成：'+MILESTONES[i-1].title});}}
 if(j.unlocked[5]&&s.cash>=0&&!s.ended){s.ended='victory';s.pendingEvent=null;}
 return earned;
}
export const MILESTONES=[
 {title:'第一单，真正落袋',desc:'签下一份客户订单，完成全部交付，并收齐预付款与尾款。',hint:'从微信里的旧识开始，了解需求、签约，再去 Agent 完成交付。'},
 {title:'给自己发工资',desc:'任意一个创业月的经营到账达到原月薪。一个月为 28 个游戏日，退款会扣回。',hint:'项目预付款、尾款与产品收入都计入；启动资金不计入。'},
 {title:'让产品自己成交',desc:'同一款产品上线后，连续 7 天每天有无需聊天的自动订单，跑通 MVP。',hint:'转化价值与初始匹配度都须达到 60；继续开发到 100%，用内容增加触达。'},
 {title:'收入不再靠打卡',desc:'同一款产品连续 28 天每天有收入，最近 28 天自动销售到账超过原月薪。',hint:'客户项目收款不计入本阶段。持续做内容、调研，提高自动销量。'},
 {title:'一个人，也能翻倍',desc:'同一款产品连续 28 天每天有收入，最近 28 天自动销售到账达到原月薪的两倍。',hint:'完成前四个里程碑、账户余额非负，即赢得本局。'}
];
export function validJourney(j){
 return j&&j.version===1&&Number.isInteger(j.salary)&&j.salary>=3000&&j.salary<=50000&&Number.isInteger(j.lastSettledDay)&&j.lastSettledDay>=0&&j.lastSettledDay<=364&&Number.isInteger(j.productId)&&j.productId>=0&&Number.isFinite(j.salesCarry)&&j.salesCarry>=0&&j.salesCarry<1&&j.months&&typeof j.months==='object'&&Object.entries(j.months).every(([k,v])=>/^([1-9]|1[0-3])$/.test(k)&&Number.isFinite(v))&&Array.isArray(j.paidProjects)&&j.paidProjects.every(p=>Number.isFinite(p.amount)&&p.amount>0)&&Array.isArray(j.productDays)&&j.productDays.length<=364&&j.productDays.every((r,i)=>Number.isInteger(r.day)&&r.day>0&&r.day<=j.lastSettledDay&&(!i||r.day>j.productDays[i-1].day)&&Number.isInteger(r.productId)&&r.productId>=0&&Number.isInteger(r.count)&&r.count>=0&&Number.isFinite(r.revenue)&&r.revenue>=0)&&j.unlocked&&typeof j.unlocked==='object'&&Object.entries(j.unlocked).every(([k,v])=>/^[1-5]$/.test(k)&&(k==='1'||j.unlocked[Number(k)-1])&&Number.isInteger(v.day)&&v.day>=1&&v.day<=365&&Number.isFinite(v.value));
}
