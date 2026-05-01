import json
import re

all_new_questions = []

# ============== OS: Need ~25 more ==============
os_more = [
    ("什么是进程间通信(IPC)？有哪些方式？", "medium", "进程间通信方式：1.管道(匿名/命名) 2.消息队列 3.共享内存(最快) 4.信号量 5.信号 6.套接字(跨网络) 7.内存映射。选择标准：数据量、速度、是否跨机器。"),
    ("什么是僵尸进程和孤儿进程？", "easy", "僵尸进程：子进程结束但父进程未回收，显示为Z状态。解决：父进程调用wait/waitpid。孤儿进程：父进程先退出，子进程被init(1号进程)收养。"),
    ("什么是死锁？四个必要条件？如何预防？", "medium", "死锁：多个进程互相等待对方资源而永久阻塞。四条件：1.互斥 2.占有且等待 3.不可抢占 4.循环等待。预防：破坏任一条件。银行家算法避免死锁。"),
    ("什么是虚拟内存？工作原理？", "medium", "虚拟内存让每个进程拥有独立的地址空间。MMU将虚拟地址翻译为物理地址。页表存储映射关系。TLB加速翻译。缺页中断时从磁盘加载页面。好处：隔离、超量使用、简化编程。"),
    ("什么是分页和分段？区别？", "easy", "分页：固定大小页面，物理单位，由OS管理，减少外部碎片。分段：逻辑单位(代码/数据/栈)，用户可见，便于共享和保护。段页式结合两者优点。"),
    ("什么是页面置换算法？常见算法？", "medium", "当内存满时选择换出哪个页面。算法：1.FIFO先进先出(可能Belady异常) 2.LRU最近最少使用 3.CLFU时钟算法 4.OPT最优(理论)。LRU实现：计数器/栈/引用位。"),
    ("什么是用户态和内核态？切换开销？", "easy", "CPU两种执行级别：用户态(受限)和内核态(特权)。系统调用触发用户态->内核态切换。上下文保存/恢复、TLB刷新等造成开销。频繁系统调用影响性能。"),
    ("什么是IO多路复用？select/poll/epoll区别？", "hard", "IO多路复用同时监听多个fd。select：fd_set限制1024，O(n)遍历。poll：链表无限制，O(n)。epoll：红黑树+就绪链表，O(1)，ET/LT模式。Linux首选epoll。"),
    ("什么是零拷贝(Zero Copy)？应用场景？", "medium", "零拷贝避免数据在内核态和用户态之间复制。技术：mmap+write、sendfile、splice、DMA。应用：Kafka、Nginx静态文件、文件传输。减少CPU和内存带宽消耗。"),
    ("什么是COW(Copy On Write)？", "easy", "写时复制：父子进程初始共享相同物理页面，任一方写入时才复制页面。fork()使用COW优化性能。节省内存，加快进程创建速度。"),
    ("什么是NUMA架构？对性能的影响？", "hard", "非统一内存访问：每个CPU有本地内存，访问远程内存更慢。影响：内存分配策略(numactl)、线程与内存亲和性、GC在NUMA节点间分布不均导致延迟毛刺。"),
    ("什么是大页内存(Huge Pages)？", "medium", "大页：2MB或1GB的页面替代默认4KB。减少TLB miss，提高内存密集型应用性能。配置：/proc/sys/vm/nr_hugepages。Java -XX:+UseLargePages。数据库常用。"),
    ("什么是IO调度器？CFQ/Noop/Deadline？", "medium", "IO调度器决定块设备请求顺序。Noop：FIFO，适合SSD/VM。Deadline：保证请求截止时间。CFQ：公平分配带宽，适合桌面。BFQ/MQ-Deadline是现代替代。"),
    ("什么是cgroup？用途？", "medium", "cgroup限制、记录和隔离进程组资源使用。子系统：cpu/memory/blkio/net_pids/freezer。Docker/K8s基于cgroup实现容器资源限制。v2版本统一层级结构。"),
    ("什么是namespace？类型？", "medium", "namespace隔离进程视图。类型：PID(进程ID)、NET(网络)、MNT(挂载)、IPC、UTS(主机名)、USER(UID/GID)。Docker容器基于namespace实现隔离。unshare命令创建新namespace。"),
    ("什么是OOM Killer？调优方法？", "medium", "OOM Killer在内存耗尽时选择进程杀掉释放内存。评分依据：内存占用、运行时间、oom_score_adj(可调整)。保护关键进程：echo -1000 > /proc/PID/oom_score_adj。"),
    ("什么是swap？何时使用？", "easy", "swap是磁盘上的交换空间，用于扩展内存。swappiness控制使用倾向(0-100)。数据库通常关闭swap。适当swap可防止OOM但增加延迟。SSD上比HDD好。"),
    ("什么是软链接和硬链接？区别？", "easy", "硬链接：同一inode的不同文件名，不能跨文件系统，不能链接目录。软链接(符号链接)：独立文件存储目标路径，可以跨文件系统和链接目录，目标删除后失效。"),
    ("什么是inotify？应用场景？", "medium", "inotify监控文件系统事件(创建/修改/删除)。API：inotify_init/inotify_add_watch/read。工具：inotifywait。应用：热加载配置、自动构建、文件同步。替代轮询。"),
    ("什么是epoll的ET和LT模式？", "hard", "LT(Level Triggered)：默认模式，只要缓冲区有数据就一直通知。ET(Edge Triggered)：只在状态变化时通知一次，必须一次性读完所有数据(非阻塞IO+循环读取)。ET效率更高但编程复杂。"),
    ("什么是异步IO(AIO/io_uring)？", "hard", "异步IO：发起IO请求后不阻塞等待完成回调。Linux AIO主要用于direct IO。io_uring(Linux 5.1+)是新一代异步IO接口，提交和完成队列在共享内存中，syscall少，高性能。"),
    ("什么是RCU(Read-Copy-Update)？", "hard", "RCU是一种同步机制：读操作无锁，写操作复制修改后原子替换旧版本。读者不需要锁，通过grace period保证安全。Linux内核广泛使用：路由表、dentry、NFS。读多写少场景极佳。"),
    ("什么是futex？", "medium", "futex(Fast Userspace Mutex)：用户态快速路径+内核态慢速路径。无竞争时仅在用户态操作(原子变量)，有竞争时进入内核等待。pthread_mutex底层使用futex。减少不必要的内核调用。"),
    ("什么是mmap？和普通read/write的区别？", "medium", "mmap将文件映射到进程地址空间。读写像操作内存一样，OS负责页面调入写出。优势：1.避免用户态内核态拷贝 2.多次读取只需一次copy 3.进程间共享内存。缺点：映射粒度是页。"),
]

