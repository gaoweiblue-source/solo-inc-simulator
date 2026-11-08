const USERS_KEY='solo-inc-users-v1';
export const userSaveKey=id=>'solo-inc-user-'+id+'-save';
export const userModeKey=id=>'solo-inc-user-'+id+'-mode';
export function loadUsers(storage){
 const raw=storage.getItem(USERS_KEY);
 if(raw){const data=JSON.parse(raw);if(!Array.isArray(data.users)||!data.users.length||!data.users.every(u=>typeof u.id==='string'&&/^[a-zA-Z0-9-]+$/.test(u.id)&&typeof u.name==='string'&&u.name.length<=24)||new Set(data.users.map(u=>u.id)).size!==data.users.length||!data.users.some(u=>u.id===data.active))throw Error('用户列表损坏，请保留本地数据');return data;}
 const data={active:'default',users:[{id:'default',name:'默认用户',needsName:!storage.getItem('solo-inc-save-v1')}]};
 // Copy first, publish the registry last. Keep the original save as a backup.
 const old=storage.getItem('solo-inc-save-v1'),mode=storage.getItem('solo-inc-mode');
 if(old&&!storage.getItem(userSaveKey('default')))storage.setItem(userSaveKey('default'),old);
 if(mode&&!storage.getItem(userModeKey('default')))storage.setItem(userModeKey('default'),mode);
 storage.setItem(USERS_KEY,JSON.stringify(data));return data;
}
export function createUser(storage,name){
 name=typeof name==='string'?name.trim():'';if(!name||name.length>24)throw Error('为创业者取个 1–24 字的名字，再出发吧。');
 const data=loadUsers(storage);if(data.users.some(u=>u.name.toLocaleLowerCase()===name.toLocaleLowerCase()))throw Error('已经有一位创业者叫这个名字了，换个名字开启你的故事吧。');
 const user={id:globalThis.crypto.randomUUID(),name};data.users.push(user);storage.setItem(USERS_KEY,JSON.stringify(data));return user;
}
export function activateUser(storage,id){const data=loadUsers(storage);if(!data.users.some(u=>u.id===id))throw Error('用户不存在');data.active=id;storage.setItem(USERS_KEY,JSON.stringify(data));}
export function renameUser(storage,id,name){name=typeof name==='string'?name.trim():'';if(!name||name.length>24)throw Error('为创业者取个 1–24 字的名字，再出发吧。');const data=loadUsers(storage),user=data.users.find(u=>u.id===id);if(!user)throw Error('用户不存在');if(data.users.some(u=>u.id!==id&&u.name.toLocaleLowerCase()===name.toLocaleLowerCase()))throw Error('已经有一位创业者叫这个名字了，换个名字开启你的故事吧。');user.name=name;user.needsName=false;storage.setItem(USERS_KEY,JSON.stringify(data));return user;}

export function chineseNameSuggestions(excluded=[]){
 const surnames=['林','陈','周','苏','沈','许','陆','顾','宋','叶','江','程','唐','温','李','张','王','赵','刘','徐'];
 const given=['知远','清和','景行','予安','书宁','云舒','思齐','嘉言','明轩','亦宁','星禾','一诺','若溪','子墨','沐阳','安然','以辰','念初','望舒','向晚'];
 const blocked=new Set(excluded),pool=surnames.flatMap(a=>given.map(b=>a+b)).filter(n=>!blocked.has(n));
 for(let i=pool.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[pool[i],pool[j]]=[pool[j],pool[i]];}
 return pool.slice(0,6);
}
