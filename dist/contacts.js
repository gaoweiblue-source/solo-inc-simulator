export const CONTACTS=[
{id:'coffee-owner',name:'林岚',industry:'餐饮 · 精品咖啡',role:'创始人',company:'山野咖啡',background:'经营两家社区咖啡店，准备开第三家。希望减少顾客反复询问营业时间和菜单的情况，平时亲自处理品牌合作。',need:'品牌展示网站',avatar:'岚',color:'#cfaa79'},
{id:'shop-ops',name:'周晓',industry:'零售 · 生活方式电商',role:'运营负责人',company:'拾物商店',background:'负责日常运营与数据复盘，正为多个平台的数据分散而烦恼。可以推动需求，但采购预算需要与老板确认。',need:'电商数据看板',avatar:'晓',color:'#86b6b0'},
{id:'market-assistant',name:'陈可',industry:'文创 · 线下活动',role:'活动执行',company:'周末市集',background:'刚加入活动团队，负责报名信息收集和供应商联络。下月有一场市集，需要向项目经理汇报外部合作方案。',need:'活动落地页',avatar:'可',color:'#bc9dc8'},
{id:'studio-partner',name:'许宁',industry:'设计 · 创意服务',role:'合伙人',company:'间隙工作室',background:'和朋友一起经营小型设计工作室，客户预约和确认流程占用了大量时间。对长期维护成本比较敏感。',need:'预约流程自动化',avatar:'宁',color:'#a3b57e'},
{id:'tech-product',name:'顾言',industry:'科技 · 企业软件',role:'产品经理',company:'星点科技',background:'负责新产品官网的需求梳理，重视用户路径和交付规范。技术选型与预算审批需要拉上技术负责人共同讨论。',need:'产品官网改版',avatar:'言',color:'#85a7cc'},
{id:'editor-founder',name:'沈知',industry:'内容 · 知识服务',role:'主理人',company:'文字工坊',background:'独立经营一个内容品牌，正在尝试把选题、写作和发布流程标准化。愿意为真正节省时间的工具付费。',need:'内容管理模板',avatar:'知',color:'#c69588'},
{id:'fitness-owner',name:'陆川',industry:'运动 · 健身',role:'工作室老板',company:'跃动健身',background:'经营私教工作室，预约主要靠微信，想减少漏记和撞单。',need:'预约流程自动化',avatar:'川',color:'#a3b57e',ruleId:'studio-partner',templateIndex:3},
{id:'course-ops',name:'唐悦',industry:'教育 · 成人培训',role:'课程运营',company:'知行课堂',background:'负责课程报名与社群，需要汇总活动报名信息，预算由负责人审批。',need:'活动落地页',avatar:'悦',color:'#bc9dc8',ruleId:'market-assistant',templateIndex:2},
{id:'saas-founder',name:'韩舟',industry:'科技 · 小微企业服务',role:'联合创始人',company:'轻舟软件',background:'带小团队做企业工具，希望改进官网上的产品介绍和咨询入口。',need:'产品官网改版',avatar:'舟',color:'#85a7cc',ruleId:'coffee-owner',templateIndex:4},
{id:'brand-editor',name:'苏禾',industry:'消费 · 独立品牌',role:'品牌主理人',company:'禾木生活',background:'自己负责品牌内容，选题和发布记录分散，希望建立清晰的内容流程。',need:'内容管理模板',avatar:'禾',color:'#c69588',ruleId:'editor-founder',templateIndex:5}
];

export const STARTER_NETWORK={
 development:[[4,'一起做过产品上线的前同事'],[3,'合作过界面开发的设计师朋友'],[8,'以前技术社区认识的同行'],[1,'曾经对接数据需求的运营同事'],[6,'大学同学，后来开了健身工作室']],
 product:[[4,'上一家公司一起评审需求的同事'],[1,'以前一起复盘业务数据的运营伙伴'],[8,'产品交流会上认识、保持联系的创业朋友'],[3,'一起做过用户体验项目的设计伙伴'],[5,'曾一起组织读书会的朋友'],[0,'长期光顾的咖啡店老板，平时常聊经营'],[7,'曾合作做用户访谈的课程运营朋友']],
 operations:[[1,'曾一起筹备促销活动的运营同事'],[2,'以前一起执行线下活动的合作伙伴'],[5,'交换过选题和运营经验的内容同行'],[7,'曾一起做社群活动的运营朋友'],[9,'做过联合内容活动的品牌朋友'],[0,'以前办活动时合作过的场地方老板'],[3,'以前制作活动物料时认识的设计伙伴'],[6,'曾一起组织社区运动活动的朋友']],
 sales:[[0,'以前维护过的企业客户，离职后仍有联系'],[1,'过去客户公司的日常业务对接人'],[2,'展会合作时认识、一直保持联系的朋友'],[3,'以前互相介绍过业务的合作伙伴'],[4,'过去参与采购讨论时认识的产品经理'],[5,'以前在商务社群认识的内容创业者'],[6,'老客户介绍认识的健身工作室老板'],[7,'以前合作推广课程的业务伙伴'],[8,'创业交流会上结识的长期商务联系人'],[9,'之前做过联合推广的品牌客户']]
};
export const STARTER_COUNTS=Object.fromEntries(Object.entries(STARTER_NETWORK).map(([k,v])=>[k,v.length]));
