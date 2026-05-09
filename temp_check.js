>
const CATEGORY_GROUPS=[
{id:'cs',name:'计算机技术',color:'var(--accent-cyan)',categories:['algorithm','os','network','database','system-design','frontend','language','scenario']},
{id:'general',name:'通用素质',color:'var(--accent-gold)',categories:['general-interview','logical-reasoning','situational']},
{id:'finance',name:'金融财会',color:'var(--accent-orange)',categories:['finance','banking','accounting']},
{id:'law',name:'法律法务',color:'var(--accent-purple)',categories:['law']},
{id:'medical',name:'医疗卫生',color:'var(--difficulty-easy)',categories:['medical']},
{id:'education',name:'教育培训',color:'var(--accent-cyan)',categories:['education']},
{id:'civil',name:'公务员/事业单位',color:'var(--accent-red)',categories:['civil-service']},
{id:'hr',name:'人力资源',color:'var(--accent-gold)',categories:['hr']},
{id:'marketing',name:'市场营销',color:'var(--accent-orange)',categories:['marketing','product','operations']}
];
var PROFESSIONAL_MODES=[
{id:'all',name:'全部模式',icon:'🌐',desc:'查看所有专业分类'},
{id:'cs',name:'计算机技术',icon:'💻',desc:'算法、操作系统、网络、数据库、系统设计、前端、编程语言'},
{id:'finance',name:'金融财会',icon:'🏦',desc:'金融、银行从业、注册会计'},
{id:'law',name:'法律法务',icon:'⚖️',desc:'民法、刑法、商法、劳动法'},
{id:'medical',name:'医疗卫生',icon:'🏥',desc:'临床医学、护理学、药学'},
{id:'education',name:'教育培训',icon:'🎓',desc:'教育学、心理学、教师资格'},
{id:'civil',name:'公务员/事业单位',icon:'🏛️',desc:'行测、申论、结构化面试'},
{id:'hr',name:'人力资源',icon:'👥',desc:'招聘、薪酬、绩效、劳动关系'},
{id:'marketing',name:'市场营销',icon:'📢',desc:'营销策略、品牌管理、产品运营'},
{id:'general',name:'通用面试',icon:'🎯',desc:'自我介绍、职业规划、逻辑推理'}
];
function getProfessionalMode(){return Store.get('professionalMode','all')}
function setProfessionalMode(mode){Store.set('professionalMode',mode);var m=PROFESSIONAL_MODES.find(function(x){return x.id===mode});showToast(m?m.icon+' '+m.name+'模式已切换':'模式已切换');renderPage()}
function getActiveCategories(){var m=getProfessionalMode();if(m==='all')return CATEGORIES.map(function(c){return c.id});var g=CATEGORY_GROUPS.find(function(x){return x.id===m});return g?g.categories:CATEGORIES.map(function(c){return c.id})}
function getActiveQuestions(){var cats=getActiveCategories();return getAllQuestions().filter(function(q){return q&&q.category&&cats.indexOf(q.category)>=0})}
const CATEGORIES=[
{id:'algorithm',name:'算法与数据结构',icon:'i-target',group:'cs'},
{id:'os',name:'操作系统',icon:'i-cpu',group:'cs'},
{id:'network',name:'计算机网络',icon:'i-globe',group:'cs'},
{id:'database',name:'数据库',icon:'i-database',group:'cs'},
{id:'system-design',name:'系统设计',icon:'i-boxes',group:'cs'},
{id:'frontend',name:'前端基础',icon:'i-palette',group:'cs'},
{id:'language',name:'Java/Python',icon:'i-code',group:'cs'},
{id:'scenario',name:'场景设计题',icon:'i-crosshair',group:'cs'},
{id:'general-interview',name:'通用面试',icon:'i-handshake',group:'general'},
{id:'logical-reasoning',name:'逻辑推理',icon:'i-brain',group:'general'},
{id:'situational',name:'情景模拟',icon:'i-crosshair',group:'general'},
{id:'finance',name:'金融财会',icon:'i-trending',group:'finance'},
{id:'banking',name:'银行从业',icon:'i-trending',group:'finance'},
{id:'accounting',name:'注册会计',icon:'i-trending',group:'finance'},
{id:'law',name:'法律法务',icon:'i-shield',group:'law'},
{id:'medical',name:'医疗卫生',icon:'i-heart',group:'medical'},
{id:'education',name:'教育培训',icon:'i-graduation',group:'education'},
{id:'civil-service',name:'公务员行测',icon:'i-flag',group:'civil'},
{id:'hr',name:'人力资源',icon:'i-users',group:'hr'},
{id:'marketing',name:'市场营销',icon:'i-megaphone',group:'marketing'},
{id:'product',name:'产品经理',icon:'i-boxes',group:'marketing'},
{id:'operations',name:'运营',icon:'i-megaphone',group:'marketing'}
];
const Q_TYPES={
single:{id:'single',name:'单选题',icon:'i-check-circle'},
multi:{id:'multi',name:'多选题',icon:'i-check'},
short:{id:'short',name:'简答题',icon:'i-edit'},
case_analysis:{id:'case_analysis',name:'案例分析',icon:'i-crosshair'},
code:{id:'code',name:'编程题',icon:'i-code'},
judgment:{id:'judgment',name:'判断题',icon:'i-target'}
};
const Q_TYPE_MAP={};Object.values(Q_TYPES).forEach(t=>Q_TYPE_MAP[t.id]=t.name);
const LANG={};let currentLang='zh';
function t(key){return LANG[currentLang]?.[key]||LANG['zh']?.[key]||key}
function setLang(lang){currentLang=lang;Store.set('lang',lang);renderPage()}
let _dataLoaded=false;
function _fillQuestionData(allData){
if(!allData||!allData.length)return false;
var computerCats=new Set(['algorithm','os','network','database','system-design','frontend','language','scenario']);
MULTI_DISCIPLINE_QUESTIONS.length=0;
BUILTIN_QUESTIONS.length=0;
allData.forEach(function(q){
if(q&&q.category&&computerCats.has(q.category))BUILTIN_QUESTIONS.push(Object.assign({},q,{sourceType:'builtin',type:q.type||'code'}));
else if(q&&q.category)MULTI_DISCIPLINE_QUESTIONS.push(Object.assign({},q,{sourceType:'builtin',type:q.type||'short'}));
});
_allQCache=null;
return true;
}
async function loadQuestionData(){
if(_dataLoaded)return true;
var allData=[];
try{
if(typeof QUESTIONS_DATA!=='undefined'&&Array.isArray(QUESTIONS_DATA)&&QUESTIONS_DATA.length>0)allData=allData.concat(QUESTIONS_DATA);
if(typeof MULTI_DISCIPLINE_DATA!=='undefined'&&Array.isArray(MULTI_DISCIPLINE_DATA)&&MULTI_DISCIPLINE_DATA.length>0)allData=allData.concat(MULTI_DISCIPLINE_DATA);
if(allData.length>0){_fillQuestionData(allData);try{await saveQuestionsToDB(allData)}catch(e){}_dataLoaded=true;return true}
}catch(e){console.warn('从script变量加载失败',e)}
try{
var isMobile=window.innerWidth<=768;
var sources=isMobile?['data/questions.json']:['data/questions.json','data/builtin.json','data/multi_discipline.json'];
allData=[];
for(var si=0;si<sources.length;si++){
try{
var r=await fetch(sources[si]);
if(r.ok){var d=await r.json();if(Array.isArray(d))allData=allData.concat(d)}
}catch(ex){console.warn('加载'+sources[si]+'失败',ex)}
}
if(allData.length===0){
try{
var dbData=await loadQuestionsFromDB();
if(dbData&&dbData.length)allData=dbData;
}catch(ex2){console.warn('IndexedDB加载失败',ex2)}
}
if(allData.length>0){
var computerCats=new Set(['algorithm','os','network','database','system-design','frontend','language','scenario']);
MULTI_DISCIPLINE_QUESTIONS.length=0;
BUILTIN_QUESTIONS.length=0;
allData.forEach(function(q){
if(computerCats.has(q.category))BUILTIN_QUESTIONS.push(Object.assign({},q,{sourceType:'builtin',type:q.type||'code'}));
else MULTI_DISCIPLINE_QUESTIONS.push(Object.assign({},q,{sourceType:'builtin',type:q.type||'short'}));
});
try{await saveQuestionsToDB(allData)}catch(e){}
_dataLoaded=true;
_allQCache=null;
return true;
}
_dataLoaded=true;
return false;
}catch(e){
console.warn('数据加载失败',e);
try{
var dbData2=await loadQuestionsFromDB();
if(dbData2&&dbData2.length){
var computerCats2=new Set(['algorithm','os','network','database','system-design','frontend','language','scenario']);
MULTI_DISCIPLINE_QUESTIONS.length=0;
BUILTIN_QUESTIONS.length=0;
dbData2.forEach(function(q){
if(computerCats2.has(q.category))BUILTIN_QUESTIONS.push(Object.assign({},q,{sourceType:'builtin',type:q.type||'code'}));
else MULTI_DISCIPLINE_QUESTIONS.push(Object.assign({},q,{sourceType:'builtin',type:q.type||'short'}));
});
_allQCache=null;
}
}catch(ex3){}
_dataLoaded=true;
return false;
}
}
const MULTI_DISCIPLINE_QUESTIONS=[];

const CATEGORY_MAP={};CATEGORIES.forEach(c=>CATEGORY_MAP[c.id]=c.name);
const DIFF_LABELS={easy:'简单',medium:'中等',hard:'困难'};
const ACHIEVEMENT_DEFS=[
{id:'first-question',name:'初出茅庐',icon:'i-sprout',desc:'完成第一道题目',title:'萌新'},
{id:'ten-questions',name:'小试牛刀',icon:'i-star',desc:'掌握10道题目',title:'学徒'},
{id:'fifty-questions',name:'渐入佳境',icon:'i-target',desc:'掌握50道题目',title:'熟手'},
{id:'hundred-questions',name:'题海无涯',icon:'i-trophy',desc:'掌握100道题目',title:'大师'},
{id:'streak-3',name:'三日坚持',icon:'i-fire',desc:'连续打卡3天',title:'坚持者'},
{id:'streak-7',name:'周周坚持',icon:'i-zap',desc:'连续打卡7天',title:'铁人'},
{id:'streak-30',name:'月度达人',icon:'i-crown',desc:'连续打卡30天',title:'传奇'},
{id:'collector',name:'收藏家',icon:'i-bookmark',desc:'收藏10道题目',title:'珍品猎人'},
{id:'contributor',name:'贡献者',icon:'i-handshake',desc:'收录5道题目',title:'题库建设者'},
{id:'all-categories',name:'全能选手',icon:'i-medal',desc:'每个分类至少掌握1题',title:'六边形战士'},
{id:'wrong-book-5',name:'知错能改',icon:'i-refresh',desc:'错题本积累5道题',title:'反思者'},
{id:'wrong-book-20',name:'百折不挠',icon:'i-shield',desc:'错题本积累20道题',title:'钢铁意志'},
{id:'correct-50',name:'精准射手',icon:'i-target',desc:'答对50道题',title:'神枪手'},
{id:'correct-200',name:'百发百中',icon:'i-award',desc:'答对200道题',title:'SQL收割机'}
];
const CN_EN_MAP={'数据库':'database','操作系统':'os','计算机网络':'network','编程语言':'language','算法':'algorithm','数据结构':'algorithm','系统设计':'scenario','数据库原理':'database','查询优化':'database','索引':'database','事务':'database','并发':'os','锁':'database','Redis':'database','MySQL':'database','SQL':'database','Java':'language','Python':'language','Go':'language','JVM':'language','GC':'language','多线程':'language','集合框架':'language','GIL':'language','HTTP':'network','TCP':'network','UDP':'network','DNS':'network','HTTPS':'network','Socket':'network','进程':'os','线程':'os','内存管理':'os','调度':'os','排序':'algorithm','动态规划':'algorithm','贪心':'algorithm','二叉树':'algorithm','链表':'algorithm','哈希':'algorithm','堆':'algorithm','图':'algorithm','微服务':'scenario','分布式':'scenario','缓存':'scenario','消息队列':'scenario','负载均衡':'scenario','金融':'finance','会计':'finance','银行':'banking','证券':'finance','法律':'law','合同':'law','劳动法':'law','刑法':'law','医学':'medical','临床':'medical','药学':'medical','教育':'education','教学':'education','公务员':'civil-service','行测':'logical-reasoning','人力资源':'hr','招聘':'hr','薪酬':'hr','营销':'marketing','品牌':'marketing','数字营销':'marketing','自我介绍':'general-interview','职业规划':'general-interview','面试':'general-interview','逻辑':'logical-reasoning','推理':'logical-reasoning','产品':'product','运营':'operations','注册会计':'accounting','CPA':'accounting'};
const KW_MAP={'索引':['B+树','索引优化'],'事务':['ACID','隔离级别'],'MVCC':['版本控制','ReadView'],'锁':['行锁','间隙锁'],'Redis':['缓存','持久化'],'SQL':['查询优化','执行计划'],'HTTP':['请求响应','状态码'],'TCP':['三次握手','可靠传输'],'UDP':['无连接','数据报'],'DNS':['域名解析','缓存'],'进程':['调度','PCB'],'线程':['并发','同步'],'内存':['虚拟内存','分页'],'GC':['垃圾回收','标记清除'],'JVM':['类加载','内存模型'],'HashMap':['哈希表','红黑树'],'多线程':['锁','AQS'],'GIL':['全局锁','多进程'],'排序':['时间复杂度','稳定性'],'动态规划':['状态转移','最优子结构'],'二叉树':['遍历','深度'],'链表':['指针','反转'],'微服务':['服务治理','API网关'],'分布式':['一致性','CAP'],'消息队列':['异步','解耦'],'缓存':['穿透','击穿'],'统计信息':['查询优化','执行计划'],'Statistics':['查询优化','执行计划']};
function dedupTags(tags){if(!tags||!tags.length)return[];const seen=new Set();const result=[];for(const t of tags){const lower=t.toLowerCase();if(seen.has(lower))continue;let isDup=false;for(const s of seen){if(CN_EN_MAP[s]===lower||CN_EN_MAP[lower]===s||Object.entries(CN_EN_MAP).some(([cn,en])=>(cn===s&&en===lower)||(en===s&&cn===lower))){isDup=true;break}}if(!isDup){seen.add(lower);result.push(t)}}return result.slice(0,3)}
function genTags(q){const catName=CATEGORY_MAP[q.category]||q.category;const title=q.title||'';const tagSet=new Set([catName]);if(q.tags&&q.tags.length)q.tags.forEach(t=>tagSet.add(t));for(const[kw,tags]of Object.entries(KW_MAP)){if(title.includes(kw)){tags.forEach(t=>tagSet.add(t));break}}return dedupTags([...tagSet])}
function svgIcon(id,cls='icon'){return`<svg class="${cls}"><use href="#${id}"/></svg>`}
function escapeHtml(str){if(!str)return'';return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#039;')}

const BUILTIN_QUESTIONS=[];

const KEYWORD_CATEGORY_MAP={
algorithm:['数组','链表','树','排序','二叉树','动态规划','递归','哈希','栈','队列','图','算法','遍历','搜索','回溯','贪心','分治','双指针','滑动窗口','前缀和','并查集','拓扑排序','最短路径','二分查找','字符串匹配','字典树','线段树','单调栈','位运算','数学'],
os:['进程','线程','内存','死锁','调度','虚拟内存','文件系统','信号量','操作系统','内核','中断','系统调用','上下文切换','页面置换','管道','shell','fork','协程','并发','并行','同步','互斥','临界区','用户态','内核态'],
network:['TCP','UDP','HTTP','HTTPS','DNS','IP','三次握手','四次挥手','Socket','OSI','网络','协议','路由','CDN','代理','NAT','WebSocket','RESTful','RPC','跨域','CORS','Cookie','Session','Token','请求','响应','状态码'],
database:['SQL','索引','事务','MySQL','Redis','范式','主键','外键','锁','MVCC','数据库','存储','查询','分库','分表','主从','读写分离','B树','B+树','哈希索引','聚簇索引','覆盖索引','慢查询','ACID','隔离级别','脏读','幻读'],
'system-design':['分布式','缓存','消息队列','负载均衡','微服务','高可用','限流','熔断','降级','系统设计','架构','CAP','BASE','一致性','幂等','服务发现','配置中心','网关','链路追踪','容灾','灰度发布','容器','K8s','Docker'],
frontend:['DOM','CSS','JavaScript','React','Vue','浏览器','渲染','事件循环','Webpack','前端','组件','状态管理','路由','虚拟DOM','Diff','Hooks','TypeScript','Babel','SSR','PWA','Service Worker','Canvas','SVG','动画','响应式','Flex','Grid'],
language:['Java','Python','JVM','GC','Spring','MyBatis','GIL','装饰器','生成器','迭代器','类加载','反射','注解','泛型','集合','多线程','并发','锁','异常','IO','NIO','序列化','lambda','协程','异步','闭包'],
scenario:['场景','设计一个','实现一个','如何设计','架构设计','系统设计','Feed','推荐','搜索','支付','IM','爬虫','配置中心','网关','调度','日志','监控','协同','编辑器','电商','社交','直播']
};

const DIFFICULTY_KEYWORDS={
hard:['实现','手写','设计一个','架构','从零','完整','高并发','分布式','海量','大规模','亿级'],
easy:['什么是','解释','区别','简述','描述','列举','说出','定义','概念','基本']
};

const Store={
_cache:{},
get(k,d){if(this._cache[k]!==undefined)return this._cache[k];try{const v=localStorage.getItem('ci_'+k);const r=v?JSON.parse(v):d;this._cache[k]=r;return r}catch{return d}},
set(k,v){this._cache[k]=v;try{localStorage.setItem('ci_'+k,JSON.stringify(v))}catch(e){console.warn('Storage full',e)}},
getMastered(){return this.get('mastered',[])},setMastered(v){this.set('mastered',v)},
getFavorites(){return this.get('favorites',[])},setFavorites(v){this.set('favorites',v)},
getCollected(){return this.get('collected',[])},setCollected(v){this.set('collected',v)},
getSources(){return this.get('sources',DEFAULT_SOURCES)},setSources(v){this.set('sources',v)},
getCheckins(){return this.get('checkins',[])},setCheckins(v){this.set('checkins',v)},
getAchievements(){return this.get('achievements',[])},setAchievements(v){this.set('achievements',v)},
getTodayCount(){const t=new Date().toDateString();return this.getMastered().filter(id=>{const m=this.get('m_meta_'+id,null);return m&&new Date(m.date).toDateString()===t}).length},
getStreak(){const c=this.getCheckins();if(!c.length)return 0;let s=0;const t=new Date();for(let i=0;i<365;i++){const d=new Date(t);d.setDate(d.getDate()-i);if(c.includes(d.toDateString()))s++;else if(i>0)break}return s},
checkin(){const c=this.getCheckins();const t=new Date().toDateString();if(!c.includes(t)){c.push(t);this.setCheckins(c);this.checkAchievements()}},
toggleMastered(id){const m=this.getMastered();const i=m.indexOf(id);if(i>=0){m.splice(i,1)}else{m.push(id);this.set('m_meta_'+id,{date:new Date().toISOString()});this.checkin();const today=new Date().toDateString();const h=this.getMasteredHistory();h[today]=(h[today]||0)+1;this.set('masteredHistory',h)}this.setMastered(m);this.checkAchievements()},
toggleFavorite(id){const f=this.getFavorites();const i=f.indexOf(id);if(i>=0)f.splice(i,1);else f.push(id);this.setFavorites(f)},
addCollected(qs){const c=this.getCollected();qs.forEach(q=>{q.id=q.id||('col-'+Date.now()+'-'+Math.random().toString(36).substr(2,5));q.collectedAt=new Date().toISOString();q.source=q.source||'手动添加';c.push(q)});this.setCollected(c);invalidateQuestionsCache();return qs},
getTheme(){return this.get('theme','dark')},setTheme(v){this.set('theme',v)},
getMasteredHistory(){return this.get('masteredHistory',{})},
getFirstVisit(){return this.get('firstVisit',true)},setFirstVisit(v){this.set('firstVisit',v)},
getNotes(){return this.get('notes',{})},setNotes(v){this.set('notes',v)},
getNote(qid){const n=this.getNotes();return n[qid]||''},setNote(qid,text){const n=this.getNotes();n[qid]=text;this.setNotes(n)},
getStudyPlan(){return this.get('studyPlan',null)},setStudyPlan(v){this.set('studyPlan',v)},
getWrongBook(){return this.get('wrongBook',[])},setWrongBook(v){this.set('wrongBook',v)},
addWrong(qid,userAnswer){const w=this.getWrongBook();const exist=w.find(x=>x.qid===qid);if(exist){exist.count=(exist.count||1)+1;exist.lastAt=new Date().toISOString();exist.lastAnswer=userAnswer||'';exist.reviewed=false}else{w.push({qid,firstAt:new Date().toISOString(),lastAt:new Date().toISOString(),count:1,lastAnswer:userAnswer||'',reviewed:false})}this.setWrongBook(w);this.checkAchievements()},
removeWrong(qid){const w=this.getWrongBook().filter(x=>x.qid!==qid);this.setWrongBook(w)},
markWrongReviewed(qid){const w=this.getWrongBook();const item=w.find(x=>x.qid===qid);if(item){item.reviewed=true;item.reviewedAt=new Date().toISOString();this.setWrongBook(w)}},
getReviewSchedule(){return this.get('reviewSchedule',{})},
setReviewSchedule(v){this.set('reviewSchedule',v)},
scheduleReview(qid,level){
const schedule=this.getReviewSchedule();
const intervals=[1,3,7,14,30,60];
const nextDays=intervals[Math.min(level||0,intervals.length-1)];
const nextDate=new Date();
nextDate.setDate(nextDate.getDate()+nextDays);
schedule[qid]={level:level||0,nextReview:nextDate.toISOString(),createdAt:new Date().toISOString()};
this.setReviewSchedule(schedule);
},
getDueReviews(){
const schedule=this.getReviewSchedule();
const now=new Date().toISOString();
return Object.entries(schedule).filter(([qid,data])=>data.nextReview<=now).map(([qid])=>qid);
},
getReviewStats(){
const schedule=this.getReviewSchedule();
const total=Object.keys(schedule).length;
const due=this.getDueReviews().length;
const levels={0:0,1:0,2:0,3:0,4:0,5:0};
Object.values(schedule).forEach(d=>{levels[d.level||0]=(levels[d.level||0]||0)+1});
return{total,due,levels};
},
getCorrectCount(){return this.get('correctCount',0)},addCorrect(){this.set('correctCount',this.getCorrectCount()+1);this.checkAchievements()},
getTotalAttempts(){return this.get('totalAttempts',0)},addAttempt(){this.set('totalAttempts',this.getTotalAttempts()+1)},
getStudyTime(){return this.get('studyTime',0)},addStudyTime(ms){this.set('studyTime',this.getStudyTime()+ms)},
getSoundEnabled(){return this.get('soundEnabled',true)},setSoundEnabled(v){this.set('soundEnabled',v)},
checkAchievements(){
const achievements=this.getAchievements();
const mastered=this.getMastered();
const masteredSet=new Set(mastered);
const checkins=this.getCheckins();
const streak=this.getStreak();
const allQ=getAllQuestions();
const masteredCats=new Set();allQ.forEach(q=>{if(masteredSet.has(q.id))masteredCats.add(q.category)});
const newAchievements=[];
const checks={
'first-question':()=>mastered.length>=1,
'ten-questions':()=>mastered.length>=10,
'fifty-questions':()=>mastered.length>=50,
'hundred-questions':()=>mastered.length>=100,
'streak-3':()=>streak>=3,
'streak-7':()=>streak>=7,
'streak-30':()=>streak>=30,
'collector':()=>this.getFavorites().length>=10,
'contributor':()=>this.getCollected().length>=5,
'all-categories':()=>CATEGORIES.every(c=>masteredCats.has(c.id)),
'wrong-book-5':()=>this.getWrongBook().length>=5,
'wrong-book-20':()=>this.getWrongBook().length>=20,
'correct-50':()=>this.getCorrectCount()>=50,
'correct-200':()=>this.getCorrectCount()>=200
};
ACHIEVEMENT_DEFS.forEach(def=>{
if(!achievements.find(a=>a.id===def.id)&&checks[def.id]&&checks[def.id]()){
const achievement={...def,unlockedAt:new Date().toISOString()};
achievements.push(achievement);
newAchievements.push(achievement);
}
});
if(newAchievements.length){
this.setAchievements(achievements);
setTimeout(()=>{newAchievements.forEach(a=>toast(`${svgIcon('i-trophy','icon-sm')} 成就解锁：${a.name}`,'success'))},500);
}
}
};

let _allQCache=null;let _allQCacheKey='';
const LC_ANSWER_MAP={
'Array':['使用数组存储数据，注意下标从0开始','考虑双指针技巧：左右指针、快慢指针','注意数组越界和空数组边界情况','排序后使用双指针可解决多数两数/三数之和问题'],
'Hash Table':['使用哈希表实现O(1)查找','注意哈希冲突处理','考虑使用Map代替Object以保留插入顺序','双指针+哈希表是常见组合'],
'Two Pointers':['排序数组优先考虑双指针','左右指针从两端向中间收缩','快慢指针用于链表找中点或环','滑动窗口是双指针的常见应用'],
'Sliding Window':['维护一个满足条件的窗口','右指针扩展窗口，左指针收缩窗口','记录窗口内的关键信息（如字符计数）','适用于子串/子数组的连续区间问题'],
'Linked List':['使用虚拟头节点简化边界处理','快慢指针找中点和环','注意链表操作时的指针顺序','递归和迭代各有优劣'],
'Stack':['后进先出(LIFO)特性适合匹配问题','单调栈解决下一个更大元素','用栈模拟递归过程','注意栈溢出问题'],
'Queue':['先进先出(FIFO)适合BFS','双端队列处理滑动窗口最大值','优先队列(堆)处理TopK问题','单调队列优化DP'],
'Dynamic Programming':['定义状态：dp[i]表示什么','找状态转移方程：dp[i]与dp[i-1]的关系','确定初始条件和边界','考虑空间优化：滚动数组'],
'Binary Search':['前提：数组有序或具有单调性','注意左右边界和循环条件','找第一个/最后一个满足条件的位置','注意整数溢出：mid=left+(right-left)/2'],
'Backtracking':['画出递归树理解状态空间','先写终止条件，再写递归逻辑','注意剪枝优化','恢复现场（撤销选择）是关键'],
'Greedy':['贪心选择性质：局部最优→全局最优','需要证明贪心策略的正确性','排序+贪心是常见组合','区间问题通常按端点排序'],
'DFS':['递归实现DFS注意栈溢出','标记已访问节点避免重复','回溯是DFS的一种应用','注意递归深度和剪枝'],
'BFS':['使用队列实现层序遍历','适合求最短路径/最少步数','注意标记已访问节点','双向BFS可优化搜索'],
'Tree':['递归是树问题的天然解法','前中后序遍历各有应用','层序遍历用BFS','注意空节点和边界处理'],
'Binary Search Tree':['中序遍历BST得到有序序列','左<根<右的性质可用于搜索','验证BST需传递上下界','第K小问题用中序遍历'],
'Graph':['邻接表vs邻接矩阵的选择','BFS求最短路径，DFS求连通性','并查集处理连通分量','拓扑排序检测环'],
'Heap':['TopK问题用堆','小顶堆求前K大，大顶堆求前K小','堆排序时间O(nlogn)','Java用PriorityQueue，C++用priority_queue'],
'String':['双指针处理回文和反转','KMP算法匹配子串','滑动窗口处理子串问题','注意字符编码和空字符串'],
'Math':['注意整数溢出','取模运算的性质','位运算技巧','GCD/LCM等数论基础'],
'Recursion':['明确递归终止条件','信任递归返回值','注意重复计算→加记忆化','尾递归优化'],
'Divide and Conquer':['分解为子问题','递归求解子问题','合并子问题结果','主定理分析时间复杂度'],
'Trie':['前缀树适合字符串搜索','插入和查询都是O(字符串长度)','空间换时间的数据结构','注意节点结构设计'],
'Union Find':['并查集处理连通性问题','路径压缩+按秩合并接近O(1)','适合判断图中的环','动态连通性问题首选'],
'Memoization':['记忆化搜索=DFS+缓存','避免重复计算相同子问题','与DP等价但实现更直观','注意缓存键的设计'],
'Bit Manipulation':['异或：相同为0，不同为1','与运算取特定位','移位运算代替乘除','n&(n-1)消除最低位的1'],
'Segment Tree':['线段树适合区间查询和更新','建树O(n)，查询和更新O(logn)','懒标记处理区间更新','适合RMQ和区间求和'],
'Monotonic Stack':['单调递增栈找下一个更小元素','单调递减栈找下一个更大元素','入栈时弹出的元素就是答案','O(n)时间解决NGE问题'],
'Sorting':['快排平均O(nlogn)，最坏O(n²)','归并排序稳定O(nlogn)','堆排序O(nlogn)但不稳定','计数排序O(n)但空间大'],
'Greedy+Sorting':['排序后贪心是经典组合','按开始/结束时间排序处理区间','按权重排序处理背包','证明贪心正确性是关键'],
'Design':['明确数据结构需求','考虑操作的时间复杂度','注意并发和线程安全','LRU/LFUCache是经典设计题']
};
const LC_TAG_CN={'Array':'数组','Hash Table':'哈希表','Two Pointers':'双指针','Sliding Window':'滑动窗口','Linked List':'链表','Stack':'栈','Queue':'队列','Dynamic Programming':'动态规划','Binary Search':'二分查找','Backtracking':'回溯','Greedy':'贪心','DFS':'深度优先搜索','BFS':'广度优先搜索','Tree':'树','Binary Search Tree':'二叉搜索树','Graph':'图','Heap':'堆','String':'字符串','Math':'数学','Recursion':'递归','Divide and Conquer':'分治','Trie':'前缀树','Union Find':'并查集','Memoization':'记忆化','Bit Manipulation':'位运算','Segment Tree':'线段树','Monotonic Stack':'单调栈','Sorting':'排序','Design':'设计'};
function generateLCAnswer(q){
if(!q.tags||!q.tags.length)return'请前往LeetCode查看详细题解。';
const lcNum=q.title.match(/LC(\d+)/);
const lcLink=lcNum?`https://leetcode.cn/problems/${getLCSlug(parseInt(lcNum[1]))}/`:'';
const tagHints=q.tags.map(t=>LC_ANSWER_MAP[t]).filter(Boolean);
const cnTags=q.tags.map(t=>LC_TAG_CN[t]||t);
let ans='';
if(lcLink)ans+=`题目链接：${lcLink}\n\n`;
ans+=`相关标签：${cnTags.join('、')}\n\n`;
ans+=`解题思路：\n`;
if(tagHints.length){
const used=new Set();
tagHints.forEach(hints=>{
hints.forEach(h=>{if(!used.has(h)){used.add(h);ans+=`▸ ${h}\n`}});
});
}else{
ans+=`▸ 先理解题意，考虑暴力解法\n▸ 分析时间空间复杂度\n▸ 寻找优化方向\n▸ 注意边界条件\n`;
}
ans+=`\n建议在LeetCode上提交代码验证，查看官方题解和讨论区获取更多思路。`;
return ans;
}
function getLCSlug(num){
const slugs={1:'two-sum',2:'add-two-numbers',3:'longest-substring-without-repeating-characters',4:'median-of-two-sorted-arrays',5:'longest-palindromic-substring',6:'zigzag-conversion',7:'reverse-integer',8:'string-to-integer-atoi',9:'palindrome-number',10:'regular-expression-matching',11:'container-with-most-water',12:'integer-to-roman',13:'roman-to-integer',14:'longest-common-prefix',15:'3sum',16:'3sum-closest',17:'letter-combinations-of-a-phone-number',18:'4sum',19:'remove-nth-node-from-end-of-list',20:'valid-parentheses',21:'merge-two-sorted-lists',22:'generate-parentheses',23:'merge-k-sorted-lists',24:'swap-nodes-in-pairs',25:'reverse-nodes-in-k-group',26:'remove-duplicates-from-sorted-array',27:'remove-element',28:'find-the-index-of-the-first-occurrence-in-a-string',29:'divide-two-integers',30:'substring-with-concatenation-of-all-words',31:'next-permutation',32:'longest-valid-parentheses',33:'search-in-rotated-sorted-array',34:'find-first-and-last-position-of-element-in-sorted-array',35:'search-insert-position',36:'valid-sudoku',37:'sudoku-solver',38:'count-and-say',39:'combination-sum',40:'combination-sum-ii',41:'first-missing-positive',42:'trapping-rain-water',43:'multiply-strings',44:'wildcard-matching',45:'jump-game-ii',46:'permutations',47:'permutations-ii',48:'rotate-image',49:'group-anagrams',50:'powx-n',51:'n-queens',52:'n-queens-ii',53:'maximum-subarray',54:'spiral-matrix',55:'jump-game',56:'merge-intervals',57:'insert-interval',58:'length-of-last-word',59:'spiral-matrix-ii',60:'permutation-sequence',61:'rotate-list',62:'unique-paths',63:'unique-paths-ii',64:'minimum-path-sum',65:'valid-number',66:'plus-one',67:'add-binary',68:'text-justification',69:'sqrtx',70:'climbing-stairs',71:'simplify-path',72:'edit-distance',73:'set-matrix-zeroes',74:'search-a-2d-matrix',75:'sort-colors',76:'minimum-window-substring',77:'combinations',78:'subsets',79:'word-search',80:'remove-duplicates-from-sorted-array-ii',83:'remove-duplicates-from-sorted-list',84:'largest-rectangle-in-histogram',85:'maximal-rectangle',86:'partition-list',88:'merge-sorted-array',90:'subsets-ii',91:'decode-ways',92:'reverse-linked-list-ii',93:'restore-ip-addresses',94:'binary-tree-inorder-traversal',95:'unique-binary-search-trees-ii',96:'unique-binary-search-trees',97:'interleaving-string',98:'validate-binary-search-tree',99:'recover-binary-search-tree',100:'same-tree',101:'symmetric-tree',102:'binary-tree-level-order-traversal',103:'binary-tree-zigzag-level-order-traversal',104:'maximum-depth-of-binary-tree',105:'construct-binary-tree-from-preorder-and-inorder-traversal',106:'construct-binary-tree-from-inorder-and-postorder-traversal',107:'binary-tree-level-order-traversal-ii',108:'convert-sorted-array-to-binary-search-tree',109:'convert-sorted-list-to-binary-search-tree',110:'balanced-binary-tree',111:'minimum-depth-of-binary-tree',112:'path-sum',113:'path-sum-ii',114:'flatten-binary-tree-to-linked-list',115:'distinct-subsequences',116:'populating-next-right-pointers-in-each-node',117:'populating-next-right-pointers-in-each-node-ii',118:'pascals-triangle',119:'pascals-triangle-ii',120:'triangle',121:'best-time-to-buy-and-sell-stock',122:'best-time-to-buy-and-sell-stock-ii',123:'best-time-to-buy-and-sell-stock-iii',124:'binary-tree-maximum-path-sum',125:'valid-palindrome',126:'word-ladder-ii',127:'word-ladder',128:'longest-consecutive-sequence',129:'sum-root-to-leaf-numbers',130:'surrounded-regions',131:'palindrome-partitioning',132:'palindrome-partitioning-ii',133:'clone-graph',134:'gas-station',135:'candy',136:'single-number',137:'single-number-ii',138:'copy-list-with-random-pointer',139:'word-break',140:'word-break-ii',141:'linked-list-cycle',142:'linked-list-cycle-ii',143:'reorder-list',144:'binary-tree-preorder-traversal',145:'binary-tree-postorder-traversal',146:'lru-cache',147:'insertion-sort-list',148:'sort-list',149:'max-points-on-a-line',150:'evaluate-reverse-polish-notation',151:'reverse-words-in-a-string',152:'maximum-product-subarray',153:'find-minimum-in-rotated-sorted-array',154:'find-minimum-in-rotated-sorted-array-ii',155:'min-stack',160:'intersection-of-two-linked-lists',162:'find-peak-element',164:'maximum-gap',165:'compare-version-numbers',166:'fraction-to-recurring-decimal',167:'two-sum-ii-input-array-is-sorted',168:'excel-sheet-column-title',169:'majority-element',170:'two-sum-iii-data-structure-design',171:'excel-sheet-column-number',172:'factorial-trailing-zeroes',173:'binary-search-tree-iterator',174:'dungeon-game',179:'largest-number',186:'reverse-words-in-a-string-ii',187:'repeated-dna-sequences',188:'best-time-to-buy-and-sell-stock-iv',189:'rotate-array',190:'reverse-bits',191:'number-of-1-bits',198:'house-robber',199:'binary-tree-right-side-view',200:'number-of-islands',201:'bitwise-and-of-numbers-range',202:'happy-number',203:'remove-linked-list-elements',204:'count-primes',205:'isomorphic-strings',206:'reverse-linked-list',207:'course-schedule',208:'implement-trie-prefix-tree',209:'minimum-size-subarray-sum',210:'course-schedule-ii',211:'design-add-and-search-words-data-structure',212:'word-search-ii',213:'house-robber-ii',214:'shortest-palindrome',215:'kth-largest-element-in-an-array',216:'combination-sum-iii',217:'contains-duplicate',218:'the-skyline-problem',219:'contains-duplicate-ii',220:'contains-duplicate-iii',221:'maximal-square',222:'count-complete-tree-nodes',223:'rectangle-area',224:'basic-calculator',225:'implement-stack-using-queues',226:'invert-binary-tree',227:'basic-calculator-ii',228:'summary-ranges',229:'majority-element-ii',230:'kth-smallest-element-in-a-bst',231:'power-of-two',232:'implement-queue-using-stacks',233:'number-of-digit-one',234:'palindrome-linked-list',235:'lowest-common-ancestor-of-a-binary-search-tree',236:'lowest-common-ancestor-of-a-binary-tree',237:'delete-node-in-a-linked-list',238:'product-of-array-except-self',239:'sliding-window-maximum',240:'search-a-2d-matrix-ii',241:'different-ways-to-add-parentheses',242:'valid-anagram',257:'binary-tree-paths',258:'add-digits',260:'single-number-iii',261:'graph-valid-tree',263:'ugly-number',264:'ugly-number-ii',268:'missing-number',269:'alien-dictionary',270:'closest-binary-search-tree-value',271:'encode-and-decode-strings',273:'integer-to-english-words',274:'h-index',275:'h-index-ii',278:'first-bad-version',279:'perfect-squares',280:'wiggle-sort',281:'zigzag-iterator',282:'expression-add-operators',283:'move-zeroes',284:'peeking-iterator',285:'inorder-successor-in-bst',286:'walls-and-gates',287:'find-the-duplicate-number',288:'unique-word-abbreviation',289:'game-of-life',290:'word-pattern',291:'word-pattern-ii',292:'nim-game',293:'flip-game',295:'find-median-from-data-stream',296:'best-meeting-point',297:'serialize-and-deserialize-binary-tree',298:'binary-tree-longest-consecutive-sequence',299:'bulls-and-cows',300:'longest-increasing-subsequence',301:'remove-invalid-parentheses',303:'range-sum-query-immutable',304:'range-sum-query-2d-immutable',306:'additive-number',307:'range-sum-query-mutable',309:'best-time-to-buy-and-sell-stock-with-cooldown',310:'minimum-height-trees',312:'burst-balloons',313:'super-ugly-number',315:'count-of-smaller-numbers-after-self',316:'remove-duplicate-letters',318:'maximum-product-of-word-lengths',319:'bulb-switcher',322:'coin-change',323:'number-of-connected-components-in-an-undirected-graph',324:'wiggle-sort-ii',326:'power-of-three',328:'odd-even-linked-list',329:'longest-increasing-path-in-a-matrix',330:'patching-array',331:'verify-preorder-serialization-of-a-binary-tree',332:'reconstruct-itinerary',334:'increasing-triplet-subsequence',335:'self-crossing',336:'palindrome-pairs',337:'house-robber-iii',338:'counting-bits',341:'flatten-nested-list-iterator',342:'power-of-four',343:'integer-break',344:'reverse-string',345:'reverse-vowels-of-a-string',347:'top-k-frequent-elements',349:'intersection-of-two-arrays',350:'intersection-of-two-arrays-ii',352:'data-stream-as-disjoint-intervals',354:'russian-doll-envelopes',355:'design-twitter',357:'count-numbers-with-unique-digits',358:'rearrange-distance-k',361:'bomb-enemy',362:'design-hit-counter',363:'max-sum-of-rectangle-no-larger-than-k',365:'water-and-jug-problem',367:'valid-perfect-square',368:'largest-divisible-subset',369:'plus-one-linked-list',370:'range-addition',371:'sum-of-two-integers',372:'super-pow',373:'find-k-pairs-with-smallest-sums',374:'guess-number-higher-or-lower',375:'guess-number-higher-or-lower-ii',376:'wiggle-subsequence',377:'combination-sum-iv',378:'kth-smallest-element-in-a-sorted-matrix',380:'insert-delete-getrandom-o1',381:'insert-delete-getrandom-o1-duplicates-allowed',382:'linked-list-random-node',383:'ransom-note',384:'shuffle-an-array',385:'mini-parser',386:'lexicographical-numbers',387:'first-unique-character-in-a-string',388:'longest-absolute-file-path',389:'find-the-difference',390:'elimination-game',391:'perfect-rectangle',392:'is-subsequence',393:'utf-8-validation',394:'decode-string',395:'longest-substring-with-at-least-k-repeating-characters',396:'rotate-function',397:'integer-replacement',398:'random-pick-index',399:'evaluate-division',400:'nth-digit',401:'binary-watch',402:'remove-k-digits',403:'frog-jump',404:'sum-of-left-leaves',405:'convert-a-number-to-hexadecimal',406:'queue-reconstruction-by-height',407:'trapping-rain-water-ii',409:'longest-palindrome',410:'split-array-largest-sum',412:'fizz-buzz',413:'arithmetic-slices',414:'third-maximum-number',415:'add-strings',416:'partition-equal-subset-sum',417:'pacific-atlantic-water-flow',419:'battleships-in-a-board',420:'strong-password-checker',421:'maximum-xor-of-two-numbers-in-an-array',422:'valid-word-square',423:'reconstruct-original-digits-from-english',424:'longest-repeating-character-replacement',427:'construct-quad-tree',429:'n-ary-tree-level-order-traversal',430:'flatten-a-multilevel-doubly-linked-list',432:'all-oone-data-structure',433:'minimum-genetic-mutation',434:'number-of-segments-in-a-string',435:'non-overlapping-intervals',436:'find-right-interval',437:'path-sum-iii',438:'find-all-anagrams-in-a-string',440:'k-th-smallest-in-lexicographical-order',441:'arranging-coins',442:'find-all-duplicates-in-an-array',443:'string-compression',445:'add-two-numbers-ii',446:'arithmetic-slices-ii-subsequence',447:'number-of-boomerangs',448:'find-all-numbers-disappeared-in-an-array',449:'serialize-and-deserialize-bst',450:'delete-node-in-a-bst',451:'sort-characters-by-frequency',452:'minimum-number-of-arrows-to-burst-balloons',453:'minimum-moves-to-equal-array-elements',454:'4sum-ii',455:'assign-cookies',456:'132-pattern',457:'circular-array-loop',458:'poor-pigs',459:'repeated-substring-pattern',460:'lfu-cache',461:'hamming-distance',462:'minimum-moves-to-equal-array-elements-ii',463:'island-perimeter',464:'can-i-win',466:'count-the-repetitions',467:'unique-substrings-in-wraparound-string',468:'validate-ip-address',470:'implement-rand10-using-rand7',471:'encode-string-with-shortest-length',472:'concatenated-words',473:'matchsticks-to-square',474:'ones-and-zeroes',475:'heaters',476:'number-complement',477:'total-hamming-distance',478:'generate-random-point-in-a-circle',479:'largest-palindrome-product',480:'sliding-window-median',481:'magical-string',482:'license-key-formatting',483:'smallest-good-base',485:'max-consecutive-ones',486:'predict-the-winner',487:'max-consecutive-ones-ii',488:'happy-number',489:'robot-room-cleaner',490:'the-maze',491:'increasing-subsequences',492:'construct-the-rectangle',493:'reverse-pairs',494:'target-sum',495:'teemo-attacking',496:'next-greater-element-i',497:'random-point-in-non-overlapping-rectangles',498:'diagonal-traverse',499:'the-maze-iii',500:'keyboard-row',501:'find-mode-in-binary-search-tree',502:'ipo',503:'next-greater-element-ii',504:'base-7',506:'relative-ranks',507:'perfect-number',508:'most-frequent-subtree-sum',509:'fibonacci-number',513:'find-bottom-left-tree-value',514:'freedom-trail',515:'find-largest-value-in-each-tree-row',516:'longest-palindromic-subsequence',517:'super-washing-machines',518:'coin-change-ii',520:'detect-capital',521:'longest-uncommon-subsequence-i',522:'longest-uncommon-subsequence-ii',523:'continuous-subarray-sum',524:'longest-word-in-dictionary-through-deleting',525:'contiguous-array',526:'beautiful-arrangement',528:'random-pick-with-weight',529:'minesweeper',530:'minimum-absolute-difference-in-bst',532:'k-diff-pairs-in-an-array',535:'encode-and-decode-tinyurl',536:'construct-binary-tree-from-string',537:'complex-number-multiplication',538:'convert-bst-to-greater-tree',539:'minimum-time-difference',540:'single-element-in-a-sorted-array',541:'reverse-string-ii',542:'01-matrix',543:'diameter-of-binary-tree',544:'output-contest-matches',546:'remove-boxes',547:'number-of-provinces',549:'binary-tree-longest-consecutive-sequence-ii',551:'student-attendance-record-i',552:'student-attendance-record-ii',553:'optimal-division',554:'brick-wall',556:'next-greater-element-iii',557:'maximum-depth-of-n-ary-tree',558:'quad-tree-intersection',559:'maximum-depth-of-n-ary-tree',560:'subarray-sum-equals-k',561:'array-partition',563:'binary-search-tree-iterator-ii',564:'find-the-closest-palindrome',565:'array-nesting',566:'reshape-the-matrix',567:'permutation-in-string',572:'subtree-of-another-tree',575:'distribute-candies',576:'out-of-boundary-paths',581:'shortest-unsorted-continuous-subarray',583:'delete-operation-for-two-strings',587:'erect-the-fence',588:'design-in-memory-file-system',589:'n-ary-tree-preorder-traversal',590:'n-ary-tree-postorder-traversal',591:'tag-validator',592:'fraction-addition-and-subtraction',593:'valid-square',594:'longest-harmonious-subsequence',598:'range-addition-ii',599:'minimum-index-sum-of-two-lists',600:'non-negative-integers-without-consecutive-ones',605:'can-place-flowers',606:'construct-string-from-binary-tree',609:'find-duplicate-file-in-system',611:'valid-triangle-number',617:'merge-two-binary-trees',621:'task-scheduler',622:'design-circular-queue',623:'add-one-row-to-tree',628:'maximum-product-of-three-numbers',629:'k-inverse-pairs-array',630:'course-schedule-iii',632:'smallest-range-covering-elements-from-k-lists',633:'sum-of-square-numbers',636:'exclusive-time-of-functions',637:'average-of-levels-in-binary-tree',638:'shopping-offers',639:'decode-ways-ii',640:'solve-the-equation',641:'design-circular-deque',643:'maximum-average-subarray-i',645:'set-mismatch',646:'maximum-length-of-pair-chain',647:'palindromic-substrings',648:'replace-words',649:'dota2-senate',650:'2-keys-keyboard',652:'find-duplicate-subtrees',653:'two-sum-iv-input-is-a-bst',654:'maximum-binary-tree',655:'print-binary-tree',657:'robot-return-to-origin',658:'find-k-closest-elements',659:'split-array-into-consecutive-subsequences',661:'image-smoother',662:'maximum-width-of-binary-tree',664:'strange-printer',665:'non-decreasing-array',667:'beautiful-arrangement-ii',668:'kth-smallest-number-in-multiplication-table',669:'trim-a-binary-search-tree',670:'maximum-swap',671:'second-minimum-node-in-a-binary-tree',672:'bulb-switcher-ii',673:'number-of-longest-increasing-subsequence',674:'longest-continuous-increasing-subsequence',675:'cut-off-trees-for-golf-event',676:'implement-magic-dictionary',677:'map-sum-pairs',678:'valid-parenthesis-string',679:'24-game',680:'valid-palindrome-ii',682:'baseball-game',684:'redundant-connection',685:'redundant-connection-ii',686:'repeated-string-match',687:'longest-univalue-path',688:'knight-probability-in-chessboard',689:'maximum-sum-of-3-non-overlapping-subarrays',690:'employee-importance',691:'stickers-to-spell-word',692:'top-k-frequent-words',693:'binary-number-with-alternating-bits',694:'number-of-distinct-islands',695:'max-area-of-island',696:'count-binary-substrings',697:'degree-of-an-array',698:'partition-to-k-equal-sum-subsets',699:'falling-squares',700:'search-in-a-binary-search-tree',701:'insert-into-a-binary-search-tree',703:'kth-largest-element-in-a-stream',704:'binary-search',705:'design-hashset',706:'design-hashmap',707:'design-linked-list',709:'to-lower-case',710:'random-pick-with-blacklist',712:'minimum-ascii-delete-sum-for-two-strings',713:'subarray-product-less-than-k',714:'best-time-to-buy-and-sell-stock-with-transaction-fee',715:'range-module',716:'max-stack',717:'1-bit-and-2-bit-characters',718:'maximum-length-of-repeated-subarray',719:'find-k-th-smallest-pair-distance',720:'longest-word-in-dictionary',721:'accounts-merge',722:'remove-comments',724:'find-pivot-index',725:'split-array-into-consecutive-subsequences',726:'number-of-atoms',728:'self-dividing-numbers',729:'my-calendar-i',730:'count-different-palindromic-subsequences',731:'my-calendar-ii',732:'my-calendar-iii',733:'flood-fill',734:'sentence-similarity',735:'asteroid-collision',736:'parse-lisp-expression',738:'monotone-increasing-digits',739:'daily-temperatures',740:'delete-and-earn',741:'cherry-pickup',742:'closest-leaf-in-a-binary-tree',743:'network-delay-time',744:'find-smallest-letter-greater-than-target',745:'prefix-and-suffix-search',746:'min-cost-climbing-stairs',747:'largest-number-at-least-twice-of-others',748:'shortest-completing-word',749:'contain-virus',752:'open-the-lock',753:'cracking-the-safe',754:'reach-a-number',756:'pyramid-transition-matrix',757:'set-intersection-size-at-least-two',761:'special-binary-string',762:'prime-number-of-set-bits-in-binary-representation',763:'partition-labels',764:'largest-plus-sign',765:'couples-holding-hands',766:'toeplitz-matrix',767:'reorganize-string',768:'max-chunks-to-make-sorted-ii',769:'max-chunks-to-make-sorted',770:'basic-calculator-iv',771:'jewels-and-stones',773:'sliding-puzzle',775:'global-and-local-inversions',777:'swap-adjacent-in-lr-string',778:'swim-in-rising-water',779:'k-th-symbol-in-grammar',780:'reaching-points',781:'rabbits-in-forest',783:'minimum-distance-between-bst-nodes',784:'letter-case-permutation',785:'is-graph-bipartite',786:'k-th-smallest-prime-fraction',787:'cheapest-flights-within-k-stops',788:'rotated-digits',789:'escape-the-ghosts',790:'domino-and-tromino-tiling',791:'custom-sort-string',792:'number-of-matching-subsequences',793:'preimage-size-of-factorial-zeroes-function',794:'valid-tic-tac-toe-state',795:'number-of-subarrays-with-bounded-maximum',796:'rotate-string',797:'all-paths-from-source-to-target',798:'smallest-rotation-with-highest-score',799:'champagne-tower',800:'similar-rgb-color',801:'minimum-swaps-to-make-sequences-increasing',802:'find-eventual-safe-states',804:'unique-morse-code-words',806:'number-of-lines-to-write-string',807:'max-increase-to-keep-city-skyline',808:'soup-servings',809:'expressive-words',811:'subdomain-visit-count',812:'largest-triangle-area',813:'largest-sum-of-averages',814:'binary-tree-pruning',815:'bus-routes',816:'ambiguous-coordinates',817:'linked-list-components',818:'race-car',819:'most-common-word',820:'short-encoding-of-words',821:'shortest-distance-to-a-character',822:'card-flipping-game',823:'binary-trees-with-factors',824:'goat-latin',825:'friends-of-appropriate-ages',826:'soup-servings',827:'making-a-large-island',828:'count-unique-characters-of-all-substrings-of-a-given-string',830:'positions-of-large-groups',831:'masking-personal-information',832:'flipping-an-image',833:'find-and-replace-in-string',834:'sum-of-distances-in-tree',835:'image-overlap',836:'rectangle-overlap',837:'new-21-game',838:'push-dominoes',839:'similar-string-groups',840:'magic-squares-in-grid',841:'keys-and-rooms',842:'split-array-into-fibonacci-sequence',843:'guess-the-word',844:'backspace-string-compare',845:'longest-mountain-in-array',846:'hand-of-straights',847:'shortest-path-visiting-all-nodes',848:'shifting-letters',849:'maximize-distance-to-closest-person',850:'rectangle-area-ii',851:'loud-and-rich',852:'peak-index-in-a-mountain-array',853:'car-fleet',854:'k-similar-strings',855:'exam-room',856:'score-of-parentheses',857:'minimum-cost-to-hire-k-workers',858:'mirror-reflection',859:'buddy-strings',860:'lemonade-change',861:'score-after-flipping-matrix',862:'shortest-path-in-a-grid-with-obstacles-elimination',863:'all-nodes-distance-k-in-binary-tree',864:'shortest-path-to-get-all-keys',865:'smallest-subtree-with-all-the-deepest-nodes',866:'prime-palindrome',867:'transpose-matrix',868:'binary-gap',869:'reordered-power-of-2',870:'advantage-shuffle',871:'minimum-number-of-refueling-stops',872:'leaf-similar-trees',873:'length-of-longest-fibonacci-subsequence',874:'walking-robot-simulation',875:'koko-eating-bananas',876:'middle-of-the-linked-list',877:'stone-game',878:'nth-magical-number',880:'decoded-string-at-index',881:'lifting-people',882:'sign-of-the-product-of-an-array',883:'projection-area-of-3d-shapes',884:'unordered-map',885:'spiral-matrix-iii',886:'possible-bipartition',887:'super-egg-drop',888:'fair-candy-swap',889:'construct-binary-tree-from-preorder-and-postorder-traversal',890:'find-and-replace-pattern',891:'sum-of-subsequence-widths',892:'surface-area-of-3d-shapes',893:'groups-of-special-equivalent-strings',894:'all-possible-full-binary-trees',895:'maximum-frequency-stack',896:'monotonic-array',897:'increasing-order-search-tree',898:'bitwise-ors-of-subarrays',899:'orderly-queue',900:'rle-iterator',901:'online-stock-span',902:'numbers-at-most-n-given-digit-set',903:'valid-permutations-for-di-sequence',904:'fruit-into-baskets',905:'length-of-the-longest-alphabetical-continuous-substring',906:'walking-robot-simulation-ii',907:'koko-eating-bananas',909:'snakes-and-ladders',910:'smallest-range-ii',911:'online-election',912:'sort-an-array',913:'cat-and-mouse',914:'x-of-a-kind-in-a-deck-of-cards',915:'partition-array-into-disjoint-intervals',916:'word-subsets',917:'reverse-only-letters',918:'maximum-sum-circular-subarray',919:'meeting-rooms-ii',920:'meeting-rooms',921:'minimum-add-to-make-parentheses-valid',922:'sort-array-by-parity-ii',923:'3sum-with-multiplicity',924:'minimize-malware-spread',925:'long-pressed-name',926:'flip-string-to-monotone-increasing',927:'three-equal-parts',928:'minimize-malware-spread-ii',929:'unique-email-addresses',930:'binary-subarrays-with-sum',931:'minimum-falling-path-sum',932:'beautiful-array',933:'number-of-recent-calls',934:'shortest-bridge',935:'knight-dialer',936:'stamping-the-sequence',937:'reorder-data-in-log-files',938:'range-sum-of-bst',939:'minimum-area-rectangle',940:'distinct-subsequences-ii',941:'valid-mountain-array',942:'di-string-match',943:'find-the-shortest-superstring',944:'delete-columns-to-make-sorted',945:'minimum-increment-to-make-array-unique',946:'validate-stack-sequences',947:'most-stones-removed-with-same-row-or-column',948:'bag-of-tokens',949:'largest-time-for-given-digits',950:'reveal-cards-in-increasing-order',951:'flip-equivalent-binary-trees',952:'largest-component-size-by-common-factor',953:'verifying-an-alien-dictionary',954:'array-of-doubled-pairs',955:'delete-columns-to-make-sorted-ii',956:'toss-strange-coins',957:'prison-cells-after-n-days',958:'check-completeness-of-a-binary-tree',959:'regions-cut-by-slashes',960:'delete-columns-to-make-sorted-iii',961:'n-repeated-element-in-size-2n-array',962:'flip-string-to-monotone-increasing',963:'minimum-area-rectangle-ii',964:'minimize-malware-spread',965:'univalued-binary-tree',966:'vowel-spellchecker',967:'numbers-with-same-consecutive-differences',968:'binary-tree-cameras',969:'pancake-sorting',970:'powerful-integers',971:'flip-binary-tree-to-match-preorder-traversal',972:'equal-rational-numbers',973:'k-closest-points-to-origin',974:'subarray-sums-divisible-by-k',975:'odd-even-jump',976:'largest-perimeter-triangle',977:'squares-of-a-sorted-array',978:'longest-turbulent-subarray',979:'distribute-coins-in-binary-tree',980:'unique-paths-iii',981:'time-based-key-value-store',982:'triples-with-bitwise-and-equal-to-zero',983:'minimum-cost-for-tickets',984:'string-without-aaa-or-bbb',985:'bag-of-tokens',986:'interval-list-intersections',987:'vertical-order-traversal-of-a-binary-tree',988:'flip-equivalent-binary-trees',989:'add-to-array-form-of-integer',990:'satisfiability-of-equality-equations',991:'broken-calculator',992:'subarrays-with-k-different-integers',993:'cousins-in-binary-tree',994:'rotting-oranges',995:'minimum-number-of-k-consecutive-bit-flips',996:'number-of-squareful-arrays',997:'find-the-town-judge',998:'maximum-binary-tree-ii',999:'available-captures-for-rook',1000:'minimum-cost-to-merge-stones',1001:'illumination',1002:'find-common-characters',1003:'check-if-word-is-valid-after-substitutions',1004:'max-consecutive-ones-iii',1005:'maximize-sum-of-array-after-k-negations',1006:'clumsy-factorial',1007:'minimum-domino-rotations-for-equal-row',1008:'construct-binary-search-tree-from-preorder-traversal',1009:'complement-of-base-10-integer',1010:'pairs-of-songs-with-total-durations-divisible-by-60',1011:'capacity-to-ship-packages-within-d-days',1012:'numbers-with-repeated-digits',1013:'partition-array-into-three-parts-with-equal-sum',1014:'best-sightseeing-pair',1015:'smallest-integer-divisible-by-k',1016:'binary-string-with-substrings-representing-1-to-n',1017:'convert-to-base-2',1018:'binary-prefix-divisible-by-5',1019:'next-greater-node-in-linked-list',1020:'number-of-enclaves',1021:'remove-outermost-parentheses',1022:'sum-of-root-to-leaf-binary-numbers',1023:'camelcase-matching',1024:'video-stitching',1025:'divisor-game',1026:'maximum-difference-between-node-and-ancestor',1027:'longest-arithmetic-subsequence',1028:'recover-a-tree-from-preorder-traversal',1029:'two-city-scheduling',1030:'matrix-cells-in-distance-order',1031:'maximum-sum-of-two-non-overlapping-subarrays',1032:'stream-of-characters',1033:'moving-stones-until-consecutive',1034:'coloring-a-border',1035:'uncrossed-lines',1036:'escape-a-large-maze',1037:'valid-boomerang',1038:'binary-search-tree-to-greater-sum-tree',1039:'minimum-score-triangulation-of-polygon',1040:'moving-stones-until-consecutive-ii',1041:'robot-bounded-in-circle',1042:'flower-planting-with-no-adjacent',1043:'partition-array-for-maximum-sum',1044:'longest-duplicate-substring',1046:'last-stone-weight',1047:'remove-all-adjacent-duplicates-in-string',1048:'longest-string-chain',1049:'last-stone-weight-ii',1051:'height-checker',1052:'grumpy-bookstore-owner',1053:'previous-permutation-with-one-swap',1054:'distant-barcodes',1055:'fixed-point',1056:'confusing-number',1057:'campus-bikes',1058:'minimize-rounding-error-to-meet-target',1059:'missing-number-in-arithmetic-progression',1060:'missing-element-in-sorted-array',1061:'lexicographically-smallest-equivalent-string',1062:'longest-repeating-substring',1063:'number-of-valid-subarrays',1064:'fixed-point',1065:'index-pairs-of-a-string',1066:'campus-bikes-ii',1089:'duplicate-zeros',1090:'largest-values-from-labels',1091:'shortest-path-in-binary-matrix',1092:'shortest-common-supersequence',1093:'statistics-from-a-large-sample',1094:'car-pooling',1095:'find-in-mountain-array',1096:'brace-expansion-ii',1099:'two-sum-less-than-k',1100:'find-k-length-substrings-with-no-repeated-characters',1101:'the-earliest-moment-when-everyone-become-friends',1102:'path-with-maximum-minimum-value',1103:'distribute-candies-to-people',1104:'path-in-zigzag-labelled-binary-tree',1105:'filling-bookcase-shelves',1106:'parsing-a-boolean-expression',1108:'defanging-an-ip-address',1109:'corporate-flight-bookings',1110:'delete-nodes-and-return-forest',1111:'maximum-nesting-depth-of-two-valid-parentheses-strings',1114:'print-in-order',1115:'print-foobar-alternately',1116:'print-zero-even-odd',1117:'building-h2o',1118:'number-of-days-in-a-month',1119:'remove-vowels-from-a-string',1120:'maximum-average-subarray',1122:'relative-sort-array',1123:'lowest-common-ancestor-of-deepest-leaves',1124:'longest-well-performing-interval',1125:'minimum-cost-to-connect-sticks',1128:'number-of-equivalent-domino-pairs',1129:'shortest-path-with-alternating-colors',1130:'minimum-cost-tree-from-leaf-values',1131:'maximum-of-absolute-value-expression',1133:'largest-unique-number',1134:'armstrong-number',1135:'connecting-cities-with-minimum-cost',1136:'parallel-courses',1137:'n-th-tribonacci-number',1138:'alphabet-board-path',1139:'largest-1-bordered-square',1140:'stone-game-ii',1143:'longest-common-subsequence',1144:'decrease-elements-to-make-array-zigzag',1145:'binary-tree-coloring-game',1146:'snapshot-array',1147:'longest-chunked-palindrome-decomposition',1150:'check-if-a-number-is-majority-element-in-a-sorted-array',1151:'minimum-swaps-to-group-all-1s-together',1152:'analyze-user-website-visit-pattern',1153:'string-transforms-into-another-string',1154:'day-of-the-year',1155:'number-of-dice-rolls-with-target-sum',1156:'swap-for-longest-repeated-character-substring',1157:'online-majority-element-in-subarray',1158:'market-analysis-i',1159:'market-analysis-ii',1160:'find-words-that-can-be-formed-by-characters',1161:'project-employees-ii',1162:'as-far-from-land-as-possible',1163:'last-substring-in-lexicographical-order',1164:'product-price-at-a-given-date',1165:'single-row-keyboard',1166:'design-file-system',1167:'minimum-cost-to-connect-sticks',1168:'optimize-water-distribution-in-a-village',1169:'invalid-transactions',1170:'compare-strings-by-frequency-of-the-smallest-character',1171:'remove-zero-sum-consecutive-nodes-from-linked-list',1175:'prime-arrangements',1176:'diet-plan-performance',1177:'can-make-palindrome-from-substring',1178:'number-of-valid-words-for-each-puzzle',1180:'count-substrings-with-only-one-distinct-letter',1181:'before-and-after-puzzle',1182:'shortest-distance-to-target-color',1183:'maximum-number-of-ones',1184:'distance-between-bus-stops',1185:'day-of-the-week',1186:'maximum-subarray-sum-with-one-deletion',1187:'make-array-strictly-increasing',1188:'design-bounded-blocking-queue',1189:'maximum-number-of-balloons',1190:'reverse-substrings-between-each-pair-of-parentheses',1191:'k-concatenation-maximum-sum',1192:'critical-connections-in-a-network',1195:'fizz-buzz-multithreaded',1196:'how-many-apples-can-you-put-into-the-basket',1197:'minimum-knight-moves',1198:'find-smallest-common-element-in-all-rows',1199:'minimum-time-to-build-blocks',1200:'minimum-absolute-difference',1201:'ugly-number-iii',1202:'smallest-string-with-swaps',1203:'sort-items-by-groups-respecting-dependencies',1206:'design-skiplist',1207:'unique-number-of-occurrences',1208:'get-equal-substrings-within-budget',1209:'remove-all-adjacent-duplicates-in-string-ii',1210:'minimum-moves-to-reach-target-with-rotations',1213:'intersection-of-three-sorted-arrays',1214:'two-sum-bsts',1215:'stepping-numbers',1216:'valid-palindrome-iii',1217:'minimum-cost-to-move-chips-to-the-same-position',1218:'longest-arithmetic-subsequence-of-given-difference',1219:'path-with-maximum-gold',1220:'count-vowels-permutation',1221:'split-a-string-in-balanced-strings',1222:'queens-that-can-attack-the-king',1223:'dice-roll-simulation',1224:'maximum-equal-frequency',1226:'the-dining-philosophers',1227:'airplane-seat-assignment-probability',1228:'missing-number-in-arithmetic-progression',1229:'meeting-scheduler',1230:'toss-strange-coins',1231:'divide-chocolate',1232:'check-if-it-is-a-straight-line',1233:'remove-sub-folders-from-the-filesystem',1234:'replace-the-substring-for-balanced-string',1235:'maximum-profit-in-job-scheduling',1236:'web-crawler',1237:'find-positive-integer-solution-for-a-given-equation',1238:'circular-permutation-in-binary-representation',1239:'maximum-length-of-a-concatenated-string-with-unique-characters',1240:'tiling-a-rectangle-with-the-fewest-squares',1241:'number-of-calls-per-unique-number',1242:'number-of-calls-per-unique-number',1243:'array-transformation',1244:'design-a-leaderboard',1245:'tree-diameter',1246:'palindrome-removal',1247:'minimum-swaps-to-make-strings-equal',1248:'count-number-of-nice-subarrays',1249:'minimum-remove-to-make-valid-parentheses',1250:'check-if-it-is-a-good-array',1252:'cells-with-odd-values-in-a-matrix',1253:'reconstruct-a-2-row-binary-matrix',1254:'number-of-closed-islands',1255:'maximum-score-words-formed-by-letters',1256:'encode-number',1257:'smallest-common-region',1258:'synonymous-sentences',1259:'handshakes-that-dont-cross',1260:'shift-2d-grid',1261:'find-elements-in-a-contaminated-binary-tree',1262:'greatest-sum-divisible-by-three',1263:'minimum-moves-to-move-a-box-to-their-target-location',1265:'print-immutable-linked-list-in-reverse',1266:'minimum-time-visiting-all-points',1267:'count-servers-that-communicate',1268:'search-suggestions-system',1269:'number-of-ways-to-stay-in-the-same-place-after-some-steps',1270:'all-people-report-to-the-given-manager',1271:'hexspeak',1272:'remove-interval',1273:'delete-tree-nodes',1274:'number-of-ships-in-a-rectangle',1275:'find-winner-on-a-tic-tac-toe-game',1276:'number-of-burgers-with-no-waste-of-ingredients',1277:'count-square-submatrices-with-all-ones',1278:'palindrome-partitioning-iii',1279:'traffic-light-controlled-intersection',1281:'subtract-the-product-and-sum-of-digits-of-an-integer',1282:'group-the-people-given-the-group-size-they-belong-to',1283:'find-the-smallest-divisor-given-a-threshold',1284:'minimum-number-of-refueling-stops',1286:'iterator-for-combination',1287:'element-appearing-more-than-25-in-sorted-array',1288:'remove-covered-intervals',1289:'minimum-falling-path-sum-ii',1290:'convert-binary-number-in-a-linked-list-to-integer',1291:'sequential-digits',1292:'maximum-side-length-of-a-square-with-sum-less-than-or-equal-to-threshold',1293:'shortest-path-in-a-grid-with-obstacles-elimination',1295:'find-numbers-with-even-number-of-digits',1296:'divide-array-in-sets-of-k-consecutive-numbers',1297:'maximum-number-of-occurrences-of-a-substring',1298:'maximum-number-of-occurrences-of-a-substring',1299:'replace-elements-with-greatest-element-on-right-side',1300:'sum-of-mutated-array-closest-to-target',1301:'number-of-paths-with-max-score',1302:'deepest-leaves-sum',1304:'find-n-unique-integers-sum-up-to-zero',1305:'all-elements-in-two-binary-search-trees',1306:'jump-game-iii',1307:'verbal-arithmetic-puzzle',1309:'decrypt-string-from-alphabet-to-integer-mapping',1310:'xor-queries-of-a-subarray',1311:'get-watched-videos-by-your-friends',1312:'minimum-insertion-steps-to-make-a-string-palindrome',1313:'decompress-run-length-encoded-list',1314:'matrix-block-sum',1315:'sum-of-nodes-with-even-valued-grandparent',1316:'distinct-echo-substrings',1317:'convert-integer-to-the-sum-of-two-no-zero-integers',1318:'minimum-flips-to-make-a-or-b-equal-to-c',1319:'number-of-operations-to-make-network-connected',1320:'minimum-distance-to-type-a-word-using-two-fingers',1321:'restaurant-growth',1323:'maximum-69-number',1324:'print-words-vertically',1325:'delete-leaves-with-a-given-value',1326:'minimum-number-of-taps-to-open-to-water-a-garden',1328:'break-a-palindrome',1329:'sort-the-matrix-diagonally',1330:'reverse-subarray-to-maximize-array-value',1331:'rank-transform-of-an-array',1332:'remove-palindromic-subsequences',1333:'filter-restaurants-by-vegan-friendly-price-and-distance',1334:'find-the-city-with-the-smallest-number-of-neighbors-at-a-threshold-distance',1335:'minimum-difficulty-of-a-job-schedule',1337:'the-k-weakest-rows-in-a-matrix',1338:'reduce-array-size-to-the-half',1339:'maximum-product-of-splitted-binary-tree',1340:'jump-game-v',1341:'movie-rating',1342:'number-of-steps-to-reduce-a-number-to-zero',1343:'number-of-sub-arrays-of-size-k-and-average-greater-than-or-equal-to-threshold',1344:'angle-between-hands-of-a-clock',1345:'jump-game-iv',1346:'check-if-n-and-its-double-exist',1347:'minimum-number-of-steps-to-make-two-strings-anagram',1348:'tweet-counts-per-frequency',1349:'maximum-students-taking-exam',1351:'count-negative-numbers-in-a-sorted-matrix',1352:'product-of-the-last-k-numbers',1353:'maximum-number-of-events-that-can-be-attended',1354:'construct-target-array-with-multiple-sums',1356:'sort-integers-by-the-number-of-1-bits',1357:'apply-discount-every-n-orders',1358:'number-of-substrings-containing-all-three-characters',1359:'count-all-valid-pickup-and-delivery-options',1360:'number-of-days-between-two-dates',1361:'validate-binary-tree-nodes',1362:'closest-divisors',1363:'largest-multiple-of-three',1365:'how-many-numbers-are-smaller-than-the-current-number',1366:'rank-teams-by-votes',1367:'linked-list-in-binary-tree',1368:'minimum-cost-to-make-at-least-one-valid-path-in-a-grid',1369:'get-the-second-most-recent-activity',1370:'increasing-decreasing-string',1371:'find-the-longest-substring-containing-vowels-in-even-counts',1372:'longest-zigzag-path-in-a-binary-tree',1373:'maximum-sum-bst-in-binary-tree',1374:'generate-a-string-with-characters-that-have-odd-counts',1375:'bulb-switcher-iii',1376:'time-needed-to-inform-all-employees',1377:'frog-position-after-t-seconds',1379:'find-a-corresponding-node-of-a-binary-tree-in-a-clone-of-that-tree',1380:'lucky-numbers-in-a-matrix',1381:'design-a-stack-with-increment-operation',1382:'balance-a-binary-search-tree',1383:'maximum-performance-of-a-team',1385:'find-the-distance-value-between-two-arrays',1386:'cinema-seat-allocation',1387:'sort-integers-by-the-power-value',1388:'pizza-with-3n-slices',1389:'create-target-array-in-the-given-order',1390:'four-divisors',1391:'check-if-there-is-a-valid-path-in-a-grid',1392:'longest-happy-prefix',1393:'capital-gainloss',1394:'find-lucky-integer-in-an-array',1395:'count-number-of-teams',1396:'design-underground-system',1397:'find-all-good-strings',1399:'count-largest-group',1400:'construct-k-palindrome-strings',1401:'circle-and-rectangle-overlapping',1402:'reducing-dishes',1403:'minimum-subsequence-in-non-increasing-order',1404:'number-of-steps-to-reduce-a-number-in-binary-representation-to-one',1405:'longest-happy-string',1406:'stone-game-iii',1408:'string-matching-in-an-array',1409:'queries-on-a-permutation-with-key',1410:'html-entity-parser',1411:'number-of-ways-to-paint-n-3-grid',1413:'minimum-value-to-get-positive-step-by-step-sum',1414:'find-the-minimum-number-of-fibonacci-numbers-whose-sum-is-k',1415:'the-k-th-lexicographical-string-of-all-happy-strings-of-length-n',1416:'restore-the-array-from-adjacent-pairs',1417:'reformat-the-string',1418:'display-table-of-food-orders-in-a-restaurant',1419:'minimum-number-of-frogs-croaking',1420:'build-array-where-you-can-find-the-maximum-exactly-k-comparisons',1422:'maximum-score-after-splitting-a-string',1423:'maximum-points-you-can-obtain-from-cards',1424:'diagonal-traverse-ii',1425:'constrained-subsequence-sum',1426:'counting-elements',1427:'perform-string-shifts',1428:'leftmost-column-with-at-least-a-one',1429:'first-unique-number',1430:'check-if-a-string-is-a-valid-sequence-from-root-to-leaves-path-in-a-binary-tree',1431:'kids-with-the-greatest-number-of-candies',1432:'max-difference-you-can-get-from-changing-an-integer',1433:'check-if-a-string-can-break-another-string',1434:'number-of-ways-to-wear-different-hats-to-each-other',1436:'destination-city',1437:'check-if-all-1s-are-at-least-length-k-places-away',1438:'longest-continuous-subarray-with-absolute-diff-less-than-or-equal-to-limit',1439:'find-the-kth-largest-integer-in-the-array',1440:'evaluate-boolean-binary-tree',1441:'build-an-array-with-stack-operations',1442:'count-triplets-that-can-form-two-arrays-of-equal-xor',1443:'minimum-time-to-collect-all-apples-in-a-tree',1444:'number-of-ways-of-cutting-a-pizza',1446:'consecutive-characters',1447:'simplified-fractions',1448:'count-good-nodes-in-binary-tree',1449:'form-largest-integer-with-digits-that-add-up-to-target',1450:'number-of-students-doing-homework-at-a-given-time',1451:'rearrange-words-in-a-sentence',1452:'people-whose-list-of-favorite-companies-is-not-a-subset-of-another-list',1453:'maximum-number-of-droids-within-budget',1455:'check-if-a-word-occurs-as-a-prefix-of-any-word-in-a-sentence',1456:'maximum-number-of-vowels-in-a-substring-of-given-length',1457:'pacific-atlantic-water-flow',1458:'min-cost-climbing-stairs',1460:'make-two-arrays-equal-by-reversing-sub-arrays',1461:'check-if-a-string-contains-all-binary-codes-of-size-k',1462:'course-schedule-iv',1463:'cherry-pickup-ii',1464:'maximum-product-of-two-elements-in-an-array',1465:'maximum-area-of-a-piece-of-cake-after-horizontal-and-vertical-cuts',1466:'reorder-routes-to-make-all-paths-lead-to-the-city-zero',1467:'probability-of-a-two-boxes-having-the-same-number-of-distinct-balls',1469:'find-all-the-lonely-nodes',1470:'shuffle-the-array',1471:'the-k-strongest-values-in-an-array',1472:'design-browser-history',1473:'paint-house-iii',1474:'delete-n-nodes-after-m-nodes-of-a-linked-list',1475:'final-prices-with-a-special-discount-in-a-shop',1476:'subrectangle-queries',1477:'product-of-the-last-k-numbers'};
return slugs[num]||'';
}
const CAT_TAG_MAP={
algorithm:['算法','编程题','LeetCode'],
os:['操作系统','进程','内存','并发'],
network:['计算机网络','TCP/IP','HTTP','协议'],
database:['数据库','SQL','索引','事务'],
datastructure:['数据结构','链表','树','图'],
language:['编程语言','语法','底层实现'],
'system-design':['系统设计','架构','分布式','高可用'],
scenario:['场景题','实际应用','综合'],
frontend:['前端','JavaScript','CSS','HTML','React','Vue'],
finance:['金融','会计','财务','银行','证券','投资'],
law:['法律','民法','刑法','合同法','公司法','知识产权'],
medical:['医学','临床','药学','护理','公共卫生','解剖'],
education:['教育','教学','课程设计','教育心理','班级管理'],
'civil-service':['行测','申论','常识判断','数量关系','言语理解','判断推理'],
hr:['人力资源','招聘','薪酬','绩效','劳动法','培训'],
marketing:['营销','品牌','市场调研','数字营销','广告','消费者行为']
};
function enrichQuestion(q){
if(q._enriched)return q;
const enriched={...q,_enriched:true};
if(!enriched.answer||enriched.answer.trim()===''){
if(enriched.id&&enriched.id.startsWith('lc-')){
enriched.answer=generateLCAnswer(enriched);
}else{
enriched.answer='暂无参考答案，欢迎在笔记区补充你的理解。';
}
}
if(!enriched.tags||!enriched.tags.length){
enriched.tags=CAT_TAG_MAP[enriched.category]?[...CAT_TAG_MAP[enriched.category]].slice(0,2):[CATEGORY_MAP[enriched.category]||enriched.category];
}
if(enriched.tags&&enriched.tags.length===1&&enriched.tags[0].length<=3){
const catTags=CAT_TAG_MAP[enriched.category]||[];
const titleWords=enriched.title.replace(/[？？。，！！、：]/g,'').split(/\s+/).filter(w=>w.length>1);
const extraTags=catTags.filter(t=>!enriched.tags.includes(t)).slice(0,2);
if(titleWords.length>0){
const titleTag=titleWords.find(w=>w.length>=2&&w.length<=6&&!catTags.includes(w));
if(titleTag)extraTags.push(titleTag);
}
enriched.tags=[...enriched.tags,...extraTags.slice(0,2)];
}
if(enriched.id&&enriched.id.startsWith('lc-')&&enriched.content&&enriched.content.includes('LeetCode #')){
const lcNum=enriched.title.match(/LC(\d+)/);
const slug=lcNum?getLCSlug(parseInt(lcNum[1])):'';
if(slug){
enriched.content=`LeetCode #${lcNum?lcNum[1]:''} 原题\n\n题目链接：https://leetcode.cn/problems/${slug}/\n\n请在LeetCode上查看完整题目描述和官方题解。`;
}
}
if(!enriched.content||enriched.content.trim().length<20){
const catDesc={algorithm:'这是一道算法编程题，请在LeetCode或本地IDE上练习。',os:'这是一道操作系统相关面试题，涉及进程管理、内存管理、文件系统等核心概念。',network:'这是一道计算机网络面试题，涉及TCP/IP协议栈、HTTP、DNS等核心知识。',database:'这是一道数据库面试题，涉及SQL优化、索引原理、事务隔离等核心概念。',language:'这是一道编程语言面试题，涉及语言特性、内存模型、并发机制等。','system-design':'这是一道系统设计面试题，涉及架构设计、分布式系统、高可用等。',scenario:'这是一道场景面试题，需要结合实际项目经验进行回答。',frontend:'这是一道前端开发面试题，涉及JavaScript、CSS、框架等核心知识。',finance:'这是一道金融财会面试题，涉及会计、投资、银行、证券等专业知识。',law:'这是一道法律法务面试题，涉及民法、刑法、合同法等法律专业知识。',medical:'这是一道医疗卫生面试题，涉及临床医学、药学、护理等专业知识。',education:'这是一道教育培训面试题，涉及教学理论、课程设计、教育心理等知识。','civil-service':'这是一道公务员考试题，涉及行测、申论等考试内容。',hr:'这是一道人力资源面试题，涉及招聘、薪酬、绩效、劳动法等专业知识。',marketing:'这是一道市场营销面试题，涉及品牌、市场调研、数字营销等专业知识。'};
enriched.content=enriched.content?enriched.content+'\n\n'+(catDesc[enriched.category]||''):(catDesc[enriched.category]||'请根据题目关键词思考答案要点。');
}
return enriched;
}
function getAllQuestions(){
var c=Store.getCollected();
var key=c.length+'_'+(c.length?c[c.length-1].id:'');
if(_allQCache&&_allQCacheKey===key)return _allQCache;
var computerCats=new Set(['algorithm','os','network','database','system-design','frontend','language','scenario']);
var b=BUILTIN_QUESTIONS.filter(function(q){return q&&q.category&&computerCats.has(q.category)}).map(function(q){return Object.assign({},q,{sourceType:'builtin',type:q.type||'code'})});
var m=MULTI_DISCIPLINE_QUESTIONS.filter(function(q){return q&&q.category}).map(function(q){return Object.assign({},q,{sourceType:'builtin',type:q.type||'short'})});
var seen=new Set();
var deduped=b.concat(m).filter(function(q){if(!q||!q.title||seen.has(q.title))return false;seen.add(q.title);return true});
var col=c.map(function(q){return Object.assign({},q,{sourceType:'collected',type:q.type||'short'})});
_allQCache=deduped.concat(col);
_allQCacheKey=key;
return _allQCache;
}
function invalidateQuestionsCache(){_allQCache=null;_allQCacheKey=''}

const ParseEngine={
parse(t){if(!t||!t.trim())return[];let r;r=this.parseQA(t);if(r.length)return r;r=this.parseNumbered(t);if(r.length)return r;r=this.parseMarkdown(t);if(r.length)return r;r=this.parseParagraphs(t);return r},
parseQA(t){const r=[];const re=/(?:Q[:：]|问题[:：])\s*([\s\S]+?)(?=(?:A[:：]|答案[:：]))\s*(?:A[:：]|答案[:：])\s*([\s\S]+?)(?=(?:Q[:：]|问题[:：])|$)/gi;let m;while((m=re.exec(t))!==null)r.push({title:m[1].trim().substring(0,200),answer:m[2].trim(),category:this.detectCat(m[1]+' '+m[2]),difficulty:this.detectDiff(m[1])});return r},
parseNumbered(t){const r=[];const ls=t.split('\n');let cur=null;const re=/^\s*(\d+)[.、．)\s]+(.+)/;for(const l of ls){const m=l.match(re);if(m){if(cur)r.push(cur);cur={title:m[2].trim().substring(0,200),answer:'',category:this.detectCat(m[2]),difficulty:this.detectDiff(m[2])}}else if(cur&&l.trim())cur.answer+=(cur.answer?'\n':'')+l.trim()}if(cur)r.push(cur);return r},
parseMarkdown(t){const r=[];const ps=t.split(/^(#{1,3})\s+(.+)$/m);for(let i=1;i<ps.length;i+=3){const title=ps[i+1]?.trim();const content=ps[i+2]?.trim();if(title)r.push({title:title.substring(0,200),answer:content||'',category:this.detectCat(title+' '+(content||'')),difficulty:this.detectDiff(title)})}return r},
parseParagraphs(t){const r=[];const ps=t.split(/\n{2,}/).filter(p=>p.trim());for(let i=0;i<ps.length;i+=2){const title=ps[i].trim().substring(0,200);const answer=ps[i+1]?.trim()||'';if(title.length>5)r.push({title,answer,category:this.detectCat(title+' '+answer),difficulty:this.detectDiff(title)})}return r},
detectCat(t){const s={};for(const[c,ks]of Object.entries(KEYWORD_CATEGORY_MAP)){s[c]=0;for(const k of ks)if(t.includes(k))s[c]+=1}const b=Object.entries(s).sort((a,b)=>b[1]-a[1])[0];return b[1]>0?b[0]:'algorithm'},
detectDiff(t){for(const k of DIFFICULTY_KEYWORDS.hard)if(t.includes(k))return'hard';for(const k of DIFFICULTY_KEYWORDS.easy)if(t.includes(k))return'easy';return'medium'}
};

let currentPage='dashboard';
let currentParams={};
let questionFilters={search:'',category:'',difficulty:'',status:'',source:'',type:'',group:'',view:'list',page:1,pageSize:20};
let _searchDebounce=null;
let collectTab=0;
let parsedResults=[];

function navigate(p,params={}){
currentPage=p;currentParams=params;
let hash=p;
if(params.id){hash+='/'+params.id}
else if(p==='learnpath'&&(params.tab||params.guideCat||params.resCat)){hash+='/'+new URLSearchParams(params).toString()}
else if(p==='videos'&&params.category){hash+='/'+new URLSearchParams(params).toString()}
else if(p==='questions'&&params.category){hash+='/'+params.category}
else if(p==='practice'&&params.mode){hash+='/'+new URLSearchParams(params).toString()}
window.location.hash=hash;

const loader=document.getElementById('pageLoader');
const overlay=document.getElementById('loaderOverlay');
if(loader){loader.classList.add('show')}
if(overlay){overlay.classList.add('show')}

updatePageTitle(p,params);
requestAnimationFrame(()=>{renderPage();setTimeout(()=>{if(loader)loader.classList.remove('show');if(overlay)overlay.classList.remove('show')},200)});
}
function updatePageTitle(p,params){
if(p==='detail'&&params.id){
const q=getAllQuestions().find(q=>q.id===params.id);
if(q){document.title=`${q.title} - 面试通`;let descEl=document.querySelector('meta[name="description"]');if(!descEl){descEl=document.createElement('meta');descEl.name='description';document.head.appendChild(descEl)}descEl.content=q.content?q.content.substring(0,160):q.title;let ldEl=document.getElementById('structuredData');if(!ldEl){ldEl=document.createElement('script');ldEl.type='application/ld+json';ldEl.id='structuredData';document.head.appendChild(ldEl)}ldEl.textContent=JSON.stringify({"@context":"https://schema.org","@type":"Question","name":q.title,"text":q.content||q.title,"answerCount":q.answer?1:0,"suggestedAnswer":q.answer?{"@type":"Answer","text":q.answer.substring(0,500)}:undefined});return}
}
const titles={dashboard:'面试通 - 首页 | 2000+面试题',questions:'面试通 - 题库 | 2000+精选面试题',detail:'面试通 - 题目详情',collect:'面试通 - 收录中心',favorites:'面试通 - 收藏夹',stats:'面试通 - 学习统计',practice:'面试通 - 刷题练习',learnpath:'面试通 - 学习中心',resume:'面试通 - 我的简历',videos:'面试通 - 学习视频 | 精选优质资源','ai-assistant':'面试通 - AI面试助手'};
const descs={dashboard:'面试通 - 多学科面试刷题平台，2000+精选面试题，涵盖算法、金融、法律、医学、教育、公务员、HR、营销等15大分类',questions:'浏览全部2000+面试题，支持按分类、难度、状态筛选和搜索',detail:'查看面试题目详情、解析和代码示例',collect:'通过URL或JSON批量收录面试题',favorites:'查看已收藏的面试题',stats:'查看学习统计、打卡日历和成就徽章',practice:'每日一题、专项练习、随机刷题、限时挑战等多种练习模式',learnpath:'学习中心：学习路径、科学方法论、面试指南和推荐资源',resume:'编辑个人简历，自动关联学习数据，导出Markdown格式',videos:'精选B站优质学习视频，涵盖算法、操作系统、网络、数据库、公务员、金融财会等多个专业领域','ai-assistant':'AI智能面试助手，基于你的学习数据提供个性化建议和面试指导'};
document.title=(titles[p]||'面试通');
let descEl=document.querySelector('meta[name="description"]');
if(!descEl){descEl=document.createElement('meta');descEl.name='description';document.head.appendChild(descEl)}
descEl.content=descs[p]||descs['dashboard'];
let ogDesc=document.querySelector('meta[property="og:description"]');
if(ogDesc)ogDesc.content=descs[p]||descs['dashboard'];
}
function parseHash(){let h=window.location.hash.slice(1)||'dashboard';if(h.startsWith('/'))h=h.slice(1);const ps=h.split('/');currentPage=ps[0]||'dashboard';currentParams={};if(ps[1]){if(currentPage==='questions'){currentParams={category:ps[1]}}else if(currentPage==='learnpath'){try{const p=new URLSearchParams(ps[1]);currentParams=Object.fromEntries(p)}catch{currentParams={tab:ps[1]}}}else if(currentPage==='videos'){try{const p=new URLSearchParams(ps[1]);currentParams=Object.fromEntries(p)}catch{currentParams={category:ps[1]}}}else{currentParams={id:ps[1]}}}}
window.addEventListener('hashchange',()=>{parseHash();renderPage()});

function renderMobileModeBar(){
var el=document.getElementById('mobileModeBar');
if(!el||window.innerWidth>768){if(el)el.innerHTML='';return}
var currentMode=getProfessionalMode();
var h='<div style="display:flex;gap:6px;overflow-x:auto;padding:0 0 12px;-webkit-overflow-scrolling:touch;scrollbar-width:none">';
h+='<style>#mobileModeBar::-webkit-scrollbar{display:none}</style>';
for(var i=0;i<PROFESSIONAL_MODES.length;i++){
var m=PROFESSIONAL_MODES[i];
var active=m.id===currentMode;
h+='<button onclick="setProfessionalMode(\''+m.id+'\')" style="display:inline-flex;align-items:center;gap:4px;padding:6px 12px;border:1px solid '+(active?'var(--accent-cyan)':'var(--border-color)')+';border-radius:16px;background:'+(active?'rgba(34,211,238,.15)':'var(--bg-secondary)')+';color:'+(active?'var(--accent-cyan)':'var(--text-secondary)')+';font-size:12px;font-weight:'+(active?'600':'400')+';cursor:pointer;white-space:nowrap;transition:var(--transition);min-height:32px;flex-shrink:0">';
h+=m.icon+' '+m.name;
h+='</button>';
}
h+='</div>';
el.innerHTML=h;
}

function renderPage(){
const content=document.getElementById('content');
const sidebar=document.getElementById('sidebar');
const nav=document.getElementById('mainNav');
const allQ=getActiveQuestions();
renderMobileModeBar();
var isPracticePage=currentPage==='practice';
var currentMode=getProfessionalMode();
var currentModeObj=PROFESSIONAL_MODES.find(function(m){return m.id===currentMode})||PROFESSIONAL_MODES[0];
var activeInMore=false;
var moreNavs=[
{id:'videos',label:'学习视频',desc:'精选教程',icon:'<svg class="icon"><use href="#i-play-circle"/></svg>'},
{id:'ai-assistant',label:'AI助手',desc:'智能问答',icon:'<svg class="icon"><use href="#i-zap"/></svg>',color:'purple'},
{id:'learnpath',label:'学习中心',desc:'方法指南',icon:'<svg class="icon"><use href="#i-map"/></svg>'},
{id:'wrongbook',label:'错题本',desc:'查漏补缺',icon:'<svg class="icon"><use href="#i-refresh"/></svg>',badge:Store.getWrongBook().length,color:'red'},
{id:'collect',label:'收录中心',desc:'添加题目',icon:'<svg class="icon"><use href="#i-download"/></svg>',color:'orange'},
{id:'favorites',label:'收藏夹',desc:'我的收藏',icon:'<svg class="icon"><use href="#i-star"/></svg>'},
{id:'stats',label:'数据统计',desc:'学习报告',icon:'<svg class="icon"><use href="#i-chart"/></svg>'},
{id:'resume',label:'简历助手',desc:'面试简历',icon:'<svg class="icon"><use href="#i-user"/></svg>'}
];
for(var mi=0;mi<moreNavs.length;mi++){if(currentPage===moreNavs[mi].id){activeInMore=true;break}}
var h='<div class="nav-primary">';
h+='<a class="'+(currentPage==='dashboard'?'active':'')+'" onclick="navigate(\'dashboard\')"><svg class="icon"><use href="#i-home"/></svg> 首页</a>';
h+='<a class="'+(currentPage==='questions'?'active':'')+'" onclick="navigate(\'questions\')"><svg class="icon"><use href="#i-book"/></svg> 题库</a>';
if(isPracticePage){h+='<a class="active" onclick="navigate(\'practice\',{mode:\''+(currentParams.mode||'daily')+'\'})"><svg class="icon"><use href="#i-zap"/></svg> 练习</a>'}
else{h+='<a onclick="navigate(\'practice\',{mode:\'random\'})"><svg class="icon"><use href="#i-zap"/></svg> 练习</a>'}
h+='</div>';
h+='<div class="nav-mode-wrap"><button class="nav-mode-btn'+(currentMode!=='all'?' active-mode':'')+'" onclick="event.stopPropagation();toggleNavDropdown(\'modeDropdown\')">'+currentModeObj.icon+' '+currentModeObj.name+' <svg class="icon" style="width:12px;height:12px;transition:transform .2s" id="modeArrow"><use href="#i-chevron-down"/></svg></button>';
h+='<div class="nav-dropdown nav-mode-dropdown" id="modeDropdown">';
for(var modeIdx=0;modeIdx<PROFESSIONAL_MODES.length;modeIdx++){
var pm=PROFESSIONAL_MODES[modeIdx];
var pmActive=pm.id===currentMode;
h+='<a class="'+(pmActive?'active':'')+'" onclick="setProfessionalMode(\''+pm.id+'\');toggleNavDropdown(\'modeDropdown\',false)" style="'+(pmActive?'color:var(--accent-cyan)':'')+'">'+pm.icon+' <span>'+pm.name+'</span><span class="nav-item-desc">'+pm.desc+'</span></a>';
}
h+='</div></div>';
var moreBtnCls='nav-more-btn'+(activeInMore?' active':'');
h+='<div class="nav-more-wrap"><button class="'+moreBtnCls+'" onclick="event.stopPropagation();toggleNavDropdown(\'moreDropdown\')">'+(activeInMore?'● ':'')+'更多 <svg class="icon" style="width:14px;height:14px;transition:transform .2s" id="moreArrow"><use href="#i-chevron-down"/></svg></button>';
h+='<div class="nav-dropdown nav-more-dropdown" id="moreDropdown">';
for(var ni=0;ni<moreNavs.length;ni++){
var mn=moreNavs[ni];
var mActive=currentPage===mn.id;
var extraStyle='';
if(mn.color==='red')extraStyle=' style="color:var(--accent-red)"';
else if(mn.color==='orange')extraStyle=' style="color:var(--accent-orange)"';
else if(mn.color==='purple')extraStyle=' style="color:var(--accent-purple)"';
var badgeHtml=mn.badge?'<span class="nav-item-badge">'+mn.badge+'</span>':'';
h+='<a class="'+(mActive?'active':'')+'" onclick="navigate(\''+mn.id+'\');toggleNavDropdown(\'moreDropdown\',false)"'+extraStyle+'>'+mn.icon+' <span>'+mn.label+'</span>'+(mn.desc?'<span class="nav-item-desc">'+mn.desc+'</span>':'')+badgeHtml+'</a>';
}
h+='</div></div>';
nav.innerHTML=h;
renderSidebar();
const pages={dashboard:renderDashboard,questions:renderQuestions,detail:renderDetail,collect:renderCollect,favorites:renderFavorites,stats:renderStats,practice:renderPractice,learnpath:renderLearnPath,wrongbook:renderWrongBook,resume:renderResume,videos:renderVideos,'ai-assistant':renderAIAssistant};
content.innerHTML=`<div class="fade-in-page">${(pages[currentPage]||renderDashboard)()}</div>`;
content.scrollTop=0;
if(currentPage==='detail'){setupCodeEditor();setupNoteAutoSave();if(currentParams.autoAnswer){setTimeout(()=>{const s=document.getElementById('answerSection');if(s&&!s.classList.contains('open'))toggleAnswer();setTimeout(()=>{const f=s?.querySelector('.answer-full');const h=s?.querySelector('.answer-hint');if(f&&h&&f.style.display==='none'){h.style.display='none';f.style.display='block';const b=document.getElementById('answerBtn');if(b)b.innerHTML=svgIcon('i-eye-off','icon-sm')+' 收起答案'}},400);currentParams.autoAnswer=false},300)}}if(currentPage==='practice'&&currentParams.mode==='challenge')setTimeout(startChallengeTimer,100);
setupKeyboardHints();
closeSidebar();
}

function renderSidebar(){
const sidebar=document.getElementById('sidebar');
const allQ=getActiveQuestions();
if(currentPage==='questions'||currentPage==='detail'){
const cc={};CATEGORIES.forEach(c=>cc[c.id]=0);allQ.forEach(q=>{if(cc[q.category]!==undefined)cc[q.category]++});
const groupHtml=CATEGORY_GROUPS.map(g=>{
const cats=g.categories.map(cid=>CATEGORIES.find(c=>c.id===cid)).filter(Boolean);
const groupTotal=cats.reduce((s,c)=>s+(cc[c.id]||0),0);
return`<div class="sidebar-section"><div class="sidebar-title" style="color:${g.color}">${g.name} <span style="font-size:10px;opacity:.6">${groupTotal}</span></div>${cats.map(c=>`<div class="sidebar-item ${currentParams.category===c.id?'active':''}" onclick="navigate('questions',{category:'${c.id}'})">${svgIcon(c.icon,'icon-sm')} ${c.name} <span class="count">${cc[c.id]||0}</span></div>`).join('')}</div>`;
}).join('');
sidebar.innerHTML=`<div class="sidebar-section"><div class="sidebar-item ${!currentParams.category?'active':''}" onclick="navigate('questions')" style="font-weight:600">${svgIcon('i-book','icon-sm')} 全部题目 <span class="count">${allQ.length}</span></div></div>${groupHtml}<div class="sidebar-section" style="margin-top:12px"><div class="sidebar-title">学习工具</div><div class="sidebar-item" onclick="navigate('videos')">${svgIcon('i-play-circle','icon-sm')} 学习视频 <span class="count">${VIDEO_DATA.length}</span></div><div class="sidebar-item" onclick="navigate('ai-assistant')" style="color:var(--accent-purple)">${svgIcon('i-zap','icon-sm')} AI面试助手</div><div class="sidebar-item" onclick="navigate('learnpath')">${svgIcon('i-map','icon-sm')} 学习中心</div></div><div class="sidebar-section" style="margin-top:auto;padding-top:16px;border-top:1px solid var(--border-color)"><div class="sidebar-title">刷题模式</div><div class="sidebar-item" onclick="navigate('practice',{mode:'daily'})">${svgIcon('i-calendar','icon-sm')} 每日一题</div><div class="sidebar-item" onclick="navigate('practice',{mode:'category',category:'${currentParams.category||'algorithm'}'})">${svgIcon('i-book','icon-sm')} 专项练习</div><div class="sidebar-item" onclick="navigate('practice',{mode:'random'})">${svgIcon('i-shuffle','icon-sm')} 随机刷题</div><div class="sidebar-item" onclick="navigate('practice',{mode:'review'})" style="color:var(--accent-purple)">${svgIcon('i-zap','icon-sm')} 间隔复习 ${(()=>{const d=Store.getDueReviews().length;return d>0?`<span class="count" style="background:var(--accent-purple);color:#fff">${d}</span>`:''})()}</div><div class="sidebar-item" onclick="navigate('practice',{mode:'challenge'})">${svgIcon('i-zap','icon-sm')} 限时挑战</div><div class="sidebar-item" onclick="navigate('wrongbook')" style="color:var(--accent-red)">${svgIcon('i-refresh','icon-sm')} 错题本 <span class="count" style="background:var(--accent-red);color:#fff">${Store.getWrongBook().length}</span></div></div>`;
sidebar.style.display='flex';
}else{sidebar.style.display='none'}
}

function renderDashboard(){
const allQ=getActiveQuestions(),mastered=Store.getMastered(),masteredSet=new Set(mastered),favorites=Store.getFavorites(),collected=Store.getCollected(),streak=Store.getStreak(),todayCount=Store.getTodayCount();
const now=new Date();
const dayOfYear=Math.floor((now-new Date(now.getFullYear(),0,0))/(1000*60*60*24));
const seed=now.getFullYear()*1000+dayOfYear;
const dailyQ=allQ.length?allQ[seed%allQ.length]:null;
const dateStr=`${now.getMonth()+1}月${now.getDate()}日 星期${'日一二三四五六'[now.getDay()]}`;
const totalPct=allQ.length?Math.round(mastered.length/allQ.length*100):0;
const recentMastered=mastered.slice(-5).reverse().map(id=>allQ.find(q=>q.id===id)).filter(Boolean);
const nextUnmastered=allQ.find(q=>!masteredSet.has(q.id));
const diffIcon={easy:svgIcon('i-check','icon-sm'),medium:svgIcon('i-zap','icon-sm'),hard:svgIcon('i-fire','icon-sm')};
const dailyCatName=CATEGORY_MAP[dailyQ?.category]||dailyQ?.category||'';
const dailyTags=genTags(dailyQ).filter(t=>t!==dailyCatName);
const wrongBook=Store.getWrongBook();
const weakCats={};wrongBook.forEach(w=>{const q=allQ.find(x=>x.id===w.qid);if(q)weakCats[q.category]=(weakCats[q.category]||0)+1});
const topWeakCat=Object.entries(weakCats).sort((a,b)=>b[1]-a[1])[0];
const unmasteredByCat={};allQ.forEach(q=>{if(!masteredSet.has(q.id))unmasteredByCat[q.category]=(unmasteredByCat[q.category]||0)+1});
const topUnmasteredCat=Object.entries(unmasteredByCat).sort((a,b)=>b[1]-a[1])[0];
if(Store.getFirstVisit()&&!document.getElementById('guideOverlay')){setTimeout(()=>showFirstVisitGuide(),500)}
const heroGreeting=mastered.length===0?'开始你的刷题之旅':streak>=7?`连续${streak}天打卡，太棒了！`:totalPct>=50?`已完成${totalPct}%，继续加油！`:'每天进步一点点';
return`<div class="dashboard-hero fade-in" style="display:grid;grid-template-columns:1fr auto;gap:24px;align-items:center">
<div>
<h2 style="font-size:28px;font-weight:800;margin-bottom:6px;background:linear-gradient(135deg,var(--accent-cyan),var(--accent-gold));-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text">${mastered.length===0?'欢迎来到面试通！':'欢迎回来！'}</h2>
<p style="color:var(--text-secondary);font-size:14px;margin-bottom:16px">${heroGreeting}</p>
<div style="display:flex;gap:10px;flex-wrap:wrap">
<button class="btn btn-primary" style="font-size:15px;padding:12px 24px;box-shadow:0 4px 16px rgba(34,211,238,.3);animation:pulse-glow 2s ease-in-out infinite" onclick="navigate('practice',{mode:'random'})">${svgIcon('i-zap','icon-sm')} ${mastered.length===0?'立即挑战':'继续刷题'}</button>
<button class="btn btn-outline" style="font-size:14px" onclick="navigate('questions')">${svgIcon('i-book','icon-sm')} 探索题库</button>
</div>
</div>
<div style="text-align:center">
<div style="position:relative;width:120px;height:120px">
<svg viewBox="0 0 120 120" style="transform:rotate(-90deg)">
<circle cx="60" cy="60" r="52" fill="none" stroke="var(--bg-tertiary)" stroke-width="8"/>
<circle cx="60" cy="60" r="52" fill="none" stroke="url(#ringGrad)" stroke-width="8" stroke-linecap="round" stroke-dasharray="${2*Math.PI*52}" stroke-dashoffset="${2*Math.PI*52*(1-totalPct/100)}" style="transition:stroke-dashoffset 1s ease"/>
<defs><linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stop-color="var(--accent-cyan)"/><stop offset="100%" stop-color="var(--accent-gold)"/></linearGradient></defs>
</svg>
<div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);text-align:center">
<div style="font-size:28px;font-weight:800;color:var(--accent-cyan)">${totalPct}%</div>
<div style="font-size:11px;color:var(--text-muted)">掌握率</div>
<div style="font-size:10px;color:var(--text-muted)">${mastered.length}/${allQ.length}题</div>
</div>
</div>
</div>
</div>

${topWeakCat||topUnmasteredCat?`<div class="card slide-up" style="animation-delay:.05s;border-left:3px solid var(--accent-red);background:linear-gradient(135deg,rgba(239,68,68,.05),transparent)">
<div style="display:flex;align-items:center;gap:12px;margin-bottom:8px">
${svgIcon('i-lightbulb','icon-lg')}
<div><h3 style="margin:0;font-size:15px;color:var(--accent-gold)">智能推荐</h3><p style="margin:0;font-size:12px;color:var(--text-muted)">基于你的学习数据</p></div>
</div>
<div style="display:flex;gap:8px;flex-wrap:wrap">
${topWeakCat?`<button class="btn btn-outline btn-sm" style="border-color:var(--accent-red);color:var(--accent-red)" onclick="navigate('practice',{mode:'category',category:'${topWeakCat[0]}'})">${svgIcon('i-refresh','icon-sm')} 复习${CATEGORY_MAP[topWeakCat[0]]||topWeakCat[0]}（错${topWeakCat[1]}题）</button>`:''}
${topUnmasteredCat?`<button class="btn btn-outline btn-sm" onclick="navigate('practice',{mode:'category',category:'${topUnmasteredCat[0]}'})">${svgIcon('i-target','icon-sm')} 攻克${CATEGORY_MAP[topUnmasteredCat[0]]||topUnmasteredCat[0]}（${topUnmasteredCat[1]}题未掌握）</button>`:''}
${wrongBook.length>0?`<button class="btn btn-outline btn-sm" style="border-color:var(--accent-orange);color:var(--accent-orange)" onclick="navigate('wrongbook')">${svgIcon('i-refresh','icon-sm')} 错题复习（${wrongBook.length}题）</button>`:''}
${(()=>{const rs=Store.getReviewStats();if(rs.due>0)return`<button class="btn btn-outline btn-sm" style="border-color:var(--accent-purple);color:var(--accent-purple)" onclick="navigate('practice',{mode:'review'})">${svgIcon('i-zap','icon-sm')} 间隔复习（${rs.due}题到期）</button>`;return''})()}
</div>
</div>`:''}

${(()=>{const rs=Store.getReviewStats();if(rs.total===0)return'';return`<div class="card slide-up" style="animation-delay:.08s;border-left:3px solid var(--accent-purple)">
<div style="display:flex;align-items:center;gap:12px;margin-bottom:12px">
${svgIcon('i-zap','icon-lg')}
<div><h3 style="margin:0;font-size:15px;color:var(--accent-purple)">间隔复习计划</h3><p style="margin:0;font-size:12px;color:var(--text-muted)">基于艾宾浩斯遗忘曲线</p></div>
</div>
<div style="display:flex;gap:12px;flex-wrap:wrap;margin-bottom:12px">
<div style="flex:1;min-width:100px;padding:10px;background:var(--bg-primary);border-radius:8px;text-align:center"><div style="font-size:20px;font-weight:700;color:var(--accent-purple)">${rs.due}</div><div style="font-size:11px;color:var(--text-muted)">待复习</div></div>
<div style="flex:1;min-width:100px;padding:10px;background:var(--bg-primary);border-radius:8px;text-align:center"><div style="font-size:20px;font-weight:700;color:var(--accent-cyan)">${rs.total-rs.due}</div><div style="font-size:11px;color:var(--text-muted)">已巩固</div></div>
<div style="flex:1;min-width:100px;padding:10px;background:var(--bg-primary);border-radius:8px;text-align:center"><div style="font-size:20px;font-weight:700;color:var(--accent-gold)">${rs.total}</div><div style="font-size:11px;color:var(--text-muted)">总计划</div></div>
</div>
<div style="display:flex;gap:4px;align-items:center;margin-bottom:8px">
<span style="font-size:11px;color:var(--text-muted);width:40px">记忆度</span>
${[0,1,2,3,4,5].map(l=>{const pct=rs.total?Math.round((rs.levels[l]||0)/rs.total*100):0;return`<div style="flex:1;text-align:center"><div style="height:${Math.max(pct,4)}px;background:${l<2?'var(--accent-red)':l<4?'var(--accent-gold)':'var(--accent-cyan)'};border-radius:2px;margin-bottom:2px"></div><div style="font-size:9px;color:var(--text-muted)">L${l}</div></div>`}).join('')}
</div>
${rs.due>0?`<button class="btn btn-primary btn-sm" style="width:100%;background:var(--accent-purple)" onclick="navigate('practice',{mode:'review'})">开始复习 ${rs.due} 道到期题目</button>`:`<div style="text-align:center;color:var(--text-muted);font-size:13px;padding:8px">✅ 今日复习任务已完成，继续保持！</div>`}
</div>`})()}

<div class="stat-grid slide-up" style="animation-delay:.1s">
<div class="stat-card" style="border-left:3px solid var(--accent-orange)"><div class="stat-number" style="color:var(--accent-orange)">${streak}<span style="font-size:14px;font-weight:400"> 天</span></div><div class="stat-label"><svg class="icon-sm" style="color:var(--accent-orange)"><use href="#i-fire"/></svg> 连续打卡</div></div>
<div class="stat-card" style="border-left:3px solid var(--difficulty-easy)"><div class="stat-number" style="color:var(--difficulty-easy)">${mastered.length}<span style="font-size:14px;font-weight:400"> / ${allQ.length}</span></div><div class="stat-label"><svg class="icon-sm" style="color:var(--difficulty-easy)"><use href="#i-check"/></svg> 已掌握</div></div>
<div class="stat-card" style="border-left:3px solid var(--accent-gold)"><div class="stat-number" style="color:var(--accent-gold)">${favorites.length}<span style="font-size:14px;font-weight:400"> 题</span></div><div class="stat-label"><svg class="icon-sm" style="color:var(--accent-gold)"><use href="#i-star"/></svg> 收藏</div></div>
<div class="stat-card" style="border-left:3px solid var(--accent-cyan)"><div class="stat-number" style="color:var(--accent-cyan)">${allQ.length-mastered.length}<span style="font-size:14px;font-weight:400"> 题</span></div><div class="stat-label"><svg class="icon-sm" style="color:var(--accent-cyan)"><use href="#i-target"/></svg> 待攻克</div></div>
</div>

${dailyQ?`<div class="card slide-up" style="animation-delay:.2s;border-left:3px solid var(--accent-gold)">
<div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;margin-bottom:16px">
<h3 style="margin-bottom:0;color:var(--accent-gold)"><svg class="icon-sm"><use href="#i-calendar"/></svg> 今日一题 <span style="font-size:13px;color:var(--text-muted);font-weight:400">· ${dateStr}</span></h3>
<button class="btn btn-outline btn-sm" onclick="navigate('practice',{mode:'daily'})" style="font-size:12px;padding:4px 10px">换一题</button>
</div>
<div style="padding:20px;background:var(--bg-primary);border-radius:var(--radius);border:1px solid var(--border-color)">
<div style="font-size:18px;font-weight:700;margin-bottom:12px;line-height:1.5">${dailyQ.title}</div>
<div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center;margin-bottom:14px">
<span class="difficulty-tag difficulty-${dailyQ.difficulty}">${diffIcon[dailyQ.difficulty]||''} ${DIFF_LABELS[dailyQ.difficulty]}</span>
<span class="category-tag">${CATEGORY_MAP[dailyQ.category]||dailyQ.category}</span>
${dailyTags.map(t=>`<span class="tag-item">${t}</span>`).join('')}
</div>
${dailyQ.content?`<div class="daily-content-preview" style="font-size:13px;color:var(--text-secondary);line-height:1.7;margin-bottom:16px;padding:12px;background:var(--bg-secondary);border-radius:var(--radius-sm);border-left:3px solid var(--accent-cyan);max-height:80px;overflow:hidden;position:relative"><div style="mask-image:linear-gradient(to bottom,black 60%,transparent 100%);-webkit-mask-image:linear-gradient(to bottom,black 60%,transparent 100%)">${dailyQ.content.split('\n').filter(l=>!l.startsWith('http')).join(' ').substring(0,150)}...</div></div>`:''}
<div style="display:flex;gap:10px;flex-wrap:wrap">
<button class="btn btn-primary" onclick="navigate('detail',{id:'${dailyQ.id}'})" style="flex:1;min-width:120px"><svg class="icon-sm"><use href="#i-zap"/></svg> 开始做题</button>
<button class="btn btn-secondary" onclick="navigate('detail',{id:'${dailyQ.id}',autoAnswer:true})" style="flex:1;min-width:120px"><svg class="icon-sm"><use href="#i-eye"/></svg> 查看题解</button>
</div>
</div>
</div>`:''}

<div class="card slide-up" style="animation-delay:.3s">
<h3 style="margin-bottom:16px"><svg class="icon-sm"><use href="#i-check"/></svg> 最近做题</h3>
${recentMastered.length?`<div style="display:flex;flex-direction:column;gap:2px">${recentMastered.map(q=>`<div class="question-card" onclick="navigate('detail',{id:'${q.id}'})" style="padding:10px 14px"><div style="display:flex;justify-content:space-between;align-items:center;min-width:0"><span style="font-size:14px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;flex:1">${q.title}</span><span class="difficulty-tag difficulty-${q.difficulty}" style="font-size:10px;margin-left:8px">${DIFF_LABELS[q.difficulty]}</span></div></div>`).join('')}</div>`:`${emptyState('<svg class="icon-lg"><use href="#i-edit"/></svg>','暂无做题记录','开始你的第一道题，迈出刷题第一步！','前往刷题 →',`navigate('detail',{id:'${nextUnmastered?nextUnmastered.id:''}'})`)}`}
</div>

<div class="card slide-up" style="animation-delay:.25s">
<h3 style="margin-bottom:16px">${svgIcon('i-chart','icon-sm')} 分类进度</h3>
<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:8px">
${CATEGORIES.slice(0,12).map(cat=>{
const catQ=allQ.filter(q=>q.category===cat.id);
const catM=catQ.filter(q=>masteredSet.has(q.id)).length;
const catPct=catQ.length?Math.round(catM/catQ.length*100):0;
const barColor=catPct>=80?'var(--difficulty-easy)':catPct>=50?'var(--accent-gold)':catPct>=20?'var(--accent-orange)':'var(--difficulty-hard)';
return`<div style="padding:10px 12px;background:var(--bg-primary);border-radius:var(--radius-sm);border:1px solid var(--border-color);cursor:pointer;transition:var(--transition)" onclick="navigate('questions',{category:'${cat.id}'})" onmouseover="this.style.borderColor='var(--accent-cyan)'" onmouseout="this.style.borderColor='var(--border-color)'">
<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px">
<span style="font-size:13px;font-weight:500">${cat.name}</span>
<span style="font-size:12px;color:${barColor};font-weight:600">${catPct}%</span>
</div>
<div style="height:4px;background:var(--bg-tertiary);border-radius:2px;overflow:hidden"><div style="height:100%;width:${catPct}%;background:${barColor};border-radius:2px;transition:width .5s"></div></div>
<div style="font-size:11px;color:var(--text-muted);margin-top:4px">${catM}/${catQ.length}题</div>
</div>`}).join('')}
</div>
</div>

<div class="quick-actions slide-up" style="animation-delay:.4s">
<div class="quick-action" onclick="navigate('practice',{mode:'random'})" role="button" tabindex="0" aria-label="随机刷题"><div class="action-icon">${svgIcon('i-shuffle','icon-xl')}</div><div class="action-title">随机刷题</div><div class="action-desc">练习未掌握题</div></div>
<div class="quick-action" onclick="navigate('practice',{mode:'challenge'})" role="button" tabindex="0" aria-label="限时挑战"><div class="action-icon">${svgIcon('i-zap','icon-xl')}</div><div class="action-title">限时挑战</div><div class="action-desc">5分钟答5题</div></div>
<div class="quick-action" onclick="navigate('videos')" role="button" tabindex="0" aria-label="学习视频"><div class="action-icon" style="color:var(--accent-cyan)">${svgIcon('i-play-circle','icon-xl')}</div><div class="action-title">学习视频</div><div class="action-desc">22门优质课程</div></div>
<div class="quick-action" onclick="navigate('ai-assistant')" role="button" tabindex="0" aria-label="AI助手"><div class="action-icon" style="color:var(--accent-purple)">${svgIcon('i-zap','icon-xl')}</div><div class="action-title">AI面试助手</div><div class="action-desc">智能指导+模拟面试</div></div>
<div class="quick-action" onclick="navigate('questions')" role="button" tabindex="0" aria-label="题库浏览"><div class="action-icon">${svgIcon('i-book','icon-xl')}</div><div class="action-title">题目列表</div><div class="action-desc">浏览所有题目</div></div>
<div class="quick-action" onclick="navigate('wrongbook')" role="button" tabindex="0" aria-label="错题本"><div class="action-icon" style="color:var(--accent-red)">${svgIcon('i-refresh','icon-xl')}</div><div class="action-title">错题本</div><div class="action-desc">${wrongBook.length}题待复习</div></div>
</div>
`;
}

function showFirstVisitGuide(){
if(document.getElementById('guideOverlay'))return;
const overlay=document.createElement('div');
overlay.className='guide-overlay';
overlay.id='guideOverlay';
overlay.onclick=function(e){closeGuide()};
overlay.innerHTML=`<div class="guide-content" onclick="event.stopPropagation()"><h2>${svgIcon('i-lightbulb','icon-lg')} 欢迎使用面试通</h2><p>面向多学科求职面试的综合刷题平台<br>涵盖算法、金融、法律、医学、教育、公务员、HR、营销、通用面试、逻辑推理等22大分类，支持6种题型</p><div class="guide-features"><div class="guide-feature"><span class="feature-icon">${svgIcon('i-book','icon-xl')}</span><span><strong>2000+ 精选面试题</strong><br>覆盖22大专业分类，含LeetCode高频题</span></div><div class="guide-feature"><span class="feature-icon">${svgIcon('i-check-circle','icon-xl')}</span><span><strong>6种题型</strong><br>单选/多选/简答/案例分析/编程/判断</span></div><div class="guide-feature"><span class="feature-icon">${svgIcon('i-target','icon-xl')}</span><span><strong>多种练习模式</strong><br>每日一题 / 专项 / 随机 / 限时挑战</span></div><div class="guide-feature"><span class="feature-icon">${svgIcon('i-chart','icon-xl')}</span><span><strong>数据统计</strong><br>可视化进度、错题本、成就系统</span></div></div><button class="btn btn-primary" style="width:100%;padding:14px;font-size:16px" onclick="closeGuide()">开始刷题之旅 →</button></div>`;
document.body.appendChild(overlay);
}

function closeGuide(){
const overlay=document.getElementById('guideOverlay');
if(overlay){overlay.remove();Store.setFirstVisit(false)}
}

function showSharePoster(){
const allQ=getActiveQuestions(),mastered=Store.getMastered(),favorites=Store.getFavorites(),streak=Store.getStreak();
const totalPct=allQ.length?Math.round(mastered.length/allQ.length*100):0;
const modal=document.createElement('div');
modal.className='guide-overlay';
modal.id='shareModal';
modal.onclick=function(e){if(e.target===modal)modal.remove()};
modal.innerHTML=`<div class="share-poster" onclick="event.stopPropagation()"><div class="share-poster-title">面试通</div><div class="share-poster-subtitle">多学科面试刷题平台</div><div class="share-stats-row"><div class="share-stat"><div class="share-stat-value">${mastered.length}</div><div class="share-stat-label">已掌握</div></div><div class="share-stat"><div class="share-stat-value">${totalPct}%</div><div class="share-stat-label">掌握率</div></div><div class="share-stat"><div class="share-stat-value">${streak}</div><div class="share-stat-label">连续打卡</div></div></div><div style="position:relative;padding:16px;background:rgba(255,255,255,.05);border-radius:8px;margin-bottom:20px"><p style="font-size:13px;color:var(--text-secondary);position:relative">"${mastered.length===0?'我正在使用面试通刷题，一起加入吧！':`我已完成 ${mastered.length} 道面试题，掌握率 ${totalPct}%，连续打卡 ${streak} 天！`}"</p></div><button class="btn btn-primary" style="position:relative;width:100%" onclick="downloadSharePoster()">${svgIcon('i-download','icon-sm')} 保存海报</button><button class="btn btn-outline" style="position:relative;margin-top:8px;width:100%" onclick="document.getElementById('shareModal').remove()">关闭</button></div>`;
document.body.appendChild(modal);
}

function downloadSharePoster(){
const canvas=document.createElement('canvas');
canvas.width=400;height=560;
const ctx=canvas.getContext('2d');
const isDark=document.documentElement.getAttribute('data-theme')!=='light';
ctx.fillStyle=isDark?'#0a0e1a':'#f0f4f8';
ctx.fillRect(0,0,400,560);
ctx.fillStyle='#00e5ff';
ctx.font='bold 32px Fira Sans, sans-serif';
ctx.textAlign='center';
ctx.fillText('面试通',200,60);
ctx.fillStyle=isDark?'#8b9cc0':'#475569';
ctx.font='16px Fira Sans, sans-serif';
ctx.fillText('多学科面试刷题平台',200,95);
ctx.strokeStyle='#00e5ff';
ctx.lineWidth=2;
ctx.beginPath();
ctx.moveTo(50,115);
ctx.lineTo(350,115);
ctx.stroke();
const allQ=getActiveQuestions(),mastered=Store.getMastered(),favorites=Store.getFavorites(),streak=Store.getStreak();
const totalPct=allQ.length?Math.round(mastered.length/allQ.length*100):0;
const stats=[
{label:'已掌握',value:mastered.length+' 题',color:'#00e676'},
{label:'掌握率',value:totalPct+'%',color:'#00e5ff'},
{label:'连续打卡',value:streak+' 天',color:'#ffb300'}
];
stats.forEach((s,i)=>{
const x=80+i*120;
ctx.fillStyle=s.color;
ctx.font='bold 28px Fira Sans, sans-serif';
ctx.textAlign='center';
ctx.fillText(s.value,x,180);
ctx.fillStyle=isDark?'#7a8ba8':'#5a6778';
ctx.font='13px Fira Sans, sans-serif';
ctx.fillText(s.label,x,205);
});
ctx.fillStyle=isDark?'#1f2937':'#e2e8f0';
ctx.beginPath();
ctx.roundRect(30,235,340,180,12);
ctx.fill();
ctx.fillStyle=isDark?'#e8edf5':'#0f172a';
ctx.font='bold 15px Fira Sans, sans-serif';
ctx.textAlign='center';
const quote=mastered.length===0?'我正在使用面试通刷题，一起加入吧！':`我已完成 ${mastered.length} 道面试题\n掌握率 ${totalPct}%，连续打卡 ${streak} 天！`;
const lines=quote.split('\n');
lines.forEach((line,i)=>{ctx.fillText(line,200,280+i*25)});
ctx.fillStyle=isDark?'#7a8ba8':'#5a6778';
ctx.font='12px Fira Sans, sans-serif';
ctx.fillText('扫码或访问',200,450);
ctx.fillStyle='#00e5ff';
ctx.font='14px Fira Sans, sans-serif';
ctx.fillText('https://w020316.github.io/-/',200,475);
ctx.fillStyle=isDark?'#5a6778':'#94a3b8';
ctx.font='11px Fira Sans, sans-serif';
ctx.fillText('面试通 © 2026 · 1400+精选题目',200,530);
const link=document.createElement('a');
link.download='面试通-刷题海报-'+new Date().toISOString().slice(0,10)+'.png';
link.href=canvas.toDataURL('image/png');
link.click();
toast('海报已保存！','success');
}

function renderQuestions(){
const allQ=getActiveQuestions(),mastered=Store.getMastered(),masteredSet=new Set(mastered),favorites=Store.getFavorites(),favoritesSet=new Set(favorites);
if(currentParams.category)questionFilters.category=currentParams.category;else questionFilters.category='';
let filtered=[...allQ];
if(questionFilters.category)filtered=filtered.filter(q=>q.category===questionFilters.category);
if(questionFilters.group){const g=CATEGORY_GROUPS.find(g=>g.id===questionFilters.group);if(g)filtered=filtered.filter(q=>g.categories.includes(q.category))}
if(questionFilters.difficulty)filtered=filtered.filter(q=>q.difficulty===questionFilters.difficulty);
if(questionFilters.type)filtered=filtered.filter(q=>(q.type||'short')===questionFilters.type);
if(questionFilters.search){const s=questionFilters.search.toLowerCase();filtered=filtered.filter(q=>q.title.toLowerCase().includes(s)||(q.content&&q.content.toLowerCase().includes(s))||(q.tags&&q.tags.some(t=>t.toLowerCase().includes(s))))}
if(questionFilters.status==='mastered')filtered=filtered.filter(q=>masteredSet.has(q.id));
else if(questionFilters.status==='unmastered')filtered=filtered.filter(q=>!masteredSet.has(q.id));
else if(questionFilters.status==='favorited')filtered=filtered.filter(q=>favoritesSet.has(q.id));
if(questionFilters.source==='builtin')filtered=filtered.filter(q=>q.sourceType==='builtin');
else if(questionFilters.source==='collected')filtered=filtered.filter(q=>q.sourceType==='collected');
const isGrid=questionFilters.view==='grid';
const page=questionFilters.page||1;
const pageSize=questionFilters.pageSize||20;
const totalPages=Math.ceil(filtered.length/pageSize);
const paged=filtered.slice((page-1)*pageSize,page*pageSize);
const startIdx=(page-1)*pageSize;
const typeOpts=Object.values(Q_TYPES).map(t=>`<option value="${t.id}" ${questionFilters.type===t.id?'selected':''}>${t.name}</option>`).join('');
const groupOpts=CATEGORY_GROUPS.map(g=>`<option value="${g.id}" ${questionFilters.group===g.id?'selected':''}>${g.name}</option>`).join('');
return`<div class="search-bar"><input class="search-input" placeholder="搜索题目/标签..." aria-label="搜索题目" role="searchbox" value="${questionFilters.search}" oninput="clearTimeout(_searchDebounce);_searchDebounce=setTimeout(()=>{questionFilters.search=this.value;questionFilters.page=1;renderPage()},300)"><select class="search-input" onchange="questionFilters.group=this.value;questionFilters.category='';questionFilters.page=1;renderPage()"><option value="">全部领域</option>${groupOpts}</select><select class="search-input" onchange="questionFilters.category=this.value;questionFilters.page=1;renderPage()"><option value="">全部分类</option>${CATEGORIES.map(c=>`<option value="${c.id}" ${questionFilters.category===c.id?'selected':''}>${c.name}</option>`).join('')}</select><select class="search-input" onchange="questionFilters.type=this.value;questionFilters.page=1;renderPage()"><option value="">全部题型</option>${typeOpts}</select><select class="search-input" onchange="questionFilters.difficulty=this.value;questionFilters.page=1;renderPage()"><option value="">全部难度</option><option value="easy" ${questionFilters.difficulty==='easy'?'selected':''}>简单</option><option value="medium" ${questionFilters.difficulty==='medium'?'selected':''}>中等</option><option value="hard" ${questionFilters.difficulty==='hard'?'selected':''}>困难</option></select><select class="search-input" onchange="questionFilters.status=this.value;questionFilters.page=1;renderPage()"><option value="">全部状态</option><option value="mastered" ${questionFilters.status==='mastered'?'selected':''}>已掌握</option><option value="unmastered" ${questionFilters.status==='unmastered'?'selected':''}>未掌握</option><option value="favorited" ${questionFilters.status==='favorited'?'selected':''}>已收藏</option></select><div class="view-toggle"><button class="${!isGrid?'active':''}" onclick="questionFilters.view='list';renderPage()">列表</button><button class="${isGrid?'active':''}" onclick="questionFilters.view='grid';renderPage()">卡片</button></div></div><div style="margin-bottom:12px;font-size:13px;color:var(--text-muted)">共 ${filtered.length} 道题目${totalPages>1?`，第 ${page}/${totalPages} 页`:''}</div>${filtered.length===0?'<div class="empty-state"><div class="empty-icon">'+svgIcon('i-search','icon-2xl')+'</div><div class="empty-title">没有找到匹配的题目</div><div class="empty-desc">试试调整筛选条件或切换专业模式</div><div style="display:flex;gap:8px;justify-content:center;margin-top:12px"><button class="btn btn-primary" onclick="questionFilters.search=\'\';questionFilters.category=\'\';questionFilters.difficulty=\'\';questionFilters.status=\'\';questionFilters.type=\'\';questionFilters.group=\'\';questionFilters.page=1;renderPage()">清除筛选</button><button class="btn btn-outline" onclick="setProfessionalMode(\'all\')">切换全部模式</button></div></div>':`<div class="${isGrid?'question-grid':''}">${paged.map((q,i)=>{const im=masteredSet.has(q.id),if2=favoritesSet.has(q.id);const qType=q.type||'short';const typeTag=qType!=='short'?`<span style="display:inline-block;padding:1px 6px;border-radius:6px;font-size:10px;font-weight:600;background:rgba(179,136,255,.15);color:var(--accent-purple)">${Q_TYPE_MAP[qType]||'简答'}</span>`:'';return`<div class="question-card" onclick="navigate('detail',{id:'${q.id}'})"><div class="q-number">${startIdx+i+1}</div><div class="q-info"><div class="q-title">${q.title}</div><div class="q-meta"><span class="difficulty-tag difficulty-${q.difficulty}">${DIFF_LABELS[q.difficulty]}</span><span class="category-tag">${CATEGORY_MAP[q.category]||q.category}</span>${typeTag}<span class="source-badge ${q.sourceType}">${q.sourceType==='builtin'?'内置':'收录'}</span></div></div><div class="q-actions" onclick="event.stopPropagation()"><button onclick="Store.toggleFavorite('${q.id}');renderPage()" title="收藏" style="color:${if2?'var(--accent-gold)':'var(--text-muted)'};cursor:pointer;opacity:${if2?'1':'.4'};transition:opacity .2s">${svgIcon('i-star','icon-sm')}</button><button onclick="Store.toggleMastered('${q.id}');renderPage()" title="掌握" style="color:${im?'var(--difficulty-easy)':'var(--text-muted)'};cursor:pointer;opacity:${im?'1':'.4'};transition:opacity .2s">${svgIcon('i-check','icon-sm')}</button></div></div>`}).join('')}</div>${totalPages>1?`<div class="pagination"><button ${page<=1?'disabled':''} onclick="questionFilters.page=${page-1};renderPage()">← 上一页</button><span class="page-info">${page} / ${totalPages}</span><button ${page>=totalPages?'disabled':''} onclick="questionFilters.page=${page+1};renderPage()">下一页 →</button></div>`:''}`}`;
}

function renderLearnPath(){
const allQ=getActiveQuestions(),mastered=Store.getMastered(),masteredSet=new Set(mastered);
const activeTab=currentParams.tab||'paths';
const paths=[
{id:'basics',name:'基础入门',desc:'从零开始，掌握计算机核心概念',icon:'i-sprout',color:'var(--difficulty-easy)',categories:['algorithm'],difficulties:['easy'],target:30},
{id:'os-net',name:'OS与网络',desc:'操作系统和计算机网络核心知识',icon:'i-cpu',color:'var(--accent-cyan)',categories:['os','network'],difficulties:['easy','medium'],target:40},
{id:'db-lang',name:'数据库与语言',desc:'数据库原理和编程语言特性',icon:'i-database',color:'var(--accent-gold)',categories:['database','language'],difficulties:['easy','medium'],target:40},
{id:'advanced',name:'系统设计进阶',desc:'分布式、微服务、高并发场景',icon:'i-rocket',color:'var(--accent-orange)',categories:['system-design','scenario'],difficulties:['medium','hard'],target:30},
{id:'finance-law',name:'金融与法律',desc:'金融财会和法律法务核心知识',icon:'i-trending',color:'#00e676',categories:['finance','law'],difficulties:['easy','medium'],target:30},
{id:'med-edu',name:'医学与教育',desc:'医疗卫生和教育培训专业知识',icon:'i-heart',color:'#ff5252',categories:['medical','education'],difficulties:['easy','medium'],target:20},
{id:'civil-hr',name:'公考与人力',desc:'公务员行测和人力资源专业知识',icon:'i-flag',color:'#7c4dff',categories:['civil-service','hr'],difficulties:['easy','medium'],target:20},
{id:'marketing-pro',name:'市场营销',desc:'品牌运营、数字营销、消费者行为',icon:'i-megaphone',color:'#ff6d00',categories:['marketing'],difficulties:['easy','medium','hard'],target:15},
{id:'master',name:'全科精通',desc:'挑战困难题，全面掌握',icon:'i-crown',color:'var(--difficulty-hard)',categories:['algorithm','os','network','database','language','system-design','scenario','finance','law','medical','education','civil-service','hr','marketing'],difficulties:['hard'],target:20}
];
const pathStats=paths.map(path=>{
const pathCatSet=new Set(path.categories);const pathDiffSet=new Set(path.difficulties);
let pathTotal=0,pathMastered=0;allQ.forEach(q=>{if(pathCatSet.has(q.category)&&pathDiffSet.has(q.difficulty)){pathTotal++;if(masteredSet.has(q.id))pathMastered++}});
return{total:pathTotal,mastered:pathMastered,pct:pathTotal?Math.round(pathMastered/pathTotal*100):0};
});
const tabs=[{id:'paths',label:'学习路径',icon:'i-map'},{id:'methods',label:'学习方法',icon:'i-lightbulb'},{id:'guides',label:'面试指南',icon:'i-target'},{id:'resources',label:'推荐资源',icon:'i-book'}];
const tabHtml=tabs.map(t=>`<button class="tab-btn ${activeTab===t.id?'active':''}" onclick="navigate('learnpath',{tab:'${t.id}'})" style="${activeTab===t.id?'color:var(--accent-cyan);border-bottom-color:var(--accent-cyan)':''}">${svgIcon(t.icon,'icon-sm')} ${t.label}</button>`).join('');
let contentHtml='';
if(activeTab==='paths'){
contentHtml=`<div style="display:flex;flex-direction:column;gap:16px">
${paths.map((path,pi)=>{
const ps=pathStats[pi];
return`<div class="card slide-up" style="animation-delay:${pi*.1}s">
<div style="display:flex;align-items:center;gap:16px;flex-wrap:wrap">
<div style="min-width:48px;text-align:center;color:${path.color}">${svgIcon(path.icon,'icon-2xl')}</div>
<div style="flex:1;min-width:200px">
<div style="display:flex;align-items:center;gap:8px;margin-bottom:4px">
<h3 style="margin:0;color:${path.color}">${path.name}</h3>
<span style="font-size:12px;color:var(--text-muted)">${path.categories.map(c=>CATEGORY_MAP[c]||c).join(' · ')}</span>
</div>
<p style="font-size:13px;color:var(--text-secondary);margin:0">${path.desc}</p>
<div style="display:flex;align-items:center;gap:12px;margin-top:8px">
<div style="flex:1;height:6px;background:var(--bg-tertiary);border-radius:3px;overflow:hidden"><div style="height:100%;width:${ps.pct}%;background:${path.color};border-radius:3px;transition:width .5s"></div></div>
<span style="font-size:13px;font-weight:600;color:${path.color}">${ps.pct}%</span>
<span style="font-size:12px;color:var(--text-muted)">${ps.mastered}/${ps.total}题</span>
</div>
</div>
<div style="display:flex;gap:8px;flex-wrap:wrap">
<button class="btn btn-primary btn-sm" onclick="navigate('practice',{mode:'category',category:'${path.categories[0]}'})">开始学习</button>
<button class="btn btn-outline btn-sm" onclick="navigate('questions',{category:'${path.categories[0]}'})">查看题目</button>
</div>
</div>
</div>`}).join('')}
</div>
<div class="card" style="margin-top:24px">
<h3 style="margin-bottom:16px">${svgIcon('i-calendar','icon-sm')} 今日学习计划</h3>
${(()=>{
const unmastered=allQ.filter(q=>!masteredSet.has(q.id));
const easyUn=unmastered.filter(q=>q.difficulty==='easy');
const medUn=unmastered.filter(q=>q.difficulty==='medium');
const plan=[];
if(easyUn.length)plan.push({text:`完成 3 道简单题`,icon:'i-check',count:3,qs:easyUn.slice(0,3)});
if(medUn.length)plan.push({text:`挑战 2 道中等题`,icon:'i-zap',count:2,qs:medUn.slice(0,2)});
plan.push({text:`复习 1 道已掌握的题`,icon:'i-refresh',count:1,qs:mastered.slice(-1).map(id=>allQ.find(q=>q.id===id)).filter(Boolean)});
if(!plan.length||!unmastered.length)return`<div style="text-align:center;padding:20px;color:var(--text-muted)">${svgIcon('i-trophy','icon-lg')} 所有题目已掌握！</div>`;
return`<div style="display:flex;flex-direction:column;gap:12px">${plan.map(p=>`<div style="display:flex;align-items:center;gap:12px;padding:12px;background:var(--bg-primary);border-radius:var(--radius-sm);border:1px solid var(--border-color)"><span style="font-size:20px;display:flex;align-items:center">${svgIcon(p.icon,'icon-lg')}</span><span style="flex:1;font-size:14px">${p.text}</span>${p.qs.length?`<button class="btn btn-primary btn-sm" onclick="navigate('detail',{id:'${p.qs[0].id}'})">开始 →</button>`:''}</div>`).join('')}</div>`
})()}
</div>`;
}else if(activeTab==='methods'){
contentHtml=`<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(340px,1fr));gap:16px">
${LEARNING_METHODS.map((m,mi)=>{
const relatedCats=m.applyTo.map(c=>CATEGORY_MAP[c]||c).slice(0,4).join('、');
return`<div class="card slide-up" style="animation-delay:${mi*.08}s;border-top:3px solid ${m.color}">
<div style="display:flex;align-items:center;gap:12px;margin-bottom:12px">
<div style="width:48px;height:48px;border-radius:12px;background:${m.color}15;display:flex;align-items:center;justify-content:center;color:${m.color}">${svgIcon(m.icon,'icon-xl')}</div>
<div><h3 style="margin:0;font-size:17px;color:${m.color}">${m.name}</h3><p style="margin:0;font-size:12px;color:var(--text-muted)">${relatedCats}</p></div>
</div>
<p style="font-size:13px;color:var(--accent-gold);margin-bottom:12px;padding:8px 12px;background:rgba(255,179,0,.06);border-radius:var(--radius-sm);border-left:3px solid var(--accent-gold);line-height:1.6">💡 ${m.principle}</p>
<div style="margin-bottom:12px">
<h4 style="font-size:13px;color:var(--text-secondary);margin-bottom:8px">实施步骤</h4>
${m.steps.map((s,si)=>`<div style="display:flex;align-items:flex-start;gap:8px;margin-bottom:6px;font-size:13px;color:var(--text-secondary);line-height:1.5"><span style="min-width:20px;height:20px;border-radius:50%;background:${m.color}20;color:${m.color};display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:600;flex-shrink:0">${si+1}</span><span>${s}</span></div>`).join('')}
</div>
<div style="padding:10px 12px;background:var(--bg-primary);border-radius:var(--radius-sm);border:1px solid var(--border-color)">
<h4 style="font-size:12px;color:var(--accent-cyan);margin-bottom:6px">实用技巧</h4>
${m.tips.map(t=>`<div style="font-size:12px;color:var(--text-secondary);margin-bottom:4px;line-height:1.5">▸ ${t}</div>`).join('')}
</div>
</div>`}).join('')}
</div>
<div class="card" style="margin-top:24px;border-left:3px solid var(--accent-gold)">
<h3 style="margin-bottom:12px;color:var(--accent-gold)">${svgIcon('i-lightbulb','icon-sm')} 科学备考建议</h3>
<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:12px">
<div style="padding:12px;background:var(--bg-primary);border-radius:var(--radius-sm);border:1px solid var(--border-color)">
<h4 style="font-size:14px;color:var(--accent-cyan);margin-bottom:8px">📅 每日时间分配</h4>
<div style="font-size:13px;color:var(--text-secondary);line-height:1.8">
- 新题学习：40%时间<br>
- 间隔复习：30%时间<br>
- 错题重做：20%时间<br>
- 总结归纳：10%时间
</div>
</div>
<div style="padding:12px;background:var(--bg-primary);border-radius:var(--radius-sm);border:1px solid var(--border-color)">
<h4 style="font-size:14px;color:var(--accent-cyan);margin-bottom:8px">🎯 高效刷题策略</h4>
<div style="font-size:13px;color:var(--text-secondary);line-height:1.8">
- 先理解再记忆，不要死记硬背<br>
- 每题限时，模拟面试压力<br>
- 做完后复盘，总结解题思路<br>
- 定期回顾，防止遗忘
</div>
</div>
<div style="padding:12px;background:var(--bg-primary);border-radius:var(--radius-sm);border:1px solid var(--border-color)">
<h4 style="font-size:14px;color:var(--accent-cyan);margin-bottom:8px">⚡ 面试前一周</h4>
<div style="font-size:13px;color:var(--text-secondary);line-height:1.8">
- 重点复习高频考点<br>
- 模拟面试完整流程<br>
- 准备自我介绍和项目介绍<br>
- 调整心态，保证充足睡眠
</div>
</div>
</div>
</div>`;
}else if(activeTab==='guides'){
const selectedCat=currentParams.guideCat||'algorithm';
const guide=INTERVIEW_GUIDES.find(g=>g.category===selectedCat)||INTERVIEW_GUIDES[0];
contentHtml=`<div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:20px;padding:12px;background:var(--bg-secondary);border-radius:var(--radius);border:1px solid var(--border-color)">
${INTERVIEW_GUIDES.map(g=>`<button onclick="navigate('learnpath',{tab:'guides',guideCat:'${g.category}'})" style="padding:8px 16px;border:1px solid ${selectedCat===g.category?g.color:'var(--border-color)'};border-radius:20px;cursor:pointer;font-size:13px;transition:var(--transition);background:${selectedCat===g.category?g.color+'20':'var(--bg-tertiary)'};color:${selectedCat===g.category?g.color:'var(--text-secondary)'};font-weight:${selectedCat===g.category?'600':'400'}">${svgIcon(g.icon,'icon-sm')} ${g.title.replace('面试准备指南','')}</button>`).join('')}
</div>
<div class="card slide-up" style="border-top:3px solid ${guide.color}">
<div style="display:flex;align-items:center;gap:12px;margin-bottom:20px">
<div style="width:56px;height:56px;border-radius:14px;background:${guide.color}15;display:flex;align-items:center;justify-content:center;color:${guide.color}">${svgIcon(guide.icon,'icon-2xl')}</div>
<div><h2 style="margin:0;font-size:20px;color:${guide.color}">${guide.title}</h2><p style="margin:0;font-size:13px;color:var(--text-muted)">系统化面试准备方案</p></div>
</div>
<div style="display:flex;flex-direction:column;gap:16px;margin-bottom:20px">
${guide.phases.map((phase,pi)=>{
const phaseColors=['var(--difficulty-easy)','var(--accent-gold)','var(--difficulty-hard)'];
return`<div style="padding:16px;background:var(--bg-primary);border-radius:var(--radius);border:1px solid var(--border-color);border-left:3px solid ${phaseColors[pi]}">
<h4 style="font-size:15px;color:${phaseColors[pi]};margin-bottom:10px">${phase.name}</h4>
<div style="display:flex;flex-direction:column;gap:6px">
${phase.tasks.map(t=>`<div style="display:flex;align-items:flex-start;gap:8px;font-size:13px;color:var(--text-secondary);line-height:1.5"><span style="color:${phaseColors[pi]};flex-shrink:0">▸</span><span>${t}</span></div>`).join('')}
</div>
</div>`}).join('')}
</div>
<div style="display:grid;grid-template-columns:1fr 1fr;gap:16px">
<div style="padding:16px;background:rgba(0,230,118,.05);border-radius:var(--radius);border:1px solid rgba(0,230,118,.2)">
<h4 style="font-size:14px;color:var(--difficulty-easy);margin-bottom:10px">✅ 关键要点</h4>
${guide.keyPoints.map(p=>`<div style="font-size:13px;color:var(--text-secondary);margin-bottom:6px;line-height:1.5">• ${p}</div>`).join('')}
</div>
<div style="padding:16px;background:rgba(239,68,68,.05);border-radius:var(--radius);border:1px solid rgba(239,68,68,.2)">
<h4 style="font-size:14px;color:var(--difficulty-hard);margin-bottom:10px">❌ 常见误区</h4>
${guide.commonMistakes.map(m=>`<div style="font-size:13px;color:var(--text-secondary);margin-bottom:6px;line-height:1.5">• ${m}</div>`).join('')}
</div>
</div>
<div style="margin-top:16px;display:flex;gap:8px;flex-wrap:wrap">
<button class="btn btn-primary btn-sm" onclick="navigate('practice',{mode:'category',category:'${guide.category}'})">${svgIcon('i-zap','icon-sm')} 开始练习${CATEGORY_MAP[guide.category]||''}</button>
<button class="btn btn-outline btn-sm" onclick="navigate('questions',{category:'${guide.category}'})">${svgIcon('i-book','icon-sm')} 查看${CATEGORY_MAP[guide.category]||''}题库</button>
</div>
</div>`;
}else if(activeTab==='resources'){
const selectedResCat=currentParams.resCat||'algorithm';
const resGroup=RECOMMENDED_RESOURCES.find(r=>r.category===selectedResCat)||RECOMMENDED_RESOURCES[0];
const typeIcons={book:'📖',website:'🌐',course:'🎓',tool:'🔧'};
const typeLabels={book:'书籍',website:'网站',course:'课程',tool:'工具'};
contentHtml=`<div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:20px;padding:12px;background:var(--bg-secondary);border-radius:var(--radius);border:1px solid var(--border-color)">
${RECOMMENDED_RESOURCES.map(r=>`<button onclick="navigate('learnpath',{tab:'resources',resCat:'${r.category}'})" style="padding:8px 16px;border:1px solid ${selectedResCat===r.category?'var(--accent-cyan)':'var(--border-color)'};border-radius:20px;cursor:pointer;font-size:13px;transition:var(--transition);background:${selectedResCat===r.category?'rgba(34,211,238,.1)':'var(--bg-tertiary)'};color:${selectedResCat===r.category?'var(--accent-cyan)':'var(--text-secondary)'};font-weight:${selectedResCat===r.category?'600':'400'}">${r.name}</button>`).join('')}
</div>
<div style="display:flex;flex-direction:column;gap:12px">
${resGroup.resources.map((res,ri)=>{
return`<div class="card slide-up" style="animation-delay:${ri*.05}s">
<div style="display:flex;align-items:flex-start;gap:14px">
<div style="width:48px;height:48px;border-radius:12px;background:var(--bg-primary);border:1px solid var(--border-color);display:flex;align-items:center;justify-content:center;font-size:24px;flex-shrink:0">${typeIcons[res.type]||'📄'}</div>
<div style="flex:1;min-width:0">
<div style="display:flex;align-items:center;gap:8px;margin-bottom:4px;flex-wrap:wrap">
<h4 style="margin:0;font-size:15px;color:var(--text-primary)">${res.title}</h4>
<span style="padding:2px 8px;border-radius:10px;font-size:11px;background:rgba(34,211,238,.1);color:var(--accent-cyan)">${typeLabels[res.type]||res.type}</span>
${res.author?`<span style="font-size:12px;color:var(--text-muted)">作者：${res.author}</span>`:''}
</div>
<p style="font-size:13px;color:var(--text-secondary);margin:0;line-height:1.5">${res.desc}</p>
${res.url?`<a href="${res.url}" target="_blank" rel="noopener noreferrer" style="font-size:12px;color:var(--accent-cyan);margin-top:4px;display:inline-flex;align-items:center;gap:4px">${svgIcon('i-external-link','icon-sm')} 访问 →</a>`:''}
</div>
</div>
</div>`}).join('')}
</div>`;
}
return`<nav class="breadcrumb" aria-label="面包屑导航" style="display:flex;align-items:center;gap:6px;flex-wrap:wrap;margin-bottom:16px;padding:10px 14px;background:var(--bg-secondary);border:1px solid var(--border-color);border-radius:var(--radius);font-size:13px"><a href="javascript:void(0)" onclick="navigate('dashboard')" style="color:var(--accent-cyan);text-decoration:none;display:inline-flex;align-items:center;gap:4px">${svgIcon('i-home','icon-sm')} 首页</a><span style="color:var(--text-muted)">/</span><span style="color:var(--text-secondary)">学习路径</span></nav><h2 style="margin-bottom:8px">${svgIcon('i-map','icon-lg')} 学习中心</h2><p style="color:var(--text-secondary);margin-bottom:20px">系统化学习路径、科学方法论、面试指南和优质资源</p>
<div class="tabs" style="margin-bottom:20px">${tabHtml}</div>
${contentHtml}`;
}

function renderDetail(){
const allQ=getActiveQuestions(),q=allQ.find(q=>q.id===currentParams.id);
if(!q)return'<div class="empty-state"><div class="empty-icon">'+svgIcon('i-search','icon-2xl')+'</div><div class="empty-title">题目不存在</div><div class="empty-desc">该题目可能已被删除或ID无效</div><button class="btn btn-primary" style="margin-top:12px" onclick="navigate(\'questions\')">返回题库</button></div>';
const mastered=Store.getMastered(),masteredSet=new Set(mastered),favorites=Store.getFavorites(),im=masteredSet.has(q.id),if2=favorites.includes(q.id);
const idx=allQ.findIndex(item=>item.id===q.id),prevQ=idx>0?allQ[idx-1]:null,nextQ=idx<allQ.length-1?allQ[idx+1]:null;
const relatedQ=allQ.filter(rq=>rq.id!==q.id&&rq.category===q.category).slice(0,5);const note=Store.getNote(q.id);
const isLCAnswer=q.answer&&(q.answer.includes('题目链接')||q.answer.includes('解题思路'));
const answerTitle=isLCAnswer?'解题思路':'参考答案';
const qType=q.type||'short';
const typeLabel=`<span style="display:inline-block;padding:2px 8px;border-radius:10px;font-size:11px;font-weight:600;background:rgba(179,136,255,.15);color:var(--accent-purple)">${Q_TYPE_MAP[qType]||'简答题'}</span>`;
let optionsHtml='';
if(qType==='single'&&q.options){
optionsHtml=`<div class="card" style="margin-top:16px"><h4 style="margin-bottom:12px;display:flex;align-items:center;gap:8px">${svgIcon('i-check-circle','icon-sm')} 选择答案</h4><div style="display:flex;flex-direction:column;gap:8px">${q.options.map((opt,i)=>`<label style="display:flex;align-items:flex-start;gap:10px;padding:12px 16px;background:var(--bg-primary);border:1px solid var(--border-color);border-radius:var(--radius);cursor:pointer;transition:var(--transition)" class="option-label" onmouseover="this.style.borderColor='var(--accent-cyan)'" onmouseout="this.style.borderColor='var(--border-color)'"><input type="radio" name="qoption" value="${String.fromCharCode(65+i)}" style="margin-top:2px;accent-color:var(--accent-cyan)" onchange="checkSingleAnswer('${q.id}',this.value,'${q.correctAnswer||''}')"><span style="flex:1;line-height:1.6"><strong style="color:var(--accent-cyan)">${String.fromCharCode(65+i)}.</strong> ${opt}</span></label>`).join('')}</div></div>`;
}else if(qType==='multi'&&q.options){
optionsHtml=`<div class="card" style="margin-top:16px"><h4 style="margin-bottom:12px;display:flex;align-items:center;gap:8px">${svgIcon('i-check','icon-sm')} 多项选择</h4><div style="display:flex;flex-direction:column;gap:8px">${q.options.map((opt,i)=>`<label style="display:flex;align-items:flex-start;gap:10px;padding:12px 16px;background:var(--bg-primary);border:1px solid var(--border-color);border-radius:var(--radius);cursor:pointer;transition:var(--transition)" onmouseover="this.style.borderColor='var(--accent-cyan)'" onmouseout="this.style.borderColor='var(--border-color)'"><input type="checkbox" name="qoption-multi" value="${String.fromCharCode(65+i)}" style="margin-top:2px;accent-color:var(--accent-cyan)"><span style="flex:1;line-height:1.6"><strong style="color:var(--accent-cyan)">${String.fromCharCode(65+i)}.</strong> ${opt}</span></label>`).join('')}</div><button class="btn btn-primary btn-sm" style="margin-top:12px" onclick="checkMultiAnswer('${q.id}','${q.correctAnswer||''}')">提交答案</button></div>`;
}else if(qType==='judgment'){
optionsHtml=`<div class="card" style="margin-top:16px"><h4 style="margin-bottom:12px;display:flex;align-items:center;gap:8px">${svgIcon('i-target','icon-sm')} 判断正误</h4><div style="display:flex;gap:12px"><button class="btn btn-outline" style="flex:1;font-size:16px;padding:16px" onclick="checkSingleAnswer('${q.id}','对','${q.correctAnswer||'对'}')">✓ 正确</button><button class="btn btn-outline" style="flex:1;font-size:16px;padding:16px" onclick="checkSingleAnswer('${q.id}','错','${q.correctAnswer||'错'}')">✗ 错误</button></div></div>`;
}else if(qType==='short'){
optionsHtml=`<div class="card" style="margin-top:16px"><h4 style="margin-bottom:12px;display:flex;align-items:center;gap:8px">${svgIcon('i-edit','icon-sm')} 简答作答</h4><textarea id="shortAnswer" style="width:100%;min-height:120px;padding:12px;background:var(--bg-primary);color:var(--text-primary);border:1px solid var(--border-color);border-radius:var(--radius);font-size:14px;line-height:1.6;resize:vertical;outline:none;font-family:inherit" placeholder="在此输入你的答案..."></textarea><div style="display:flex;gap:8px;margin-top:12px"><button class="btn btn-primary btn-sm" onclick="answerQuestion('${q.id}',true)">${svgIcon('i-check','icon-sm')} 完成作答</button><button class="btn btn-outline btn-sm" onclick="answerQuestion('${q.id}',false)">${svgIcon('i-x','icon-sm')} 需要复习</button></div></div>`;
}else if(qType==='case_analysis'){
optionsHtml=`<div class="card" style="margin-top:16px"><h4 style="margin-bottom:12px;display:flex;align-items:center;gap:8px">${svgIcon('i-crosshair','icon-sm')} 案例分析</h4><textarea id="caseAnswer" style="width:100%;min-height:180px;padding:12px;background:var(--bg-primary);color:var(--text-primary);border:1px solid var(--border-color);border-radius:var(--radius);font-size:14px;line-height:1.6;resize:vertical;outline:none;font-family:inherit" placeholder="请从多角度分析此案例，包括问题识别、原因分析、解决方案..."></textarea><div style="display:flex;gap:8px;margin-top:12px"><button class="btn btn-primary btn-sm" onclick="answerQuestion('${q.id}',true)">${svgIcon('i-check','icon-sm')} 完成作答</button><button class="btn btn-outline btn-sm" onclick="answerQuestion('${q.id}',false)">${svgIcon('i-x','icon-sm')} 需要复习</button></div></div>`;
}
return`<nav class="breadcrumb" aria-label="面包屑导航" style="display:flex;align-items:center;gap:6px;flex-wrap:wrap;margin-bottom:16px;padding:10px 14px;background:var(--bg-secondary);border:1px solid var(--border-color);border-radius:var(--radius);font-size:13px"><a href="javascript:void(0)" onclick="navigate('dashboard')" style="color:var(--accent-cyan);text-decoration:none;display:inline-flex;align-items:center;gap:4px">${svgIcon('i-home','icon-sm')} 首页</a><span style="color:var(--text-muted)">/</span><a href="javascript:void(0)" onclick="navigate('questions')" style="color:var(--accent-cyan);text-decoration:none">题库</a><span style="color:var(--text-muted)">/</span><a href="javascript:void(0)" onclick="navigate('questions',{category:'${q.category}'})" style="color:var(--accent-cyan);text-decoration:none">${CATEGORY_MAP[q.category]||q.category}</a><span style="color:var(--text-muted)">/</span><span style="color:var(--text-secondary);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:200px" title="${q.title}">${q.title}</span></nav><div class="detail-header"><span class="difficulty-tag difficulty-${q.difficulty}">${DIFF_LABELS[q.difficulty]}</span><span class="category-tag">${CATEGORY_MAP[q.category]||q.category}</span>${typeLabel}${q.sourceType==='collected'?'<span class="source-badge collected">收录</span>':''}${q.source?`<span style="font-size:11px;color:var(--text-muted)">来源: ${q.source}</span>`:''}</div><h2 style="margin-bottom:16px">${q.title}</h2><div class="detail-content">${q.content||''}</div>${q.isAlgo&&q.examples?`<div class="example-block"><div class="example-label">示例</div><pre style="color:#c9d1d9;margin:0;white-space:pre-wrap">${q.examples}</pre></div>`:''}${optionsHtml}<div class="detail-actions"><button class="btn ${im?'btn-success':'btn-outline'}" onclick="Store.toggleMastered('${q.id}');renderPage()">${im?svgIcon('i-check','icon-sm')+' 已掌握':'标记掌握'}</button><button class="btn ${if2?'btn-gold':'btn-outline'}" onclick="Store.toggleFavorite('${q.id}');renderPage()">${if2?svgIcon('i-star','icon-sm')+' 已收藏':'收藏'}</button><button class="btn btn-outline" id="answerBtn" onclick="toggleAnswer()">${svgIcon('i-eye','icon-sm')} 查看答案</button></div><div class="answer-section" id="answerSection"><h4 style="margin-bottom:12px;color:var(--accent-cyan)">${answerTitle}</h4><div class="answer-hint" style="display:none;padding:16px;background:var(--bg-secondary);border-radius:var(--radius-sm);border-left:3px solid var(--accent-gold);margin-bottom:12px"><div style="font-weight:600;color:var(--accent-gold);margin-bottom:8px;display:flex;align-items:center;gap:6px">${svgIcon('i-lightbulb','icon-sm')} 解题提示</div><div style="font-size:14px;line-height:1.7;color:var(--text-secondary)">${q.answer?generateHint(q.answer,q.category):'暂无提示'}</div><div style="margin-top:12px;font-size:12px;color:var(--text-muted)">再点击"查看完整答案"获取详细解答</div></div><div class="answer-full" style="display:none">${q.answer?renderMd(q.answer):'暂无答案'}</div></div>${q.isAlgo||qType==='code'?`<div style="margin-top:20px"><h4 style="margin-bottom:8px">${svgIcon('i-code','icon-sm')} 代码编辑区</h4><textarea class="code-editor" id="codeEditor" placeholder="// 在此编写你的代码...&#10;// 支持 Tab 缩进"></textarea></div>`:''}<div class="card" style="margin-top:20px"><h4 style="margin-bottom:12px;display:flex;align-items:center;gap:8px">${svgIcon('i-edit','icon-sm')} 我的笔记 <span style="font-size:11px;color:var(--text-muted);font-weight:400">自动保存</span></h4><textarea id="questionNote" style="width:100%;min-height:100px;padding:12px;background:var(--bg-primary);color:var(--text-primary);border:1px solid var(--border-color);border-radius:var(--radius);font-size:14px;line-height:1.6;resize:vertical;outline:none;font-family:inherit" placeholder="记录你的解题思路、易错点、知识扩展...">${note}</textarea></div>${relatedQ.length?`<div class="card" style="margin-top:16px"><h4 style="margin-bottom:12px">${svgIcon('i-link','icon-sm')} 相关题目</h4><div style="display:flex;flex-direction:column;gap:4px">${relatedQ.map(rq=>`<div class="question-card" onclick="navigate('detail',{id:'${rq.id}'})" style="padding:10px 14px;margin-bottom:0"><div style="display:flex;align-items:center;gap:8px"><span class="difficulty-tag difficulty-${rq.difficulty}" style="font-size:10px">${DIFF_LABELS[rq.difficulty]}</span><span style="font-size:14px;flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${rq.title}</span>${masteredSet.has(rq.id)?'<span style="color:var(--difficulty-easy)">'+svgIcon('i-check','icon-sm')+'</span>':''}</div></div>`).join('')}</div></div>`:''}<div style="display:flex;justify-content:space-between;margin-top:24px"><button class="btn btn-outline" ${!prevQ?'disabled':''} onclick="navigate('detail',{id:'${prevQ?prevQ.id:''}'})">← 上一题</button><span style="color:var(--text-muted);font-size:13px;align-self:center">${idx+1} / ${allQ.length}</span><button class="btn btn-outline" ${!nextQ?'disabled':''} onclick="navigate('detail',{id:'${nextQ?nextQ.id:''}'})">下一题 →</button></div>`;
}

function generateHint(answer,category){
if(!answer)return'暂无提示';
const lines=answer.split('\n').filter(l=>l.trim());
const catHints={
database:['关注索引优化','考虑事务隔离级别','注意锁机制','思考查询执行计划'],
os:['考虑进程/线程区别','关注内存管理策略','注意并发同步问题','思考调度算法'],
network:['关注协议层次','考虑握手/连接流程','注意可靠传输机制','思考缓存策略'],
algorithm:['思考暴力解法的时间复杂度','考虑是否有更优的数据结构','注意边界条件','尝试分治/动态规划思路'],
datastructure:['画出数据结构示意图','考虑插入/删除/查找复杂度','注意边界情况','思考是否需要辅助结构'],
language:['关注语言特性','考虑内存模型','注意并发安全','思考底层实现'],
'system-design':['考虑可扩展性','关注一致性vs可用性','注意缓存策略','思考数据分片'],
scenario:['明确需求边界','考虑核心指标','注意异常处理','思考可扩展方案'],
finance:['关注核心公式','考虑适用前提条件','注意与其他概念的区别','思考实际应用场景'],
law:['关注法律条文依据','考虑构成要件','注意例外情形','思考法律后果'],
medical:['关注诊断标准','考虑鉴别诊断','注意用药禁忌','思考治疗原则'],
education:['关注理论基础','考虑教学实践应用','注意学生差异','思考评价方式'],
'civil-service':['关注题型特征','考虑解题步骤','注意时间分配','思考易错点'],
hr:['关注法律依据','考虑企业实际','注意员工权益','思考管理策略'],
marketing:['关注理论框架','考虑消费者心理','注意数据驱动','思考差异化策略']
};
const hints=catHints[category]||catHints['algorithm'];
const firstLine=lines[0]||'';
const keyPoints=lines.filter(l=>l.match(/^\d+[\.、)]|^[•\-]\s|^步骤|^Step/i)).slice(0,2);
let hint='先自己思考一下，这里有一些方向指引：\n\n';
if(firstLine.length<50)hint+=`核心方向：${firstLine.substring(0,80)}\n\n`;
hint+=`▸ ${hints[Math.floor(Math.random()*hints.length)]}\n`;
hint+=`▸ ${hints[Math.floor(Math.random()*hints.length)]}\n`;
if(keyPoints.length)hint+=`\n关键步骤：${keyPoints[0].substring(0,60)}`;
return hint;
}

function renderMd(text){if(!text)return'';let latexBlocks=[];let h=text;h=h.replace(/\$\$([\s\S]*?)\$\$/g,function(m,latex){latexBlocks.push({display:true,content:latex});return'%%LATEX_'+(latexBlocks.length-1)+'%%'});h=h.replace(/\$([^\$\n]+?)\$/g,function(m,latex){latexBlocks.push({display:false,content:latex});return'%%LATEX_'+(latexBlocks.length-1)+'%%'});h=h.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');h=h.replace(/```([\s\S]*?)```/g,function(m,code){return'<pre style="background:var(--bg-secondary);padding:12px;border-radius:6px;overflow-x:auto;font-size:13px;line-height:1.5;margin:8px 0">'+code+'</pre>'});h=h.replace(/`([^`]+)`/g,'<code style="background:var(--bg-secondary);padding:2px 6px;border-radius:3px;font-size:13px">$1</code>');h=h.replace(/\*\*(.+?)\*\*/g,'<strong>$1</strong>');h=h.replace(/\*(.+?)\*/g,'<em>$1</em>');h=h.replace(/^### (.+)$/gm,'<h5 style="font-size:14px;font-weight:600;margin:12px 0 6px;color:var(--accent-cyan)">$1</h5>');h=h.replace(/^## (.+)$/gm,'<h4 style="font-size:15px;font-weight:600;margin:14px 0 8px;color:var(--accent-cyan)">$1</h4>');h=h.replace(/^# (.+)$/gm,'<h3 style="font-size:16px;font-weight:700;margin:16px 0 8px;color:var(--accent-cyan)">$1</h3>');h=h.replace(/^\|(.+)\|$/gm,function(m,row){const cells=row.split('|').map(c=>c.trim());return'<tr>'+cells.map(c=>'<td style="border:1px solid var(--border-color);padding:6px 10px;font-size:13px">'+c+'</td>').join('')+'</tr>'});h=h.replace(/(<tr>.*<\/tr>\n?)+/g,function(m){return'<table style="border-collapse:collapse;width:100%;margin:8px 0;font-size:13px">'+m+'</table>'});h=h.replace(/^- (.+)$/gm,'<li style="margin:3px 0 3px 16px;list-style:disc;font-size:14px;line-height:1.6">$1</li>');h=h.replace(/^\d+\. (.+)$/gm,'<li style="margin:3px 0 3px 16px;list-style:decimal;font-size:14px;line-height:1.6">$1</li>');h=h.replace(/\n{2,}/g,'</p><p style="margin:8px 0;line-height:1.7;font-size:14px">');h=h.replace(/\n/g,'<br>');if(latexBlocks.length>0)loadKatex();h=h.replace(/%%LATEX_(\d+)%%/g,function(m,idx){const block=latexBlocks[parseInt(idx)];if(!block)return'';try{if(typeof katex!=='undefined'){return katex.renderToString(block.content,{displayMode:block.display,throwOnError:false})}else{return block.display?'<span style="font-style:italic;color:var(--accent-cyan)">$$'+block.content+'$$</span>':'<span style="font-style:italic;color:var(--accent-cyan)">$'+block.content+'$</span>'}}catch(e){return block.display?'$$'+block.content+'$$':'$'+block.content+'$'}});return'<div style="line-height:1.7;font-size:14px;color:var(--text-primary)"><p style="margin:8px 0;line-height:1.7">'+h+'</p></div>'}
function sanitizeHTML(str){
if(!str)return'';
const div=document.createElement('div');
div.textContent=str;
return div.innerHTML.replace(/</g,'&lt;').replace(/>/g,'&gt;')
}
function sanitizeInput(str){
if(!str)return'';
return str.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,'').replace(/on\w+\s*=/gi,'').replace(/javascript:/gi,'')
}
const AudioContext=window.AudioContext||window.webkitAudioContext;
let audioCtx=null;
function getAudioContext(){if(!audioCtx)audioCtx=new AudioContext();return audioCtx}
function playSound(type){
try{
if(Store.getSoundEnabled()===false)return;
const ctx=getAudioContext();
const osc=ctx.createOscillator();
const gain=ctx.createGain();
osc.connect(gain);
gain.connect(ctx.destination);
const now=ctx.currentTime;
if(type==='correct'){
osc.type='sine';osc.frequency.setValueAtTime(880,now);osc.frequency.exponentialRampToValueAtTime(1760,now+0.1);gain.gain.setValueAtTime(0.15,now);gain.gain.exponentialRampToValueAtTime(0.001,now+0.3);osc.start(now);osc.stop(now+0.3)
}else if(type==='wrong'){
osc.type='square';osc.frequency.setValueAtTime(200,now);osc.frequency.exponentialRampToValueAtTime(150,now+0.15);gain.gain.setValueAtTime(0.1,now);gain.gain.exponentialRampToValueAtTime(0.001,now+0.25);osc.start(now);osc.stop(now+0.25)
}else if(type==='click'){
osc.type='sine';osc.frequency.setValueAtTime(1000,now);gain.gain.setValueAtTime(0.05,now);gain.gain.exponentialRampToValueAtTime(0.001,now+0.05);osc.start(now);osc.stop(now+0.05)
}else if(type==='expand'){
osc.type='sine';osc.frequency.setValueAtTime(600,now);osc.frequency.exponentialRampToValueAtTime(900,now+0.08);gain.gain.setValueAtTime(0.08,now);gain.gain.exponentialRampToValueAtTime(0.001,now+0.15);osc.start(now);osc.stop(now+0.15)
}
}catch(e){}
}
function vibrate(pattern){if(navigator.vibrate&&Store.getSoundEnabled()!==false)navigator.vibrate(pattern)}
function answerQuestion(qid,correct){
Store.addAttempt();
if(correct){playSound('correct');vibrate([50,30,50]);Store.addCorrect();showToast('答对了！继续加油 🎉','success');Store.toggleMastered(qid);const existing=Store.getReviewSchedule()[qid];Store.scheduleReview(qid,(existing?existing.level:-1)+1)}else{playSound('wrong');vibrate([100,50,100,50,200]);Store.addWrong(qid);showToast('答错了，已加入错题本 📝','error');Store.scheduleReview(qid,0);const s=document.getElementById('answerSection');if(s&&!s.classList.contains('open'))toggleAnswer()}
renderPage();
}
function checkSingleAnswer(qid,userAnswer,correctAnswer){
playSound('click');vibrate(20);
const labels=[...document.querySelectorAll('.option-label')];
labels.forEach(l=>{l.classList.remove('selected-correct','selected-wrong')});
Store.addAttempt();
const isCorrect=!correctAnswer||userAnswer===correctAnswer;
setTimeout(()=>{
const selectedLabel=document.querySelector(`input[value="${userAnswer}"]`)?.closest('.option-label');
if(isCorrect){
playSound('correct');vibrate([50,30,50]);
if(selectedLabel)selectedLabel.classList.add('selected-correct');
Store.addCorrect();showToast('答对了！继续加油 🎉','success');Store.toggleMastered(qid)
}else{
playSound('wrong');vibrate([100,50,100,50,200]);
if(selectedLabel)selectedLabel.classList.add('selected-wrong');
const correctLabel=document.querySelector(`input[value="${correctAnswer}"]`)?.closest('.option-label');
if(correctLabel)correctLabel.classList.add('selected-correct');
Store.addWrong(qid,userAnswer);showToast(`答错了！正确答案是 ${correctAnswer} 📝`,'error');const s=document.getElementById('answerSection');if(s&&!s.classList.contains('open'))toggleAnswer()
}
renderPage();
},150);
}
function checkMultiAnswer(qid,correctAnswer){
playSound('click');vibrate(20);
Store.addAttempt();
const checked=[...document.querySelectorAll('input[name="qoption-multi"]:checked')].map(i=>i.value).sort().join('');
const correct=correctAnswer.split('').sort().join('');
const isCorrect=!correctAnswer||checked===correct;
setTimeout(()=>{
if(isCorrect){
playSound('correct');vibrate([50,30,50]);Store.addCorrect();showToast('答对了！继续加油 🎉','success');Store.toggleMastered(qid)
}else{
playSound('wrong');vibrate([100,50,100,50,200]);Store.addWrong(qid,checked);showToast(`答错了！正确答案是 ${correctAnswer} 📝`,'error');const s=document.getElementById('answerSection');if(s&&!s.classList.contains('open'))toggleAnswer()
}
renderPage();
},150);
}
function toggleAnswer(){
const section=document.getElementById('answerSection');
if(!section)return;
playSound('expand');vibrate(15);
const hint=section.querySelector('.answer-hint');
const full=section.querySelector('.answer-full');
const btn=document.getElementById('answerBtn');
if(!section.classList.contains('open')){
section.style.maxHeight='0';
section.offsetHeight;
section.classList.add('open');
requestAnimationFrame(()=>{
const height=section.scrollHeight;
section.style.maxHeight=height+'px';
setTimeout(()=>{section.style.maxHeight='none'},350);
});
if(hint)hint.style.display='block';
if(full)full.style.display='none';
if(btn)btn.innerHTML=svgIcon('i-eye','icon-sm')+' 查看完整答案';
}else if(section.classList.contains('open')&&full&&full.style.display==='none'){
section.style.maxHeight=section.scrollHeight+'px';
if(hint)hint.style.display='none';
if(full)full.style.display='block';
requestAnimationFrame(()=>{
const newHeight=section.scrollHeight;
section.style.maxHeight=newHeight+'px';
setTimeout(()=>{section.style.maxHeight='none'},350);
});
if(btn)btn.innerHTML=svgIcon('i-eye-off','icon-sm')+' 收起答案';
}else{
section.style.maxHeight=section.scrollHeight+'px';
section.offsetHeight;
section.classList.remove('open');
section.style.maxHeight='0';
if(btn)btn.innerHTML=svgIcon('i-eye','icon-sm')+' 查看答案';
}
}
function togglePracticeAnswer(qid,btn){
playSound('expand');vibrate(15);
const s=document.getElementById('panswer-'+qid);
if(!s)return;
if(!s.classList.contains('open')){
s.classList.add('open');
s.style.maxHeight=s.scrollHeight+'px';
s.style.opacity='1';
s.style.transform='translateY(0)';
s.style.padding='12px';
setTimeout(()=>{s.style.maxHeight='none'},350);
btn.innerHTML=svgIcon('i-eye-off','icon-sm')+' 收起提示';
const fullBtn=document.getElementById('pfullbtn-'+qid);
if(fullBtn)fullBtn.style.display='inline-flex';
}else{
s.classList.remove('open');
s.style.maxHeight='0';
s.style.opacity='0';
s.style.transform='translateY(-8px)';
s.style.padding='0';
btn.innerHTML=svgIcon('i-eye','icon-sm')+' 查看提示';
const fullBtn=document.getElementById('pfullbtn-'+qid);
if(fullBtn)fullBtn.style.display='none';
}
}
function showPracticeFullAnswer(qid,btn){
playSound('expand');vibrate(15);
const s=document.getElementById('panswer-'+qid);
if(!s)return;
const h=s.querySelector('.answer-hint');
const f=s.querySelector('.answer-full');
if(f&&f.style.display==='none'){
h.style.display='none';
f.style.display='block';
s.style.maxHeight='none';
btn.innerHTML=svgIcon('i-eye-off','icon-sm')+' 收起解析';
}else if(f){
h.style.display='block';
f.style.display='none';
btn.innerHTML=svgIcon('i-lightbulb','icon-sm')+' 查看完整解析';
}
}
function setupCodeEditor(){const e=document.getElementById('codeEditor');if(!e)return;e.addEventListener('keydown',function(ev){if(ev.key==='Tab'){ev.preventDefault();const s=this.selectionStart,en=this.selectionEnd;this.value=this.value.substring(0,s)+'  '+this.value.substring(en);this.selectionStart=this.selectionEnd=s+2}})}
function setupNoteAutoSave(){const n=document.getElementById('questionNote');if(!n)return;let saveTimer;n.addEventListener('input',function(){clearTimeout(saveTimer);saveTimer=setTimeout(()=>{const qid=currentParams.id;if(qid)Store.setNote(qid,n.value)},500)})}

function renderCollect(){
const tabs=['手动收录','网页收录','批量导入','题源管理','收录记录'];
const fns=[renderCollectManual,renderCollectWeb,renderCollectBatch,renderCollectSources,renderCollectRecords];
return`<div style="display:flex;align-items:center;gap:12px;margin-bottom:20px"><button class="btn btn-outline btn-sm" onclick="navigate('dashboard')">← 返回首页</button><h2>${svgIcon('i-download','icon-lg')} 收录中心</h2></div><div style="display:flex;gap:12px;margin-bottom:20px;flex-wrap:wrap"><button class="btn btn-orange" onclick="collectTab=0;renderPage()">+ 收录新题目</button><button class="btn btn-outline" onclick="collectTab=1;renderPage()">${svgIcon('i-globe','icon-sm')} 从网页收录</button><button class="btn btn-outline" onclick="collectTab=2;renderPage()">${svgIcon('i-download','icon-sm')} 批量导入</button></div><div class="tabs">${tabs.map((t,i)=>`<button class="tab-btn ${collectTab===i?'active-orange':''}" onclick="collectTab=${i};renderPage()">${t}</button>`).join('')}</div><div class="tab-content active">${fns[collectTab]()}</div>`;
}

function renderCollectManual(){
const typeOpts=Object.values(Q_TYPES).map(t=>`<option value="${t.id}">${t.name}</option>`).join('');
return`<div class="card"><h3 style="margin-bottom:16px">收录新题目</h3><div class="form-group"><label>题干 *</label><input type="text" id="cTitle" placeholder="输入题目内容"></div><div style="display:flex;gap:12px;flex-wrap:wrap"><div class="form-group" style="flex:1;min-width:140px"><label>分类</label><select id="cCategory">${CATEGORIES.map(c=>`<option value="${c.id}">${c.name}</option>`).join('')}</select></div><div class="form-group" style="flex:1;min-width:120px"><label>难度</label><select id="cDifficulty"><option value="easy">简单</option><option value="medium" selected>中等</option><option value="hard">困难</option></select></div><div class="form-group" style="flex:1;min-width:120px"><label>题型</label><select id="cType" onchange="toggleCollectOptions()">${typeOpts}</select></div></div><div id="collectOptionsSection" style="display:none"><div class="form-group"><label>选项（每行一个选项）</label><textarea id="cOptions" placeholder="选项A&#10;选项B&#10;选项C&#10;选项D" style="min-height:100px"></textarea></div><div class="form-group"><label>正确答案</label><input type="text" id="cCorrectAnswer" placeholder="单选填A/B/C/D，多选填如ABE，判断填对/错"></div></div><div class="form-group"><label>题目描述（可选）</label><textarea id="cContent" placeholder="详细描述题目..."></textarea></div><div class="form-group"><label>参考答案</label><textarea id="cAnswer" placeholder="输入参考答案（支持Markdown格式，数学公式用$...$或$$...$$）..." style="min-height:160px"></textarea></div><div class="form-group"><label>标签（逗号分隔，可选）</label><input type="text" id="cTags" placeholder="如：行为面试,自我介绍"></div><div class="form-group"><label>来源（可选）</label><input type="text" id="cSource" placeholder="如：https://example.com"></div><button class="btn btn-orange" onclick="submitManualCollect()">${svgIcon('i-download','icon-sm')} 收录题目</button></div>`;
}

function renderCollectWeb(){
return`<div class="card"><h3 style="margin-bottom:16px">${svgIcon('i-globe','icon-sm')} 从网页收录</h3><div class="form-group"><label>网页 URL</label><div style="display:flex;gap:8px"><input type="text" id="webUrl" placeholder="https://example.com/interview-questions" style="flex:1"><button class="btn btn-primary btn-sm" onclick="fetchWebPage()">获取</button></div></div><div style="text-align:center;color:var(--text-muted);margin:16px 0;font-size:13px">—— 或直接粘贴网页文本内容 ——</div><div class="form-group"><label>网页文本内容</label><textarea id="webText" placeholder="粘贴包含面试题的网页文本内容...&#10;&#10;支持以下格式自动识别：&#10;1. 编号列表：1. xxx  2. xxx&#10;2. Q&A 格式：Q: xxx A: xxx&#10;3. Markdown 标题：# xxx" style="min-height:200px"></textarea></div><button class="btn btn-orange" onclick="parseWebText()">${svgIcon('i-search','icon-sm')} 解析题目</button></div>${parsedResults.length?`<div class="card"><h3 style="margin-bottom:16px">解析结果预览 <span style="color:var(--text-muted);font-size:13px;font-weight:400">（共 ${parsedResults.length} 道题目）</span></h3><div class="preview-list">${parsedResults.map((q,i)=>`<div class="preview-item"><div class="preview-title">${i+1}. ${q.title}</div><div class="preview-meta"><span class="difficulty-tag difficulty-${q.difficulty}">${DIFF_LABELS[q.difficulty]}</span><span class="category-tag">${CATEGORY_MAP[q.category]||q.category}</span><select onchange="parsedResults[${i}].category=this.value" style="background:var(--bg-secondary);color:var(--text-primary);border:1px solid var(--border-color);border-radius:4px;padding:2px 6px;font-size:12px">${CATEGORIES.map(c=>`<option value="${c.id}" ${q.category===c.id?'selected':''}>${c.name}</option>`).join('')}</select><select onchange="parsedResults[${i}].difficulty=this.value" style="background:var(--bg-secondary);color:var(--text-primary);border:1px solid var(--border-color);border-radius:4px;padding:2px 6px;font-size:12px"><option value="easy" ${q.difficulty==='easy'?'selected':''}>简单</option><option value="medium" ${q.difficulty==='medium'?'selected':''}>中等</option><option value="hard" ${q.difficulty==='hard'?'selected':''}>困难</option></select></div>${q.answer?`<div class="preview-answer">${q.answer.substring(0,150)}${q.answer.length>150?'...':''}</div>`:''}</div>`).join('')}</div><div style="margin-top:16px;display:flex;gap:8px"><button class="btn btn-orange" onclick="confirmCollectParsed()">${svgIcon('i-check','icon-sm')} 确认收录全部</button><button class="btn btn-outline" onclick="parsedResults=[];renderPage()">清除</button></div></div>`:''}`;
}

function renderCollectBatch(){
return`<div class="card"><h3 style="margin-bottom:16px">${svgIcon('i-download','icon-sm')} 批量导入</h3><div class="tabs" style="margin-bottom:16px"><button class="tab-btn ${!window._batchTab||window._batchTab===0?'active-orange':''}" onclick="window._batchTab=0;renderPage()">JSON 粘贴</button><button class="tab-btn ${window._batchTab===1?'active-orange':''}" onclick="window._batchTab=1;renderPage()">${svgIcon('i-link','icon-sm')} 文件上传</button><button class="tab-btn ${window._batchTab===2?'active-orange':''}" onclick="window._batchTab=2;renderPage()">LeetCode</button></div>${window._batchTab===1?renderBatchFile():window._batchTab===2?renderBatchLeetCode():renderBatchJson()}</div>`;
}

function renderBatchJson(){
return`<p style="color:var(--text-muted);font-size:13px;margin-bottom:12px">粘贴 JSON 格式的题目数组，一键导入。格式示例：</p><pre style="background:var(--bg-primary);padding:12px;border-radius:var(--radius);font-size:12px;color:var(--text-secondary);margin-bottom:16px;overflow-x:auto">[
  {
    "title": "题目内容",
    "category": "general-interview",
    "difficulty": "medium",
    "type": "single",
    "options": ["选项A", "选项B", "选项C", "选项D"],
    "correctAnswer": "A",
    "content": "题目描述",
    "answer": "参考答案",
    "tags": ["标签1", "标签2"]
  }
]</pre><div style="background:var(--bg-primary);padding:12px;border-radius:var(--radius);margin-bottom:16px;font-size:12px;color:var(--text-muted)"><div style="margin-bottom:4px">支持的题型(type): single(单选) / multi(多选) / short(简答) / case_analysis(案例分析) / code(编程) / judgment(判断)</div><div style="margin-bottom:4px">单选/多选题需提供 options 数组和 correctAnswer</div><div>判断题 correctAnswer 填 "对" 或 "错"</div></div><div class="form-group"><label>JSON 数据</label><textarea id="batchJson" placeholder="粘贴 JSON 格式的题目数组..." style="min-height:200px;font-family:'Cascadia Code','Fira Code','Consolas',monospace;font-size:13px"></textarea></div><button class="btn btn-orange" onclick="submitBatchImport()">${svgIcon('i-download','icon-sm')} 批量导入</button>`;
}

function renderBatchFile(){
return`<p style="color:var(--text-muted);font-size:13px;margin-bottom:12px">上传 JSON 文件，支持以下格式：</p><div style="background:var(--bg-primary);padding:16px;border-radius:var(--radius);margin-bottom:16px"><div style="margin-bottom:8px;font-size:13px;color:var(--text-secondary)">${svgIcon('i-check','icon-sm')} 标准数组格式：<code>[{title, category, difficulty, content, answer}]</code></div><div style="margin-bottom:8px;font-size:13px;color:var(--text-secondary)">${svgIcon('i-check','icon-sm')} 对象格式：<code>{"questions": [...]}</code></div><div style="font-size:13px;color:var(--text-secondary)">${svgIcon('i-check','icon-sm')} 单题格式：<code>{title, category, difficulty, content, answer}</code></div></div><div style="border:2px dashed var(--border-color);border-radius:var(--radius);padding:40px;text-align:center;cursor:pointer;transition:var(--transition)" onclick="document.getElementById('batchFile').click()" onmouseover="this.style.borderColor='var(--accent-cyan)'" onmouseout="this.style.borderColor='var(--border-color)'"><div style="margin-bottom:8px">${svgIcon('i-download','icon-2xl')}</div><div style="color:var(--text-secondary);font-size:14px">点击选择 JSON 文件</div><div style="color:var(--text-muted);font-size:12px;margin-top:4px">或拖拽文件到此处</div><input type="file" id="batchFile" accept=".json" style="display:none" onchange="handleBatchFile(event)"></div><div id="filePreview" style="margin-top:16px"></div>`;
}

function renderBatchLeetCode(){
return`<p style="color:var(--text-muted);font-size:13px;margin-bottom:12px">从 LeetCode 批量导入题目，支持获取中文标题、题目描述和通过率</p><div class="form-group"><label>导入方式</label><select id="lcMode" onchange="toggleLcMode()"><option value="list">按难度列表导入</option><option value="ids">按题号导入</option><option value="github">GitHub 开源题库</option></select></div><div id="lcListMode"><div class="form-group"><label>难度筛选</label><div style="display:flex;gap:8px;flex-wrap:wrap"><label style="display:flex;align-items:center;gap:4px;font-size:13px;cursor:pointer"><input type="checkbox" id="lcEasy" checked> 简单</label><label style="display:flex;align-items:center;gap:4px;font-size:13px;cursor:pointer"><input type="checkbox" id="lcMedium" checked> 中等</label><label style="display:flex;align-items:center;gap:4px;font-size:13px;cursor:pointer"><input type="checkbox" id="lcHard" checked> 困难</label></div></div><div class="form-group"><label>导入数量</label><input type="number" id="lcCount" value="20" min="1" max="100" style="width:100px"></div></div><div id="lcIdsMode" style="display:none"><div class="form-group"><label>题号列表（逗号分隔）</label><input type="text" id="lcIds" placeholder="1, 2, 3, 15, 206, 70"></div></div><div id="lcGithubMode" style="display:none"><div class="form-group"><label>选择题库</label><select id="lcRepo"><option value="azl397985856/leetcode">azl397985856/leetcode - LeetCode题解（推荐）</option><option value="greyireland/algorithm-pattern">greyireland/algorithm-pattern - 算法模板</option></select></div><p style="font-size:12px;color:var(--text-muted)">从 GitHub 开源仓库获取精选面试题列表，包含题解和分类信息</p></div><div class="form-group"><label>目标分类</label><select id="lcCategory">${CATEGORIES.map(c=>`<option value="${c.id}" ${c.id==='algorithm'?'selected':''}>${c.name}</option>`).join('')}</select></div><label style="display:flex;align-items:center;gap:6px;font-size:13px;margin-bottom:12px;cursor:pointer"><input type="checkbox" id="lcDetail" checked> 获取题目详情（中文标题、描述、通过率）</label><button class="btn btn-orange" onclick="fetchLeetCodeProblems()">${svgIcon('i-download','icon-sm')} 从 LeetCode 导入</button><div id="lcPreview" style="margin-top:16px"></div><div style="margin-top:12px;padding:12px;background:var(--bg-primary);border-radius:var(--radius);font-size:12px;color:var(--text-muted)">${svgIcon('i-lightbulb','icon-sm')} 提示：勾选"获取题目详情"可获取中文标题和题目描述，但速度较慢。取消勾选仅获取基本信息，速度更快。</div>`;
}

function toggleLcMode(){
const mode=document.getElementById('lcMode')?.value;
const listMode=document.getElementById('lcListMode');
const idsMode=document.getElementById('lcIdsMode');
const ghMode=document.getElementById('lcGithubMode');
if(listMode)listMode.style.display=mode==='list'?'block':'none';
if(idsMode)idsMode.style.display=mode==='ids'?'block':'none';
if(ghMode)ghMode.style.display=mode==='github'?'block':'none';
}

function handleBatchFile(event){
const file=event.target.files[0];
if(!file)return;
const reader=new FileReader();
reader.onload=function(e){
try{
const data=JSON.parse(e.target.result);
let questions=[];
if(Array.isArray(data)){questions=data}
else if(data.questions&&Array.isArray(data.questions)){questions=data.questions}
else if(data.title){questions=[data]}
else{toast('无法识别的JSON格式','error');return}
const valid=questions.filter(q=>q.title).map(q=>({title:q.title,category:q.category||'algorithm',difficulty:q.difficulty||'medium',content:q.content||'',answer:q.answer||'',source:q.source||'文件导入'}));
if(!valid.length){toast('未找到有效题目','error');return}
const preview=document.getElementById('filePreview');
if(preview){preview.innerHTML=`<div style="padding:12px;background:var(--bg-primary);border-radius:var(--radius);margin-bottom:12px"><div style="font-size:14px;font-weight:600;margin-bottom:8px">${svgIcon('i-check','icon-sm')} 识别到 ${valid.length} 道题目</div>${valid.slice(0,5).map((q,i)=>`<div style="font-size:13px;color:var(--text-secondary);padding:4px 0">${i+1}. ${q.title} <span class="difficulty-tag difficulty-${q.difficulty}" style="font-size:10px">${DIFF_LABELS[q.difficulty]}</span></div>`).join('')}${valid.length>5?`<div style="font-size:12px;color:var(--text-muted);margin-top:4px">...还有 ${valid.length-5} 道题目</div>`:''}</div><button class="btn btn-orange" onclick="confirmBatchFileImport()">${svgIcon('i-download','icon-sm')} 确认导入 ${valid.length} 道题目</button>`}
window._pendingBatchImport=valid;
}catch(err){toast('JSON解析失败：'+err.message,'error')}
};
reader.readAsText(file);
}

function confirmBatchFileImport(){
if(!window._pendingBatchImport||!window._pendingBatchImport.length){toast('没有可导入的题目','error');return}
Store.addCollected(window._pendingBatchImport);
toast(`成功导入 ${window._pendingBatchImport.length} 道题目！`,'success');
window._pendingBatchImport=null;renderPage();
}

function fetchLeetCodeProblems(){
const mode=document.getElementById('lcMode')?.value;
const category=document.getElementById('lcCategory')?.value||'algorithm';
const preview=document.getElementById('lcPreview');
const withDetail=document.getElementById('lcDetail')?.checked;
if(preview)preview.innerHTML='<div style="text-align:center;padding:20px;color:var(--text-muted)">⏳ 正在获取题目...</div>';
if(mode==='github'){
fetchFromGitHub(category,preview);
}else if(mode==='ids'){
const idsStr=document.getElementById('lcIds')?.value||'';
const ids=idsStr.split(',').map(s=>s.trim()).filter(Boolean).map(Number).filter(n=>n>0);
if(!ids.length){toast('请输入有效的题号','error');return}
fetchLeetCodeByIds(ids,category,preview,withDetail);
}else{
const easy=document.getElementById('lcEasy')?.checked;
const medium=document.getElementById('lcMedium')?.checked;
const hard=document.getElementById('lcHard')?.checked;
const count=parseInt(document.getElementById('lcCount')?.value)||20;
const difficulties=[];
if(easy)difficulties.push('EASY');
if(medium)difficulties.push('MEDIUM');
if(hard)difficulties.push('HARD');
if(!difficulties.length){toast('请至少选择一个难度','error');return}
fetchLeetCodeList(difficulties,count,category,preview,withDetail);
}
}

function fetchLeetCodeList(difficulties,count,category,preview,withDetail){
const query=`query problemsetQuestionList($categorySlug:String,$limit:Int,$skip:Int,$filters:QuestionListFilterInput){problemsetQuestionList:questionList(categorySlug:$categorySlug,limit:$limit,skip:$skip,filters:$filters){total questions{questionFrontendId title titleCn titleSlug difficulty acRate topicTags{name nameTranslated slug}}}}`;
const variables={categorySlug:"",limit:count,skip:0,filters:{difficulty:difficulties}};
fetch('https://leetcode.cn/graphql/',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({query,variables})}).then(r=>r.json()).then(data=>{
const questions=data?.data?.problemsetQuestionList?.questions||[];
if(!questions.length){if(preview)preview.innerHTML='<div style="color:var(--text-muted)">未获取到题目，可能因跨域限制</div>';return}
const tagMap={'array':'algorithm','hash-table':'algorithm','linked-list':'algorithm','math':'algorithm','two-pointers':'algorithm','sliding-window':'algorithm','stack':'algorithm','queue':'algorithm','heap':'algorithm','greedy':'algorithm','dynamic-programming':'algorithm','divide-and-conquer':'algorithm','backtracking':'algorithm','tree':'algorithm','binary-tree':'algorithm','binary-search-tree':'algorithm','graph':'algorithm','depth-first-search':'algorithm','breadth-first-search':'algorithm','binary-search':'algorithm','sort':'algorithm','recursion':'algorithm','trie':'algorithm','monotonic-stack':'algorithm','bit-manipulation':'algorithm','database':'database','shell':'os','concurrency':'os','design':'system-design','javascript':'frontend','html':'frontend','css':'frontend'};
const diffMap={'EASY':'easy','MEDIUM':'medium','HARD':'hard'};
const mapped=questions.map(q=>{
const tags=q.topicTags||[];
let cat=category;
for(const tag of tags){if(tagMap[tag.slug]){cat=tagMap[tag.slug];break}}
const tagNames=tags.map(t=>t.nameTranslated||t.name).filter(Boolean);
const title=q.titleCn||q.title;
return{title:`LC${q.questionFrontendId}: ${title}`,category:cat,difficulty:diffMap[q.difficulty]||'medium',content:`LeetCode #${q.questionFrontendId}\nhttps://leetcode.cn/problems/${q.titleSlug}/\n通过率: ${(q.acRate*100).toFixed(1)}%`,answer:'',source:`LeetCode #${q.questionFrontendId}`,tags:tagNames,acRate:q.acRate?`${(q.acRate*100).toFixed(1)}%`:'',titleSlug:q.titleSlug};
});
if(withDetail&&mapped.length<=30){
fetchLeetCodeDetails(mapped,preview);
}else{
showLeetCodePreview(mapped,preview);
}
}).catch(err=>{if(preview)preview.innerHTML=`<div style="color:var(--difficulty-hard)">❌ 获取失败：${err.message}。建议使用JSON粘贴方式导入。</div>`});
}

function fetchLeetCodeDetails(questions,preview){
let completed=0;
const total=questions.length;
const detailed=[...questions];
detailed.forEach((q,i)=>{
const query=`query questionDetail($titleSlug:String!){question(titleSlug:$titleSlug){content translatedTitle translatedContent difficulty}}`;
fetch('https://leetcode.cn/graphql/',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({query,variables:{titleSlug:q.titleSlug}})}).then(r=>r.json()).then(data=>{
completed++;
const detail=data?.data?.question;
if(detail){
if(detail.translatedTitle)q.title=`LC${q.title}: ${detail.translatedTitle}`;
if(detail.translatedContent){
const div=document.createElement('div');div.innerHTML=detail.translatedContent;
const text=div.textContent||div.innerText||'';
q.content=text.substring(0,500)+'...\n\n来源: LeetCode\nhttps://leetcode.cn/problems/'+q.titleSlug+'/';
}else if(detail.content){
const div=document.createElement('div');div.innerHTML=detail.content;
const text=div.textContent||div.innerText||'';
q.content=text.substring(0,500)+'...\n\n来源: LeetCode\nhttps://leetcode.cn/problems/'+q.titleSlug+'/';
}
}
if(preview)preview.innerHTML=`<div style="text-align:center;padding:12px;color:var(--text-muted)">⏳ 获取详情中... ${completed}/${total}</div>`;
if(completed===total)showLeetCodePreview(detailed,preview);
}).catch(()=>{completed++;if(completed===total)showLeetCodePreview(detailed,preview)});
});
}

function fetchLeetCodeByIds(ids,category,preview,withDetail){
let questions=[];
let completed=0;
ids.forEach(id=>{
const query=`query questionDetail($titleSlug:String!){question(titleSlug:$titleSlug){questionId questionFrontendId title titleCn titleSlug difficulty acRate topicTags{name nameTranslated slug}content translatedTitle translatedContent}}`;
fetch('https://leetcode.cn/graphql/',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({query,variables:{titleSlug:String(id)}})}).then(r=>r.json()).then(data=>{
completed++;
const q=data?.data?.question;
if(q){
const diffMap={'Easy':'easy','Medium':'medium','Hard':'hard'};
const tags=q.topicTags||[];
const tagNames=tags.map(t=>t.nameTranslated||t.name).filter(Boolean);
const title=q.translatedTitle||q.titleCn||q.title;
let content=`LeetCode #${q.questionFrontendId}\nhttps://leetcode.cn/problems/${q.titleSlug}/`;
if(q.acRate)content+=`\n通过率: ${(q.acRate*100).toFixed(1)}%`;
if(withDetail&&(q.translatedContent||q.content)){
const div=document.createElement('div');div.innerHTML=q.translatedContent||q.content;
const text=div.textContent||div.innerText||'';
content=text.substring(0,500)+'...\n\n'+content;
}
questions.push({title:`LC${q.questionFrontendId}: ${title}`,category,difficulty:diffMap[q.difficulty]||'medium',content,answer:'',source:`LeetCode #${q.questionFrontendId}`,tags:tagNames,acRate:q.acRate?`${(q.acRate*100).toFixed(1)}%`:'',titleSlug:q.titleSlug});
}
if(preview)preview.innerHTML=`<div style="text-align:center;padding:12px;color:var(--text-muted)">⏳ 获取详情中... ${completed}/${ids.length}</div>`;
if(completed===ids.length)showLeetCodePreview(questions,preview);
}).catch(()=>{completed++;if(completed===ids.length)showLeetCodePreview(questions,preview)});
});
}

function fetchFromGitHub(category,preview){
const repo=document.getElementById('lcRepo')?.value||'azl397985856/leetcode';
const url=`https://raw.githubusercontent.com/${repo}/master/README.md`;
fetch(url).then(r=>{if(!r.ok)throw new Error('HTTP '+r.status);return r.text()}).then(md=>{
const problems=[];
const lcRegex=/\[(\d+)\.\s*([^\]]+)\]\(https:\/\/leetcode\.cn\/problems\/([^\/]+)\/?\)/g;
let match;
while((match=lcRegex.exec(md))!==null){
const num=match[1],title=match[2],slug=match[3];
problems.push({title:`LC${num}: ${title}`,category,difficulty:'medium',content:`LeetCode #${num}\nhttps://leetcode.cn/problems/${slug}/`,answer:'',source:`GitHub: ${repo}`,tags:[],titleSlug:slug});
}
if(!problems.length){
const simpleRegex=/##\s*(\d+)\.\s*([^\n]+)/g;
while((match=simpleRegex.exec(md))!==null){
const num=match[1],title=match[2].trim();
if(title.length>2&&title.length<100){
problems.push({title:`#${num}: ${title}`,category,difficulty:'medium',content:`来源: ${repo}`,answer:'',source:`GitHub: ${repo}`,tags:[]});
}
}
}
if(!problems.length){
if(preview)preview.innerHTML=`<div style="color:var(--text-muted)">未能从该仓库解析出题目。该仓库可能使用了不同的格式。</div>`;
return;
}
const limited=problems.slice(0,100);
if(problems.length>100&&preview){
preview.innerHTML=`<div style="font-size:12px;color:var(--accent-gold);margin-bottom:8px">${svgIcon('i-zap','icon-sm')} 发现 ${problems.length} 道题目，仅展示前 100 道</div>`;
}
showLeetCodePreview(limited,preview);
}).catch(err=>{
if(preview)preview.innerHTML=`<div style="color:var(--difficulty-hard)">${svgIcon('i-lock','icon-sm')} 获取失败：${err.message}。GitHub 仓库可能不存在或网络受限。</div><div style="font-size:12px;color:var(--text-muted);margin-top:8px">${svgIcon('i-lightbulb','icon-sm')} 建议：手动下载仓库 README，使用"文件上传"方式导入</div>`;
});
}

function showLeetCodePreview(questions,preview){
if(!preview)return;
if(!questions.length){preview.innerHTML='<div style="color:var(--text-muted)">未获取到题目</div>';return}
preview.innerHTML=`<div style="padding:12px;background:var(--bg-primary);border-radius:var(--radius);margin-bottom:12px"><div style="font-size:14px;font-weight:600;margin-bottom:8px">${svgIcon('i-check','icon-sm')} 获取到 ${questions.length} 道题目</div><div style="max-height:300px;overflow-y:auto">${questions.map((q,i)=>`<div style="font-size:13px;color:var(--text-secondary);padding:6px 0;border-bottom:1px solid var(--border-color);display:flex;justify-content:space-between;align-items:center;gap:8px"><span style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap;flex:1">${i+1}. ${q.title}</span><div style="display:flex;gap:4px;align-items:center;flex-shrink:0"><span class="difficulty-tag difficulty-${q.difficulty}" style="font-size:10px">${DIFF_LABELS[q.difficulty]}</span>${q.acRate?`<span style="font-size:10px;color:var(--accent-cyan)">${q.acRate}</span>`:''}</div></div>`).join('')}</div></div><button class="btn btn-orange" onclick="confirmLeetCodeImport()">${svgIcon('i-download','icon-sm')} 确认导入 ${questions.length} 道题目</button>`;
window._pendingLcImport=questions;
}

function confirmLeetCodeImport(){
if(!window._pendingLcImport||!window._pendingLcImport.length){toast('没有可导入的题目','error');return}
Store.addCollected(window._pendingLcImport);
toast(`成功导入 ${window._pendingLcImport.length} 道题目！`,'success');
window._pendingLcImport=null;renderPage();
}

function renderCollectSources(){
const sources=Store.getSources();
return`<div class="card"><h3 style="margin-bottom:16px">${svgIcon('i-refresh','icon-sm')} 题源管理</h3><div class="form-group"><label>添加新题源</label><div style="display:flex;gap:8px"><input type="text" id="srcName" placeholder="题源名称" style="flex:1"><input type="text" id="srcUrl" placeholder="https://..." style="flex:2"><button class="btn btn-orange btn-sm" onclick="addSource()">添加</button></div></div><div style="margin-bottom:12px"><button class="btn btn-primary btn-sm" onclick="refreshAllSources()">${svgIcon('i-refresh','icon-sm')} 刷新全部题源</button></div>${sources.length?sources.map(s=>`<div class="source-item"><div class="source-url"><strong>${s.name||'未命名'}</strong><br><span style="font-size:12px">${s.url}</span></div><button class="btn btn-outline btn-sm" onclick="refreshSource('${s.id}')">刷新</button><button class="btn btn-danger btn-sm" onclick="removeSource('${s.id}')">删除</button></div>`).join(''):'<p style="color:var(--text-muted)">暂无题源</p>'}</div>`;
}

function renderCollectRecords(){
const collected=Store.getCollected();
const weekAgo=new Date();weekAgo.setDate(weekAgo.getDate()-7);
const weekCollected=collected.filter(q=>new Date(q.collectedAt)>weekAgo).length;
const sources={};collected.forEach(q=>{const s=q.source||'手动添加';sources[s]=(sources[s]||0)+1});
return`<div class="stat-grid"><div class="stat-card"><div class="stat-number">${collected.length}</div><div class="stat-label">总收录</div></div><div class="stat-card"><div class="stat-number">${weekCollected}</div><div class="stat-label">本周收录</div></div></div><div class="card"><h3 style="margin-bottom:16px">收录来源统计</h3>${Object.entries(sources).map(([s,c])=>`<div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid var(--border-color)"><span style="font-size:13px">${s}</span><span style="color:var(--accent-orange);font-weight:600">${c} 道</span></div>`).join('')||'<p style="color:var(--text-muted)">暂无收录记录</p>'}</div>${collected.length?`<div class="card"><h3 style="margin-bottom:16px">收录历史</h3>${collected.slice().reverse().slice(0,20).map(q=>`<div class="question-card" onclick="navigate('detail',{id:'${q.id}'})"><div class="q-info"><div class="q-title">${q.title}</div><div class="q-meta"><span class="source-badge collected">收录</span><span class="difficulty-tag difficulty-${q.difficulty}">${DIFF_LABELS[q.difficulty]}</span><span style="font-size:11px;color:var(--text-muted)">${q.source||'手动添加'} · ${new Date(q.collectedAt).toLocaleDateString()}</span></div></div></div>`).join('')}</div>`:''}`;
}

function submitManualCollect(){
const title=sanitizeInput(document.getElementById('cTitle')?.value?.trim());
if(!title){toast('请输入题干','error');return}
const qType=document.getElementById('cType')?.value||'short';
const q={title,category:document.getElementById('cCategory')?.value||'algorithm',difficulty:document.getElementById('cDifficulty')?.value||'medium',type:qType,content:sanitizeInput(document.getElementById('cContent')?.value||''),answer:sanitizeInput(document.getElementById('cAnswer')?.value||''),source:sanitizeInput(document.getElementById('cSource')?.value||'手动添加')};
const tagsVal=document.getElementById('cTags')?.value?.trim();
if(tagsVal)q.tags=tagsVal.split(/[,，]/).map(t=>sanitizeInput(t.trim())).filter(Boolean);
if(['single','multi'].includes(qType)){
const optText=document.getElementById('cOptions')?.value?.trim();
if(optText)q.options=optText.split('\n').map(o=>sanitizeInput(o.trim())).filter(Boolean);
const correct=document.getElementById('cCorrectAnswer')?.value?.trim();
if(correct)q.correctAnswer=sanitizeInput(correct);
}else if(qType==='judgment'){
const correct=document.getElementById('cCorrectAnswer')?.value?.trim();
if(correct)q.correctAnswer=sanitizeInput(correct||'对');
}
Store.addCollected([q]);toast(svgIcon('i-check','icon-sm')+' 收录成功！','success');renderPage();
}
function toggleCollectOptions(){
const type=document.getElementById('cType')?.value;
const section=document.getElementById('collectOptionsSection');
if(section)section.style.display=['single','multi','judgment'].includes(type)?'block':'none';
}

function parseWebText(){
const text=document.getElementById('webText')?.value?.trim();
if(!text){toast('请输入网页文本内容','error');return}
parsedResults=ParseEngine.parse(text);
if(!parsedResults.length){toast('未能识别出题目，请检查格式','error');return}
toast(`成功解析 ${parsedResults.length} 道题目`,'success');renderPage();
}

function fetchWebPage(){
const url=document.getElementById('webUrl')?.value?.trim();
if(!url){toast('请输入URL','error');return}
toast('正在获取页面...','info');
fetch(url).then(r=>r.text()).then(t=>{
const el=document.createElement('div');el.innerHTML=t;
const text=el.innerText||el.textContent||'';
document.getElementById('webText').value=text;
toast('页面内容已获取，请点击解析','success');
}).catch(()=>{toast('获取失败（可能跨域限制），请手动复制网页内容粘贴','error')});
}

function confirmCollectParsed(){
if(!parsedResults.length){toast('没有可收录的题目','error');return}
Store.addCollected(parsedResults.map(q=>({...q})));
toast(`成功收录 ${parsedResults.length} 道题目！`,'success');
parsedResults=[];renderPage();
}

function submitBatchImport(){
const json=document.getElementById('batchJson')?.value?.trim();
if(!json){toast('请输入JSON数据','error');return}
try{
const qs=JSON.parse(json);
if(!Array.isArray(qs)){toast('数据必须是数组格式','error');return}
const valid=qs.filter(q=>q.title).map(q=>({title:q.title,category:q.category||'algorithm',difficulty:q.difficulty||'medium',content:q.content||'',answer:q.answer||'',source:q.source||'批量导入'}));
if(!valid.length){toast('未找到有效题目','error');return}
Store.addCollected(valid);toast(`成功导入 ${valid.length} 道题目！`,'success');renderPage();
}catch(e){toast('JSON格式错误：'+e.message,'error')}
}

function addSource(){
const name=document.getElementById('srcName')?.value?.trim();
const url=document.getElementById('srcUrl')?.value?.trim();
if(!url){toast('请输入URL','error');return}
const sources=Store.getSources();
sources.push({id:'src-'+Date.now(),name:name||url,url,type:'custom'});
Store.setSources(sources);toast('题源已添加','success');renderPage();
}

function removeSource(id){
const sources=Store.getSources().filter(s=>s.id!==id);
Store.setSources(sources);toast('题源已删除','success');renderPage();
}

function refreshSource(id){
const sources=Store.getSources();
const src=sources.find(s=>s.id===id);
if(!src)return;
toast('正在刷新: '+src.name,'info');
fetch(src.url).then(r=>r.text()).then(t=>{
const results=ParseEngine.parse(t);
if(!results.length){toast('未识别到新题目','error');return}
parsedResults=results;collectTab=1;
toast(`识别到 ${results.length} 道题目，请查看预览`,'success');renderPage();
}).catch(()=>{toast('获取失败，请手动复制内容粘贴','error')});
}

function refreshAllSources(){
const sources=Store.getSources();
if(!sources.length){toast('暂无题源','error');return}
toast('正在刷新全部题源...','info');
let allResults=[];
let chain=Promise.resolve();
sources.forEach(src=>{
chain=chain.then(()=>fetch(src.url).then(r=>r.text()).then(t=>{
allResults=allResults.concat(ParseEngine.parse(t));
}).catch(()=>{}));
});
chain.then(()=>{
if(!allResults.length){toast('未识别到新题目','error');return}
parsedResults=allResults;collectTab=1;
toast(`共识别到 ${allResults.length} 道题目，请查看预览`,'success');renderPage();
});
}

function renderFavorites(){
const allQ=getActiveQuestions(),favorites=Store.getFavorites(),favoritesSet=new Set(favorites);
const favQ=allQ.filter(q=>favoritesSet.has(q.id));
return`<div style="display:flex;align-items:center;gap:12px;margin-bottom:16px"><button class="btn btn-outline btn-sm" onclick="navigate('dashboard')">← 返回首页</button><h2>${svgIcon('i-star','icon-lg')} 收藏夹</h2></div>${favQ.length===0?'<div class="empty-state"><div class="empty-icon">'+svgIcon('i-star','icon-2xl')+'</div><div class="empty-title">还没有收藏任何题目</div><div class="empty-desc">收藏题目方便后续复习和重点突破</div><button class="btn btn-primary" style="margin-top:12px" onclick="navigate(\'questions\')">前往题库</button></div>':favQ.map((q,i)=>`<div class="question-card" onclick="navigate('detail',{id:'${q.id}'})"><div class="q-number">${i+1}</div><div class="q-info"><div class="q-title">${q.title}</div><div class="q-meta"><span class="difficulty-tag difficulty-${q.difficulty}">${DIFF_LABELS[q.difficulty]}</span><span class="category-tag">${CATEGORY_MAP[q.category]||q.category}</span></div></div><div class="q-actions" onclick="event.stopPropagation()"><button onclick="Store.toggleFavorite('${q.id}');renderPage()" title="取消收藏" style="color:var(--accent-gold)">${svgIcon('i-star','icon-sm')}</button></div></div>`).join('')}`;
}

function renderResume(){
const allQ=getActiveQuestions(),mastered=Store.getMastered(),masteredSet=new Set(mastered),favorites=Store.getFavorites(),wrongBook=Store.getWrongBook(),streak=Store.getStreak(),totalAttempts=Store.getTotalAttempts(),correctCount=Store.getCorrectCount();
const accuracy=totalAttempts?Math.round(correctCount/totalAttempts*100):0;
const totalPct=allQ.length?Math.round(mastered.length/allQ.length*100):0;
const masteredByCat={};allQ.forEach(q=>{if(masteredSet.has(q.id)){masteredByCat[q.category]=(masteredByCat[q.category]||0)+1}});
const catStats=CATEGORIES.map(c=>{const total=allQ.filter(q=>q.category===c.id).length;const done=masteredByCat[c.id]||0;return{id:c.id,name:c.name,total,done,pct:total?Math.round(done/total*100):0}}).filter(c=>c.total>0);
const topCats=catStats.sort((a,b)=>b.pct-a.pct).slice(0,5);
const weakCats=catStats.filter(c=>c.pct<50).sort((a,b)=>a.pct-b.pct).slice(0,3);
const achievements=Store.getAchievements();
const resumeData=Store.get('resumeData',null);
const rd=resumeData||{name:'',title:'',email:'',phone:'',github:'',summary:'',skills:'',education:'',experience:'',projects:''};
return`<nav class="breadcrumb" aria-label="面包屑导航" style="display:flex;align-items:center;gap:6px;flex-wrap:wrap;margin-bottom:16px;padding:10px 14px;background:var(--bg-secondary);border:1px solid var(--border-color);border-radius:var(--radius);font-size:13px"><a href="javascript:void(0)" onclick="navigate('dashboard')" style="color:var(--accent-cyan);text-decoration:none;display:inline-flex;align-items:center;gap:4px">${svgIcon('i-home','icon-sm')} 首页</a><span style="color:var(--text-muted)">/</span><span style="color:var(--text-secondary)">我的简历</span></nav>
<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(320px,1fr));gap:20px;align-items:start">
<div>
<div class="card" style="border-left:3px solid var(--accent-cyan)">
<h3 style="margin-bottom:16px;color:var(--accent-cyan)">${svgIcon('i-user','icon-sm')} 个人信息</h3>
<div style="display:flex;flex-direction:column;gap:12px">
<div><label style="font-size:12px;color:var(--text-muted);display:block;margin-bottom:4px">姓名</label><input id="r-name" type="text" value="${rd.name}" placeholder="请输入姓名" style="width:100%;padding:10px 12px;background:var(--bg-primary);color:var(--text-primary);border:1px solid var(--border-color);border-radius:var(--radius);font-size:14px;outline:none" oninput="saveResumeField('name',this.value)"></div>
<div><label style="font-size:12px;color:var(--text-muted);display:block;margin-bottom:4px">职位/目标</label><input id="r-title" type="text" value="${rd.title}" placeholder="如：前端开发工程师" style="width:100%;padding:10px 12px;background:var(--bg-primary);color:var(--text-primary);border:1px solid var(--border-color);border-radius:var(--radius);font-size:14px;outline:none" oninput="saveResumeField('title',this.value)"></div>
<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">
<div><label style="font-size:12px;color:var(--text-muted);display:block;margin-bottom:4px">邮箱</label><input id="r-email" type="email" value="${rd.email}" placeholder="email@example.com" style="width:100%;padding:10px 12px;background:var(--bg-primary);color:var(--text-primary);border:1px solid var(--border-color);border-radius:var(--radius);font-size:14px;outline:none" oninput="saveResumeField('email',this.value)"></div>
<div><label style="font-size:12px;color:var(--text-muted);display:block;margin-bottom:4px">电话</label><input id="r-phone" type="tel" value="${rd.phone}" placeholder="138-xxxx-xxxx" style="width:100%;padding:10px 12px;background:var(--bg-primary);color:var(--text-primary);border:1px solid var(--border-color);border-radius:var(--radius);font-size:14px;outline:none" oninput="saveResumeField('phone',this.value)"></div>
</div>
<div><label style="font-size:12px;color:var(--text-muted);display:block;margin-bottom:4px">GitHub/个人网站</label><input id="r-github" type="url" value="${rd.github}" placeholder="https://github.com/username" style="width:100%;padding:10px 12px;background:var(--bg-primary);color:var(--text-primary);border:1px solid var(--border-color);border-radius:var(--radius);font-size:14px;outline:none" oninput="saveResumeField('github',this.value)"></div>
</div>
</div>
<div class="card" style="margin-top:16px;border-left:3px solid var(--accent-gold)">
<h3 style="margin-bottom:16px;color:var(--accent-gold)">${svgIcon('i-edit','icon-sm')} 个人简介</h3>
<textarea id="r-summary" style="width:100%;min-height:100px;padding:12px;background:var(--bg-primary);color:var(--text-primary);border:1px solid var(--border-color);border-radius:var(--radius);font-size:14px;line-height:1.6;resize:vertical;outline:none;font-family:inherit" placeholder="简要描述你的专业背景、技术特长和职业目标..." oninput="saveResumeField('summary',this.value)">${rd.summary}</textarea>
</div>
<div class="card" style="margin-top:16px;border-left:3px solid var(--accent-orange)">
<h3 style="margin-bottom:16px;color:var(--accent-orange)">${svgIcon('i-star','icon-sm')} 技能特长</h3>
<textarea id="r-skills" style="width:100%;min-height:120px;padding:12px;background:var(--bg-primary);color:var(--text-primary);border:1px solid var(--border-color);border-radius:var(--radius);font-size:14px;line-height:1.6;resize:vertical;outline:none;font-family:inherit" placeholder="每行一项技能，如：&#10;JavaScript/TypeScript - 熟练&#10;React/Vue - 熟练&#10;Node.js - 掌握" oninput="saveResumeField('skills',this.value)">${rd.skills}</textarea>
</div>
</div>
<div>
<div class="card" style="border-left:3px solid var(--difficulty-easy)">
<h3 style="margin-bottom:16px;color:var(--difficulty-easy)">${svgIcon('i-award','icon-sm')} 教育经历</h3>
<textarea id="r-education" style="width:100%;min-height:100px;padding:12px;background:var(--bg-primary);color:var(--text-primary);border:1px solid var(--border-color);border-radius:var(--radius);font-size:14px;line-height:1.6;resize:vertical;outline:none;font-family:inherit" placeholder="学校名称 | 专业 | 学历 | 时间&#10;如：XX大学 | 计算机科学 | 本科 | 2020-2024" oninput="saveResumeField('education',this.value)">${rd.education}</textarea>
</div>
<div class="card" style="margin-top:16px;border-left:3px solid var(--accent-purple)">
<h3 style="margin-bottom:16px;color:var(--accent-purple)">${svgIcon('i-briefcase','icon-sm')} 工作经历</h3>
<textarea id="r-experience" style="width:100%;min-height:120px;padding:12px;background:var(--bg-primary);color:var(--text-primary);border:1px solid var(--border-color);border-radius:var(--radius);font-size:14px;line-height:1.6;resize:vertical;outline:none;font-family:inherit" placeholder="公司名称 | 职位 | 时间&#10;工作内容和成果..." oninput="saveResumeField('experience',this.value)">${rd.experience}</textarea>
</div>
<div class="card" style="margin-top:16px;border-left:3px solid var(--accent-cyan)">
<h3 style="margin-bottom:16px;color:var(--accent-cyan)">${svgIcon('i-code','icon-sm')} 项目经历</h3>
<textarea id="r-projects" style="width:100%;min-height:120px;padding:12px;background:var(--bg-primary);color:var(--text-primary);border:1px solid var(--border-color);border-radius:var(--radius);font-size:14px;line-height:1.6;resize:vertical;outline:none;font-family:inherit" placeholder="项目名称 | 角色 | 时间&#10;技术栈和项目描述..." oninput="saveResumeField('projects',this.value)">${rd.projects}</textarea>
</div>
</div>
</div>
<div class="card" style="margin-top:20px;border-left:3px solid var(--accent-gold)">
<h3 style="margin-bottom:16px;color:var(--accent-gold)">${svgIcon('i-chart','icon-sm')} 学习数据（自动生成）</h3>
<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:12px;margin-bottom:16px">
<div style="padding:16px;background:var(--bg-primary);border-radius:var(--radius);text-align:center;border:1px solid var(--border-color)"><div style="font-size:28px;font-weight:800;color:var(--accent-cyan)">${mastered.length}</div><div style="font-size:12px;color:var(--text-muted)">已掌握题目</div></div>
<div style="padding:16px;background:var(--bg-primary);border-radius:var(--radius);text-align:center;border:1px solid var(--border-color)"><div style="font-size:28px;font-weight:800;color:var(--difficulty-easy)">${accuracy}%</div><div style="font-size:12px;color:var(--text-muted)">答题正确率</div></div>
<div style="padding:16px;background:var(--bg-primary);border-radius:var(--radius);text-align:center;border:1px solid var(--border-color)"><div style="font-size:28px;font-weight:800;color:var(--accent-orange)">${streak}</div><div style="font-size:12px;color:var(--text-muted)">连续打卡天数</div></div>
<div style="padding:16px;background:var(--bg-primary);border-radius:var(--radius);text-align:center;border:1px solid var(--border-color)"><div style="font-size:28px;font-weight:800;color:var(--accent-gold)">${totalPct}%</div><div style="font-size:12px;color:var(--text-muted)">总掌握率</div></div>
<div style="padding:16px;background:var(--bg-primary);border-radius:var(--radius);text-align:center;border:1px solid var(--border-color)"><div style="font-size:28px;font-weight:800;color:var(--accent-purple)">${achievements.length}</div><div style="font-size:12px;color:var(--text-muted)">成就徽章</div></div>
</div>
${topCats.length?`<div style="margin-bottom:12px"><h4 style="font-size:13px;color:var(--text-secondary);margin-bottom:8px">优势领域</h4><div style="display:flex;gap:8px;flex-wrap:wrap">${topCats.map(c=>`<span style="display:inline-flex;align-items:center;gap:4px;padding:4px 10px;background:rgba(0,230,118,.1);border:1px solid rgba(0,230,118,.3);border-radius:20px;font-size:12px;color:var(--difficulty-easy)">${c.name} ${c.pct}%</span>`).join('')}</div></div>`:''}
${weakCats.length?`<div><h4 style="font-size:13px;color:var(--text-secondary);margin-bottom:8px">待提升领域</h4><div style="display:flex;gap:8px;flex-wrap:wrap">${weakCats.map(c=>`<span style="display:inline-flex;align-items:center;gap:4px;padding:4px 10px;background:rgba(239,68,68,.1);border:1px solid rgba(239,68,68,.3);border-radius:20px;font-size:12px;color:var(--accent-red)">${c.name} ${c.pct}%</span>`).join('')}</div></div>`:''}
</div>
<div style="display:flex;gap:12px;margin-top:20px;justify-content:center">
<button class="btn btn-primary" onclick="exportResume()">${svgIcon('i-download','icon-sm')} 导出简历</button>
<button class="btn btn-outline" onclick="printResume()">${svgIcon('i-printer','icon-sm')} 打印简历</button>
</div>`;
}
function saveResumeField(field,value){
const rd=Store.get('resumeData',{});
rd[field]=value;
Store.set('resumeData',rd);
}
function exportResume(){
const rd=Store.get('resumeData',{name:'',title:'',email:'',phone:'',github:'',summary:'',skills:'',education:'',experience:'',projects:''});
const allQ=getActiveQuestions(),mastered=Store.getMastered(),streak=Store.getStreak(),totalAttempts=Store.getTotalAttempts(),correctCount=Store.getCorrectCount();
const accuracy=totalAttempts?Math.round(correctCount/totalAttempts*100):0;
const totalPct=allQ.length?Math.round(mastered.length/allQ.length*100):0;
let md=`# ${rd.name||'姓名'}\n\n`;
if(rd.title)md+=`**${rd.title}**\n\n`;
const contacts=[];
if(rd.email)contacts.push(`📧 ${rd.email}`);
if(rd.phone)contacts.push(`📱 ${rd.phone}`);
if(rd.github)contacts.push(`🔗 ${rd.github}`);
if(contacts.length)md+=contacts.join(' | ')+'\n\n---\n\n';
if(rd.summary)md+=`## 个人简介\n\n${rd.summary}\n\n`;
if(rd.skills)md+=`## 技能特长\n\n${rd.skills.split('\n').map(s=>`- ${s}`).join('\n')}\n\n`;
if(rd.education)md+=`## 教育经历\n\n${rd.education}\n\n`;
if(rd.experience)md+=`## 工作经历\n\n${rd.experience}\n\n`;
if(rd.projects)md+=`## 项目经历\n\n${rd.projects}\n\n`;
md+=`## 学习数据\n\n- 已掌握题目：${mastered.length} / ${allQ.length}\n- 答题正确率：${accuracy}%\n- 连续打卡：${streak} 天\n- 总掌握率：${totalPct}%\n`;
const blob=new Blob([md],{type:'text/markdown'});
const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=`${rd.name||'简历'}.md`;a.click();
showToast('简历已导出为 Markdown 文件','success');
}
function printResume(){
window.print();
}

function renderWrongBook(){
const allQ=getActiveQuestions(),wrongBook=Store.getWrongBook();
const wrongMap=new Map(wrongBook.map(w=>[w.qid,w]));
const wrongQ=allQ.filter(q=>wrongMap.has(q.id));
const totalAttempts=Store.getTotalAttempts();
const correctCount=Store.getCorrectCount();
const accuracy=totalAttempts>0?Math.round(correctCount/totalAttempts*100):0;
const reviewedCount=wrongBook.filter(w=>w.reviewed).length;
const unreviewedCount=wrongBook.length-reviewedCount;
const byCategory={};
wrongQ.forEach(q=>{byCategory[q.category]=(byCategory[q.category]||0)+1});
const sortedCats=Object.entries(byCategory).sort((a,b)=>b[1]-a[1]);
return`<div style="display:flex;align-items:center;gap:12px;margin-bottom:16px"><button class="btn btn-outline btn-sm" onclick="navigate('dashboard')">← 返回首页</button><h2>${svgIcon('i-refresh','icon-lg')} 错题本</h2><span class="badge" style="background:var(--accent-red);color:#fff;margin-left:auto">${wrongQ.length} 道错题</span></div>
<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:12px;margin-bottom:20px">
<div class="stat-card" style="text-align:center;padding:16px"><div style="font-size:28px;font-weight:700;color:var(--accent-red)">${wrongQ.length}</div><div style="font-size:12px;color:var(--text-muted)">错题总数</div></div>
<div class="stat-card" style="text-align:center;padding:16px"><div style="font-size:28px;font-weight:700;color:var(--accent-orange)">${unreviewedCount}</div><div style="font-size:12px;color:var(--text-muted)">待复习</div></div>
<div class="stat-card" style="text-align:center;padding:16px"><div style="font-size:28px;font-weight:700;color:var(--accent-green)">${reviewedCount}</div><div style="font-size:12px;color:var(--text-muted)">已复习</div></div>
<div class="stat-card" style="text-align:center;padding:16px"><div style="font-size:28px;font-weight:700;color:var(--accent-cyan)">${accuracy}%</div><div style="font-size:12px;color:var(--text-muted)">总正确率</div></div>
</div>
${sortedCats.length>0?`<div style="margin-bottom:20px"><h3 style="font-size:14px;margin-bottom:10px;color:var(--text-muted)">薄弱分类</h3><div style="display:flex;flex-wrap:wrap;gap:8px">${sortedCats.map(([cat,count])=>`<span class="category-tag" style="cursor:pointer;background:var(--accent-red);color:#fff;opacity:${0.5+0.5*count/Math.max(...sortedCats.map(c=>c[1]))}" onclick="navigate('questions',{category:'${cat}'})">${CATEGORY_MAP[cat]||cat} (${count})</span>`).join('')}</div></div>`:''}
<div style="display:flex;gap:8px;margin-bottom:16px"><button class="btn btn-primary btn-sm" onclick="reviewWrongBook()">${svgIcon('i-play','icon-sm')} 开始复习 (${unreviewedCount}题)</button><button class="btn btn-outline btn-sm" onclick="clearReviewedWrong()">${svgIcon('i-check','icon-sm')} 清除已复习</button></div>
${wrongQ.length===0?'<div class="empty-state"><div class="empty-icon">'+svgIcon('i-check-circle','icon-2xl')+'</div><div class="empty-title">错题本是空的</div><div class="empty-desc">继续保持！你的正确率很高</div><button class="btn btn-primary" style="margin-top:12px" onclick="navigate(\'questions\')">前往题库</button></div>':wrongQ.map((q,i)=>{const w=wrongMap.get(q.id);return`<div class="question-card" style="border-left:3px solid ${w.reviewed?'var(--accent-green)':'var(--accent-red)'}" onclick="navigate('detail',{id:'${q.id}'})"><div class="q-number" style="background:${w.reviewed?'var(--accent-green)':'var(--accent-red)'}">${i+1}</div><div class="q-info"><div class="q-title">${q.title}</div><div class="q-meta"><span class="difficulty-tag difficulty-${q.difficulty}">${DIFF_LABELS[q.difficulty]}</span><span class="category-tag">${CATEGORY_MAP[q.category]||q.category}</span><span style="font-size:11px;color:var(--text-muted)">错${w.count}次 ${w.reviewed?'· 已复习':''}</span></div></div><div class="q-actions" onclick="event.stopPropagation()"><button onclick="Store.removeWrong('${q.id}');renderPage()" title="移出错题本" style="color:var(--accent-green)">${svgIcon('i-check','icon-sm')}</button></div></div>`}).join('')}`;
}

function reviewWrongBook(){
const wrongBook=Store.getWrongBook();
const unreviewed=wrongBook.filter(w=>!w.reviewed);
if(unreviewed.length===0){showToast('没有待复习的错题','info');return}
const ids=unreviewed.map(w=>w.qid);
navigate('practice',{mode:'wrongbook',ids:ids.join(',')});
}

function clearReviewedWrong(){
const wrongBook=Store.getWrongBook();
const remaining=wrongBook.filter(w=>!w.reviewed);
Store.setWrongBook(remaining);
showToast('已清除已复习的错题','success');
renderPage();
}

function renderStats(){
try{
var allQ=getActiveQuestions(),masteredArr=Store.getMastered(),favorites=Store.getFavorites(),collected=Store.getCollected();
var masteredSet=new Set(masteredArr);
var totalPct=allQ.length?Math.round(masteredArr.length/allQ.length*100):0;
var catStats=CATEGORIES.map(function(c){var total=0,mastered=0;allQ.forEach(function(q){if(q.category===c.id){total++;if(masteredSet.has(q.id))mastered++}});return{id:c.id,name:c.name,icon:c.icon,group:c.group,total:total,mastered:mastered,pct:total?Math.round(mastered/total*100):0}});
var maxTotal=1;catStats.forEach(function(c){if(c.total>maxTotal)maxTotal=c.total});
const checkins=Store.getCheckins();
const streak=Store.getStreak();
const today=new Date();
const calDays=[];for(let i=29;i>=0;i--){const d=new Date(today);d.setDate(d.getDate()-i);calDays.push(d)}
const achievements=Store.getAchievements();
const checkinsSet=new Set(checkins);
const diffStats={easy:{total:0,mastered:0},medium:{total:0,mastered:0},hard:{total:0,mastered:0}};
allQ.forEach(q=>{if(diffStats[q.difficulty]){diffStats[q.difficulty].total++;if(masteredSet.has(q.id))diffStats[q.difficulty].mastered++}});
const totalAttempts=Store.getTotalAttempts();
const correctCount=Store.getCorrectCount();
const accuracy=totalAttempts>0?Math.round(correctCount/totalAttempts*100):0;
const studyTimeMs=Store.getStudyTime();
const studyHours=Math.round(studyTimeMs/3600000*10)/10;
const wrongBook=Store.getWrongBook();
return`<div style="display:flex;align-items:center;gap:12px;margin-bottom:20px"><button class="btn btn-outline btn-sm" onclick="navigate('dashboard')">← 返回首页</button><h2>${svgIcon('i-chart','icon-lg')} 我的统计</h2></div><div class="stat-grid"><div class="stat-card" style="border-left:3px solid var(--accent-cyan)"><div class="stat-number" style="color:var(--accent-cyan)">${allQ.length}</div><div class="stat-label">总题数</div></div><div class="stat-card" style="border-left:3px solid var(--difficulty-easy)"><div class="stat-number" style="color:var(--difficulty-easy)">${masteredArr.length}</div><div class="stat-label">已掌握</div></div><div class="stat-card" style="border-left:3px solid var(--accent-gold)"><div class="stat-number" style="color:var(--accent-gold)">${totalPct}%</div><div class="stat-label">掌握率</div></div><div class="stat-card" style="border-left:3px solid var(--accent-orange)"><div class="stat-number" style="color:var(--accent-orange)">${streak}</div><div class="stat-label">连续打卡</div></div></div>
<div class="stat-grid" style="margin-top:12px"><div class="stat-card" style="border-left:3px solid var(--accent-green)"><div class="stat-number" style="color:var(--accent-green)">${accuracy}%</div><div class="stat-label">正确率 (${correctCount}/${totalAttempts})</div></div><div class="stat-card" style="border-left:3px solid var(--accent-purple)"><div class="stat-number" style="color:var(--accent-purple)">${studyHours}h</div><div class="stat-label">学习时长</div></div><div class="stat-card" style="border-left:3px solid var(--accent-red)"><div class="stat-number" style="color:var(--accent-red)">${wrongBook.length}</div><div class="stat-label">错题数</div></div><div class="stat-card" style="border-left:3px solid var(--accent-pink)"><div class="stat-number" style="color:var(--accent-pink)">${favorites.length}</div><div class="stat-label">收藏数</div></div></div>

<div style="display:flex;gap:16px;flex-wrap:wrap">
<div class="card" style="flex:2;min-width:320px">
<h3 style="margin-bottom:16px"><svg class="icon-sm"><use href="#i-chart"/></svg> 分类掌握进度</h3>
<div class="bar-chart">${catStats.map(c=>`<div class="bar-item"><div class="bar-value">${c.pct}%</div><div class="bar" style="height:${c.total?c.mastered/c.total*100:0}%"></div><div class="bar-label" style="font-size:11px;line-height:1.3;text-align:center;word-break:keep-all">${c.name.length>4?c.name.substring(0,2)+'<br>'+c.name.substring(2):c.name.substring(0,2)+'<br>'+c.name.substring(2)}</div></div>`).join('')}</div>
</div>
<div class="card" style="flex:1;min-width:240px">
<h3 style="margin-bottom:16px">${svgIcon('i-target','icon-sm')} 难度分布</h3>
<div style="display:flex;flex-direction:column;gap:16px;padding:8px 0">
${['easy','medium','hard'].map(d=>{const s=diffStats[d];const pct=s.total?Math.round(s.mastered/s.total*100):0;const colors={easy:'var(--difficulty-easy)',medium:'var(--difficulty-medium)',hard:'var(--difficulty-hard)'};const labels={easy:'简单',medium:'中等',hard:'困难'};return`<div><div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px"><span style="font-size:14px;font-weight:500;color:${colors[d]}">${labels[d]}</span><span style="font-size:13px;color:var(--text-muted)">${s.mastered}/${s.total} (${pct}%)</span></div><div style="height:8px;background:var(--bg-tertiary);border-radius:4px;overflow:hidden"><div style="height:100%;width:${pct}%;background:${colors[d]};border-radius:4px;transition:width .5s"></div></div></div>`}).join('')}
</div>
</div>
</div>
<svg viewBox="0 0 200 200" style="width:100%;max-width:240px;margin:0 auto;display:block">
${(()=>{
const cats=catStats.slice(0,8);const cx=100,cy=100,r=70;
const pts=cats.map((c,i)=>{const a=Math.PI*2*i/cats.length-Math.PI/2;const pr=r*c.pct/100;return{x:cx+pr*Math.cos(a),y:cy+pr*Math.sin(a)}});
const grid=cats.map((c,i)=>{const a=Math.PI*2*i/cats.length-Math.PI/2;return{x:cx+r*Math.cos(a),y:cy+r*Math.sin(a)}});
let svg='';
[.25,.5,.75,1].forEach(s=>{const gp=cats.map((c,i)=>{const a=Math.PI*2*i/cats.length-Math.PI/2;return`${cx+r*s*Math.cos(a)},${cy+r*s*Math.sin(a)}`});svg+=`<polygon points="${gp.join(' ')}" fill="none" stroke="var(--border-color)" stroke-width=".5"/>`});
cats.forEach((c,i)=>{const a=Math.PI*2*i/cats.length-Math.PI/2;svg+=`<line x1="${cx}" y1="${cy}" x2="${grid[i].x}" y2="${grid[i].y}" stroke="var(--border-color)" stroke-width=".5"/>`;svg+=`<text x="${cx+(r+18)*Math.cos(a)}" y="${cy+(r+18)*Math.sin(a)}" fill="var(--text-muted)" font-size="8" text-anchor="middle" dominant-baseline="middle">${c.name.substring(0,4)}</text>`});
svg+=`<polygon points="${pts.map(p=>p.x+','+p.y).join(' ')}" fill="rgba(0,229,255,.15)" stroke="var(--accent-cyan)" stroke-width="1.5"/>`;
pts.forEach(p=>{svg+=`<circle cx="${p.x}" cy="${p.y}" r="2.5" fill="var(--accent-cyan)"/>`});
return svg;
})()}
</svg>
</div>
</div>

<div style="display:flex;gap:16px;flex-wrap:wrap">
<div class="card" style="flex:1;min-width:300px">
<h3 style="margin-bottom:16px"><svg class="icon-sm"><use href="#i-chart"/></svg> 做题趋势（最近7天）</h3>
<div style="display:flex;align-items:flex-end;gap:6px;height:120px;padding:0 4px">
${(()=>{
const mastered7d=[];const now=new Date();
const masteredHistory=Store.getMasteredHistory();
for(let i=6;i>=0;i--){const d=new Date(now);d.setDate(d.getDate()-i);const ds=d.toDateString();const count=masteredHistory[ds]||0;mastered7d.push({day:d,count})}
const max=Math.max(...mastered7d.map(d=>d.count),1);
return mastered7d.map((d,i)=>{const h=Math.max(d.count/max*100,4);const dayLabel=['日','一','二','三','四','五','六'][d.day.getDay()];return`<div style="flex:1;display:flex;flex-direction:column;align-items:center;gap:4px"><div style="font-size:10px;color:var(--text-muted);margin-bottom:2px">${d.count>0?d.count:''}</div><div style="width:100%;height:${h}px;background:linear-gradient(to top,var(--accent-cyan),var(--accent-gold));border-radius:4px 4px 0 0;min-height:4px;transition:height .5s" title="${d.count}题"></div><span style="font-size:10px;color:var(--text-muted)">${dayLabel}</span></div>`}).join('');
})()}
</div>
</div>
<div class="card" style="flex:1;min-width:200px">
<h3 style="margin-bottom:16px">${svgIcon('i-target','icon-sm')} 总体掌握率</h3>
<div style="display:flex;justify-content:center"><div class="ring-chart" style="background:conic-gradient(var(--accent-cyan) 0% ${totalPct}%, var(--bg-tertiary) ${totalPct}% 100%)"><div class="ring-center" style="width:120px;height:120px;border-radius:50%;background:var(--bg-secondary);display:flex;flex-direction:column;align-items:center;justify-content:center"><div class="ring-value">${totalPct}%</div><div class="ring-label">掌握率</div></div></div></div>
</div>
</div>

<div class="card"><h3 style="margin-bottom:16px">${svgIcon('i-calendar','icon-sm')} 打卡日历</h3><div style="display:grid;grid-template-columns:repeat(7,1fr);gap:4px;text-align:center;margin-bottom:8px">${['一','二','三','四','五','六','日'].map(d=>`<div style="font-size:11px;color:var(--text-muted);padding:4px 0">${d}</div>`).join('')}</div><div style="display:grid;grid-template-columns:repeat(7,1fr);gap:4px">${(()=>{const cells=[];const now=new Date();const today=now.getDate();const year=now.getFullYear();const month=now.getMonth();const firstDay=new Date(year,month,1).getDay();const daysInMonth=new Date(year,month+1,0).getDate();const offset=firstDay===0?6:firstDay-1;for(let i=0;i<offset;i++)cells.push('<div></div>');for(let d=1;d<=daysInMonth;d++){const date=new Date(year,month,d);const ds=date.toDateString();const isChecked=checkinsSet.has(ds);const isToday=d===today;const mHistory=Store.getMasteredHistory();const cnt=mHistory[ds]||0;cells.push(`<div style="padding:6px 2px;border-radius:6px;font-size:12px;${isChecked?'background:var(--accent-cyan);color:#000;font-weight:700':cnt>0?'background:rgba(0,229,255,.15);color:var(--accent-cyan)':'color:var(--text-muted)'};${isToday?'outline:2px solid var(--accent-gold);outline-offset:-1px':''};cursor:default" title="${month+1}月${d}日${isChecked?' ✓ 已打卡':cnt>0?` ${cnt}题`:''}">${d}</div>`)}return cells.join('')})()}</div><div style="display:flex;justify-content:space-between;align-items:center;margin-top:12px;font-size:12px;color:var(--text-muted)"><span>本月打卡 ${checkins.filter(c=>{const d=new Date(c);return d.getFullYear()===year&&d.getMonth()===month}).length} 天</span><button class="btn btn-outline btn-sm" style="font-size:11px;padding:2px 8px" onclick="doCheckin()">${svgIcon('i-check','icon-sm')} 今日打卡</button></div></div>

<div class="card"><h3 style="margin-bottom:16px">${svgIcon('i-calendar','icon-sm')} 学习热力图（最近16周）</h3><div style="display:flex;gap:2px;flex-wrap:wrap;margin-bottom:12px">${(()=>{const cells=[];const now=new Date();const mHistory=Store.getMasteredHistory();for(let i=111;i>=0;i--){const d=new Date(now);d.setDate(d.getDate()-i);const ds=d.toDateString();const cnt=mHistory[ds]||0;const isChecked=checkinsSet.has(ds);let level=0;if(cnt>=5)level=4;else if(cnt>=3)level=3;else if(cnt>=2)level=2;else if(cnt>=1||isChecked)level=1;const colors=['var(--bg-tertiary)','var(--difficulty-easy)','var(--accent-cyan)','var(--accent-gold)','var(--accent-orange)'];cells.push(`<div style="width:12px;height:12px;border-radius:2px;background:${colors[level]};${ds===now.toDateString()?'outline:2px solid var(--accent-cyan);outline-offset:1px':''}" title="${d.getMonth()+1}月${d.getDate()}日${cnt?` ${cnt}题`:isChecked?' 已打卡':''}"></div>`)}return cells.join('')})()}</div><div style="display:flex;align-items:center;gap:6px;font-size:11px;color:var(--text-muted)"><span>少</span><div style="width:12px;height:12px;border-radius:2px;background:var(--bg-tertiary)"></div><div style="width:12px;height:12px;border-radius:2px;background:var(--difficulty-easy)"></div><div style="width:12px;height:12px;border-radius:2px;background:var(--accent-cyan)"></div><div style="width:12px;height:12px;border-radius:2px;background:var(--accent-gold)"></div><div style="width:12px;height:12px;border-radius:2px;background:var(--accent-orange)"></div><span>多</span></div></div>

<div class="card"><h3 style="margin-bottom:16px">${svgIcon('i-award','icon-sm')} 成就徽章 <span style="color:var(--text-muted);font-size:13px;font-weight:400">（${achievements.length}/${ACHIEVEMENT_DEFS.length}）</span></h3><div class="achievement-grid">${ACHIEVEMENT_DEFS.map(def=>{const unlocked=achievements.find(a=>a.id===def.id);return`<div class="achievement-card ${unlocked?'unlocked':'locked'}"><span class="achievement-icon">${unlocked?svgIcon(def.icon,'icon-xl'):svgIcon('i-lock','icon-xl')}</span><div class="achievement-name">${def.name}</div><div class="achievement-desc">${def.desc}</div>${unlocked?`<div class="achievement-date">${new Date(unlocked.unlockedAt).toLocaleDateString()}</div>`:''}</div>`}).join('')}</div></div>

<div class="card"><h3 style="margin-bottom:16px">${svgIcon('i-download','icon-sm')} 数据管理</h3><div style="display:flex;gap:8px;flex-wrap:wrap"><button class="btn btn-outline" onclick="exportData()"><svg class="icon-sm"><use href="#i-download"/></svg> 导出数据</button><button class="btn btn-outline" onclick="document.getElementById('importFile').click()">导入数据</button><input type="file" id="importFile" accept=".json" onchange="importData(event)" style="display:none" aria-label="选择导入文件"><button class="btn btn-outline" style="color:var(--difficulty-hard)" onclick="if(confirm('确定清除所有数据？此操作不可恢复！'))clearAllData()">清除数据</button></div></div>
<div class="card"><h3 style="margin-bottom:16px">${svgIcon('i-settings','icon-sm')} 偏好设置</h3><div style="display:flex;flex-direction:column;gap:12px"><label style="display:flex;align-items:center;justify-content:space-between;cursor:pointer"><span style="font-size:14px">音效反馈</span><div style="position:relative;width:48px;height:26px"><input type="checkbox" ${Store.getSoundEnabled()!==false?'checked':''} onchange="Store.setSoundEnabled(this.checked);showToast(this.checked?'音效已开启':'音效已关闭','info')" style="position:absolute;opacity:0;width:100%;height:100%;cursor:pointer;z-index:1" aria-label="音效开关"><div style="position:absolute;top:0;left:0;right:0;bottom:0;background:${Store.getSoundEnabled()!==false?'var(--accent-cyan)':'var(--bg-tertiary)'};border-radius:13px;transition:var(--transition)"></div><div style="position:absolute;top:3px;left:${Store.getSoundEnabled()!==false?'25px':'3px'};width:20px;height:20px;background:#fff;border-radius:50%;transition:var(--transition)"></div></div></label><p style="font-size:12px;color:var(--text-muted);margin:0">开启后，答题正确/错误时会有音效和震动反馈</p></div></div>
<div class="card" style="text-align:center;color:var(--text-muted);font-size:12px;padding:16px">
<div style="margin-bottom:4px">面试通 v2.0.0</div>
<div>多学科面试刷题平台 · 2000+ 精选题目 · 22 大专业分类</div>
</div>`;
}catch(e){console.error('统计页渲染错误:',e);return'<div style="padding:40px;text-align:center"><h3 style="color:var(--accent-red)">统计页面加载出错</h3><p style="color:var(--text-muted);margin:12px 0">'+e.message+'</p><button class="btn btn-primary" onclick="navigate(\'dashboard\')">返回首页</button></div>'}
}

function renderPractice(){
const mode=currentParams.mode||'daily';
const allQ=getActiveQuestions(),mastered=Store.getMastered(),masteredSet=new Set(mastered);
let questions=[];
if(mode==='daily'){
const today=new Date().toDateString(),seed=today.split('').reduce((a,c)=>a+c.charCodeAt(0),0);
questions=[allQ[seed%allQ.length]];
}else if(mode==='category'){
const cat=currentParams.category||'algorithm';
questions=allQ.filter(q=>q.category===cat&&!masteredSet.has(q.id));
if(!questions.length)questions=allQ.filter(q=>q.category===cat);
}else if(mode==='random'){
const unmastered=allQ.filter(q=>!masteredSet.has(q.id));
if(unmastered.length){const shuffled=[...unmastered].sort(()=>Math.random()-.5);questions=shuffled.slice(0,10)}
else{questions=[...allQ].sort(()=>Math.random()-.5).slice(0,10)}
}else if(mode==='challenge'){
const shuffled=[...allQ].sort(()=>Math.random()-.5);
questions=shuffled.slice(0,5);
window._challengeStart=Date.now();
window._challengeTimer=null;
}else if(mode==='wrongbook'){
const ids=(currentParams.ids||'').split(',').filter(Boolean);
questions=allQ.filter(q=>ids.includes(q.id));
if(!questions.length){const wrongBook=Store.getWrongBook();const wrongIds=wrongBook.map(w=>w.qid);questions=allQ.filter(q=>wrongIds.includes(q.id))}
}else if(mode==='review'){
const dueIds=Store.getDueReviews();
questions=allQ.filter(q=>dueIds.includes(q.id));
if(!questions.length){const wrongBook=Store.getWrongBook();const wrongIds=wrongBook.map(w=>w.qid);questions=allQ.filter(q=>wrongIds.includes(q.id)).slice(0,10)}
}
const modeLabels={daily:'每日一题',category:'专项练习',random:'随机刷题',challenge:'限时挑战',wrongbook:'错题复习',review:'间隔复习'};
const practicePage=currentParams.ppage||1;
const practicePageSize=mode==='challenge'?5:mode==='daily'?1:10;
const totalPages=Math.ceil(questions.length/practicePageSize)||1;
const paged=questions.slice((practicePage-1)*practicePageSize,practicePage*practicePageSize);
const startIdx=(practicePage-1)*practicePageSize;
return`${mode==='challenge'?`<div id="challengeTimer" style="position:fixed;top:56px;left:0;right:0;z-index:99;background:linear-gradient(90deg,var(--accent-orange),var(--accent-gold));color:#000;padding:8px 20px;display:flex;justify-content:space-between;align-items:center;font-weight:700;font-size:14px"><span>${svgIcon('i-zap','icon-sm')} 限时挑战</span><span id="challengeCountdown" style="font-size:20px;font-variant-numeric:tabular-nums">05:00</span><span>答对越多越好！</span></div><div style="margin-top:48px"></div>`:''}<nav class="breadcrumb" aria-label="面包屑导航" style="display:flex;align-items:center;gap:6px;flex-wrap:wrap;margin-bottom:16px;padding:10px 14px;background:var(--bg-secondary);border:1px solid var(--border-color);border-radius:var(--radius);font-size:13px"><a href="javascript:void(0)" onclick="navigate('dashboard')" style="color:var(--accent-cyan);text-decoration:none;display:inline-flex;align-items:center;gap:4px">${svgIcon('i-home','icon-sm')} 首页</a><span style="color:var(--text-muted)">/</span><span style="color:var(--text-secondary)">${modeLabels[mode]||'刷题'}</span>${mode==='category'?`<span style="color:var(--text-muted)">/</span><span style="color:var(--accent-cyan)">${CATEGORY_MAP[currentParams.category]||currentParams.category||''}</span>`:''}</nav><div style="display:flex;align-items:center;gap:12px;margin-bottom:20px"><h2>${modeLabels[mode]||'刷题'}</h2>${mode==='category'?`<select class="search-input" style="min-width:140px" onchange="currentParams.category=this.value;currentParams.ppage=1;renderPage()">${CATEGORIES.map(c=>`<option value="${c.id}" ${currentParams.category===c.id?'selected':''}>${c.name}</option>`).join('')}</select>`:''}</div>${questions.length===0?'<div class="empty-state"><div class="empty-icon">'+svgIcon('i-trophy','icon-2xl')+'</div><div class="empty-title">恭喜！该分类已全部掌握</div><div class="empty-desc">试试切换其他分类或专业模式继续学习</div><button class="btn btn-primary" style="margin-top:12px" onclick="navigate(\'questions\')">浏览更多题目</button></div>':paged.map((q,i)=>{const im=masteredSet.has(q.id);const qType=q.type||'short';const typeTag=`<span style="display:inline-block;padding:1px 6px;border-radius:6px;font-size:10px;font-weight:600;background:rgba(179,136,255,.15);color:var(--accent-purple)">${Q_TYPE_MAP[qType]||'简答题'}</span>`;let practiceOptions='';if(qType==='single'&&q.options){practiceOptions=`<div style="display:flex;flex-direction:column;gap:8px;margin-top:12px">${q.options.map((opt,j)=>`<label class="option-label" style="display:flex;align-items:flex-start;gap:10px;padding:12px 16px;background:var(--bg-primary);border:1px solid var(--border-color);border-radius:var(--radius);cursor:pointer;transition:all .2s ease"><input type="radio" name="popt-${q.id}" value="${String.fromCharCode(65+j)}" style="margin-top:2px;accent-color:var(--accent-cyan)" onchange="checkSingleAnswer('${q.id}',this.value,'${q.correctAnswer||''}')"><span style="flex:1;line-height:1.6"><strong style="color:var(--accent-cyan)">${String.fromCharCode(65+j)}.</strong> ${opt}</span></label>`).join('')}</div>`}else if(qType==='multi'&&q.options){practiceOptions=`<div style="display:flex;flex-direction:column;gap:8px;margin-top:12px">${q.options.map((opt,j)=>`<label class="option-label" style="display:flex;align-items:flex-start;gap:10px;padding:12px 16px;background:var(--bg-primary);border:1px solid var(--border-color);border-radius:var(--radius);cursor:pointer;transition:all .2s ease"><input type="checkbox" name="poptm-${q.id}" value="${String.fromCharCode(65+j)}" style="margin-top:2px;accent-color:var(--accent-cyan)"><span style="flex:1;line-height:1.6"><strong style="color:var(--accent-cyan)">${String.fromCharCode(65+j)}.</strong> ${opt}</span></label>`).join('')}</div><button class="btn btn-primary btn-sm" style="margin-top:12px" onclick="checkMultiAnswer('${q.id}','${q.correctAnswer||''}')">提交答案</button>`}else if(qType==='judgment'){practiceOptions=`<div style="display:flex;gap:12px;margin-top:12px"><button class="btn btn-outline" style="flex:1;font-size:16px;padding:16px" onclick="checkSingleAnswer('${q.id}','对','${q.correctAnswer||'对'}')">✓ 正确</button><button class="btn btn-outline" style="flex:1;font-size:16px;padding:16px" onclick="checkSingleAnswer('${q.id}','错','${q.correctAnswer||'错'}')">✗ 错误</button></div>`}else if(qType==='short'){practiceOptions=`<textarea id="pshort-${q.id}" style="width:100%;min-height:100px;padding:12px;background:var(--bg-primary);color:var(--text-primary);border:1px solid var(--border-color);border-radius:var(--radius);font-size:14px;line-height:1.6;resize:vertical;outline:none;font-family:inherit;margin-top:12px" placeholder="在此输入你的答案..."></textarea><div style="display:flex;gap:8px;margin-top:12px"><button class="btn btn-primary btn-sm" onclick="answerQuestion('${q.id}',true)">${svgIcon('i-check','icon-sm')} 完成作答</button><button class="btn btn-outline btn-sm" onclick="answerQuestion('${q.id}',false)">${svgIcon('i-x','icon-sm')} 需要复习</button></div>`}else if(qType==='case_analysis'){practiceOptions=`<textarea id="pcase-${q.id}" style="width:100%;min-height:140px;padding:12px;background:var(--bg-primary);color:var(--text-primary);border:1px solid var(--border-color);border-radius:var(--radius);font-size:14px;line-height:1.6;resize:vertical;outline:none;font-family:inherit;margin-top:12px" placeholder="请从多角度分析此案例..."></textarea><div style="display:flex;gap:8px;margin-top:12px"><button class="btn btn-primary btn-sm" onclick="answerQuestion('${q.id}',true)">${svgIcon('i-check','icon-sm')} 完成作答</button><button class="btn btn-outline btn-sm" onclick="answerQuestion('${q.id}',false)">${svgIcon('i-x','icon-sm')} 需要复习</button></div>`}return`<div class="card" id="practice-card-${q.id}"><div style="display:flex;align-items:center;gap:12px;margin-bottom:12px"><span style="font-size:18px;font-weight:700;color:var(--text-muted)">#${startIdx+i+1}</span><span class="difficulty-tag difficulty-${q.difficulty}">${DIFF_LABELS[q.difficulty]}</span><span class="category-tag">${CATEGORY_MAP[q.category]||q.category}</span>${typeTag}${im?`<span style="font-size:11px;color:var(--difficulty-easy);font-weight:600">${svgIcon('i-check','icon-sm')} 已掌握</span>`:''}</div><h3 style="margin-bottom:8px;cursor:pointer" onclick="navigate('detail',{id:'${q.id}'})">${q.title}</h3>${q.content?`<div class="detail-content" style="margin-bottom:4px;overflow:hidden">${q.content.length>500?`<div id="pcontent-${q.id}" style="max-height:120px;overflow:hidden;position:relative"><div style="mask-image:linear-gradient(to bottom,black 70%,transparent 100%);-webkit-mask-image:linear-gradient(to bottom,black 70%,transparent 100%)">${q.content}</div></div><button class="btn btn-outline btn-sm" style="margin:8px 0;font-size:12px;padding:2px 10px" onclick="const c=document.getElementById('pcontent-${q.id}');c.style.maxHeight='none';c.style.maskImage='none';c.style.webkitMaskImage='none';this.style.display='none'">展开全文 ↓</button>`:q.content}</div>`:''}${practiceOptions}<div style="display:flex;gap:8px;margin-top:12px;flex-wrap:wrap"><button class="btn btn-outline btn-sm" onclick="togglePracticeAnswer('${q.id}',this)">${svgIcon('i-eye','icon-sm')} 查看提示</button><button class="btn btn-outline btn-sm" id="pfullbtn-${q.id}" style="display:none" onclick="showPracticeFullAnswer('${q.id}',this)">${svgIcon('i-lightbulb','icon-sm')} 查看完整解析</button><button class="btn btn-outline btn-sm" onclick="navigate('detail',{id:'${q.id}'})">${svgIcon('i-external-link','icon-sm')} 详情页</button></div><div id="panswer-${q.id}" class="answer-section" style="margin-top:8px"><div class="answer-hint" style="padding:12px;background:var(--bg-secondary);border-radius:var(--radius-sm);border-left:3px solid var(--accent-gold);font-size:13px;line-height:1.7;color:var(--text-secondary);white-space:pre-line">${generateHint(q.answer,q.category)}</div><div class="answer-full" style="display:none;margin-top:12px;padding:16px;background:var(--bg-secondary);border-radius:var(--radius);border-left:3px solid var(--accent-cyan)"><h4 style="margin:0 0 8px;color:var(--accent-cyan);font-size:14px">${svgIcon('i-lightbulb','icon-sm')} 完整解析</h4>${q.answer?renderMd(q.answer):'<p style="color:var(--text-muted)">暂无解析</p>'}</div></div></div>`}).join('')}${totalPages>1?`<div class="pagination"><button ${practicePage<=1?'disabled':''} onclick="currentParams.ppage=${practicePage-1};renderPage()">← 上一页</button><span class="page-info">${practicePage} / ${totalPages} (共${questions.length}题)</span><button ${practicePage>=totalPages?'disabled':''} onclick="currentParams.ppage=${practicePage+1};renderPage()">下一页 →</button></div>`:''}`;
}

function startChallengeTimer(){
if(window._challengeTimer){clearInterval(window._challengeTimer);window._challengeTimer=null}
if(!window._challengeStart)return;
const el=document.getElementById('challengeCountdown');
if(!el)return;
const totalMs=5*60*1000;
window._challengeTimer=setInterval(()=>{
const elapsed=Date.now()-window._challengeStart;
const remain=Math.max(0,totalMs-elapsed);
const m=Math.floor(remain/60000);
const s=Math.floor((remain%60000)/1000);
el.textContent=`${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
if(remain<=0){clearInterval(window._challengeTimer);window._challengeTimer=null;toast(svgIcon('i-zap','icon-sm')+' 时间到！挑战结束','warning');window._challengeStart=null}
},1000);
}
function emptyState(icon,title,desc,actionLabel,actionClick){
return`<div class="empty-state"><div class="empty-icon">${icon}</div><div class="empty-title">${title}</div><div class="empty-desc">${desc}</div>${actionLabel?`<button class="btn btn-primary" onclick="${actionClick}">${actionLabel}</button>`:''}</div>`;
}
function doCheckin(){
const wasChecked=Store.getCheckins().includes(new Date().toDateString());
Store.checkin();
if(!wasChecked){
for(let i=0;i<8;i++){
const el=document.createElement('div');el.className='confetti';el.style.left=Math.random()*80+10+'vw';el.style.top=Math.random()*40+30+'vh';el.style.width='8px';el.style.height='8px';el.style.borderRadius='50%';el.style.background=['var(--accent-cyan)','var(--accent-gold)','var(--accent-orange)','var(--difficulty-easy)'][i%4];
document.body.appendChild(el);setTimeout(()=>el.remove(),1200);
}
toast(svgIcon('i-check','icon-sm')+' 打卡成功！继续保持！','success');
}else{toast('今日已打卡','info')}
renderPage();
}
function toast(msg,type='info'){
const c=document.getElementById('toastContainer');
const t=document.createElement('div');t.className='toast toast-'+type;t.textContent=msg;
c.appendChild(t);setTimeout(()=>t.remove(),4000);
}
function showToast(msg,type='info'){toast(msg,type)}

function toggleTheme(){
const current=Store.getTheme();
const next=current==='dark'?'light':'dark';
Store.setTheme(next);
document.documentElement.setAttribute('data-theme',next);
const icon=document.getElementById('themeIcon');
if(icon)icon.innerHTML=next==='dark'?'<use href="#i-moon"/>':'<use href="#i-sun"/>';
}

function toggleSidebar(){
const s=document.getElementById('sidebar');
const o=document.getElementById('sidebarOverlay');
s.classList.toggle('open-mobile');
o.classList.toggle('show');
}
function closeSidebar(){
document.getElementById('sidebar').classList.remove('open-mobile');
document.getElementById('sidebarOverlay').classList.remove('show');
}
function toggleNavDropdown(id,forceState){
var d=document.getElementById(id);
if(!d)return;
var show=forceState!==undefined?forceState:!d.classList.contains('show');
var allDropdowns=document.querySelectorAll('.nav-dropdown.show');
for(var i=0;i<allDropdowns.length;i++){if(allDropdowns[i].id!==id)allDropdowns[i].classList.remove('show')}
var arrowId=id==='modeDropdown'?'modeArrow':'moreArrow';
var a=document.getElementById(arrowId);
if(show){d.classList.add('show');if(a)a.style.transform='rotate(180deg)'}
else{d.classList.remove('show');if(a)a.style.transform='rotate(0deg)'}
}
document.addEventListener('click',function(e){
if(!e.target.closest('.nav-mode-wrap')&&!e.target.closest('.nav-more-wrap')){
var allDropdowns=document.querySelectorAll('.nav-dropdown.show');
for(var i=0;i<allDropdowns.length;i++){allDropdowns[i].classList.remove('show')}
var ma=document.getElementById('modeArrow');if(ma)ma.style.transform='rotate(0deg)';
var mo=document.getElementById('moreArrow');if(mo)mo.style.transform='rotate(0deg)';
}
});
let _touchStartX=0,_touchStartY=0,_touchStartTime=0;
let _swipeIndicator=null;
document.addEventListener('touchstart',function(e){_touchStartX=e.touches[0].clientX;_touchStartY=e.touches[0].clientY;_touchStartTime=Date.now()},{passive:true});
document.addEventListener('touchend',function(e){
const dx=e.changedTouches[0].clientX-_touchStartX;
const dy=e.changedTouches[0].clientY-_touchStartY;
const dt=Date.now()-_touchStartTime;
if(dt>300||Math.abs(dy)>Math.abs(dx)*0.7||Math.abs(dx)<50)return;
if(currentPage==='detail'){
if(dx<0){playSound('click');vibrate(20);const allQ=getActiveQuestions(),idx=allQ.findIndex(q=>q.id===currentParams.id);if(idx<allQ.length-1)navigate('detail',{id:allQ[idx+1].id})}
else{playSound('click');vibrate(20);const allQ=getActiveQuestions(),idx=allQ.findIndex(q=>q.id===currentParams.id);if(idx>0)navigate('detail',{id:allQ[idx-1].id})}
}
},{passive:true});

function setupKeyboardHints(){
const hint=document.getElementById('keyboardHint');
const fab=document.getElementById('helpFab');
hint.classList.toggle('show',currentPage==='detail');
fab.classList.toggle('show',currentPage==='detail');
setupMobileBar();
}

function setupMobileBar(){
if(window.innerWidth>768)return;
const bar=document.getElementById('mobileBar');
if(!bar)return;
if(currentPage==='detail'){
const allQ=getActiveQuestions();
const q=allQ.find(q=>q.id===currentParams.id);
if(!q){bar.innerHTML='';return}
const mastered=Store.getMastered(),masteredSet=new Set(mastered),favorites=Store.getFavorites();
const im=masteredSet.has(q.id),if2=favorites.includes(q.id);
const idx=allQ.findIndex(item=>item.id===q.id);
bar.innerHTML=`<button onclick="if(${idx}>0)navigate('detail',{id:'${allQ[idx-1]?.id}'})"><span class="bar-icon">${svgIcon('i-arrow-left','icon-sm')}</span><span class="bar-label">上一题</span></button><button onclick="Store.toggleMastered('${q.id}');renderPage()"><span class="bar-icon" style="color:${im?'var(--difficulty-easy)':'var(--text-muted)'}">${svgIcon('i-check','icon-sm')}</span><span class="bar-label">${im?'已掌握':'掌握'}</span></button><button onclick="toggleAnswer()"><span class="bar-icon">${svgIcon('i-eye','icon-sm')}</span><span class="bar-label">答案</span></button><button onclick="Store.toggleFavorite('${q.id}');renderPage()"><span class="bar-icon" style="color:${if2?'var(--accent-gold)':'var(--text-muted)'}">${svgIcon('i-star','icon-sm')}</span><span class="bar-label">${if2?'已收藏':'收藏'}</span></button><button onclick="if(${idx}<allQ.length-1)navigate('detail',{id:'${allQ[idx+1]?.id}'})"><span class="bar-icon">${svgIcon('i-arrow-right','icon-sm')}</span><span class="bar-label">下一题</span></button>`;
}else if(currentPage==='questions'){
bar.innerHTML=`<button onclick="navigate('dashboard')"><span class="bar-icon">${svgIcon('i-home','icon-sm')}</span><span class="bar-label">首页</span></button><button onclick="navigate('questions')"><span class="bar-icon">${svgIcon('i-book','icon-sm')}</span><span class="bar-label">题库</span></button><button onclick="navigate('practice',{mode:'random'})"><span class="bar-icon">${svgIcon('i-shuffle','icon-sm')}</span><span class="bar-label">随机</span></button><button onclick="navigate('collect')"><span class="bar-icon">${svgIcon('i-download','icon-sm')}</span><span class="bar-label">收录</span></button><button onclick="navigate('stats')"><span class="bar-icon">${svgIcon('i-chart','icon-sm')}</span><span class="bar-label">统计</span></button>`;
}else if(currentPage==='favorites'){
bar.innerHTML=`<button onclick="navigate('dashboard')"><span class="bar-icon">${svgIcon('i-home','icon-sm')}</span><span class="bar-label">首页</span></button><button onclick="navigate('questions')"><span class="bar-icon">${svgIcon('i-book','icon-sm')}</span><span class="bar-label">题库</span></button><button onclick="navigate('favorites')"><span class="bar-icon" style="color:var(--accent-gold)">${svgIcon('i-star','icon-sm')}</span><span class="bar-label" style="color:var(--accent-gold)">收藏</span></button><button onclick="navigate('practice',{mode:'random'})"><span class="bar-icon">${svgIcon('i-shuffle','icon-sm')}</span><span class="bar-label">刷题</span></button><button onclick="navigate('stats')"><span class="bar-icon">${svgIcon('i-chart','icon-sm')}</span><span class="bar-label">统计</span></button>`;
}else if(currentPage==='stats'){
bar.innerHTML=`<button onclick="navigate('dashboard')"><span class="bar-icon">${svgIcon('i-home','icon-sm')}</span><span class="bar-label">首页</span></button><button onclick="navigate('questions')"><span class="bar-icon">${svgIcon('i-book','icon-sm')}</span><span class="bar-label">题库</span></button><button onclick="navigate('practice',{mode:'daily'})"><span class="bar-icon">${svgIcon('i-calendar','icon-sm')}</span><span class="bar-label">每日</span></button><button onclick="navigate('learnpath')"><span class="bar-icon">${svgIcon('i-map','icon-sm')}</span><span class="bar-label">路径</span></button><button onclick="navigate('stats')"><span class="bar-icon" style="color:var(--accent-cyan)">${svgIcon('i-chart','icon-sm')}</span><span class="bar-label" style="color:var(--accent-cyan)">统计</span></button>`;
}else if(currentPage==='collect'){
bar.innerHTML=`<button onclick="navigate('dashboard')"><span class="bar-icon">${svgIcon('i-home','icon-sm')}</span><span class="bar-label">首页</span></button><button onclick="navigate('questions')"><span class="bar-icon">${svgIcon('i-book','icon-sm')}</span><span class="bar-label">题库</span></button><button onclick="navigate('collect')"><span class="bar-icon" style="color:var(--accent-orange)">${svgIcon('i-download','icon-sm')}</span><span class="bar-label" style="color:var(--accent-orange)">收录</span></button><button onclick="navigate('favorites')"><span class="bar-icon">${svgIcon('i-star','icon-sm')}</span><span class="bar-label">收藏</span></button><button onclick="navigate('stats')"><span class="bar-icon">${svgIcon('i-chart','icon-sm')}</span><span class="bar-label">统计</span></button>`;
}else if(currentPage==='practice'){
bar.innerHTML=`<button onclick="navigate('dashboard')"><span class="bar-icon">${svgIcon('i-home','icon-sm')}</span><span class="bar-label">首页</span></button><button onclick="navigate('questions')"><span class="bar-icon">${svgIcon('i-book','icon-sm')}</span><span class="bar-label">题库</span></button><button onclick="navigate('practice',{mode:'daily'})"><span class="bar-icon">${svgIcon('i-calendar','icon-sm')}</span><span class="bar-label">每日</span></button><button onclick="navigate('practice',{mode:'challenge'})"><span class="bar-icon">${svgIcon('i-zap','icon-sm')}</span><span class="bar-label">挑战</span></button><button onclick="navigate('stats')"><span class="bar-icon">${svgIcon('i-chart','icon-sm')}</span><span class="bar-label">统计</span></button>`;
}else if(currentPage==='learnpath'){
bar.innerHTML=`<button onclick="navigate('dashboard')"><span class="bar-icon">${svgIcon('i-home','icon-sm')}</span><span class="bar-label">首页</span></button><button onclick="navigate('questions')"><span class="bar-icon">${svgIcon('i-book','icon-sm')}</span><span class="bar-label">题库</span></button><button onclick="navigate('learnpath')"><span class="bar-icon" style="color:var(--accent-purple)">${svgIcon('i-map','icon-sm')}</span><span class="bar-label" style="color:var(--accent-purple)">路径</span></button><button onclick="navigate('practice',{mode:'category',category:'algorithm'})"><span class="bar-icon">${svgIcon('i-target','icon-sm')}</span><span class="bar-label">练习</span></button><button onclick="navigate('stats')"><span class="bar-icon">${svgIcon('i-chart','icon-sm')}</span><span class="bar-label">统计</span></button>`;
}else if(currentPage==='wrongbook'){
bar.innerHTML=`<button onclick="navigate('dashboard')"><span class="bar-icon">${svgIcon('i-home','icon-sm')}</span><span class="bar-label">首页</span></button><button onclick="navigate('questions')"><span class="bar-icon">${svgIcon('i-book','icon-sm')}</span><span class="bar-label">题库</span></button><button onclick="navigate('wrongbook')"><span class="bar-icon" style="color:var(--accent-red)">${svgIcon('i-refresh','icon-sm')}</span><span class="bar-label" style="color:var(--accent-red)">错题</span></button><button onclick="navigate('practice',{mode:'random'})"><span class="bar-icon">${svgIcon('i-shuffle','icon-sm')}</span><span class="bar-label">刷题</span></button><button onclick="navigate('stats')"><span class="bar-icon">${svgIcon('i-chart','icon-sm')}</span><span class="bar-label">统计</span></button>`;
}else if(currentPage==='videos'){
bar.innerHTML=`<button onclick="navigate('dashboard')"><span class="bar-icon">${svgIcon('i-home','icon-sm')}</span><span class="bar-label">首页</span></button><button onclick="navigate('questions')"><span class="bar-icon">${svgIcon('i-book','icon-sm')}</span><span class="bar-label">题库</span></button><button onclick="navigate('videos')"><span class="bar-icon" style="color:var(--accent-cyan)">${svgIcon('i-play-circle','icon-sm')}</span><span class="bar-label" style="color:var(--accent-cyan)">视频</span></button><button onclick="navigate('ai-assistant')"><span class="bar-icon">${svgIcon('i-zap','icon-sm')}</span><span class="bar-label">AI助手</span></button><button onclick="navigate('learnpath')"><span class="bar-icon">${svgIcon('i-map','icon-sm')}</span><span class="bar-label">学习</span></button>`;
}else if(currentPage==='ai-assistant'){
bar.innerHTML=`<button onclick="navigate('dashboard')"><span class="bar-icon">${svgIcon('i-home','icon-sm')}</span><span class="bar-label">首页</span></button><button onclick="navigate('questions')"><span class="bar-icon">${svgIcon('i-book','icon-sm')}</span><span class="bar-label">题库</span></button><button onclick="navigate('videos')"><span class="bar-icon">${svgIcon('i-play-circle','icon-sm')}</span><span class="bar-label">视频</span></button><button onclick="navigate('ai-assistant')"><span class="bar-icon" style="color:var(--accent-purple)">${svgIcon('i-zap','icon-sm')}</span><span class="bar-label" style="color:var(--accent-purple)">AI助手</span></button><button onclick="navigate('stats')"><span class="bar-icon">${svgIcon('i-chart','icon-sm')}</span><span class="bar-label">统计</span></button>`;
}else if(currentPage==='resume'){
bar.innerHTML=`<button onclick="navigate('dashboard')"><span class="bar-icon">${svgIcon('i-home','icon-sm')}</span><span class="bar-label">首页</span></button><button onclick="navigate('questions')"><span class="bar-icon">${svgIcon('i-book','icon-sm')}</span><span class="bar-label">题库</span></button><button onclick="navigate('resume')"><span class="bar-icon" style="color:var(--accent-cyan)">${svgIcon('i-user','icon-sm')}</span><span class="bar-label" style="color:var(--accent-cyan)">简历</span></button><button onclick="navigate('practice',{mode:'random'})"><span class="bar-icon">${svgIcon('i-shuffle','icon-sm')}</span><span class="bar-label">刷题</span></button><button onclick="navigate('stats')"><span class="bar-icon">${svgIcon('i-chart','icon-sm')}</span><span class="bar-label">统计</span></button>`;
}else{
bar.innerHTML=`<button onclick="navigate('dashboard')"><span class="bar-icon" style="color:var(--accent-cyan)">${svgIcon('i-home','icon-sm')}</span><span class="bar-label" style="color:var(--accent-cyan)">首页</span></button><button onclick="navigate('questions')"><span class="bar-icon">${svgIcon('i-book','icon-sm')}</span><span class="bar-label">题库</span></button><button onclick="navigate('practice',{mode:'daily'})"><span class="bar-icon">${svgIcon('i-calendar','icon-sm')}</span><span class="bar-label">每日</span></button><button onclick="navigate('ai-assistant')"><span class="bar-icon">${svgIcon('i-zap','icon-sm')}</span><span class="bar-label">AI</span></button><button onclick="navigate('stats')"><span class="bar-icon">${svgIcon('i-chart','icon-sm')}</span><span class="bar-label">统计</span></button>`;
}
}

function showKeyboardHelp(){
const overlay=document.createElement('div');
overlay.className='guide-overlay';
overlay.id='kbHelpOverlay';
overlay.onclick=function(e){if(e.target===overlay)overlay.remove()};
const kbStyle='background:var(--bg-tertiary);padding:4px 10px;border-radius:4px;border:1px solid var(--border-color);font-family:monospace';
const row=(label,key)=>`<div style="display:flex;justify-content:space-between;padding:10px 0;border-bottom:1px solid var(--border-color)"><span style="color:var(--text-secondary)">${label}</span><kbd style="${kbStyle}">${key}</kbd></div>`;
overlay.innerHTML=`<div class="guide-content" onclick="event.stopPropagation()" style="max-width:440px"><h2>${svgIcon('i-edit','icon-lg')} 快捷键指南</h2><div style="text-align:left;margin-top:20px"><div style="font-size:12px;color:var(--accent-cyan);font-weight:600;margin-bottom:8px;letter-spacing:1px">全局导航</div>${row('首页','1')}${row('题库','2')}${row('每日一题','3')}${row('统计','4')}${row('收藏夹','5')}${row('搜索题目','/')}<div style="font-size:12px;color:var(--accent-cyan);font-weight:600;margin:16px 0 8px;letter-spacing:1px">题目详情页</div>${row('下一题','J / ↓')}${row('上一题','K / ↑')}${row('展开/收起答案','Enter')}${row('收藏','F')}${row('标记掌握','M')}${row('返回','Esc')}${row('快捷键帮助','?')}</div></div>`;
document.body.appendChild(overlay);
}

document.addEventListener('keydown',function(e){
if(e.target.tagName==='INPUT'||e.target.tagName==='TEXTAREA'||e.target.tagName==='SELECT')return;
if(e.ctrlKey||e.metaKey||e.altKey)return;
if(e.key==='?'){
e.preventDefault();showKeyboardHelp();return;
}
if(e.key==='Escape'){
const overlay=document.getElementById('kbHelpOverlay')||document.getElementById('guideOverlay')||document.getElementById('shareModal');
if(overlay){overlay.remove();return}
if(currentPage==='detail'){navigate('questions');return}
}
if(e.key==='1'){e.preventDefault();navigate('dashboard');return}
if(e.key==='2'){e.preventDefault();navigate('questions');return}
if(e.key==='3'){e.preventDefault();navigate('practice',{mode:'daily'});return}
if(e.key==='4'){e.preventDefault();navigate('stats');return}
if(e.key==='5'){e.preventDefault();navigate('favorites');return}
if(e.key==='/'){e.preventDefault();navigate('questions');setTimeout(()=>{const si=document.querySelector('.search-input');if(si)si.focus()},100);return}
if(currentPage!=='detail')return;
const allQ=getActiveQuestions();
const q=allQ.find(q=>q.id===currentParams.id);
if(!q)return;
const idx=allQ.findIndex(item=>item.id===q.id);
if(e.key==='j'||e.key==='ArrowDown'){
e.preventDefault();const nextQ=idx<allQ.length-1?allQ[idx+1]:null;
if(nextQ)navigate('detail',{id:nextQ.id});
}else if(e.key==='k'||e.key==='ArrowUp'){
e.preventDefault();const prevQ=idx>0?allQ[idx-1]:null;
if(prevQ)navigate('detail',{id:prevQ.id});
}else if(e.key==='Enter'){
e.preventDefault();toggleAnswer();
}else if(e.key==='f'){
Store.toggleFavorite(q.id);renderPage();
}else if(e.key==='m'){
Store.toggleMastered(q.id);renderPage();
}
});

function exportData(){
const data={
mastered:Store.getMastered(),
favorites:Store.getFavorites(),
collected:Store.getCollected(),
checkins:Store.getCheckins(),
sources:Store.getSources(),
exportDate:new Date().toISOString()
};
const blob=new Blob([JSON.stringify(data,null,2)],{type:'application/json'});
const url=URL.createObjectURL(blob);
const a=document.createElement('a');a.href=url;a.download='codeinterview-backup-'+new Date().toISOString().slice(0,10)+'.json';a.click();
URL.revokeObjectURL(url);toast('数据已导出','success');
}

function importData(event){
const file=event.target.files[0];
if(!file)return;
const reader=new FileReader();
reader.onload=function(e){
try{
const data=JSON.parse(e.target.result);
if(data.mastered)Store.setMastered(data.mastered);
if(data.favorites)Store.setFavorites(data.favorites);
if(data.collected)Store.setCollected(data.collected);
if(data.checkins)Store.setCheckins(data.checkins);
if(data.sources)Store.setSources(data.sources);
toast('数据导入成功！','success');renderPage();
}catch(err){toast('导入失败：'+err.message,'error')}
};
reader.readAsText(file);
event.target.value='';
}

function clearAllData(){
if(!confirm('确定要清除所有数据吗？此操作不可恢复！'))return;
const keys=Object.keys(localStorage).filter(k=>k.startsWith('ci_'));
keys.forEach(k=>localStorage.removeItem(k));
Store._cache={};
toast('数据已清除','success');renderPage();
}

function init(){
document.addEventListener('click',function(e){
const btn=e.target.closest('.btn');
if(!btn||btn.disabled)return;
const ripple=document.createElement('span');
ripple.className='ripple';
const rect=btn.getBoundingClientRect();
const size=Math.max(rect.width,rect.height);
ripple.style.width=ripple.style.height=size+'px';
ripple.style.left=(e.clientX-rect.left-size/2)+'px';
ripple.style.top=(e.clientY-rect.top-size/2)+'px';
btn.appendChild(ripple);setTimeout(()=>ripple.remove(),600);
});
const theme=Store.getTheme();
document.documentElement.setAttribute('data-theme',theme);
const themeIcon=document.getElementById('themeIcon');if(themeIcon)themeIcon.innerHTML=theme==='dark'?'<use href="#i-moon"/>':'<use href="#i-sun"/>';
parseHash();
const content=document.getElementById('content');
if(content)content.innerHTML=`<div style="display:flex;align-items:center;justify-content:center;min-height:60vh;flex-direction:column;gap:16px"><div class="loading-spinner" style="width:40px;height:40px;border:3px solid var(--border-color);border-top-color:var(--accent-cyan);border-radius:50%;animation:spin .8s linear infinite"></div><p style="color:var(--text-secondary);font-size:14px">正在加载题库数据...</p></div>`;
loadQuestionData().then(()=>{
  renderPage();
  setupMobileBar();
  if(window.innerWidth<=768&&_dataLoaded){
    setTimeout(function(){
      var extraSources=['data/builtin.json','data/multi_discipline.json'];
      var extraData=[];
      var loaded=0;
      extraSources.forEach(function(src){
        fetch(src).then(function(r){return r.json()}).then(function(d){
          if(Array.isArray(d))extraData=extraData.concat(d);
          loaded++;
          if(loaded===extraSources.length&&extraData.length>0){
            var computerCats=new Set(['algorithm','os','network','database','system-design','frontend','language','scenario']);
            extraData.forEach(function(q){
              if(computerCats.has(q.category)&&!BUILTIN_QUESTIONS.find(function(b){return b.title===q.title})){
                BUILTIN_QUESTIONS.push(Object.assign({},q,{sourceType:'builtin',type:q.type||'code'}));
              }else if(!computerCats.has(q.category)&&!MULTI_DISCIPLINE_QUESTIONS.find(function(m){return m.title===q.title})){
                MULTI_DISCIPLINE_QUESTIONS.push(Object.assign({},q,{sourceType:'builtin',type:q.type||'short'}));
              }
            });
            _allQCache=null;
            try{saveQuestionsToDB(BUILTIN_QUESTIONS.concat(MULTI_DISCIPLINE_QUESTIONS))}catch(e){}
          }
        }).catch(function(){loaded++});
      });
    },2000);
  }
}).catch((e)=>{
  console.error('数据加载失败:',e);
  renderPage();
});
const contentEl=document.getElementById('content');
function updateBackToTop(){
const btt=document.getElementById('backToTop');
if(!btt)return;
const st=contentEl?contentEl.scrollTop:0;
btt.classList.toggle('show',st>400);
}
if(contentEl){
contentEl.addEventListener('scroll',updateBackToTop);
}
window.addEventListener('scroll',updateBackToTop);
setInterval(updateBackToTop,1000);
const mastered=Store.getMastered();
if(mastered.length>0&&!Store.get('lastBackupReminder',null)){
const lastReminder=Store.get('lastBackupReminder','');
const now=new Date().toISOString().slice(0,7);
if(lastReminder!==now){
Store.set('lastBackupReminder',now);
setTimeout(()=>toast(svgIcon('i-lightbulb','icon-sm')+' 提示：定期导出数据可防止丢失，点击统计页面的"导出数据"按钮','info'),3000);
}
}
window.addEventListener('error',function(e){
if(e.message&&e.message.indexOf('ResizeObserver')>=0)return;
if(e.message&&e.message.indexOf('Script error')>=0)return;
console.error('Global error:',e.message);
});
window.addEventListener('unhandledrejection',function(e){
console.error('Unhandled promise:',e.reason);
});
if('connection' in navigator&&navigator.connection.saveData){
document.documentElement.style.setProperty('--transition','0.01s');
}
window._studyStart=Date.now();
setInterval(function(){if(document.visibilityState==='visible'){Store.addStudyTime(60000)}},60000);
document.addEventListener('visibilitychange',function(){if(document.visibilityState==='hidden'&&window._studyStart){Store.addStudyTime(Date.now()-window._studyStart);window._studyStart=null}else if(document.visibilityState==='visible'){window._studyStart=Date.now()}});
}

const VIDEO_DATA=[
{id:'v-algo-001',title:'数据结构 - 浙江大学',category:'algorithm',platform:'bilibili',url:'https://www.bilibili.com/video/BV1JW411i731/',author:'浙江大学',duration:'26:12:00',views:'1200万+',description:'浙江大学数据结构课程，陈越老师主讲，系统讲解数组、链表、栈、队列、树、图等核心概念，每集10分钟，适合算法入门。',tags:['数据结构','算法','入门'],cover:'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=University%20data%20structures%20course%20blackboard%20with%20arrays%20linked%20lists%20trees%20graphs%20diagrams%20educational%20blue%20theme&image_size=landscape_16_9'},
{id:'v-algo-002',title:'Java数据结构与算法 - 尚硅谷',category:'algorithm',platform:'bilibili',url:'https://www.bilibili.com/video/BV1E4411H73v/',author:'尚硅谷',duration:'35:40:00',views:'800万+',description:'图解Java数据结构与算法，涵盖排序、查找、树、图、哈希表等，配有动画演示和代码实现。',tags:['数据结构','Java','算法'],cover:'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Java%20programming%20algorithms%20sorting%20binary%20tree%20hash%20table%20code%20on%20screen%20dark%20theme%20developer&image_size=landscape_16_9'},
{id:'v-algo-003',title:'数据结构与算法基础 - 青岛大学',category:'algorithm',platform:'bilibili',url:'https://www.bilibili.com/video/BV1nJ411V7bd/',author:'青岛大学-王卓',duration:'40:30:00',views:'600万+',description:'青岛大学王卓老师主讲，讲解细致，适合零基础入门，配套PPT和习题。',tags:['数据结构','入门','大学课程'],cover:'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Algorithm%20fundamentals%20textbook%20notebook%20pencil%20university%20desk%20clean%20minimal%20education&image_size=landscape_16_9'},
{id:'v-os-001',title:'操作系统：设计与实现 - 南京大学',category:'os',platform:'bilibili',url:'https://www.bilibili.com/video/BV1N741177F5/',author:'南京大学-蒋炎岩',duration:'30:00:00',views:'350万+',description:'南京大学蒋炎岩老师主讲，深入讲解操作系统原理与实现，风格幽默，质量极高。',tags:['操作系统','南京大学','原理'],cover:'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Operating%20system%20kernel%20process%20memory%20management%20Linux%20terminal%20dark%20tech%20background&image_size=landscape_16_9'},
{id:'v-os-002',title:'Linux教程 - 韩顺平',category:'os',platform:'bilibili',url:'https://www.bilibili.com/video/BV1Sv411r7vd/',author:'韩顺平',duration:'28:00:00',views:'500万+',description:'韩顺平老师Linux入门教程，通俗易懂，涵盖Linux命令、Shell编程、系统管理。',tags:['Linux','Shell','入门'],cover:'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Linux%20terminal%20command%20line%20penguin%20shell%20scripting%20green%20dark%20background%20server&image_size=landscape_16_9'},
{id:'v-net-001',title:'计算机网络 - 王道考研',category:'network',platform:'bilibili',url:'https://www.bilibili.com/video/BV19E411D78Q/',author:'王道考研',duration:'25:15:00',views:'900万+',description:'王道考研计算机网络课程，体系完整，讲解清晰，适合考研和面试复习。',tags:['计算机网络','考研','TCP/IP'],cover:'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Computer%20network%20TCP%20IP%20protocol%20layers%20packets%20routing%20diagram%20blue%20tech&image_size=landscape_16_9'},
{id:'v-net-002',title:'计算机网络 - 湖南科技大学',category:'network',platform:'bilibili',url:'https://www.bilibili.com/video/BV1c4411d7jb/',author:'湖南科技大学',duration:'35:00:00',views:'450万+',description:'中科大郑老师主讲，深入浅出讲解TCP/IP、HTTP、DNS等核心协议。',tags:['网络','协议','HTTP'],cover:'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=HTTP%20HTTPS%20DNS%20network%20protocol%20web%20browser%20request%20response%20cable%20connection&image_size=landscape_16_9'},
{id:'v-db-001',title:'MySQL数据库教程 - 尚硅谷',category:'database',platform:'bilibili',url:'https://www.bilibili.com/video/BV12b411K7Zu/',author:'尚硅谷',duration:'38:00:00',views:'700万+',description:'尚硅谷MySQL全套教程，从基础SQL到高级优化，涵盖索引、事务、锁机制等。',tags:['MySQL','SQL','数据库'],cover:'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=MySQL%20database%20SQL%20query%20table%20index%20optimization%20server%20room%20dark%20blue&image_size=landscape_16_9'},
{id:'v-db-002',title:'Redis最新教程 - 狂神说',category:'database',platform:'bilibili',url:'https://www.bilibili.com/video/BV1S54y1R7SB/',author:'狂神说Java',duration:'18:00:00',views:'500万+',description:'Redis数据结构、持久化、主从复制、哨兵模式、缓存穿透/击穿/雪崩解决方案。',tags:['Redis','缓存','分布式'],cover:'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Redis%20cache%20database%20in-memory%20data%20structure%20fast%20performance%20red%20logo%20dark&image_size=landscape_16_9'},
{id:'v-civil-001',title:'公务员考试零基础入门教程',category:'civil-service',platform:'bilibili',url:'https://www.bilibili.com/video/BV1r49DBLErk/',author:'公考系统课',duration:'48:00:00',views:'300万+',description:'公务员考试零基础入门全套教程，行测+申论系统精讲，国考省考通用。',tags:['公务员','行测','申论'],cover:'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Civil%20service%20exam%20China%20government%20test%20preparation%20books%20desk%20formal%20professional&image_size=landscape_16_9'},
{id:'v-civil-002',title:'公务员考试系统精讲课',category:'civil-service',platform:'bilibili',url:'https://www.bilibili.com/video/BV1gforBVEza/',author:'公考系统课',duration:'45:00:00',views:'200万+',description:'2027年最新公务员考试系统精讲课，行测+申论完整合集，国考省考通用。',tags:['公务员','国考','省考'],cover:'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Government%20civil%20servant%20exam%202027%20intensive%20study%20classroom%20red%20banner%20official&image_size=landscape_16_9'},
{id:'v-fin-001',title:'CPA注册会计师-会计精讲',category:'finance',platform:'bilibili',url:'https://www.bilibili.com/video/BV1pE41177bK/',author:'东奥会计在线',duration:'42:00:00',views:'180万+',description:'CPA会计科目精讲，长期股权投资、所得税、合并报表等重点难点解析。',tags:['CPA','会计','注会'],cover:'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=CPA%20accounting%20financial%20statements%20calculator%20charts%20graphs%20business%20gold%20professional&image_size=landscape_16_9'},
{id:'v-law-001',title:'法考刑法精讲 - 众合法考',category:'law',platform:'bilibili',url:'https://www.bilibili.com/video/BV1KE41137rp/',author:'众合法考',duration:'35:00:00',views:'250万+',description:'法考刑法核心知识点，犯罪构成、共同犯罪、刑罚裁量等专题深度解析。',tags:['法考','刑法','法律'],cover:'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Law%20legal%20gavel%20court%20criminal%20code%20book%20justice%20scales%20purple%20formal&image_size=landscape_16_9'},
{id:'v-med-001',title:'临床执业医师-内科学',category:'medical',platform:'bilibili',url:'https://www.bilibili.com/video/BV1T7411L7qP/',author:'医学教育网',duration:'45:00:00',views:'120万+',description:'内科常见病诊断与治疗，心血管、呼吸、消化、内分泌等系统疾病精讲。',tags:['医师','内科','临床'],cover:'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Medical%20clinical%20doctor%20stethoscope%20internal%20medicine%20hospital%20white%20coat%20healthcare&image_size=landscape_16_9'},
{id:'v-edu-001',title:'教师资格证-教育学',category:'education',platform:'bilibili',url:'https://www.bilibili.com/video/BV1aE411H7Qn/',author:'粉笔教师',duration:'26:00:00',views:'190万+',description:'教师资格证教育学考点梳理，教育目的、课程、教学、德育等模块精讲。',tags:['教资','教育学','教师'],cover:'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Teacher%20education%20certification%20classroom%20blackboard%20chalk%20school%20warm%20orange&image_size=landscape_16_9'},
{id:'v-hr-001',title:'人力资源管理师三级',category:'hr',platform:'bilibili',url:'https://www.bilibili.com/video/BV1Zx411c7mY/',author:'环球网校',duration:'32:00:00',views:'95万+',description:'HR六大模块：招聘配置、培训开发、绩效管理、薪酬福利、劳动关系、人力资源规划。',tags:['HR','人力','考证'],cover:'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Human%20resources%20HR%20teamwork%20organizational%20chart%20people%20network%20gold%20corporate&image_size=landscape_16_9'},
{id:'v-mkt-001',title:'市场营销学基础',category:'marketing',platform:'bilibili',url:'https://www.bilibili.com/video/BV1VE411u7X8/',author:'中国人民大学',duration:'24:00:00',views:'110万+',description:'营销环境分析、消费者行为、STP战略、4P理论、品牌管理等核心内容。',tags:['营销','市场','品牌'],cover:'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Marketing%20strategy%20brand%20advertising%20consumer%20behavior%20growth%20chart%20orange%20creative&image_size=landscape_16_9'},
{id:'v-lang-001',title:'JVM全套教程 - 尚硅谷',category:'language',platform:'bilibili',url:'https://www.bilibili.com/video/BV1PJ411n7xZ/',author:'尚硅谷-宋红康',duration:'30:00:00',views:'400万+',description:'JVM内存结构、垃圾回收、类加载机制、性能调优等Java虚拟机核心知识。',tags:['JVM','Java','性能'],cover:'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=JVM%20Java%20Virtual%20Machine%20memory%20garbage%20collection%20heap%20stack%20performance%20coding&image_size=landscape_16_9'},
{id:'v-lang-002',title:'JUC并发编程 - 狂神说',category:'language',platform:'bilibili',url:'https://www.bilibili.com/video/BV1B7411L7tE/',author:'狂神说Java',duration:'15:00:00',views:'350万+',description:'Java并发编程JUC详解，线程池、锁机制、CAS、AQS等核心并发知识。',tags:['JUC','并发','Java'],cover:'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Java%20concurrent%20programming%20multithreading%20thread%20pool%20lock%20synchronization%20parallel&image_size=landscape_16_9'},
{id:'v-front-001',title:'前端开发Vue3+React实战',category:'frontend',platform:'bilibili',url:'https://www.bilibili.com/video/BV1oK41147zB/',author:'黑马程序员',duration:'28:00:00',views:'380万+',description:'Vue3组合式API、React Hooks、TypeScript、工程化构建、性能优化全栈前端开发。',tags:['Vue3','React','前端'],cover:'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Frontend%20web%20development%20Vue%20React%20JavaScript%20CSS%20browser%20components%20modern%20UI&image_size=landscape_16_9'},
{id:'v-sys-001',title:'系统设计面试 - GitHub开源',category:'system-design',platform:'youtube',url:'https://www.youtube.com/playlist?list=PLMCXHnjXnTnvo6alSjN23PAZBGcO5bfXo',author:'System Design',duration:'18:00:00',views:'200万+',description:'从短链接到抖音Feed，覆盖分布式系统设计核心概念：缓存、消息队列、负载均衡、微服务架构。',tags:['系统设计','架构','分布式'],cover:'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=System%20design%20architecture%20distributed%20systems%20microservices%20cloud%20infrastructure%20diagram%20blueprint&image_size=landscape_16_9'},
{id:'v-algo-004',title:'代码随想录算法刷题',category:'algorithm',platform:'bilibili',url:'https://www.bilibili.com/video/BV1fA4y1R7Ge/',author:'代码随想录-Carl',duration:'45:00:00',views:'650万+',description:'按专题系统刷LeetCode，数组→链表→哈希→字符串→栈与队列→双指针→二叉树→回溯→贪心→动态规划，每题详细图解。',tags:['LeetCode','刷题','动态规划'],cover:'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=LeetCode%20coding%20challenge%20algorithm%20practice%20screen%20colorful%20code%20neon%20dark%20hacker&image_size=landscape_16_9'},
{id:'v-algo-005',title:'左程云算法面试通关',category:'algorithm',platform:'bilibili',url:'https://www.bilibili.com/video/BV1k84y1x7Be/',author:'左程云',duration:'50:00:00',views:'520万+',description:'前阿里P8算法面试官亲授，覆盖大厂高频算法题，含面试技巧和时间复杂度分析。',tags:['算法面试','大厂','高频题'],cover:'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Tech%20interview%20whiteboard%20coding%20algorithm%20big%20company%20office%20glass%20modern%20professional&image_size=landscape_16_9'},
{id:'v-db-003',title:'MySQL高级-索引优化与执行计划',category:'database',platform:'bilibili',url:'https://www.bilibili.com/video/BV1KW411u7xr/',author:'尚硅谷',duration:'20:00:00',views:'380万+',description:'MySQL高级进阶，深入索引原理（B+树）、执行计划分析、查询优化、分库分表实战。',tags:['MySQL','索引优化','执行计划'],cover:'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=MySQL%20query%20optimization%20execution%20plan%20B%2B%20tree%20index%20performance%20tuning%20dashboard&image_size=landscape_16_9'},
{id:'v-net-003',title:'HTTP协议详解 - 小林coding',category:'network',platform:'bilibili',url:'https://www.bilibili.com/video/BV1j54y1G7Xv/',author:'小林coding',duration:'12:00:00',views:'420万+',description:'图解HTTP/HTTPS原理，TCP三次握手四次挥手、HTTP2/3新特性，面试高频考点全覆盖。',tags:['HTTP','HTTPS','TCP'],cover:'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=HTTP%20protocol%20HTTPS%20TLS%20handshake%20encryption%20security%20web%20blue%20shield&image_size=landscape_16_9'},
{id:'v-front-002',title:'JavaScript高级-原型链与闭包',category:'frontend',platform:'bilibili',url:'https://www.bilibili.com/video/BV1Kt411w7MH/',author:'尚硅谷',duration:'16:00:00',views:'600万+',description:'JS核心难点深度剖析：原型链、闭包、作用域、this指向、事件循环、Promise、async/await。',tags:['JavaScript','闭包','原型链'],cover:'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=JavaScript%20advanced%20closure%20prototype%20chain%20event%20loop%20code%20yellow%20black%20developer&image_size=landscape_16_9'},
{id:'v-lang-003',title:'Spring6最新教程 - 尚硅谷',category:'language',platform:'bilibili',url:'https://www.bilibili.com/video/BV1kR4y1b7Qc/',author:'尚硅谷',duration:'40:00:00',views:'450万+',description:'Spring6+SpringBoot3最新教程，IoC容器、AOP、事务管理、MVC、自动配置原理深度讲解。',tags:['Spring','SpringBoot','Java'],cover:'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Spring%20Boot%20Java%20framework%20microservice%20green%20leaf%20logo%20code%20editor%20modern&image_size=landscape_16_9'},
{id:'v-sys-002',title:'微服务架构实战 - 黑马',category:'system-design',platform:'bilibili',url:'https://www.bilibili.com/video/BV1kH4y1s7Ez/',author:'黑马程序员',duration:'35:00:00',views:'320万+',description:'SpringCloud+Nacos+Gateway+Feign微服务全栈实战，含Docker部署和服务治理。',tags:['微服务','SpringCloud','Docker'],cover:'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Microservices%20architecture%20Docker%20containers%20cloud%20native%20Kubernetes%20blue%20orange%20infrastructure&image_size=landscape_16_9'},
{id:'v-bank-001',title:'银行从业资格考试精讲',category:'banking',platform:'bilibili',url:'https://www.bilibili.com/video/BV1WY411T7Jb/',author:'环球网校',duration:'30:00:00',views:'150万+',description:'银行从业资格法律法规+个人理财双科精讲，考点梳理+真题解析，适合零基础备考。',tags:['银行从业','理财','考证'],cover:'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Bank%20financial%20exam%20study%20gold%20coins%20building%20professional%20certificate%20formal&image_size=landscape_16_9'},
{id:'v-prod-001',title:'产品经理入门到精通',category:'product',platform:'bilibili',url:'https://www.bilibili.com/video/BV1qK4y1H7FL/',author:'人人都是产品经理',duration:'22:00:00',views:'280万+',description:'产品思维、需求分析、原型设计、数据驱动、用户增长，从0到1打造产品经理核心竞争力。',tags:['产品经理','需求分析','原型'],cover:'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Product%20manager%20wireframe%20prototype%20user%20experience%20design%20thinking%20colorful%20creative&image_size=landscape_16_9'},
{id:'v-ops-001',title:'运营入门-用户增长实战',category:'operations',platform:'bilibili',url:'https://www.bilibili.com/video/BV1hK4y1C7j9/',author:'运营研究社',duration:'18:00:00',views:'160万+',description:'用户运营、内容运营、活动运营三大模块，AARRR模型实战，数据驱动增长方法论。',tags:['运营','用户增长','AARRR'],cover:'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Operations%20user%20growth%20AARRR%20funnel%20data%20analytics%20chart%20green%20upward%20trend&image_size=landscape_16_9'},
{id:'v-logic-001',title:'逻辑推理-行测判断推理',category:'logical-reasoning',platform:'bilibili',url:'https://www.bilibili.com/video/BV1cV41187AZ/',author:'粉笔公考',duration:'20:00:00',views:'220万+',description:'图形推理、定义判断、类比推理、逻辑判断四大题型解题技巧，公务员/事业编通用。',tags:['逻辑推理','行测','判断推理'],cover:'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Logical%20reasoning%20puzzle%20brain%20teaser%20chess%20pattern%20recognition%20abstract%20purple&image_size=landscape_16_9'},
{id:'v-gen-001',title:'面试自我介绍与表达技巧',category:'general-interview',platform:'bilibili',url:'https://www.bilibili.com/video/BV1ab41187sM/',author:'老王聊面试',duration:'8:00:00',views:'500万+',description:'STAR法则自我介绍模板、常见面试问题应答策略、薪资谈判技巧、面试礼仪全攻略。',tags:['自我介绍','面试技巧','STAR'],cover:'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Job%20interview%20handshake%20professional%20suit%20office%20meeting%20room%20warm%20lighting%20success&image_size=landscape_16_9'},
{id:'v-algo-006',title:'LeetCode刷题攻略-灵茶山艾府',category:'algorithm',platform:'bilibili',url:'https://www.bilibili.com/video/BV1Q94y1Q7qq/',author:'灵茶山艾府',duration:'30:00:00',views:'380万+',description:'LeetCode周赛选手亲授，从思路到代码全流程讲解，侧重思维训练和一题多解。',tags:['LeetCode','周赛','思维训练'],cover:'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Competitive%20programming%20LeetCode%20weekly%20contest%20screen%20algorithm%20ranking%20blue%20gold&image_size=landscape_16_9'},
{id:'v-algo-007',title:'图解算法-小黑屋',category:'algorithm',platform:'bilibili',url:'https://www.bilibili.com/video/BV1eg411w7gn/',author:'小黑屋算法',duration:'22:00:00',views:'290万+',description:'动画图解排序、搜索、树、图等核心算法，每集5分钟，直观理解算法执行过程。',tags:['图解','动画','排序'],cover:'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Algorithm%20animation%20sorting%20visualization%20colorful%20bars%20moving%20educational%20fun&image_size=landscape_16_9'},
{id:'v-os-003',title:'操作系统概念-王道考研',category:'os',platform:'bilibili',url:'https://www.bilibili.com/video/BV1YE411D7nH/',author:'王道考研',duration:'28:00:00',views:'700万+',description:'王道考研操作系统全套课程，进程管理、内存管理、文件系统、IO管理全覆盖。',tags:['操作系统','考研','王道'],cover:'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Operating%20system%20concepts%20process%20scheduling%20memory%20paging%20textbook%20diagram%20blue&image_size=landscape_16_9'},
{id:'v-net-004',title:'网络协议抓包实战-Wireshark',category:'network',platform:'bilibili',url:'https://www.bilibili.com/video/BV1xt4y1Q7oG/',author:'技术蛋老师',duration:'14:00:00',views:'260万+',description:'用Wireshark抓包分析TCP三次握手、HTTP请求响应、DNS解析全过程，实战理解网络协议。',tags:['Wireshark','抓包','实战'],cover:'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Wireshark%20packet%20capture%20network%20analysis%20TCP%20HTTP%20protocol%20screen%20green%20dark&image_size=landscape_16_9'},
{id:'v-db-004',title:'MongoDB从入门到实战',category:'database',platform:'bilibili',url:'https://www.bilibili.com/video/BV1bJ411x7mz/',author:'黑马程序员',duration:'20:00:00',views:'320万+',description:'NoSQL数据库MongoDB核心操作、聚合管道、索引优化、副本集、分片集群实战。',tags:['MongoDB','NoSQL','实战'],cover:'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=MongoDB%20NoSQL%20database%20document%20JSON%20green%20leaf%20cluster%20data%20storage&image_size=landscape_16_9'},
{id:'v-db-005',title:'SQL必知必会-极客时间',category:'database',platform:'bilibili',url:'https://www.bilibili.com/video/BV1q54y1z7YV/',author:'极客时间',duration:'12:00:00',views:'280万+',description:'SQL从入门到精通，SELECT/JOIN/子查询/窗口函数/性能优化，每天15分钟掌握一个知识点。',tags:['SQL','入门','窗口函数'],cover:'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=SQL%20query%20language%20database%20table%20join%20select%20code%20editor%20clean%20professional&image_size=landscape_16_9'},
{id:'v-front-003',title:'CSS动画与布局进阶',category:'frontend',platform:'bilibili',url:'https://www.bilibili.com/video/BV1Y54y1o7kx/',author:'技术胖',duration:'16:00:00',views:'220万+',description:'CSS Grid/Flexbox布局、动画transition/animation、响应式设计、CSS变量与主题切换。',tags:['CSS','动画','布局'],cover:'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=CSS%20animation%20layout%20flexbox%20grid%20responsive%20design%20colorful%20gradient%20modern&image_size=landscape_16_9'},
{id:'v-front-004',title:'TypeScript从入门到实战',category:'frontend',platform:'bilibili',url:'https://www.bilibili.com/video/BV1H44y1k7oE/',author:'技术胖',duration:'18:00:00',views:'350万+',description:'TypeScript类型系统、泛型、装饰器、声明文件，配合React/Vue项目实战。',tags:['TypeScript','类型','实战'],cover:'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=TypeScript%20programming%20type%20system%20blue%20code%20editor%20developer%20tools%20clean&image_size=landscape_16_9'},
{id:'v-lang-004',title:'Python面试100题',category:'language',platform:'bilibili',url:'https://www.bilibili.com/video/BV1fK4y1e7GL/',author:'Python面试通',duration:'15:00:00',views:'410万+',description:'Python面试高频100题精讲，涵盖基础语法、数据结构、GIL、装饰器、生成器、异步IO。',tags:['Python','面试','100题'],cover:'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Python%20programming%20interview%20questions%20code%20snake%20logo%20blue%20yellow%20developer&image_size=landscape_16_9'},
{id:'v-lang-005',title:'Go语言核心编程',category:'language',platform:'bilibili',url:'https://www.bilibili.com/video/BV1wf4y1X7mS/',author:'黑马程序员',duration:'25:00:00',views:'300万+',description:'Go语言goroutine、channel、接口、反射、并发模式、性能调优核心知识全讲解。',tags:['Go','goroutine','并发'],cover:'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Go%20programming%20language%20goroutine%20concurrent%20gopher%20mascot%20blue%20code%20modern&image_size=landscape_16_9'},
{id:'v-sys-003',title:'Redis实战-缓存架构设计',category:'system-design',platform:'bilibili',url:'https://www.bilibili.com/video/BV1cr4y1b7LQ/',author:'黑马程序员',duration:'22:00:00',views:'350万+',description:'Redis缓存架构实战：缓存穿透/击穿/雪崩解决方案、分布式锁、限流、排行榜设计。',tags:['Redis','缓存','架构'],cover:'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Redis%20cache%20architecture%20distributed%20lock%20rate%20limiting%20red%20server%20infrastructure&image_size=landscape_16_9'},
{id:'v-fin-002',title:'基金投资入门-理财通识课',category:'finance',platform:'bilibili',url:'https://www.bilibili.com/video/BV1zV41187pB/',author:'理财通',duration:'10:00:00',views:'450万+',description:'基金分类、定投策略、风险控制、资产配置，零基础理财入门必看。',tags:['基金','理财','定投'],cover:'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Investment%20fund%20finance%20chart%20growth%20money%20coins%20gold%20green%20professional&image_size=landscape_16_9'},
{id:'v-law-002',title:'民法典核心条文解读',category:'law',platform:'bilibili',url:'https://www.bilibili.com/video/BV1pK4y1Y7fJ/',author:'罗翔说刑法',duration:'18:00:00',views:'800万+',description:'罗翔老师解读民法典核心条文，合同编、物权编、婚姻家庭编重点讲解，通俗易懂。',tags:['民法典','罗翔','合同'],cover:'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Civil%20code%20law%20book%20gavel%20justice%20scales%20court%20purple%20formal%20elegant&image_size=landscape_16_9'},
{id:'v-med-002',title:'解剖学-系统解剖3D动画',category:'medical',platform:'bilibili',url:'https://www.bilibili.com/video/BV1sK4y1H7BG/',author:'3Dbody解剖',duration:'20:00:00',views:'350万+',description:'3D动画讲解人体各大系统解剖结构，骨骼、肌肉、神经、循环系统直观呈现。',tags:['解剖','3D','医学'],cover:'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Human%20anatomy%203D%20model%20skeleton%20muscles%20medical%20education%20blue%20scientific&image_size=landscape_16_9'},
{id:'v-edu-002',title:'教育心理学-教资必考',category:'education',platform:'bilibili',url:'https://www.bilibili.com/video/BV1cK4y1Y7nC/',author:'中公教师',duration:'24:00:00',views:'280万+',description:'教育心理学核心考点精讲，学习理论、动机理论、发展心理学、教学心理学全覆盖。',tags:['教资','心理学','中公'],cover:'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Educational%20psychology%20brain%20learning%20theory%20books%20classroom%20warm%20orange%20study&image_size=landscape_16_9'},
{id:'v-hr-002',title:'HRBP实战-阿里政委体系',category:'hr',platform:'bilibili',url:'https://www.bilibili.com/video/BV1oK411e7xZ/',author:'HR精英课堂',duration:'14:00:00',views:'180万+',description:'HRBP角色定位、政委体系、组织诊断、人才盘点、文化落地实战方法论。',tags:['HRBP','政委','阿里'],cover:'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=HRBP%20business%20partner%20organizational%20chart%20team%20building%20gold%20corporate%20modern&image_size=landscape_16_9'},
{id:'v-mkt-002',title:'数字营销-社交媒体运营',category:'marketing',platform:'bilibili',url:'https://www.bilibili.com/video/BV1hK4y1Q7jR/',author:'运营研究社',duration:'16:00:00',views:'230万+',description:'抖音/小红书/微信公众号运营策略、内容策划、数据复盘、投放优化全流程。',tags:['数字营销','抖音','小红书'],cover:'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Digital%20marketing%20social%20media%20TikTok%20WeChat%20phone%20apps%20colorful%20creative%20vibrant&image_size=landscape_16_9'},
{id:'v-civil-003',title:'申论写作高分技巧',category:'civil-service',platform:'bilibili',url:'https://www.bilibili.com/video/BV1Zf4y1V7nG/',author:'粉笔公考',duration:'18:00:00',views:'350万+',description:'申论五大题型解题方法、公文写作格式、大作文高分模板、热点素材积累。',tags:['申论','写作','粉笔'],cover:'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Essay%20writing%20civil%20service%20exam%20pen%20paper%20Chinese%20calligraphy%20red%20formal&image_size=landscape_16_9'},
{id:'v-acc-001',title:'初级会计实务精讲',category:'accounting',platform:'bilibili',url:'https://www.bilibili.com/video/BV1AE411s7gV/',author:'中华会计网校',duration:'35:00:00',views:'260万+',description:'初级会计职称考试两科精讲，会计实务+经济法基础，零基础4个月通关方案。',tags:['初级会计','职称','实务'],cover:'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Accounting%20bookkeeping%20financial%20ledger%20calculator%20pen%20gold%20professional%20clean&image_size=landscape_16_9'},
{id:'v-sit-001',title:'情景面试-结构化答题',category:'situational',platform:'bilibili',url:'https://www.bilibili.com/video/BV1pV41187pM/',author:'面试研究院',duration:'10:00:00',views:'190万+',description:'情景模拟面试题答题框架，人际沟通、应急处理、组织协调、综合分析四大类。',tags:['情景面试','结构化','答题'],cover:'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Situational%20interview%20scenario%20role%20play%20meeting%20discussion%20office%20professional&image_size=landscape_16_9'},
{id:'v-sit-002',title:'面试情景模拟-高频考点实战',category:'situational',platform:'bilibili',url:'https://www.bilibili.com/video/BV1GJ411m7Gn/',author:'面试官说',duration:'12:00:00',views:'150万+',description:'真实面试场景还原，20道高频情景模拟题详细讲解，涵盖团队合作、客户沟通、压力面试等。',tags:['情景模拟','高频考点','实战'],cover:'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Mock%20interview%20simulation%20practice%20role%20play%20professional%20office%20conversation%20formal&image_size=landscape_16_9'},
{id:'v-acc-002',title:'经济法基础-初级会计备考',category:'accounting',platform:'bilibili',url:'https://www.bilibili.com/video/BV1ME411v7ZP/',author:'中华会计网校',duration:'30:00:00',views:'180万+',description:'经济法基础考点精讲，劳动合同法、公司法、合同法重点内容，配套真题演练。',tags:['经济法','会计职称','备考'],cover:'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Economics%20law%20accounting%20tax%20regulation%20book%20calculator%20legal%20documents%20professional&image_size=landscape_16_9'},
{id:'v-bank-002',title:'银行招聘笔试-行测备考攻略',category:'banking',platform:'bilibili',url:'https://www.bilibili.com/video/BV1uT4y1L7Bx/',author:'金融求职圈',duration:'25:00:00',views:'200万+',description:'银行招聘笔试行测部分备考攻略，数量关系、言语理解、判断推理、资料分析全覆盖。',tags:['银行招聘','行测','笔试'],cover:'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Bank%20recruitment%20exam%20test%20preparation%20math%20verbal%20reasoning%20office%20professional&image_size=landscape_16_9'},
{id:'v-ops-002',title:'内容运营-爆款内容创作方法论',category:'operations',platform:'bilibili',url:'https://www.bilibili.com/video/BV1f54y1R7LG/',author:'运营研究社',duration:'20:00:00',views:'220万+',description:'爆款内容创作SOP，从选题到标题到正文，10万+爆款背后的方法论。',tags:['内容运营','爆款','创作'],cover:'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Content%20creation%20social%20media%20viral%20article%20writing%20creative%20office%20laptop%20colorful&image_size=landscape_16_9'},
{id:'v-prod-002',title:'Axure原型设计-产品经理必修',category:'product',platform:'bilibili',url:'https://www.bilibili.com/video/BV1b54y1z7aB/',author:'产品小白进化论',duration:'16:00:00',views:'260万+',description:'Axure RP从入门到精通，高保真原型设计，交互动效，元件库使用技巧。',tags:['Axure','原型设计','产品经理'],cover:'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Product%20prototype%20wireframe%20design%20Axure%20UI%20mockup%20computer%20screen%20professional&image_size=landscape_16_9'}
];

const LEARNING_METHODS=[
{id:'feynman',name:'费曼学习法',icon:'i-lightbulb',color:'var(--accent-cyan)',principle:'如果你不能简单地解释一件事，说明你还没有真正理解它',steps:['选择一个概念','用自己的话解释它，就像教一个完全不懂的人','发现解释中的知识缺口，回去学习','简化你的解释，使用类比和比喻'],tips:['尝试把面试题的答案讲给朋友听','如果讲不清楚，说明理解还不够深入','用最简单的语言描述复杂概念','画图辅助理解，如数据结构示意图'],applyTo:['algorithm','os','network','database']},
{id:'spaced',name:'间隔重复法',icon:'i-zap',color:'var(--accent-purple)',principle:'基于艾宾浩斯遗忘曲线，在即将遗忘时复习，效果最佳',steps:['第1次复习：学习后1小时','第2次复习：1天后','第3次复习：3天后','第4次复习：7天后','第5次复习：14天后','第6次复习：30天后'],tips:['本平台的「间隔复习」功能已自动实现此方法','标记掌握的题目会自动进入复习计划','坚持每天复习到期题目','不要跳过复习，遗忘曲线效应显著'],applyTo:['algorithm','finance','law','medical','education','civil-service','hr','marketing']},
{id:'pomodoro',name:'番茄工作法',icon:'i-calendar',color:'var(--accent-gold)',principle:'25分钟专注 + 5分钟休息，4个番茄后长休息15-30分钟',steps:['设定一个明确的学习目标（如完成5道题）','设定25分钟计时器','专注学习，不做任何其他事','计时器响后休息5分钟','每4个番茄后休息15-30分钟'],tips:['面试准备建议每天4-8个番茄','每个番茄专注一个分类','休息时站起来活动，不要看手机','记录完成的番茄数，追踪效率'],applyTo:['algorithm','os','network','database','system-design','frontend','language']},
{id:'active-recall',name:'主动回忆法',icon:'i-target',color:'var(--difficulty-easy)',principle:'主动从记忆中提取信息，比被动阅读效果好3倍',steps:['看完题目后先不看答案','尝试自己写出/说出完整答案','对照答案检查遗漏点','标注不熟悉的部分重点复习','间隔一段时间后再次回忆'],tips:['不要看完题目就立即看答案','尝试口头表述答案，模拟面试场景','用思维导图回忆知识框架','错题本中的题尤其适合此方法'],applyTo:['algorithm','finance','law','medical','education','civil-service','hr','marketing']},
{id:'deliberate',name:'刻意练习',icon:'i-fire',color:'var(--accent-orange)',principle:'在舒适区之外有目标地练习，才能持续进步',steps:['识别你的薄弱环节（查看错题本和统计）','设定具体可衡量的目标','在能力边缘练习（选择稍难的题目）','获取即时反馈（查看答案和解析）','重复练习直到掌握'],tips:['不要只刷简单题，要挑战中等和困难题','错题要反复做直到完全理解','每个分类保持均衡练习','设定每日最小目标（如5题）'],applyTo:['algorithm','os','network','database','system-design','frontend','language','scenario']},
{id:'mindmap',name:'思维导图法',icon:'i-boxes',color:'var(--accent-purple)',principle:'用图形化方式组织知识，建立概念之间的联系',steps:['以核心概念为中心','向外扩展主要分支','每个分支继续细化','用颜色和图标区分不同类型','定期回顾和补充'],tips:['算法：以数据结构为中心，扩展各类算法','网络：以OSI模型为中心，逐层展开','数据库：以SQL为中心，扩展索引、事务、优化','金融：以会计等式为中心，扩展各会计要素'],applyTo:['algorithm','os','network','database','finance','law','medical']}
];

const INTERVIEW_GUIDES=[
{category:'algorithm',title:'算法面试准备指南',icon:'i-target',color:'var(--accent-cyan)',phases:[
{name:'基础阶段（1-2周）',tasks:['刷LeetCode Hot 100中的Easy题','掌握数组、链表、栈、队列基本操作','学习时间/空间复杂度分析','每天3-5题，重在理解思路']},
{name:'进阶阶段（2-3周）',tasks:['攻克Medium难度题','学习二叉树、图、动态规划','总结常见题型模板（滑动窗口、双指针、BFS/DFS）','每天5-8题，注重代码实现']},
{name:'冲刺阶段（1-2周）',tasks:['刷LeetCode Hot 100中的Hard题','模拟面试限时做题（30分钟/题）','复习错题和薄弱题型','练习白板编程和口头表述']}
],keyPoints:['先说思路再写代码','注意边界条件处理','主动说出时间空间复杂度','不会的题先说暴力解法再优化'],commonMistakes:['直接写代码不沟通思路','忽略空值和边界情况','过度优化导致代码复杂','不测试就提交']},
{category:'finance',title:'金融财会面试指南',icon:'i-trending',color:'var(--accent-orange)',phases:[
{name:'基础阶段（2-3周）',tasks:['掌握会计六大要素和基本等式','理解三大报表的逻辑关系','学习常用财务比率计算','了解最新会计准则变化']},
{name:'进阶阶段（2-3周）',tasks:['深入合并报表和关联交易','掌握税务筹划基本方法','学习金融工具和套期会计','练习案例分析题']},
{name:'冲刺阶段（1-2周）',tasks:['关注近期财经热点','模拟面试回答专业问题','准备自我介绍和职业规划','复习高频考点和易错点']}
],keyPoints:['回答要有逻辑框架','结合实际案例说明','关注行业最新动态','展示专业素养和学习能力'],commonMistakes:['只背概念不理解原理','忽视实务操作经验','回答过于学术化','不了解行业动态']},
{category:'law',title:'法律法务面试指南',icon:'i-shield',color:'var(--accent-purple)',phases:[
{name:'基础阶段（2-3周）',tasks:['梳理民法、刑法核心法条','掌握法律推理基本方法','了解诉讼程序和证据规则','记忆重要司法解释']},
{name:'进阶阶段（2-3周）',tasks:['练习案例分析（IRAC方法）','学习合同审查要点','掌握公司法核心条款','了解劳动法和知识产权法']},
{name:'冲刺阶段（1-2周）',tasks:['模拟法律意见书撰写','准备热点法律问题观点','练习口头辩论和论证','复习高频考点']}
],keyPoints:['法条引用要准确','案例分析用IRAC框架','注意法律更新的时效性','展示法律思维和逻辑能力'],commonMistakes:['法条记忆不准确','案例分析缺乏逻辑','忽视程序法内容','回答不够严谨']},
{category:'medical',title:'医疗卫生面试指南',icon:'i-heart',color:'var(--difficulty-easy)',phases:[
{name:'基础阶段（2-3周）',tasks:['复习内科学核心疾病诊疗','掌握外科学基本操作原则','学习诊断学常用检查方法','了解药理学常用药物']},
{name:'进阶阶段（2-3周）',tasks:['练习病例分析题','掌握急诊处理流程','学习医患沟通技巧','了解医疗法规和伦理']},
{name:'冲刺阶段（1-2周）',tasks:['模拟临床情景面试','准备自我介绍和专业规划','复习高频考点和易错题','关注医学前沿进展']}
],keyPoints:['诊断要全面考虑鉴别诊断','治疗方案要个体化','注意用药禁忌和相互作用','展示临床思维和人文关怀'],commonMistakes:['诊断不够全面','忽视鉴别诊断','用药考虑不周全','缺乏人文关怀意识']},
{category:'civil-service',title:'公务员面试指南',icon:'i-flag',color:'#7c4dff',phases:[
{name:'基础阶段（2-3周）',tasks:['掌握行测五大题型解题方法','练习言语理解和数量关系','学习判断推理和资料分析','了解常识判断高频考点']},
{name:'进阶阶段（2-3周）',tasks:['限时模拟行测全套试题','学习申论写作框架和技巧','练习综合分析题','关注时政热点和政策']},
{name:'冲刺阶段（1-2周）',tasks:['全真模拟考试环境','查漏补缺薄弱环节','准备面试常见问题','练习结构化面试答题']}
],keyPoints:['行测注重速度和准确率平衡','申论要有政府思维','面试答题要有逻辑层次','关注最新时政热点'],commonMistakes:['行测时间分配不合理','申论偏题跑题','面试答题过于模板化','忽视时政积累']},
{category:'hr',title:'人力资源面试指南',icon:'i-users',color:'var(--accent-gold)',phases:[
{name:'基础阶段（1-2周）',tasks:['掌握HR六大模块核心知识','学习劳动法和劳动合同法','了解招聘流程和面试技巧','掌握薪酬设计基本方法']},
{name:'进阶阶段（2-3周）',tasks:['学习绩效管理工具（KPI/OKR）','掌握培训需求分析方法','了解员工关系处理技巧','练习HR案例分析']},
{name:'冲刺阶段（1-2周）',tasks:['准备HR专业问题回答','模拟HR情景面试','关注人力资源新趋势','复习高频考点']}
],keyPoints:['结合企业实际回答问题','了解最新劳动法规变化','展示沟通协调能力','数据驱动的HR思维'],commonMistakes:['理论脱离实际','忽视法律合规','缺乏数据意识','沟通表达不清晰']},
{category:'marketing',title:'市场营销面试指南',icon:'i-megaphone',color:'var(--accent-orange)',phases:[
{name:'基础阶段（1-2周）',tasks:['掌握4P/4C/STP等核心理论','学习消费者行为学基础','了解数字营销主要渠道','掌握市场调研基本方法']},
{name:'进阶阶段（2-3周）',tasks:['学习品牌管理策略','掌握社交媒体营销技巧','了解数据分析和用户增长','练习营销方案策划']},
{name:'冲刺阶段（1-2周）',tasks:['准备营销案例分析','模拟营销方案汇报','关注行业最新趋势','复习高频考点']}
],keyPoints:['用数据支撑营销决策','关注ROI和转化率','了解目标用户画像','展示创意和执行力'],commonMistakes:['只有理论没有实操','忽视数据驱动','方案缺乏可落地性','不了解行业竞品']},
{category:'education',title:'教育培训面试指南',icon:'i-graduation',color:'var(--accent-cyan)',phases:[
{name:'基础阶段（1-2周）',tasks:['掌握教育学基本理论','学习心理学核心概念','了解课程设计和教学方法','熟悉教育法规和政策']},
{name:'进阶阶段（2-3周）',tasks:['练习教学设计和教案编写','学习课堂管理技巧','掌握教育评价方法','了解特殊教育需求']},
{name:'冲刺阶段（1-2周）',tasks:['准备试讲和说课','模拟面试答辩','关注教育改革动态','复习高频考点']}
],keyPoints:['教学设计要体现学生主体','关注因材施教理念','展示教育情怀和专业素养','了解教育技术新趋势'],commonMistakes:['教学设计脱离学情','忽视学生个体差异','缺乏教育情怀展示','不了解教育新技术']}
];

const RECOMMENDED_RESOURCES=[
{category:'algorithm',name:'算法与数据结构',resources:[
{title:'LeetCode中国站',type:'website',url:'https://leetcode.cn/',desc:'全球最大在线刷题平台，面试必备'},
{title:'代码随想录',type:'website',url:'https://programmercarl.com/',desc:'系统化LeetCode刷题路线，按专题分类'},
{title:'算法（第4版）',type:'book',author:'Robert Sedgewick',desc:'经典算法教材，Java实现，适合系统学习'},
{title:'剑指Offer',type:'book',author:'何海涛',desc:'中国程序员面试圣经，75道经典面试题'},
{title:'labuladong算法小抄',type:'website',url:'https://labuladong.online/',desc:'算法框架思维，用套路解题'}
]},
{category:'os',name:'操作系统',resources:[
{title:'操作系统导论(OSTEP)',type:'book',author:'Remzi H. Arpaci-Dusseau',desc:'最易懂的OS教材，虚拟化/并发/持久化三篇'},
{title:'深入理解计算机系统(CSAPP)',type:'book',author:'Randal E. Bryant',desc:'CMU经典教材，从程序员视角理解系统'},
{title:'南京大学OS课程',type:'course',url:'https://www.bilibili.com/video/BV1N741177F5/',desc:'蒋炎岩老师主讲，质量极高'}
]},
{category:'network',name:'计算机网络',resources:[
{title:'计算机网络：自顶向下方法',type:'book',author:'James F. Kurose',desc:'从应用层到物理层，最流行的网络教材'},
{title:'图解HTTP',type:'book',author:'上野宣',desc:'图文并茂，快速理解HTTP协议'},
{title:'Wireshark网络分析',type:'tool',desc:'抓包工具，实践理解网络协议'}
]},
{category:'database',name:'数据库',resources:[
{title:'MySQL技术内幕：InnoDB存储引擎',type:'book',author:'姜承尧',desc:'深入MySQL底层实现，面试高频考点'},
{title:'Redis设计与实现',type:'book',author:'黄健宏',desc:'Redis源码级解析，数据结构和实现原理'},
{title:'高性能MySQL',type:'book',author:'Baron Schwartz',desc:'MySQL优化圣经，索引/查询/架构优化'}
]},
{category:'finance',name:'金融财会',resources:[
{title:'CPA官方教材',type:'book',desc:'注册会计师考试教材，最权威的会计知识体系'},
{title:'东奥会计在线',type:'website',url:'https://www.dongao.com/',desc:'CPA/初级/中级会计职称在线学习平台'},
{title:'财务报表分析与证券定价',type:'book',author:'Stephen Penman',desc:'从分析师视角理解财务报表'}
]},
{category:'law',name:'法律法务',resources:[
{title:'法考客观题精讲',type:'course',desc:'法考必备，系统梳理法律知识体系'},
{title:'民法典及相关司法解释',type:'book',desc:'最新民法典全文及解读，法律人必备'},
{title:'中国裁判文书网',type:'website',url:'https://wenshu.court.gov.cn/',desc:'真实判例学习，理解法律实务'}
]},
{category:'medical',name:'医疗卫生',resources:[
{title:'内科学（第9版）',type:'book',desc:'临床医学核心教材，执业医师考试必备'},
{title:'医学教育网',type:'website',url:'https://www.med66.com/',desc:'执业医师/护士/药师考试在线学习'},
{title:'UpToDate临床顾问',type:'website',desc:'基于证据的临床决策支持资源'}
]},
{category:'civil-service',name:'公务员行测',resources:[
{title:'粉笔公考',type:'website',url:'https://www.fenbi.com/',desc:'公务员考试在线刷题和学习平台'},
{title:'华图在线',type:'website',url:'https://v.huatu.com/',desc:'公务员考试培训，行测申论系统课程'},
{title:'半月谈',type:'website',url:'http://www.banyuetan.org/',desc:'时政热点和申论素材积累'}
]},
{category:'hr',name:'人力资源',resources:[
{title:'人力资源管理（第14版）',type:'book',author:'Gary Dessler',desc:'HR经典教材，六大模块全面覆盖'},
{title:'三茅人力资源网',type:'website',url:'https://www.hrloo.com/',desc:'HR专业社区，实务案例和工具模板'},
{title:'OKR工作法',type:'book',author:'Christina Wodtke',desc:'目标管理新方法，互联网企业常用'}
]},
{category:'marketing',name:'市场营销',resources:[
{title:'营销管理（第16版）',type:'book',author:'Philip Kotler',desc:'营销学圣经，理论体系最完整'},
{title:'定位',type:'book',author:'Al Ries & Jack Trout',desc:'战略定位经典，改变营销思维'},
{title:'增长黑客',type:'book',author:'Sean Ellis',desc:'低成本用户增长方法论，互联网营销必备'}
]},
{category:'education',name:'教育培训',resources:[
{title:'教育学基础',type:'book',desc:'教师资格证考试核心教材'},
{title:'粉笔教师',type:'website',url:'https://teacher.fenbi.com/',desc:'教师资格证/教师招聘考试学习平台'},
{title:'给教师的建议',type:'book',author:'苏霍姆林斯基',desc:'教育经典，理解教育本质'}
]}
];

function renderVideos(){
var currentCategory=currentParams.category||'all';
var filteredVideos=currentCategory==='all'?VIDEO_DATA:VIDEO_DATA.filter(function(v){return v.category===currentCategory});
var videoPage=currentParams.vpage||1;
var isMobile=window.innerWidth<=768;
var pageSize=isMobile?12:24;
var totalPages=Math.ceil(filteredVideos.length/pageSize);
if(videoPage>totalPages)videoPage=1;
var pageVideos=filteredVideos.slice((videoPage-1)*pageSize,videoPage*pageSize);
return`<nav class="breadcrumb" aria-label="面包屑导航" style="display:flex;align-items:center;gap:6px;flex-wrap:wrap;margin-bottom:16px;padding:10px 14px;background:var(--bg-secondary);border:1px solid var(--border-color);border-radius:var(--radius);font-size:13px"><a href="javascript:void(0)" onclick="navigate('dashboard')" style="color:var(--accent-cyan);text-decoration:none;display:inline-flex;align-items:center;gap:4px">${svgIcon('i-home','icon-sm')} 首页</a><span style="color:var(--text-muted)">/</span><span style="color:var(--text-secondary)">学习视频</span></nav>
<div style="margin-bottom:20px">
<h2 style="font-size:24px;margin-bottom:12px;color:var(--accent-cyan)">${svgIcon('i-play-circle','icon-lg')} 学习视频资源</h2>
<p style="color:var(--text-secondary);font-size:14px;margin-bottom:16px">精选优质学习视频，涵盖各专业领域，助你高效备考</p>
<div class="video-categories" style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:20px;padding:12px;background:var(--bg-secondary);border-radius:var(--radius);border:1px solid var(--border-color)">
${(function(){var btns=[{id:'all',name:'全部'}];var seen=new Set();VIDEO_DATA.forEach(function(v){if(!seen.has(v.category)){seen.add(v.category);btns.push({id:v.category,name:CATEGORY_MAP[v.category]||v.category})}});return btns.map(function(c){return'<button class="filter-btn '+(currentCategory===c.id?'active':'')+'" onclick="navigate(\'videos\',{category:\''+c.id+'\'})" style="padding:8px 16px;border:none;border-radius:20px;cursor:pointer;font-size:13px;transition:var(--transition);background:'+(currentCategory===c.id?'var(--accent-cyan)':'var(--bg-tertiary)')+';color:'+(currentCategory===c.id?'#0f172a':'var(--text-secondary)')+'">'+c.name+'</button>'}).join('')})()}
</div>
</div>
<div class="video-grid" style="display:grid;grid-template-columns:repeat(auto-fill,minmax(320px,1fr));gap:16px">
${pageVideos.length===0?`<div class="empty-state" style="grid-column:1/-1"><div class="empty-icon">📺</div><div class="empty-title">暂无该分类的视频资源</div><div class="empty-desc">当前专业模式下没有匹配的视频，试试切换到其他模式</div><button class="btn btn-primary" style="margin-top:12px" onclick="setProfessionalMode('all')">切换到全部模式</button></div>`:pageVideos.map(v=>`<div class="card video-card" style="cursor:pointer;transition:var(--transition);overflow:hidden" onclick="window.open('${v.url}','_blank')">
<div style="position:relative;width:100%;aspect-ratio:16/9;border-radius:var(--radius-sm);overflow:hidden;margin-bottom:12px;background:var(--bg-tertiary)">
<img src="${v.cover||''}" alt="${v.title}" loading="lazy" style="width:100%;height:100%;object-fit:cover;transition:transform .3s ease" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'" onload="this.style.display='block';this.nextElementSibling.style.display='none'"/>
<div style="position:absolute;inset:0;display:none;align-items:center;justify-content:center;background:linear-gradient(135deg,var(--bg-tertiary),var(--bg-primary))">
<span style="font-size:36px">🎬</span>
</div>
<div style="position:absolute;top:8px;left:8px;background:rgba(0,0,0,.6);color:#fff;padding:2px 8px;border-radius:4px;font-size:11px;font-weight:500">${v.platform==='bilibili'?'B站':v.platform==='youtube'?'YouTube':v.platform}</div>
<div style="position:absolute;bottom:8px;right:8px;background:rgba(0,0,0,.7);color:#fff;padding:2px 8px;border-radius:4px;font-size:12px">${v.duration}</div>
<div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;background:rgba(0,229,255,.05);opacity:0;transition:opacity .3s ease" class="video-hover-overlay"><span style="font-size:40px;color:#fff;text-shadow:0 2px 8px rgba(0,0,0,.5)">▶</span></div>
</div>
<div style="padding:4px 0">
<h3 style="font-size:15px;font-weight:600;color:var(--text-primary);margin-bottom:6px;line-height:1.4">${v.title}</h3>
<p style="font-size:13px;color:var(--text-secondary);margin-bottom:8px;line-height:1.5;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden">${v.description}</p>
<div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:6px">
<span style="font-size:12px;color:var(--accent-cyan);background:rgba(34,211,238,.1);padding:2px 8px;border-radius:10px">${v.author}</span>
<span style="font-size:12px;color:var(--text-muted)">👁 ${v.views}</span>
</div>
<div style="display:flex;gap:4px;margin-top:8px;flex-wrap:wrap">
${v.tags.map(tag=>`<span style="font-size:11px;color:var(--text-muted);background:var(--bg-tertiary);padding:2px 8px;border-radius:10px">${tag}</span>`).join('')}
</div>
</div>
</div>`).join('')}
</div>${totalPages>1?'<div class="pagination" style="display:flex;justify-content:center;gap:8px;margin-top:20px">'+(videoPage>1?'<button class="btn btn-outline btn-sm" onclick="navigate(\'videos\',{category:\''+currentCategory+'\',vpage:'+(videoPage-1)+'})">← 上一页</button>':'')+'<span style="padding:8px 16px;color:var(--text-secondary);font-size:13px">'+videoPage+' / '+totalPages+'</span>'+(videoPage<totalPages?'<button class="btn btn-primary btn-sm" onclick="navigate(\'videos\',{category:\''+currentCategory+'\',vpage:'+(videoPage+1)+'})">下一页 →</button>':'')+'</div>':''}`;
}

let aiChatHistory=Store.get('aiChatHistory')||[];
let _mockInterviewState=null;
let _typewriterTimer=null;
function typewriterRender(containerId,text,speed){
if(_typewriterTimer)clearInterval(_typewriterTimer);
var el=document.getElementById(containerId);
if(!el)return;
el.innerHTML=renderMarkdown(text);
el.scrollTop=el.scrollHeight;
var parent=el.closest('.ai-chat');
if(parent)parent.scrollTop=parent.scrollHeight;
}
function renderMarkdown(text){
if(!text)return'';
let html=text;
html=html.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
html=html.replace(/```(\w*)\n([\s\S]*?)```/g,(_,lang,code)=>`<pre style="background:var(--bg-primary);padding:12px;border-radius:6px;overflow-x:auto;margin:8px 0;font-size:13px;border:1px solid var(--border-color)"><code>${code.trim()}</code></pre>`);
html=html.replace(/`([^`]+)`/g,'<code style="background:var(--bg-primary);padding:2px 6px;border-radius:4px;font-size:13px;color:var(--accent-cyan)">$1</code>');
html=html.replace(/\*\*(.+?)\*\*/g,'<strong style="color:var(--text-primary)">$1</strong>');
html=html.replace(/\*(.+?)\*/g,'<em>$1</em>');
html=html.replace(/^### (.+)$/gm,'<h4 style="margin:12px 0 6px;color:var(--accent-cyan);font-size:14px">$1</h4>');
html=html.replace(/^## (.+)$/gm,'<h3 style="margin:14px 0 8px;color:var(--accent-gold);font-size:15px">$1</h3>');
html=html.replace(/^# (.+)$/gm,'<h2 style="margin:16px 0 8px;color:var(--accent-cyan);font-size:17px">$1</h2>');
html=html.replace(/^---$/gm,'<hr style="border:none;border-top:1px solid var(--border-color);margin:12px 0">');
html=html.replace(/^- (.+)$/gm,'<div style="padding-left:16px;position:relative;margin:2px 0"><span style="position:absolute;left:0;color:var(--accent-cyan)">•</span>$1</div>');
html=html.replace(/^\d+\. (.+)$/gm,(m,p1,off,str)=>`<div style="padding-left:16px;margin:2px 0">${p1}</div>`);
html=html.replace(/\n/g,'<br>');
return html;
}

function renderAIAssistant(){
const currentMode=getProfessionalMode();
const currentModeObj=PROFESSIONAL_MODES.find(function(m){return m.id===currentMode})||PROFESSIONAL_MODES[0];
const context=buildAIContext();
const chatHtml=aiChatHistory.map((msg,idx)=>{
let contentHtml='';
if(msg.role==='assistant'){contentHtml=renderMarkdown(msg.content)}
else{contentHtml=escapeHtml(msg.content)}
return`<div class="ai-message ${msg.role}" style="margin:12px 0;padding:12px 16px;border-radius:var(--radius);max-width:85%;line-height:1.6;word-break:break-word;${msg.role==='user'?'background:var(--accent-cyan);color:#0f172a;margin-left:auto;text-align:right':'background:var(--bg-tertiary);color:var(--text-primary)'}"><div style="font-size:14px">${contentHtml}</div><div style="font-size:11px;color:inherit;opacity:.7;margin-top:4px;text-align:${msg.role==='user'?'right':'left'}">${new Date(msg.timestamp).toLocaleTimeString()}</div></div>`
}).join('');
const quickBtns=[
{text:'💡 算法面试准备',q:'如何准备算法面试？'},
{text:'🎯 分析薄弱环节',q:'我的薄弱环节是什么？'},
{text:'✍️ 项目经验技巧',q:'如何回答项目经验类问题？'},
{text:'📋 公考面试指导',q:'公务员面试有哪些注意事项？'},
{text:'🏦 金融财会面试',q:'金融财会面试常问什么？'},
{text:'⚖️ 法律法务面试',q:'法律法务面试怎么准备？'},
{text:'🏥 医疗卫生面试',q:'医疗卫生面试常考哪些内容？'},
{text:'🎭 模拟面试',q:'请对我进行模拟面试'},
{text:'📊 学习计划',q:'帮我制定一个学习计划'},
{text:'🧠 记忆技巧',q:'有什么高效的记忆方法？'},
{text:'💻 前端开发面试',q:'前端开发面试怎么准备？'},
{text:'🏗️ 系统设计面试',q:'系统设计面试高频题有哪些？'}
];
var dynamicBtns=[];
if(context.weakCats.length>0){dynamicBtns.push({text:'🔥 攻克'+context.weakCats[0].name,q:'帮我重点复习'+context.weakCats[0].name+'，给我出几道题'})}
if(context.wrongCount>0){dynamicBtns.push({text:'❌ 错题复习('+context.wrongCount+'题)',q:'帮我复习错题，讲解易错点'})}
if(context.mastered<10){dynamicBtns.push({text:'🚀 快速入门',q:'我是面试新手，应该从哪里开始？'})}
else if(context.mastered>context.total*0.7){dynamicBtns.push({text:'🏆 冲刺高分',q:'我已经掌握了大部分题目，如何冲刺高分？'})}
if(currentMode!=='all'){dynamicBtns.push({text:currentModeObj.icon+' '+currentModeObj.name+'专项',q:'针对'+currentModeObj.name+'面试给我详细指导'})}
var allQuickBtns=dynamicBtns.concat(quickBtns);
return`<nav class="breadcrumb" aria-label="面包屑导航" style="display:flex;align-items:center;gap:6px;flex-wrap:wrap;margin-bottom:16px;padding:10px 14px;background:var(--bg-secondary);border:1px solid var(--border-color);border-radius:var(--radius);font-size:13px"><a href="javascript:void(0)" onclick="navigate('dashboard')" style="color:var(--accent-cyan);text-decoration:none;display:inline-flex;align-items:center;gap:4px">${svgIcon('i-home','icon-sm')} 首页</a><span style="color:var(--text-muted)">/</span><span style="color:var(--text-secondary)">AI面试助手</span></nav>
<div style="max-width:800px;margin:0 auto">
<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;flex-wrap:wrap;gap:8px">
<h2 style="font-size:24px;color:var(--accent-purple)">${svgIcon('i-zap','icon-lg')} AI面试助手</h2>
<div style="display:flex;gap:8px">
${aiChatHistory.length>0?`<button onclick="clearAIChat()" style="padding:6px 14px;background:var(--bg-tertiary);color:var(--text-secondary);border:1px solid var(--border-color);border-radius:20px;cursor:pointer;font-size:12px;transition:var(--transition)" onmouseover="this.style.borderColor='var(--difficulty-hard)';this.style.color='var(--difficulty-hard)'" onmouseout="this.style.borderColor='var(--border-color)';this.style.color='var(--text-secondary)'">🗑️ 清除记录</button>`:''}
</div>
</div>
<p style="color:var(--text-secondary);font-size:14px;margin-bottom:16px">智能面试指导、模拟面试、学习建议和实时问答</p>
<div style="display:flex;gap:8px;margin-bottom:16px;flex-wrap:wrap">
<span style="padding:4px 10px;background:rgba(179,136,255,.1);color:var(--accent-purple);border-radius:12px;font-size:11px;font-weight:500">🧠 TTAPI AI模型</span>
<span style="padding:4px 10px;background:rgba(34,211,238,.1);color:var(--accent-cyan);border-radius:12px;font-size:11px;font-weight:500">🔍 Tavily实时搜索</span>
<span style="padding:4px 10px;background:rgba(255,179,0,.1);color:var(--accent-gold);border-radius:12px;font-size:11px;font-weight:500">🐟 TinyFish备用搜索</span>
</div>
<div class="ai-container" style="background:var(--bg-secondary);border:1px solid var(--border-color);border-radius:var(--radius);height:calc(100vh - 320px);min-height:400px;display:flex;flex-direction:column;overflow:hidden">
<div id="ai-chat-history" class="ai-chat" style="flex:1;overflow-y:auto;padding:16px;display:flex;flex-direction:column">
${chatHtml||`<div style="text-align:center;padding:40px;color:var(--text-muted)"><div style="font-size:48px;margin-bottom:12px">🤖</div><p style="font-size:15px;margin-bottom:8px">你好！我是AI面试助手</p><p style="font-size:13px;margin-bottom:4px">${context.mastered===0?'让我帮你开启面试准备之旅！':context.mastered<50?'你已完成'+context.mastered+'题，继续加油！':'太棒了！已掌握'+context.mastered+'题，让我帮你更上一层楼！'}</p><p style="font-size:12px;color:var(--text-muted);margin-bottom:16px">当前模式：${currentModeObj.icon} ${currentModeObj.name}${context.weakCats.length>0?' · 薄弱：'+context.weakCats.map(function(c){return c.name}).join('、'):''}</p><div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;max-width:440px;margin:0 auto">${allQuickBtns.slice(0,8).map(b=>`<div style="padding:12px;background:var(--bg-primary);border-radius:8px;font-size:13px;cursor:pointer;text-align:left;transition:var(--transition);border:1px solid var(--border-color)" onclick="quickAIQuestion('${b.q}')" onmouseover="this.style.borderColor='var(--accent-cyan)'" onmouseout="this.style.borderColor='var(--border-color)'">${b.text}</div>`).join('')}</div></div>`}<div style="text-align:center;padding:40px;color:var(--text-muted)"><div style="font-size:48px;margin-bottom:12px">🤖</div><p style="font-size:15px;margin-bottom:8px">你好！我是AI面试助手</p><p style="font-size:13px;margin-bottom:16px">我可以为你提供专业面试指导、模拟面试和学习建议</p><div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;max-width:400px;margin:0 auto">${quickBtns.map(b=>`<div style="padding:12px;background:var(--bg-primary);border-radius:8px;font-size:13px;cursor:pointer;text-align:left;transition:var(--transition);border:1px solid var(--border-color)" onclick="quickAIQuestion('${b.q}')" onmouseover="this.style.borderColor='var(--accent-cyan)'" onmouseout="this.style.borderColor='var(--border-color)'">${b.text}</div>`).join('')}</div></div>`}
</div>
<div class="ai-input" style="padding:16px;border-top:1px solid var(--border-color);display:flex;gap:8px;align-items:end">
<textarea id="ai-question" placeholder="请输入你的面试问题...（Enter发送，Shift+Enter换行）" rows="3" style="flex:1;padding:12px;background:var(--bg-primary);color:var(--text-primary);border:1px solid var(--border-color);border-radius:var(--radius);font-size:14px;resize:none;outline:none;font-family:inherit;line-height:1.5;max-height:120px" onkeydown="if(event.key==='Enter'&&!event.shiftKey){event.preventDefault();sendAIMessage()}"></textarea>
<button id="ai-send" onclick="sendAIMessage()" style="padding:12px 24px;background:var(--accent-purple);color:#fff;border:none;border-radius:var(--radius);cursor:pointer;font-size:14px;font-weight:600;transition:var(--transition);white-space:nowrap;height:fit-content" onmouseover="this.style.opacity='0.9'" onmouseout="this.style.opacity='1'">发送</button>
</div>
</div>
</div>`;
}

function clearAIChat(){
aiChatHistory=[];
Store.set('aiChatHistory',[]);
renderPage();
showToast('聊天记录已清除','info');
}

function quickAIQuestion(question){
document.getElementById('ai-question').value=question;
sendAIMessage();
}

function sendAIMessage(){
const input=document.getElementById('ai-question');
const question=input.value.trim();
if(!question){showToast('请输入问题','error');return}
aiChatHistory.push({role:'user',content:question,timestamp:Date.now()});
input.value='';
Store.set('aiChatHistory',aiChatHistory);
renderPage();
setTimeout(()=>{generateAIResponse(question)},300);
}

function buildAIContext(){
const allQ=getAllQuestions();
const mastered=Store.getMastered();
const masteredSet=new Set(mastered);
const wrongBook=Store.getWrongBook();
const totalAttempts=Store.getTotalAttempts();
const correctCount=Store.getCorrectCount();
const accuracy=totalAttempts?Math.round(correctCount/totalAttempts*100):0;
const catStats={};
allQ.forEach(q=>{if(!catStats[q.category])catStats[q.category]={total:0,mastered:0,wrong:0};catStats[q.category].total++;if(masteredSet.has(q.id))catStats[q.category].mastered++});
wrongBook.forEach(function(w){var wq=allQ.find(function(q){return q.id===w.qid});if(wq&&catStats[wq.category])catStats[wq.category].wrong++});
const weakCats=Object.entries(catStats).sort((a,b)=>(a[1].mastered/a[1].total)-(b[1].mastered/b[1].total)).slice(0,3);
const streak=Store.getStreak();
const todayCount=Store.getTodayCount();
const strongCats=Object.entries(catStats).sort((a,b)=>(b[1].mastered/b[1].total)-(a[1].mastered/a[1].total)).slice(0,3);
const recentWrong=wrongBook.slice(-3).map(function(w){var wq=allQ.find(function(q){return q.id===w.qid});return wq?{title:wq.title,category:CATEGORY_MAP[wq.category]||wq.category}:null}).filter(Boolean);
return{total:allQ.length,mastered:mastered.length,accuracy,totalAttempts,wrongCount:wrongBook.length,streak,todayCount,weakCats:weakCats.map(([cat,s])=>({name:CATEGORIES.find(c=>c.id===cat)?.name||cat,mastery:Math.round(s.mastered/s.total*100),wrong:s.wrong})),strongCats:strongCats.map(([cat,s])=>({name:CATEGORIES.find(c=>c.id===cat)?.name||cat,mastery:Math.round(s.mastered/s.total*100)})),currentMode:currentModeObj.name,recentWrong:recentWrong};
}

const TTAPI_KEY='6a1d8d71-83e1-a29a-73bd-054f629404a0';
const TAVILY_API_KEY='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';
const TINYFISH_API_KEY='sk-tinyfish-uc4UsT0fms_HCoYfw7q-vZXkKF5w_usf';

async function callTTAPIChat(question,context){
try{
const systemPrompt=`你是"面试通"平台的AI面试助手，专业、友好、有深度。你的职责：
1. 回答用户关于面试准备、学习方法、职业规划的问题
2. 提供各领域（算法、金融、法律、医学、教育、公务员、HR、营销等）的专业指导
3. 根据用户学习数据给出个性化建议
4. 模拟真实面试场景，提出问题并给出反馈

当前用户数据：
- 题库${context.total}题，已掌握${context.mastered}题（掌握率${context.total?Math.round(context.mastered/context.total*100):0}%）
- 正确率${context.accuracy}%，错题${context.wrongCount}道
- 连续学习${context.streak}天，今日掌握${context.todayCount}题
- 当前模式：${context.currentMode}
${context.weakCats.length>0?'- 薄弱分类：'+context.weakCats.map(c=>c.name+'('+c.mastery+'%掌握，'+c.wrong+'道错题)').join('、'):'- 所有分类进展良好'}
${context.strongCats&&context.strongCats.length>0?'- 优势分类：'+context.strongCats.map(c=>c.name+'('+c.mastery+'%掌握)').join('、'):''}
${context.recentWrong&&context.recentWrong.length>0?'- 最近错题：'+context.recentWrong.map(w=>w.title+'('+w.category+')').join('、'):''}

回答要求：
- 用中文回答，结构清晰（使用标题、列表）
- 结合实际场景和案例
- 给出可执行的建议
- 如果涉及技术问题，给出准确的解释
- 根据用户的薄弱环节重点指导
- 如果用户在模拟面试中，扮演面试官角色，追问并评分`;你是"面试通"平台的AI面试助手，专业、友好、有深度。你的职责：
1. 回答用户关于面试准备、学习方法、职业规划的问题
2. 提供各领域（算法、金融、法律、医学、教育、公务员、HR、营销等）的专业指导
3. 根据用户学习数据给出个性化建议
4. 模拟真实面试场景，提出问题并给出反馈

当前用户数据：题库${context.total}题，已掌握${context.mastered}题，正确率${context.accuracy}%，错题${context.wrongCount}道，连续学习${context.streak}天。
${context.weakCats.length>0?'薄弱分类：'+context.weakCats.map(c=>c.name+'('+c.mastery+'%)').join('、'):'所有分类进展良好'}。

回答要求：
- 用中文回答，结构清晰（使用标题、列表）
- 结合实际场景和案例
- 给出可执行的建议
- 如果涉及技术问题，给出准确的解释`;
const res=await fetch('https://ttapi.io/v1/chat/completions',{
method:'POST',
headers:{'Content-Type':'application/json','Authorization':'Bearer '+TTAPI_KEY},
body:JSON.stringify({
model:'gpt-4o-mini',
messages:[
{role:'system',content:systemPrompt},
...aiChatHistory.slice(-10).filter(m=>m.role!=='assistant'||!m.content.includes('typing')).map(m=>({role:m.role,content:m.content})),
{role:'user',content:question}
],
temperature:0.7,
max_tokens:2000
})
});
if(!res.ok)throw new Error('TTAPI Error: '+res.status);
const data=await res.json();
if(data.choices&&data.choices[0]&&data.choices[0].message){
return data.choices[0].message.content;
}
return null;
}catch(e){
console.warn('TTAPI调用失败:',e);
return null;
}
}

async function callTinyFishSearch(query){
try{
const res=await fetch('https://api.tinyfish.io/v1/search',{
method:'POST',
headers:{'Content-Type':'application/json','Authorization':'Bearer '+TINYFISH_API_KEY},
body:JSON.stringify({
query:query,
max_results:5
})
});
if(!res.ok)throw new Error('TinyFish Error: '+res.status);
const data=await res.json();
if(data.results&&data.results.length>0){
let response='**🔍 相关搜索结果：**\n\n';
data.results.slice(0,5).forEach((r,i)=>{
response+=`**${i+1}. ${r.title||'搜索结果'}**\n`;
if(r.snippet)response+=`${r.snippet}\n`;
if(r.url)response+=`🔗 [查看原文](${r.url})\n\n`;
});
return response;
}
return null;
}catch(e){
console.warn('TinyFish搜索失败:',e);
return null;
}
}

async function callTavilySearch(question,context){
try{
const contextInfo=context?`\n\n用户学习数据：题库${context.total}题，已掌握${context.mastered}题，正确率${context.accuracy}%，错题${context.wrongCount}道，薄弱分类：${context.weakCats.map(c=>c.name).join('、')}`:'';
const res=await fetch('https://api.tavily.com/search',{
method:'POST',
headers:{'Content-Type':'application/json'},
body:JSON.stringify({
api_key:TAVILY_API_KEY,
query:question+' 面试 备考 技巧',
search_depth:'advanced',
max_results:5,
include_answer:'advanced',
chunks_per_source:2
})
});
if(!res.ok)throw new Error('Tavily API Error: '+res.status);
const data=await res.json();
if(data.answer){
let response=data.answer;
if(data.results&&data.results.length>0){
response+='\n\n**参考资源：**\n';
data.results.slice(0,3).forEach((r,i)=>{
response+=`${i+1}. [${r.title||'参考链接'}](${r.url})\n`;
if(r.content)response+=`   > ${r.content.substring(0,120)}...\n`;
});
}
return response;
}
if(data.results&&data.results.length>0){
let response='根据搜索结果，为你整理以下信息：\n\n';
data.results.forEach((r,i)=>{
response+=`**${i+1}. ${r.title}**\n${r.content||''}\n来源：[${r.url}](${r.url})\n\n`;
});
return response;
}
return null;
}catch(e){
console.warn('Tavily Search failed:',e);
return null;
}
}

async function generateAIResponse(question){
const context=buildAIContext();
const chatEl=document.getElementById('ai-chat-history');
if(chatEl){
const typingDiv=document.createElement('div');
typingDiv.id='ai-typing';
typingDiv.className='ai-message assistant';
typingDiv.style.cssText='margin:12px 0;padding:12px 16px;border-radius:var(--radius);max-width:85%;background:var(--bg-tertiary);color:var(--text-primary)';
typingDiv.innerHTML='<div style="display:flex;align-items:center;gap:8px"><div class="loading"></div><span style="font-size:14px;color:var(--text-muted)">🤖 AI正在思考中...</span></div>';
chatEl.appendChild(typingDiv);
chatEl.scrollTop=chatEl.scrollHeight;
}

let response=null;
const typingEl=document.getElementById('ai-typing');

try{
if(typingEl)typingEl.querySelector('span').textContent='🧠 正在连接TTAPI智能模型...';
const ttapiResult=await callTTAPIChat(question,context);
if(ttapiResult){
response=ttapiResult;
response+='\n\n---\n*💡 由 TTAPI AI 模型驱动 | 本回答结合了你的学习数据生成*';
}
}catch(e){console.warn('TTAPI失败:',e)}

if(!response){
try{
if(typingEl)typingEl.querySelector('span').textContent='🔍 Tavily搜索实时信息...';
const tavilyResult=await callTavilySearch(question,context);
if(tavilyResult){
response=tavilyResult;
if(context.weakCats.length>0){
response+=`\n\n---\n**⚠️ 你的薄弱环节提醒**：${context.weakCats.map(c=>c.name+'(掌握率'+c.mastery+'%)').join('、')}，建议重点复习。`;
}
}
}catch(e){console.warn('Tavily失败:',e)}
}

if(!response){
try{
if(typingEl)typingEl.querySelector('span').textContent='🐟 TinyFish搜索备用资源...';
const tinyfishResult=await callTinyFishSearch(question+' 面试 备考 技巧');
if(tinyfishResult){
response=tinyfishResult;
}
}catch(e){console.warn('TinyFish失败:',e)}
}

if(!response){
if(typingEl)typingEl.querySelector('span').textContent='📚 使用本地知识库生成回复...';
response=generateLocalResponse(question,context);
}

if(typingEl)typingEl.remove();

aiChatHistory.push({role:'assistant',content:response,timestamp:Date.now()});
Store.set('aiChatHistory',aiChatHistory);
renderPage();
const chatHistory=document.getElementById('ai-chat-history');
if(chatHistory)chatHistory.scrollTop=chatHistory.scrollHeight;
}

function generateLocalResponse(question,context){
const q=question.toLowerCase();
if(q.includes('模拟面试')||q.includes('面试模拟')||q.includes('模拟题')||q.includes('请对我进行模拟面试')){
_mockInterviewState={round:1,totalRounds:5,scores:[],currentQ:null,category:null};
var mode=getProfessionalMode();
var cats=getActiveCategories();
var targetCat=cats[Math.floor(Math.random()*cats.length)];
var catQuestions=getAllQuestions().filter(function(qq){return qq.category===targetCat});
if(catQuestions.length===0)catQuestions=getAllQuestions();
var randomQ=catQuestions[Math.floor(Math.random()*catQuestions.length)];
_mockInterviewState.currentQ=randomQ;
_mockInterviewState.category=randomQ.category;
var catName=CATEGORY_MAP[randomQ.category]||randomQ.category;
var diffLabel={easy:'简单',medium:'中等',hard:'困难'}[randomQ.difficulty]||randomQ.difficulty;
return`🎭 **模拟面试开始！** (第1/${_mockInterviewState.totalRounds}轮)

---

**面试官：** "你好，欢迎参加面试。我是今天的面试官，让我们开始吧。"

**📌 面试类型：** 技术深挖
**📂 题目分类：** ${catName}
**⚡ 难度等级：** ${diffLabel}

---

**面试官提问：**

> **"${randomQ.title}"**

${randomQ.content?randomQ.content.substring(0,200)+'...':''}

---

💡 **回答提示：**
1. 先花1-2分钟理解题目，确认关键信息
2. 说出你的解题思路，不要急于给出答案
3. 如果是算法题，先说暴力解法再优化
4. 如果是专业题，用结构化方式回答

📌 **你可以：**
- 直接输入你的回答，我会追问和评分
- 回复"看答案"查看参考答案
- 回复"跳过"进入下一题
- 回复"结束面试"查看综合评价`;
}
if(q.includes('学习计划')||q.includes('备考计划')||q.includes('怎么安排')){
const days=Math.max(7,Math.round((context.total-context.mastered)/5));
return`📊 **个性化学习计划**

---

**你的当前状态：**
- 已掌握：${context.mastered}/${context.total} 题
- 正确率：${context.accuracy}%
- 错题数：${context.wrongCount} 道
- 连续学习：${context.streak} 天

**建议学习周期：${days}天**

---

**📅 每日学习安排（番茄工作法）**

| 时段 | 内容 | 时长 |
|------|------|------|
| 上午 | 新题学习（薄弱分类优先） | 2个番茄(50分钟) |
| 下午 | 间隔复习（到期题目） | 1个番茄(25分钟) |
| 晚上 | 错题重做+总结归纳 | 1个番茄(25分钟) |

**🎯 每日目标：**
- 完成 5-10 道新题
- 复习所有到期题目
- 重做 2-3 道错题
- 总结当天学到的知识点

**📈 阶段性目标：**
1. **第1周**：掌握所有简单题，正确率提升到60%
2. **第2-3周**：攻克中等题，正确率提升到75%
3. **第4周+**：挑战困难题，正确率提升到85%

**⚠️ 注意事项：**
- 不要连续学习超过2小时
- 每周至少休息1天
- 错题必须理解原理，不要只记答案`;
}
if(q.includes('记忆')||q.includes('背诵')||q.includes('记不住')){
return`🧠 **高效记忆方法大全**

---

**1. 间隔重复法（最推荐）**
- 学习后 1小时 → 1天 → 3天 → 7天 → 14天 → 30天 复习
- 本平台的「间隔复习」功能已自动实现此方法
- 遗忘曲线表明：及时复习可大幅提升记忆保持率

**2. 费曼学习法**
- 用自己的话解释概念，就像教一个完全不懂的人
- 如果讲不清楚，说明理解还不够深入
- 尝试把面试题答案讲给朋友听

**3. 记忆宫殿法**
- 将知识点与你熟悉的地点关联
- 例如：把会计等式放在家门口，折旧方法放在客厅
- 适合记忆大量零散知识点

**4. 组块记忆法**
- 将大量信息分成小组块（每组3-5个）
- 例如：会计六大要素分为两组记忆
  - 资产类：资产、费用（成本）
  - 来源类：负债、所有者权益、收入、利润

**5. 口诀记忆法**
- 编制简短口诀帮助记忆
- 例如：借贷记账法"资产费用借方增，负债权益贷方增"
- 自己编的口诀效果最好

**6. 思维导图法**
- 以核心概念为中心，向外扩展
- 用颜色和图标区分不同类型
- 适合梳理知识体系

**💡 实用建议：**
- 睡前复习效果最佳（睡眠中大脑会巩固记忆）
- 多感官参与：读、写、说、画
- 理解性记忆远比死记硬背有效
- 每次复习时尝试先回忆，再看答案`;
}
if(_mockInterviewState&&(q.includes('看答案')||q.includes('跳过')||q.includes('下一题')||q.includes('结束面试'))){
if(q.includes('结束面试')){
var avgScore=_mockInterviewState.scores.length?Math.round(_mockInterviewState.scores.reduce(function(a,b){return a+b},0)/_mockInterviewState.scores.length):0;
var level=avgScore>=80?'⭐ 优秀':avgScore>=60?'👍 良好':avgScore>=40?'📝 一般':'💪 需要加强';
var result='🎭 **模拟面试结束！综合评价**\n\n---\n\n';
result+='**📊 面试成绩单**\n\n';
result+='| 轮次 | 得分 |\n|------|------|\n';
_mockInterviewState.scores.forEach(function(s,i){result+='| 第'+(i+1)+'轮 | '+s+'/100 |\n'});
result+='\n**综合评分：'+avgScore+'/100 '+level+'**\n\n';
result+='**💡 改进建议：**\n';
if(avgScore<60){result+='1. 基础知识需要加强，建议先从简单题开始\n2. 多练习结构化回答，使用"第一、第二、第三"\n3. 每天至少练习3道面试题\n'}
else if(avgScore<80){result+='1. 回答深度可以加强，注意底层原理\n2. 多结合实际案例，避免空泛描述\n3. 加强薄弱分类的专项练习\n'}
else{result+='1. 表现优秀！继续保持\n2. 可以挑战更高难度的题目\n3. 注意面试中的表达节奏和自信度\n'}
result+='\n📌 回复"模拟面试"开始新一轮面试，或问其他问题';
_mockInterviewState=null;
return result;
}
if(q.includes('看答案')&&_mockInterviewState.currentQ){
var cq=_mockInterviewState.currentQ;
var answer=cq.answer||'暂无参考答案';
_mockInterviewState.scores.push(40);
return'📝 **参考答案：'+cq.title+'**\n\n---\n\n'+answer+'\n\n---\n\n💡 看答案得分 40/100（建议先自己思考再看答案）\n\n📌 回复"跳过"进入下一题，或"结束面试"查看评价';
}
_mockInterviewState.round++;
if(_mockInterviewState.round>_mockInterviewState.totalRounds){
var avgScore=_mockInterviewState.scores.length?Math.round(_mockInterviewState.scores.reduce(function(a,b){return a+b},0)/_mockInterviewState.scores.length):0;
var level=avgScore>=80?'⭐ 优秀':avgScore>=60?'👍 良好':avgScore>=40?'📝 一般':'💪 需要加强';
_mockInterviewState=null;
return'🎭 **面试结束！**\n\n综合评分：'+avgScore+'/100 '+level+'\n\n📌 回复"模拟面试"开始新一轮，或问其他问题';
}
var nextQs=getAllQuestions().filter(function(qq){return qq.category===_mockInterviewState.category});
if(nextQs.length===0)nextQs=getAllQuestions();
var nextQ=nextQs[Math.floor(Math.random()*nextQs.length)];
_mockInterviewState.currentQ=nextQ;
var prevScore=60+Math.floor(Math.random()*30);
_mockInterviewState.scores.push(prevScore);
return'🎭 **第'+_mockInterviewState.round+'/'+_mockInterviewState.totalRounds+'轮**\n\n---\n\n上一轮得分：'+prevScore+'/100\n\n**面试官追问：**\n\n> **"'+nextQ.title+'"**\n\n'+(nextQ.content?nextQ.content.substring(0,200)+'...':'')+'\n\n---\n\n📌 直接输入回答，或回复"看答案"/"跳过"/"结束面试"';
}
if(q.includes('薄弱')||q.includes('弱点')||q.includes('不足')||q.includes('分析')){
var analysis='🎯 **你的学习数据分析报告**\n\n---\n\n';
analysis+='**📊 整体表现**\n';
analysis+='总题库：'+context.total+' 题\n';
analysis+='已掌握：'+context.mastered+' 题（'+(context.total?Math.round(context.mastered/context.total*100):0)+'%）\n';
analysis+='正确率：'+context.accuracy+'%\n';
analysis+='错题数：'+context.wrongCount+' 道\n';
analysis+='连续学习：'+context.streak+' 天\n';
analysis+='今日掌握：'+context.todayCount+' 题\n\n';
if(context.weakCats.length>0){
analysis+='**⚠️ 需要加强的分类：**\n\n';
analysis+='| 分类 | 掌握率 | 错题数 | 建议 |\n|------|--------|--------|------|\n';
context.weakCats.forEach(function(c){
var suggestion=c.mastery<30?'从基础开始':c.mastery<60?'专项突破':'巩固提升';
analysis+='| '+c.name+' | '+c.mastery+'% | '+c.wrong+'道 | '+suggestion+' |\n';
});
analysis+='\n';
}
if(context.strongCats&&context.strongCats.length>0){
analysis+='**✅ 优势分类：**\n';
context.strongCats.forEach(function(c){analysis+='- '+c.name+'：'+c.mastery+'% 掌握\n'});
analysis+='\n';
}
analysis+='**💡 个性化建议：**\n';
if(context.mastered===0){analysis+='1. 你刚开始使用，建议先从"每日一题"开始\n2. 选择一个你熟悉的分类进行专项练习\n3. 每天坚持做5-10道题，养成习惯\n'}
else if(context.accuracy<50){analysis+='1. 正确率偏低，建议先理解知识点再做题\n2. 多看答案解析，理解解题思路\n3. 利用错题本反复复习\n'}
else if(context.mastered<context.total*0.3){analysis+='1. 坚持每天刷题，重点攻克薄弱分类\n2. 使用间隔复习巩固已学知识\n3. 观看相关视频加深理解\n'}
else if(context.mastered<context.total*0.7){analysis+='1. 你已掌握近半，重点突破中等难度题\n2. 尝试限时挑战提升答题速度\n3. 模拟面试检验综合能力\n'}
else{analysis+='1. 你已掌握大部分题目，冲刺高分！\n2. 挑战困难题，查漏补缺\n3. 多做模拟面试，提升表达能力\n'}
return analysis;
}
if(q.includes('算法')||q.includes('数据结构')){
return`**算法面试准备建议：**

**推荐学习路径：**
1. **基础数据结构** - 数组、链表、栈、队列
2. **进阶数据结构** - 二叉树、堆、哈希表、图
3. **经典算法** - 排序、查找、动态规划、贪心

**你目前掌握率：${context.total?Math.round(context.mastered/context.total*100):0}%**

**推荐视频：**
- 数据结构 - 浙江大学（B站 BV1JW411i731）
- Java数据结构与算法 - 尚硅谷（B站 BV1E4411H73v）

**刷题建议：**
- 每天2-3道算法题
- 先做简单题建立信心
- 重点掌握高频题型`;
}
if(q.includes('项目')||q.includes('经历')){
return`**项目经验回答技巧（STAR法则）：**

**Situation（情境）** - 项目背景和你的角色
**Task（任务）** - 面临的挑战和目标
**Action（行动）** - 你采取的具体措施
**Result（结果）** - 量化成果和经验教训

**注意事项：**
1. 准备2-3个不同类型的项目案例
2. 突出个人贡献而非团队成果
3. 用数据说话，避免空泛描述`;
}
if(q.includes('公务员')||q.includes('行测')||q.includes('申论')||q.includes('公考')){
return`**公务员面试备考指南：**

**一、行测备考要点**
1. **言语理解** - 逻辑填空、片段阅读、语句表达
2. **数量关系** - 工程问题、行程问题、排列组合
3. **判断推理** - 图形推理、定义判断、逻辑判断
4. **资料分析** - 速算技巧、图表分析
5. **常识判断** - 时政热点、法律常识

**二、申论写作技巧**
- 归纳概括：找准关键词，分类归纳
- 提出对策：针对性+可行性
- 综合分析：多角度辩证思考
- 文章写作：论点明确+论据充分+逻辑清晰

**三、面试注意事项**
1. 着装正式，仪态大方
2. 回答条理清晰，使用"第一、第二、第三"
3. 结合岗位特点回答
4. 保持自信，不卑不亢

**推荐视频：** 公务员考试零基础入门教程（B站）`;
}
if(q.includes('金融')||q.includes('财会')||q.includes('会计')||q.includes('银行')){
return`**金融财会面试备考指南：**

**一、金融基础知识**
1. 货币银行学 - 货币政策、利率体系、商业银行
2. 国际金融 - 汇率、国际收支、外汇管理
3. 金融市场 - 股票、债券、基金、衍生品

**二、会计核心考点**
1. 会计等式与借贷记账法
2. 固定资产折旧方法
3. 收入确认五步法模型
4. 增值税税率与计算

**三、银行从业要点**
1. 商业银行三性原则：安全性、流动性、盈利性
2. 巴塞尔协议资本充足率要求
3. LPR贷款市场报价利率
4. 中间业务与表外业务

**四、面试常见问题**
- "请解释净息差和净利差的区别"
- "如何评估一家银行的经营状况？"
- "新金融工具准则有哪些变化？"

**推荐视频：** CPA注册会计师-会计精讲（B站）`;
}
if(q.includes('法律')||q.includes('法考')||q.includes('律师')){
return`**法律法务面试备考指南：**

**一、法考核心科目**
1. 刑法 - 犯罪构成、共同犯罪、刑罚裁量
2. 民法 - 民事法律行为、物权、合同、侵权
3. 行政法 - 行政行为、行政复议、行政诉讼
4. 商经法 - 公司法、合伙企业法、破产法

**二、高频考点**
- 正当防卫与紧急避险的区分
- 合同效力（有效/无效/可撤销/效力待定）
- 劳动合同法（试用期、解除、赔偿）
- 知识产权（著作权、专利权、商标权）

**三、面试技巧**
1. 法条引用要准确
2. 案例分析要条理清晰
3. 注意法律思维的体现
4. 关注最新立法动态

**推荐视频：** 法考刑法精讲 - 众合法考（B站）`;
}
if(q.includes('hr')||q.includes('人力')||q.includes('招聘')||q.includes('面试技巧')){
return`**HR面试常见问题及回答技巧：**

**一、行为面试题（STAR法则）**
1. "请举例说明你如何解决团队冲突"
2. "描述一次你克服困难的经历"
3. "你如何处理与同事的分歧？"

**二、经典问题回答策略**
- **自我介绍**：3分钟版本，突出与岗位匹配的经历
- **为什么选择我们公司**：行业了解+岗位匹配+个人发展
- **薪资期望**：调研市场价+给出合理区间+表示可协商
- **职业规划**：短期1-3年+中期3-5年，与公司发展结合

**三、HR面试注意事项**
1. 态度真诚，不夸大不贬低
2. 回答具体，用数据/案例支撑
3. 展示学习能力和成长意愿
4. 准备2-3个反问问题

**四、面试禁忌**
- 不要说前公司坏话
- 不要表现出急切或无所谓
- 不要打断面试官
- 不要只回答"是/否"`;
}
if(q.includes('产品')||q.includes('运营')||q.includes('营销')){
return`**产品/运营/营销面试备考指南：**

**一、产品经理核心能力**
1. 需求分析 - 用户调研、竞品分析、需求优先级（RICE模型）
2. 产品设计 - 信息架构、交互设计、原型制作
3. 数据分析 - DAU/MAU、留存率、转化漏斗
4. 项目管理 - 敏捷开发、版本规划、跨部门协作

**二、运营核心知识**
1. 用户运营 - 拉新、促活、留存、转化
2. 内容运营 - UGC/PGC、内容策略、分发渠道
3. 活动运营 - 策划、执行、复盘
4. 数据运营 - 指标体系、AB测试、增长模型

**三、营销核心概念**
1. STP理论 - 市场细分、目标市场、市场定位
2. 4P/4C理论 - 产品/顾客、价格/成本、渠道/便利、促销/沟通
3. 品牌管理 - 品牌定位、品牌资产、品牌延伸

**四、面试高频题**
- "如何从0到1设计一个产品？"
- "DAU突然下降20%怎么排查？"
- "如何策划一场用户增长活动？"`;
}
if(q.includes('医学')||q.includes('医师')||q.includes('临床')||q.includes('护士')){
return`**医疗卫生面试备考指南：**

**一、临床知识核心**
1. 内科学 - 心血管、呼吸、消化、内分泌
2. 外科学 - 无菌术、休克、创伤、围手术期
3. 诊断学 - 病史采集、体格检查、辅助检查

**二、高频面试题**
1. "急性心梗的处理流程？"
2. "休克的分类和抢救原则？"
3. "如何与患者家属沟通病情？"

**三、医患沟通技巧**
1. 倾听为主，表达共情
2. 用通俗语言解释专业术语
3. 尊重患者知情权和选择权
4. 做好医疗文书记录

**推荐视频：** 临床执业医师-内科学（B站）`;
}
if(q.includes('教师')||q.includes('教资')||q.includes('教育')){
return`**教师资格证面试备考指南：**

**一、笔试核心考点**
1. 教育学 - 教育目的、课程理论、教学原则
2. 心理学 - 学习理论、发展心理、心理健康
3. 教育法规 - 教师法、义务教育法、未成年人保护法

**二、面试流程**
1. 结构化面试（5分钟2题）
2. 试讲（10分钟）
3. 答辩（5分钟）

**三、试讲技巧**
1. 导入新颖，吸引注意
2. 互动设计，体现学生主体
3. 板书工整，逻辑清晰
4. 时间把控，节奏得当

**推荐视频：** 教师资格证-教育学（B站）`;
}
if(q.includes('操作系统')||q.includes('进程')||q.includes('线程')||q.includes('内存管理')){
return`**操作系统面试备考指南：**

**一、核心知识体系**
1. 进程管理 - 进程状态、调度算法、进程同步、死锁
2. 内存管理 - 虚拟内存、分页/分段、页面置换算法
3. 文件系统 - 文件组织、目录结构、磁盘调度
4. I/O管理 - I/O控制方式、缓冲技术、SPOOLing

**二、高频面试题**
1. "进程和线程的区别？"
2. "什么是死锁？如何预防和避免？"
3. "虚拟内存的工作原理？"
4. "页面置换算法有哪些？LRU怎么实现？"

**三、面试技巧**
1. 用图表辅助解释（如进程状态转换图）
2. 结合Linux实际实现回答
3. 注意区分概念间的细微差别
4. 准备常见算法的手动模拟（如页面置换）

**推荐资源：** 南京大学OS课程（B站）、CSAPP第9章`;
}
if(q.includes('网络')||q.includes('tcp')||q.includes('http')||q.includes('协议')){
return`**计算机网络面试备考指南：**

**一、核心知识体系**
1. OSI七层模型 / TCP/IP四层模型
2. 应用层 - HTTP/HTTPS、DNS、FTP
3. 传输层 - TCP三次握手/四次挥手、UDP、拥塞控制
4. 网络层 - IP、ICMP、路由协议
5. 数据链路层 - MAC地址、ARP、以太网

**二、高频面试题**
1. "TCP三次握手和四次挥手的过程？"
2. "HTTP和HTTPS的区别？"
3. "TCP如何保证可靠传输？"
4. "DNS解析的完整过程？"
5. "GET和POST的区别？"

**三、面试技巧**
1. 画图说明握手/挥手过程
2. 从协议层次角度分析问题
3. 结合实际场景（如浏览器输入URL后的过程）
4. 注意协议的演进（HTTP/1.1 → HTTP/2 → HTTP/3）

**推荐资源：** 《计算机网络：自顶向下方法》、《图解HTTP》`;
}
if(q.includes('数据库')||q.includes('sql')||q.includes('mysql')||q.includes('索引')){
return`**数据库面试备考指南：**

**一、核心知识体系**
1. SQL基础 - 增删改查、JOIN、子查询、聚合函数
2. 索引 - B+树、聚簇/非聚簇索引、覆盖索引、最左前缀
3. 事务 - ACID、隔离级别、MVCC、锁机制
4. 优化 - 慢查询分析、执行计划、分库分表

**二、高频面试题**
1. "MySQL索引的底层数据结构？为什么用B+树？"
2. "事务的隔离级别？各自解决什么问题？"
3. "MVCC的实现原理？"
4. "如何优化慢查询？"
5. "Redis和MySQL的数据一致性怎么保证？"

**三、面试技巧**
1. 用EXPLAIN分析查询执行计划
2. 从索引原理角度回答优化问题
3. 结合实际业务场景设计表结构
4. 准备Redis缓存相关的问题

**推荐资源：** 《MySQL技术内幕：InnoDB存储引擎》、《Redis设计与实现》`;
}
if(q.includes('系统设计')||q.includes('分布式')||q.includes('架构')||q.includes('微服务')){
return`**系统设计面试备考指南：**

**一、核心知识体系**
1. 分布式基础 - CAP理论、一致性模型、分布式ID
2. 缓存 - 缓存策略、缓存穿透/击穿/雪崩
3. 消息队列 - Kafka/RabbitMQ、消息可靠性、顺序性
4. 微服务 - 服务注册发现、配置中心、链路追踪
5. 高可用 - 限流/熔断/降级、负载均衡、容灾

**二、高频面试题**
1. "如何设计一个短链接系统？"
2. "如何设计一个秒杀系统？"
3. "如何保证分布式事务的一致性？"
4. "如何设计一个消息队列？"

**三、面试技巧**
1. 先确认需求，再设计方案
2. 从简单方案开始，逐步优化
3. 画架构图说明数据流向
4. 估算QPS、存储等数据
5. 讨论trade-off和扩展性

**推荐资源：** 《数据密集型应用系统设计》(DDIA)、System Design Primer(GitHub)`;
}
if(q.includes('前端')||q.includes('javascript')||q.includes('css')||q.includes('react')||q.includes('vue')){
return`**前端面试备考指南：**

**一、核心知识体系**
1. JavaScript - 原型链、闭包、事件循环、Promise
2. CSS - 布局(Flex/Grid)、BFC、动画、响应式
3. 框架 - React/Vue核心原理、虚拟DOM、Diff算法
4. 工程化 - Webpack/Vite、性能优化、CI/CD
5. 网络 - HTTP/HTTPS、跨域、缓存策略

**二、高频面试题**
1. "事件循环(Event Loop)的执行机制？"
2. "React Hooks的原理和使用注意事项？"
3. "虚拟DOM的Diff算法？"
4. "前端性能优化有哪些手段？"
5. "浏览器渲染过程？"

**三、面试技巧**
1. 手写代码题要边写边解释思路
2. 从原理层面回答框架相关问题
3. 准备项目中的性能优化案例
4. 了解最新的前端技术趋势

**推荐资源：** 《JavaScript高级程序设计》、React官方文档、Vue3设计思路`;
}
if(q.includes('编程语言')||q.includes('java')||q.includes('python')||q.includes('go')||q.includes('c++')){
return`**编程语言面试备考指南：**

**一、Java方向**
1. JVM - 内存模型、垃圾回收、类加载机制
2. 并发 - synchronized、volatile、线程池、CAS
3. 集合 - HashMap原理、ConcurrentHashMap
4. Spring - IoC/AOP、事务管理、循环依赖

**二、Python方向**
1. GIL全局解释器锁
2. 装饰器、生成器、迭代器
3. 内存管理和垃圾回收
4. 异步编程(asyncio)

**三、Go方向**
1. Goroutine和Channel
2. 内存模型和逃逸分析
3. 接口和泛型
4. 并发模式

**四、面试技巧**
1. 从底层原理回答语言特性
2. 对比不同语言的优劣
3. 准备实际项目中的语言使用案例
4. 了解语言最新版本的特性

**推荐资源：** 《深入理解Java虚拟机》、《Effective Python》、Go官方教程`;
}
if(_mockInterviewState){
var score=50+Math.floor(Math.random()*40);
_mockInterviewState.scores.push(score);
var feedback='';
if(score>=80)feedback='回答很好！思路清晰，要点全面。';
else if(score>=60)feedback='回答尚可，但可以更深入。建议注意以下改进点：';
else feedback='回答需要加强。建议：';
_mockInterviewState.round++;
if(_mockInterviewState.round>_mockInterviewState.totalRounds){
var avgScore=Math.round(_mockInterviewState.scores.reduce(function(a,b){return a+b},0)/_mockInterviewState.scores.length);
var level=avgScore>=80?'⭐ 优秀':avgScore>=60?'👍 良好':avgScore>=40?'📝 一般':'💪 需要加强';
_mockInterviewState=null;
return'💬 **面试官反馈：** '+feedback+' ('+score+'/100)\n\n---\n\n🎭 **面试结束！**\n\n综合评分：'+avgScore+'/100 '+level+'\n\n📌 回复"模拟面试"开始新一轮';
}
var nextQs2=getAllQuestions();
var nextQ2=nextQs2[Math.floor(Math.random()*nextQs2.length)];
_mockInterviewState.currentQ=nextQ2;
return'💬 **面试官反馈：** '+feedback+' ('+score+'/100)\n\n---\n\n🎭 **第'+_mockInterviewState.round+'/'+_mockInterviewState.totalRounds+'轮**\n\n**面试官：**\n\n> **"'+nextQ2.title+'"**\n\n'+(nextQ2.content?nextQ2.content.substring(0,200)+'...':'')+'\n\n---\n\n📌 继续回答，或回复"看答案"/"跳过"/"结束面试"';
}
const allQ=getAllQuestions();
const related=allQ.filter(qq=>qq.title.toLowerCase().includes(q.slice(0,4))||(qq.tags&&qq.tags.some(t=>q.includes(t)))).slice(0,3);
let response='关于"'+question+'"，我为你整理以下建议：\n\n';
if(related.length>0){
response+='**📚 相关题目推荐：**\n'+related.map((rq,i)=>''+(i+1)+'. '+rq.title+' ('+((CATEGORY_MAP[rq.category]||rq.category))+')').join('\n')+'\n\n';
}
if(context.weakCats.length>0){
response+='**⚠️ 你的薄弱提醒：** '+context.weakCats.map(function(c){return c.name+'('+c.mastery+'%掌握)'}).join('、')+'，建议优先复习。\n\n';
}
response+='**💡 通用建议：**\n';
response+='1. 理解基本概念和原理，不要死记硬背\n';
response+='2. 结合实际场景思考，用STAR法则组织回答\n';
response+='3. 多做题巩固知识点，利用错题本查漏补缺\n';
response+='4. 观看学习视频加深理解\n\n';
response+='📌 提示：你可以问我更具体的问题，如：\n';
response+='- "模拟面试" — 开始多轮模拟面试\n';
response+='- "分析薄弱环节" — 查看学习数据报告\n';
response+='- "帮我制定学习计划" — 个性化学习安排\n';
response+='- 任何专业领域的问题，如"算法怎么准备"、"公务员考什么"';
return response;
}

init();
if('serviceWorker' in navigator){navigator.serviceWorker.register('sw.js').catch(()=>{})}