for i, (title, diff, answer) in enumerate(os_more):
    all_new_questions.append({
        'id': f'os-more-{i+1}',
        'title': title,
        'category': 'os',
        'difficulty': diff,
        'content': answer[:150],
        'answer': answer,
        'sourceType': 'builtin',
        'source': '操作系统面试题',
        'tags': ['操作系统'],
    })

print(f"OS more: {len(os_more)}")

# ============== LANGUAGE: Need ~100 more ==============
lang_more = [
    ("Java的synchronized原理？锁升级过程？", "hard", "synchronized基于对象头Mark Word和Monitor。锁升级：偏向锁(无竞争)->轻量级锁(CAS自旋)->重量级锁(OS互斥锁)。偏向锁默认延迟开启(-XX:BiasedLockingStartupDelay=4)。JDK15弃用偏向锁。"),
    ("Java的Volatile关键字？可见性和有序性？", "hard", "volatile保证：1.可见性：写立即刷新到主存，读从主存读取 2.有序性：禁止指令重排序(Memory Barrier)。不保证原子性(i++不行)。适用场景：状态标志、单例双重检查(DCL)。"),
    ("Java的ThreadLocal原理？内存泄漏问题？", "medium", "ThreadLocal为每个线程维护独立变量副本。内部ThreadLocalMap以ThreadLocal为key，Entry继承WeakReference。泄漏原因：ThreadLocal被GC但Entry.value强引用未清除。解决方案：finally中remove()。"),
    ("Java的线程池参数？拒绝策略？", "medium", "ThreadPoolExecutor参数：corePoolSize/maxPoolSize/keepAliveTime/unit/workQueue/threadFactory/handler。队列：ArrayBlockingQueue/LinkedBlockingQueue/SynchronousQueue。拒绝：AbortPolicy/CallerRunsPolicy/DiscardOldestPolicy/DiscardPolicy。"),
    ("Java的CAS？ABA问题及解决？", "medium", "CAS(Compare And Swap)：比较并交换，乐观锁实现。Unsafe类提供compareAndSwap。ABA问题：值A->B->A，CAS误判未变。解决：版本号(AtomicStampedReference)。LongAdder用分段CAS提高吞吐。"),
    ("Java的HashMap源码分析？扩容机制？", "hard", "HashMap数组+链表+红黑树(JDK8+)。put流程：hash->定位桶->遍历链表/树->插入/替换。扩容threshold=capacity*loadFactor，2倍扩容rehash。JDK8尾插法避免循环链表。红黑树化阈值8，退化阈值6。"),
    ("Java的ConcurrentHashMap源码？JDK7 vs JDK8？", "hard", "JDK7：Segment分段锁(ReentrantLock)，每个Segment独立锁。JDK8：Node数组+CAS+synchronized锁桶节点，锁粒度更细。size()计算使用CounterCell分散计数。不支持null key/value。"),
    ("Java的AQS(AbstractQueuedSynchronizer)？", "hard", "AQS是并发包基础框架。核心：state volatile变量 + CLH双向队列。独占(acquire/release)和共享(acquireShared/releaseShared)。ReentrantLock/Semaphore/CountDownLatch都基于AQS。模板方法模式。"),
    ("Java的反射机制？性能和安全？", "medium", "反射在运行时获取类信息并操作对象。Class.forName/getMethod/invoke。性能问题：跳过编译优化、参数装箱、安全检查。安全：setAccessible(true)绕过检查。应用：Spring IOC、JSON序列化、动态代理。"),
    ("Java的动态代理？JDK Proxy vs CGLIB？", "medium", "JDK Proxy：基于接口，InvocationHandler.invoke()。CGLIB：基于继承，MethodInterceptor.intercept()，无法代理final类和方法。Spring AOP默认JDK接口用Proxy，类用CGLIB。JDK17需开启--add-opens。"),
    ("Java的异常体系？Checked vs Unchecked？", "easy", "Throwable->Error(不可恢复)和Exception。Exception->RuntimeException(Unchecked)和非RuntimeException(Checked)。Checked必须处理(try-catch/throws)，Unchecked可不处理。自定义异常继承相应基类。"),
    ("Java的序列化？Serializable vs Externalizable？", "medium", "Serializable：标记接口，自动序列化所有字段(transient除外)。Externalizable：手动控制序列化(writeExternal/readExternal)。serialVersionUID用于版本兼容。Jackson/Gson更灵活的JSON序列化替代。"),
    ("Java的NIO？BIO/NIO/AIO对比？", "medium", "BIO：同步阻塞，一连接一线程。NIO：同步非阻塞，Selector多路复用，Buffer+Channel。AIO：异步非阻塞，Proactor模式。Netty基于NIO(Epoll)封装。NIO适合高连接低延迟场景。"),
    ("Java的JVM内存模型？运行时数据区？", "medium", "JVM运行时数据区：堆(对象实例)、栈(栈帧/局部变量表/操作数栈)、程序计数器、本地方法栈、方法区(元空间/JDK8+)。直接内存(Direct Memory)不受GC管理。-Xms/-Xmx设置堆大小。"),
    ("Java的垃圾收集算法？标记清除/复制/标记整理？", "medium", "标记清除：两阶段，产生碎片。复制：Survivor区，浪费一半空间，无碎片。标记整理：移动存活对象，无碎片但成本高。分代收集：新生代用复制，老年代用标记整理/混合。G1/ZGC/Shenandoah现代GC。"),
    ("Java的垃圾收集器？Serial/Parallel/CMS/G1/ZGC？", "hard", "Serial：单线程STW。Parallel Scavenge：多线程吞吐优先。CMS：并发标记清除，低停顿已废弃。G1：Region划分，可控停顿时间，默认推荐。ZGC(JDK11+)：<10ms停顿，TB级堆。Shenandoah：类似ZGC。选择依据：堆大小、停顿要求。"),
    ("Java的类加载器？双亲委派模型？", "medium", "类加载器层次：Bootstrap(启动)->Extension(平台)->Application(系统)->Custom。双亲委派：子加载器先委托父加载器加载。打破场景：SPI(ThreadContextClassLoader)、Tomcat、热部署。defineClass加载字节码。"),
    ("Java的字节码？字节码指令？", "medium", "字节码是JVM执行的指令集(.class文件)。常量池、字段表、方法表、属性表。常见指令：iconst/load/store(变量)、if/icmp(条件)、invokevirtual/interface/static/dynamic(方法调用)、new/getfield/putfield(对象)。javap -c查看字节码。"),
    ("Java的JIT编译？分层编译？", "medium", "JIT将热点字节码编译为机器码。分层编译(TieredCompilation)：Tier0解释执行->Tier3 C1编译(Tier1/Tier Profile)->Tier4 C2编译(完全优化)。-XX:+PrintCompilation查看编译日志。OSR(On Stack Replacement)栈上替换。"),
    ("Java的内存屏障(Memory Barrier)？", "hard", "内存屏障确保特定顺序的内存操作。LoadLoad/StoreStore/LoadStore/StoreLoad四种屏障。volatile写前插入StoreStore后插入StoreLoad。Unsafe.loadFence/storeFence/fullFence。硬件层面对应x86的mfence/lfence/sfence指令。"),
    ("Java的String.intern()？字符串常量池？", "medium", "intern()将字符串放入字符串常量池，返回池中引用。JDK6：永久代(PermGen)，JDK7+：堆。常量池：字面量和intern()字符串。String s = new String(\"abc\")创建两个对象。-XX:StringTableSize调整大小。"),
    ("C++的智能指针？unique_ptr/shared_ptr/weak_ptr？", "medium", "unique_ptr：独占所有权，不可拷贝可移动。shared_ptr：共享所有权，引用计数控制生命周期，线程安全引用计数但非对象。weak_ptr：弱引用，不增加计数，解决循环引用。make_unique/make_shared创建。"),
    ("C++的右值引用？移动语义？完美转发？", "hard", "右值引用(T&&)绑定临时对象。std::move将左值转为右值引用。移动构造/赋值转移资源而非拷贝。完美转发std::forward<T>()保持值类别。引用折叠规则：T& &&→T&，T&& &&→T&&。"),
    ("C++的Lambda表达式？捕获列表？", "medium", "Lambda：[capture](params)->ret {body}。捕获：[=]值捕获 [&]引用捕获 [this]指针 [var]指定变量。mutable修饰允许修改值捕获副本。本质是匿名functor对象，operator()重载。"),
    ("C++的STL容器？vector/list/deque/map/unordered_map？", "medium", "vector：连续数组，随机访问O(1)，尾部插入O(1)均摊，扩容O(n)。list：双向链表，任意位置O(1)插入删除，无随机访问。deque：分段连续，两端O(1)。map：红黑树O(log n)。unordered_map：哈希表O(1)平均。"),
    ("C++的多态？虚函数表(vtable)？", "medium", "多态通过虚函数实现。含虚函数的类有vptr指向vtable。vtable存储虚函数地址。构造函数中vptr逐步初始化。析构函数应为virtual否则delete基类指针不会调用子类析构。纯虚函数=0抽象类。"),
    ("Python的GIL(Global Interpreter Lock)？", "hard", "GIL是CPython的全局解释器锁，同一时刻只有一个线程执行Python字节码。原因：CPython内存管理非线程安全。影响：CPU密集型多线程无法并行，IO密集型不受限。绕过：multiprocessing/C扩展/ctypes释放GIL。"),
    ("Python的装饰器(decorator)？带参数装饰器？", "medium", "装饰器：接收函数返回新函数的函数。@语法糖。@functools.wraps保留原函数属性。带参数装饰器：三层嵌套，外层接收参数返回装饰器。应用：缓存/认证/日志/计时/单例。"),
    ("Python的生成器(generator)？yield/yield from？", "medium", "生成器：含yield的函数，惰性计算，节省内存。__next__()驱动执行。yield from(Python 3.3)委托给子生成器。send(value)向生成器传值。协程(async/await)基于生成器演化。"),
    ("Go的goroutine？调度器(GMP)模型？", "hard", "goroutine：轻量级线程，2-4KB栈初始，go()启动。GMP模型：G(goroutine)-M(machine OS线程)-P(processor逻辑处理器)。调度：work stealing、hand off、preemption(基于函数调用)。runtime.GOMAXPROCS设置P数量。"),
    ("Go的channel？缓冲和无缓冲？", "medium", "channel：goroutine间通信。make(chan T, size)。无缓冲(size=0)：同步，发送方阻塞直到接收方就绪。缓冲：异步，缓冲满才阻塞。select多路复用。单向channel chan<- T/<-chan T。"),
    ("Go的interface？nil interface？", "medium", "interface：隐式实现，duck typing。eface空接口(any)，iface非空接口(itab+data)。nil interface：type=nil且data=nil。type非data=nil != 完全nil。type assertion.(Type)/comma ok模式。reflect判断实际类型。"),
    ("Go的slice vs array？append底层？", "easy", "array：固定长度值类型。slice：动态长度引用类型，指向底层数组。cap容量len长度。append超出cap时扩容(1.25倍，<1024时2倍)。切片共享底层数组，修改互相影响。copy()避免。[:]切片操作。"),
    ("Rust的所有权(Ownership)？借用(Borrowing)？生命周期(Lifetime)？", "hard", "所有权：每个值有唯一owner，owner离开作用域值被释放。Move语义：赋值/传参转移所有权。借用：&T不可变借用(任意多个)，&mut T可变借用(唯一)。生命周期：标注引用有效范围，'a语法。编译时保证内存安全，无需GC。"),
    ("Rust的错误处理？Result<T,E> vs Option<T>？", "medium", "Result<T,E>：Ok(T)成功或Err(E)失败。?运算符传播错误。unwrap/expect提取值(panic on Err)。Option<T>：Some(T)或None，处理可能缺失的值。thiserror/anyhow库简化错误处理。"),
    ("Rust的迭代器(Iterator)？适配器和消费者？", "medium", "Iterator trait：fn next(&mut self) -> Option<Item>。适配器(懒执行)：map/filter/take/skip/chain/zip/enumerate/cloned/flatten。消费者(执行)：collect/for_each/fold/count/any/all/find/last/partition。for循环语法糖。"),
    ("什么是JIT编译？AOT编译？", "medium", "JIT(Just-In-Time)：运行时将字节码/中间代码编译为机器码。热点代码编译优化。Java JVM、JavaScript V8使用JIT。AOT(Ahead-Of-Time)：编译时直接生成机器码。Go/Rust/C++使用AOT。JIT比解释快比AOT灵活。WASM支持两种。"),
    ("什么是GC调优？垃圾收集器选择？", "hard", "JVM GC调优：-Xms/-Xmx堆大小、-XX:+UseG1GC选择收集器、-XX:MaxGCPauseMillis目标暂停时间。工具：jstat、jmap、GCViewer、VisualVM。G1平衡吞吐和停顿。ZGC低停顿(<10ms)。Serial小堆。Parallel高吞吐。CMS已废弃。"),
    ("什么是内存模型(Memory Model)？", "hard", "内存模型定义多线程访问内存的规则。Java Memory Model：happens-before关系保证可见性。volatile、synchronized、final建立happens-before。C++ Memory Model：6种内存序relaxed/acquire/release/acq_rel/seq_cst/consume。用于无锁编程。"),
    ("什么是协程(Coroutine)？Green Thread？", "medium", "协程：用户态轻量级线程，由程序控制切换不需内核参与。Python asyncio、Go goroutine、Kotlin协程、Lua coroutine。比OS线程开销小(栈KB vs MB)，适合IO密集型。Green Thread：运行时管理的用户态线程(JVM早期、Go runtime)。"),
    ("什么是Actor模型？Erlang/Akka？", "medium", "Actor模型：每个Actor有独立状态和邮箱，通过消息通信，不共享内存。Erlang/OTP原生支持。Akka(JVM)：Supervision策略监管、Let It Crash哲学。优点：无锁并发天然安全、容错、分布式透明。缺点：消息传递调试难、开销。"),
    ("什么是CSP模型？Go channel？", "medium", "CSP(Communicating Sequential Processes)：通过通道(channel)通信，不共享内存。Tony Hoare提出。Go语言基于CSP设计。goroutine+channel组合。vs Actor：channel是第一类对象可独立存在，Actor mailbox属于特定actor。"),
    ("什么是尾递归优化(TCO)？", "medium", "尾递归：递归调用是函数最后操作。编译器优化为跳转不增加栈帧。Haskell/Scala/Erlang/Kotlin支持。Python/Java/JavaScript(严格模式部分)不支持。ES6规定tail calls但浏览器实现不一致。解决递归栈溢出的重要技术。"),
    ("什么是模式匹配(Pattern Matching)？", "medium", "模式匹配：检查数据结构是否符合模式并解构。Rust match/Scala case/ Haskell pattern/ Python 3.10 match。比switch更强：解构、守卫(guard)、嵌套、类型检查。编译器穷举性检查(exhaustiveness)。代数数据类型(ADT)配合使用。"),
    ("什么是代数数据类型(ADT)？Sum/Product Type？", "medium", "ADT：类型组合方式。Product Type(积类型)：AND关系，struct/tuple，字段全有。Sum Type(和类型)：OR关系，enum/tagged union，取其一。Rust enum是Sum Type(最强枚举)。Haskell data声明ADT。TypeScript discriminated union模拟。领域建模利器。"),
    ("什么是类型推导(Type Inference)？", "medium", "类型推导：编译器自动推断表达式类型无需显式标注。Haskell Hindley-Milner全推导。C++ auto、Java var(局部)、Go := (短变量声明)、Kotlin val/var、TypeScript let/const。减少冗余但需权衡可读性。依赖注入/泛型时类型标注仍需。"),
    ("什么是高阶函数(Higher-Order Function)？", "easy", "高阶函数：接收函数作为参数或返回函数。map/filter/reduce/sort/forEach都是高阶函数。闭包(closure)/lambda(λ)是匿名函数。函数组合(function composition)：f∘g = f(g(x))。柯里化(currying)：多元函数转为一元函数链。一等公民(first-class function)。"),
    ("什么是单子(Monad)？", "hard", "Monad：函数式编程抽象，可链式操作包装值。两个操作：return(纯值包装入上下文)和bind(>>= 或 flatMap，链式传递计算)。Maybe/Option(空值处理)、List(多值)、IO(副作用)、Promise(异步)都是Monad。Haskell基础。"),
    ("什么是不可变数据结构(Immutable Data Structure)？", "medium", "不可变：创建后不能修改。修改操作返回新副本(结构共享structural sharing)。优势：线程安全无需锁、可缓存(hash不变)、易推理(引用透明)、时间旅行调试。Clojure/Haskell/Immutable.js默认不可变。持久化数据结构(Persistent DS)高效实现。"),
    ("什么是惰性求值(Lazy Evaluation)？", "medium", "惰性求值：表达式只在需要结果时才计算。Haskell默认惰性(非严格语义)。Python generator/yield、Java Stream.lazy()、RxJS Observable。优势：无限数据结构( range/infinite list)、避免不必要计算、短路求值(short-circuit)。劣势：内存泄漏( thunk堆积)、空间泄漏、性能难预测。"),
    ("什么是动态分发(Dynamic Dispatch)和静态分发(Static Dispatch)？", "medium", "静态分发：编译时确定具体类型调用，泛型/模板/内联，零额外开销(单态化monomorphization)。动态分发：运行时通过vtable/字典查找，虚函数/dyn Trait/interface{}，有间接调用开销。Rust impl Trait(静态) vs dyn Trait(动态)。C++模板(静态) vs 虚函数(动态)。"),
    ("什么是零成本抽象(Zero-Cost Abstraction)？", "medium", "零成本抽象：Bjarne Stroustrup提出'你不需要为你不用的功能付费'。高级抽象在编译时优化掉不引入运行时开销。Rust迭代器编译为手写循环般高效、C++模板STL、Go interface内联小接口。需要编译器强大优化能力。"),
    ("什么是ABI(Application Binary Interface)稳定性？", "medium", "ABI：编译后的二进制接口规范。C ABI最稳定(调用约定/布局/名称修饰标准化)。C++ ABI不稳定(name mangling不同编译器不同)。Rust暂无稳定ABI( editions可能改变)。跨语言互操作用C ABI( FFI)。Swift ABI稳定( Swift 5+)。WebAssembly定义稳定ABI。"),
    ("什么是增量编译(Incremental Compilation)？", "medium", "增量编译：只重新编译源码中实际变化的部分及其依赖。Rust Cargo、Go build(本身快)、Gradle Java增量。好处：开发时大幅减少等待时间(秒级而非分钟级)。挑战：正确跟踪依赖关系( fine-grained dependency tracking)。沙盒构建( sandboxing)保证正确性。"),
    ("什么是交叉编译(Cross Compilation)？", "medium", "交叉编译：在一个平台上生成另一个平台的可执行文件。Go：GOOS(Go Operating System)+GOARCH(Go Architecture)环境变量。Rust：--target triple(如aarch64-unknown-linux-gnu)。C/C++：Toolchain( toolchain file)。应用：嵌入式开发( ARM/ RISC-V)、移动端( iOS/ Android)、IoT设备。Docker多阶段构建(multi-stage build)简化。"),
    ("什么是LSP(Language Server Protocol)？", "easy", "LSP：微软2016年定义的编辑器-语言服务器通信协议(JSON-RPC)。统一了自动补全(completion)、跳转定义(definition/find references)、诊断(diagnostics/ lint)、悬停信息(hover/rename)等功能。VS Code基于LSP生态繁荣。各语言实现LSP Server。DAP(Debug Adapter Protocol)是其调试版。"),
    ("什么是依赖注入(Dependency Injection)？IoC容器？", "medium", "DI：依赖从外部注入而非内部创建(new)。方式：构造器注入(constructor injection最佳实践)、setter注入、接口注入。IoC(Inversion of Control)容器自动管理对象生命周期和依赖关系。Spring IoC( Java)、Angular DI( TypeScript)、Guice( Google)。降低耦合、提高可测试性( mock方便)。"),
    ("什么是SOLID原则？", "medium", "SOLID五原则：S-SRP单一职责(一个类一个原因变化)、O-OCP开闭(对扩展开放对修改关闭)、L-LSP里氏替换(子类可替换基类)、I-ISP接口隔离(小接口优于大接口)、D-DIP依赖反转(依赖抽象不依赖具体)。Robert C. Martin( Uncle Bob)提出。面向对象设计基石。Clean Architecture体现。"),
    ("什么是设计模式(Design Pattern)？GoF？", "medium", "GoF(Gang of Four)23种设计模式分三类：创建型(Singleton/Factory Method/Abstract Factory/Builder/Prototype对象创建)、结构型(Adapter/Bridge/Composite/Decorator/Facade/Flyweight/Proxy类/对象组合)、行为型(Chain of Responsibility/Command/Iterator/Mediator/Memento/Observer/State/Strategy/Template Method/Visitor对象职责分配)。不是银弹，适度使用。"),
    ("什么是DDD(Domain-Driven Design)？核心概念？", "hard", "DDD：Eric Evans提出，面向领域的软件设计方法论。战略设计：限界上下文(Bounded Context，模型边界)、上下文映射(Context Mapping)、核心域(Core Domain)。战术设计：实体(Entity)、值对象(Value Object)、聚合根(Aggregate Root)、领域服务(Domain Service)、领域事件(Domain Event)、仓储(Repository)、工厂(Factory)。通用语言(Ubiquitous Language)至关重要。Event Storming协作建模。"),
    ("什么是CQRS(Command Query Responsibility Segregation)？", "hard", "CQRS：命令查询职责分离。Command(写操作)和Query(读操作)使用不同模型/存储。写模型保证一致性(CRUD+验证)，读模型优化查询(反范式/预聚合/物化视图)。通常最终一致(Eventual Consistency)。Greg Young提出。适合读远多于写的系统(报表/搜索/仪表盘)。增加复杂度需权衡。"),
    ("什么是Event Sourcing(事件溯源)？", "hard", "Event Sourcing：持久化所有状态变更事件(Domain Event)而非当前状态。当前状态通过重放(replay)事件流重建。Event Store专门存储事件。Snapshot定期保存状态点避免从头重放。优势：完整审计轨迹(Audit Trail)、时间旅行调试(Time Travel Debugging)、自然解耦。挑战：Schema演进、事件量增长、学习曲线。Martin Fowler推广。"),
]

for i, (title, diff, answer) in enumerate(lang_more):
    all_new_questions.append({
        'id': f'lang-more-{i+1}',
        'title': title,
        'category': 'language',
        'difficulty': diff,
        'content': answer[:150],
        'answer': answer,
        'sourceType': 'builtin',
        'source': '编程语言面试题',
        'tags': ['编程语言'],
    })

print(f"Language more: {len(lang_more)}")

# Save to temp file for now, we'll inject later
import json as json_module

with open('temp_new_questions.json', 'w', encoding='utf-8') as f:
    json_module.dump(all_new_questions, f, ensure_ascii=False, indent=2)

print(f"Total new questions prepared: {len(all_new_questions)}")
print("Run inject script to add them to index.html")
