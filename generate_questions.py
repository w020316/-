import requests
import json
import time

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    'Accept': 'application/json',
    'Referer': 'https://leetcode.cn/problemset/all/',
    'Origin': 'https://leetcode.cn',
}

tag_map = {
    'array': 'algorithm', 'hash-table': 'algorithm', 'linked-list': 'algorithm',
    'math': 'algorithm', 'two-pointers': 'algorithm', 'sliding-window': 'algorithm',
    'stack': 'algorithm', 'queue': 'algorithm', 'heap': 'algorithm',
    'greedy': 'algorithm', 'dynamic-programming': 'algorithm',
    'divide-and-conquer': 'algorithm', 'backtracking': 'algorithm',
    'tree': 'algorithm', 'binary-tree': 'algorithm', 'binary-search-tree': 'algorithm',
    'graph': 'algorithm', 'depth-first-search': 'algorithm', 'breadth-first-search': 'algorithm',
    'binary-search': 'algorithm', 'sort': 'algorithm', 'recursion': 'algorithm',
    'trie': 'algorithm', 'monotonic-stack': 'algorithm', 'bit-manipulation': 'algorithm',
    'memoization': 'algorithm', 'string': 'algorithm', 'combinatorics': 'algorithm',
    'number-theory': 'algorithm', 'geometry': 'algorithm', 'randomized': 'algorithm',
    'interactive': 'algorithm', 'counting': 'algorithm', 'brainteaser': 'algorithm',
    'merge-sort': 'algorithm', 'quickselect': 'algorithm', 'bucket-sort': 'algorithm',
    'topological-sort': 'algorithm', 'minimum-spanning-tree': 'algorithm',
    'shortest-path': 'algorithm', 'union-find': 'algorithm', 'segment-tree': 'algorithm',
    'binary-indexed-tree': 'algorithm', 'line-sweep': 'algorithm',
    'rolling-hash': 'algorithm', 'suffix-array': 'algorithm', 'radix-sort': 'algorithm',
    'shell': 'os', 'concurrency': 'os', 'multithreading': 'os',
    'database': 'database', 'sql': 'database',
    'design': 'system-design', 'system-design': 'system-design',
    'javascript': 'frontend', 'html': 'frontend', 'css': 'frontend',
    'react': 'frontend', 'vue': 'frontend',
}

diff_map = {'Easy': 'easy', 'Medium': 'medium', 'Hard': 'hard'}

# LeetCode category slugs for filtering
lc_categories = {
    'algorithm': '',
    'database': 'database',
    'shell': 'shell',
    'concurrency': 'concurrency',
}

all_questions = []
seen_ids = set()

# Fetch from LeetCode by category
for cat_name, cat_slug in lc_categories.items():
    print(f"\nFetching category: {cat_name} (slug: {cat_slug})")
    skip = 0
    count = 0
    while count < 250:
        query = """
        query problemsetQuestionList($categorySlug: String, $limit: Int, $skip: Int, $filters: QuestionListFilterInput) {
            problemsetQuestionList: questionList(categorySlug: $categorySlug, limit: $limit, skip: $skip, filters: $filters) {
                total questions {
                    questionFrontendId title titleCn titleSlug difficulty acRate isPaidOnly
                    topicTags { name nameTranslated slug }
                }
            }
        }
        """
        variables = {'categorySlug': cat_slug, 'limit': 50, 'skip': skip, 'filters': {}}
        try:
            resp = requests.post('https://leetcode.cn/graphql/', json={'query': query, 'variables': variables}, headers=headers, timeout=15)
            data = resp.json()
            questions = data.get('data', {}).get('problemsetQuestionList', {}).get('questions', [])
            total = data.get('data', {}).get('problemsetQuestionList', {}).get('total', 0)
            
            if not questions:
                break
            
            for q in questions:
                if q.get('isPaidOnly', False):
                    continue
                qid = f"lc-{q['questionFrontendId']}"
                if qid in seen_ids:
                    continue
                seen_ids.add(qid)
                
                tags = q.get('topicTags', [])
                tag_names = [t.get('nameTranslated') or t.get('name', '') for t in tags[:5]]
                title = q.get('titleCn') or q.get('title', '')
                
                # Determine category from tags
                mapped_cat = cat_name
                for t in tags:
                    slug = t.get('slug', '')
                    if slug in tag_map:
                        mapped_cat = tag_map[slug]
                        break
                
                all_questions.append({
                    'id': qid,
                    'title': f"LC{q['questionFrontendId']}: {title}",
                    'category': mapped_cat,
                    'difficulty': diff_map.get(q.get('difficulty', 'Medium'), 'medium'),
                    'content': f"LeetCode #{q['questionFrontendId']}\nhttps://leetcode.cn/problems/{q['titleSlug']}/\n通过率: {(q.get('acRate', 0)*100):.1f}%",
                    'answer': '',
                    'sourceType': 'builtin',
                    'source': f"LeetCode #{q['questionFrontendId']}",
                    'tags': tag_names,
                })
                count += 1
            
            print(f"  Fetched {len(questions)} (skip={skip}), category total: {count}/{total}")
            if count >= total or count >= 250:
                break
            skip += 50
            time.sleep(0.5)
        except Exception as e:
            print(f"  Error: {e}")
            break

print(f"\nLeetCode total: {len(all_questions)}")

# Now add custom questions for categories that LeetCode doesn't cover well
# OS, Network, System Design, Frontend, Language, Scenario
custom_questions = []

# === Operating System Questions ===
os_questions = [
    ("进程与线程的区别是什么？", "easy", "进程是资源分配的基本单位，线程是CPU调度的基本单位。进程拥有独立的地址空间，线程共享所属进程的地址空间。进程间通信需要IPC机制，线程间可以直接共享数据。进程创建开销大，线程创建开销小。"),
    ("什么是死锁？产生死锁的四个必要条件？", "medium", "死锁是指两个或多个进程无限期地等待对方所占用的资源。四个必要条件：1.互斥条件 2.占有并等待 3.不可抢占 4.循环等待。预防死锁的方法：破坏四个条件之一。"),
    ("虚拟内存的原理是什么？", "medium", "虚拟内存使得程序可以使用比物理内存更大的地址空间。通过页表将虚拟地址映射到物理地址，当访问的页面不在物理内存中时产生缺页中断，由操作系统将所需页面从磁盘调入内存。"),
    ("常见的页面置换算法有哪些？", "medium", "1.OPT最优置换（理论算法）2.FIFO先进先出 3.LRU最近最少使用 4.Clock时钟算法 5.LFU最不经常使用。LRU性能最好但开销大，Clock是LRU的近似算法。"),
    ("进程间通信（IPC）的方式有哪些？", "medium", "1.管道(pipe) 2.命名管道(FIFO) 3.消息队列 4.共享内存 5.信号量 6.套接字(socket) 7.信号(signal)。共享内存速度最快，套接字可用于跨网络通信。"),
    ("什么是用户态和内核态？如何切换？", "easy", "用户态是应用程序运行的状态，只能访问受限资源。内核态是操作系统内核运行的状态，可以访问所有资源。切换方式：系统调用、中断、异常。切换时需要保存上下文。"),
    ("信号量与互斥锁的区别？", "medium", "互斥锁用于互斥，同一时刻只允许一个线程访问临界区，值只能为0或1。信号量用于同步，可以允许多个线程同时访问，值可以为非负整数。信号量可以用于解决生产者-消费者问题。"),
    ("常见的进程调度算法有哪些？", "medium", "1.FCFS先来先服务 2.SJF短作业优先 3.优先级调度 4.时间片轮转 5.多级反馈队列。多级反馈队列综合了多种算法的优点，是大多数操作系统的默认调度算法。"),
    ("什么是缓冲区溢出？如何防止？", "hard", "缓冲区溢出是向缓冲区写入超过其容量的数据，覆盖相邻内存。防止方法：1.边界检查 2.使用安全函数(strncpy替代strcpy) 3.栈保护(canary) 4.ASLR地址空间随机化 5.DEP/NX数据执行保护。"),
    ("Linux文件系统的inode是什么？", "medium", "inode是索引节点，存储文件的元数据（权限、所有者、大小、时间戳、数据块指针等），不包含文件名。文件名存储在目录项中。通过inode号可以定位文件数据。"),
    ("什么是写时复制(Copy-on-Write)？", "medium", "写时复制是一种优化技术，当进程fork时，子进程共享父进程的物理内存页，只有当某一方修改内存时才复制该页。这样可以减少内存使用和fork的开销。"),
    ("操作系统中断的处理流程？", "medium", "1.中断请求 2.中断响应（CPU完成当前指令）3.保存现场 4.中断处理（执行中断服务程序）5.恢复现场 6.中断返回。中断处理期间可能屏蔽其他中断。"),
    ("什么是内存映射文件(mmap)？", "medium", "mmap将文件映射到进程的虚拟地址空间，对映射区域的访问等同于对文件的读写。优点：避免用户态和内核态的数据拷贝，适合大文件操作和进程间共享。"),
    ("什么是守护进程(Daemon)？", "easy", "守护进程是后台运行的特殊进程，脱离终端控制。创建步骤：1.fork()创建子进程 2.父进程退出 3.setsid()创建新会话 4.关闭文件描述符 5.改变工作目录。如httpd、sshd。"),
]

# I'll generate comprehensive questions for each category programmatically
import random

# OS questions
os_topics = [
    ("进程的状态有哪些？", "easy", "进程有五种状态：创建、就绪、运行、阻塞、终止。就绪状态等待CPU调度，阻塞状态等待I/O或其他事件完成。"),
    ("什么是僵尸进程？如何处理？", "medium", "僵尸进程是子进程已终止但父进程未调用wait()回收其资源的进程。处理方法：1.父进程调用wait/waitpid 2.杀死父进程使子进程被init收养 3.使用signal(SIGCHLD, SIG_IGN)忽略。"),
    ("什么是孤儿进程？", "easy", "孤儿进程是父进程已终止而子进程仍在运行的进程。孤儿进程会被init进程(PID=1)收养，由init负责回收资源，不会造成危害。"),
    ("协程与线程的区别？", "medium", "协程是用户态的轻量级线程，由程序控制切换，不需要内核参与。线程由操作系统调度。协程切换开销极小，可以在一个线程内运行多个协程。Python的asyncio、Go的goroutine都是协程。"),
    ("什么是内存碎片？如何解决？", "medium", "内存碎片分为内部碎片和外部碎片。内部碎片是分配的内存大于所需，外部碎片是空闲内存总量足够但无法分配连续空间。解决方法：1.分页机制 2.紧凑(compaction) 3.伙伴系统 4.slab分配器。"),
    ("Linux的伙伴系统原理？", "hard", "伙伴系统将内存分为大小相等的块，每个块大小为2的幂次。分配时找到最小的合适块，释放时检查相邻块是否空闲，如果是则合并。优点：快速分配和释放，减少外部碎片。"),
    ("什么是slab分配器？", "hard", "slab分配器在伙伴系统之上，为内核对象提供高效缓存。每个slab包含多个相同类型的对象，分配和释放对象不需要初始化，提高了效率。适用于频繁创建和销毁的内核对象。"),
    ("描述Linux的启动过程？", "hard", "1.BIOS/UEFI自检 2.读取MBR/GPT引导 3.GRUB引导加载器 4.加载内核 5.内核初始化 6.启动init/systemd 7.执行系统服务 8.进入登录界面。"),
    ("什么是COW(Copy-On-Write)？应用场景？", "medium", "COW写时复制：fork时子进程共享父进程内存页，只有修改时才复制。应用：1.fork() 2.内存映射文件 3.快照 4.docker镜像层。"),
    ("Linux中什么是epoll？与select/poll的区别？", "hard", "epoll是Linux的高效I/O多路复用机制。select/poll每次调用需要传入所有fd，O(n)复杂度。epoll使用红黑树管理fd，事件驱动，O(1)通知就绪fd。epoll支持ET边缘触发和LT水平触发。"),
    ("什么是大页(HugePages)？", "medium", "大页是大于标准4KB的内存页(通常2MB或1GB)。优点：1.减少页表大小 2.减少TLB miss 3.提高大内存应用性能。适用于数据库等大内存应用。"),
    ("什么是NUMA架构？", "hard", "NUMA(非统一内存访问)架构中，每个CPU有本地内存，访问本地内存快于远程内存。操作系统需要考虑NUMA拓扑，尽量在本地内存分配，减少跨节点访问。"),
    ("描述Linux的进程地址空间布局？", "medium", "从低到高：1.代码段(.text) 2.数据段(.data/.bss) 3.堆(向上增长) 4.共享库映射区 5.栈(向下增长) 6.内核空间。可通过/proc/pid/maps查看。"),
    ("什么是RLimit？", "easy", "RLimit是Linux的资源限制机制，限制进程可以使用的系统资源。包括：CPU时间、文件大小、内存、打开文件数、进程数等。通过ulimit命令或setrlimit系统调用设置。"),
    ("Linux中软链接和硬链接的区别？", "easy", "硬链接：指向相同inode，删除原文件不影响，不能跨文件系统。软链接：指向文件路径，原文件删除后失效(悬空链接)，可以跨文件系统。ln创建硬链接，ln -s创建软链接。"),
    ("什么是零拷贝(Zero-copy)技术？", "hard", "零拷贝避免数据在内核态和用户态之间复制。方法：1.sendfile()直接在内核空间传输 2.mmap将文件映射到用户空间 3.splice在两个fd之间移动数据。用于高性能网络传输。"),
    ("什么是CFS调度器？", "hard", "CFS(完全公平调度器)是Linux默认的进程调度器。使用红黑树维护进程，每个进程有虚拟运行时间vruntime，CFS选择vruntime最小的进程运行。保证了所有进程的公平性。"),
    ("什么是RCU机制？", "hard", "RCU(Read-Copy-Update)是一种同步机制，读者不加锁直接访问，写者先复制再修改，等所有读者完成后再替换旧数据。适用于读多写少场景，如内核路由表。"),
    ("描述Linux的I/O栈？", "hard", "VFS -> 文件系统(ext4等) -> 块设备层 -> I/O调度器 -> 设备驱动 -> 硬件。I/O调度器合并和排序请求，常见调度器：CFQ、Deadline、noop、mq-deadline。"),
    ("什么是Namespace和Cgroup？", "medium", "Namespace提供资源隔离(PID/网络/文件系统/IPC等)，Cgroup提供资源限制(CPU/内存/IO等)。两者是Docker等容器技术的基础。"),
    ("Linux中如何查看系统性能？", "easy", "常用命令：top/htop(CPU和内存)、iostat(IO)、vmstat(虚拟内存)、netstat/ss(网络)、free(内存)、df(磁盘)、sar(综合性能)。"),
    ("什么是缺页中断？处理流程？", "medium", "访问的虚拟页不在物理内存中时产生缺页中断。处理流程：1.检查地址合法性 2.选择一个物理页(可能需要换出) 3.从磁盘读取页面 4.更新页表 5.重新执行指令。"),
    ("什么是TLB？TLB miss怎么处理？", "medium", "TLB(Translation Lookaside Buffer)是页表缓存，加速虚拟地址到物理地址的转换。TLB miss时需要访问内存中的页表，可能触发缺页中断。优化：大页、预取、软件管理TLB。"),
    ("什么是忙等待(Busy Waiting)？有什么问题？", "easy", "忙等待是循环检查条件是否满足，不释放CPU。问题：浪费CPU资源。应该使用阻塞等待(如信号量、条件变量)替代，让出CPU给其他进程。"),
    ("什么是自旋锁(Spinlock)？适用场景？", "medium", "自旋锁在获取锁失败时忙等待而不是睡眠。适用于：1.临界区很短 2.不能睡眠的场景(中断处理) 3.多处理器系统。不适用于长临界区和单处理器系统。"),
    ("什么是读写锁？", "medium", "读写锁允许多个读者同时访问，但写者独占。适用于读多写少场景。注意写者饥饿问题，可使用写者优先的读写锁。"),
    ("什么是乐观锁和悲观锁？", "medium", "悲观锁：假定冲突一定发生，先加锁再操作。乐观锁：假定冲突不发生，先操作再检查(版本号/CAS)。乐观锁适用于低冲突场景，减少锁开销。"),
    ("什么是ABA问题？如何解决？", "hard", "ABA问题：值从A变为B再变回A，CAS操作认为没有变化。解决方法：1.版本号(每次修改递增) 2.Double CAS(同时比较值和版本号)。"),
    ("什么是内存屏障(Memory Barrier)？", "hard", "内存屏障确保屏障前后的内存操作按序执行，防止CPU和编译器重排。类型：1.读屏障 2.写屏障 3.全屏障。用于多线程同步，保证内存可见性。"),
    ("描述Linux的启动参数？", "medium", "内核启动参数在GRUB中配置，常见参数：root(根文件系统)、init(初始进程)、ro/rw(只读/读写)、quiet(安静模式)、nomodeset(不设置图形模式)。"),
    ("什么是OOM Killer？", "medium", "OOM Killer在系统内存不足时选择进程杀死以释放内存。选择策略：基于oom_score，考虑进程内存使用、优先级、运行时间等。可通过/proc/pid/oom_adj调整。"),
    ("什么是perf工具？", "medium", "perf是Linux性能分析工具，基于事件采样。功能：1.CPU性能分析 2.缓存命中率 3.分支预测 4.系统调用追踪。常用命令：perf stat、perf record、perf report。"),
    ("什么是eBPF？", "hard", "eBPF(extended Berkeley Packet Filter)允许在内核中安全运行沙盒程序，无需修改内核源码。应用：网络过滤、性能监控、安全审计。Cilium、Falco等工具基于eBPF。"),
    ("什么是io_uring？", "hard", "io_uring是Linux 5.1+的高性能异步I/O框架。使用共享环形缓冲区，避免系统调用开销。支持批处理和零拷贝，性能优于aio和epoll。"),
    ("什么是cgroup v2？与v1的区别？", "medium", "cgroup v2统一了层级结构，所有控制器在同一层级。v1每个控制器独立层级。v2改进：1.统一层级 2.线程模式 3.更好的资源分配 4.压力通知机制。"),
    ("Linux中什么是KASLR？", "medium", "KASLR(Kernel Address Space Layout Randomization)在每次启动时随机化内核代码的加载地址，增加内核漏洞利用难度。是内核安全的重要机制。"),
    ("什么是可信执行环境(TEE)？", "hard", "TEE是处理器内的安全区域，保证内部代码和数据的机密性和完整性。如ARM TrustZone、Intel SGX。用于安全支付、DRM、密钥存储等场景。"),
    ("什么是容器运行时？runc和containerd的区别？", "medium", "runc是OCI标准的容器运行时，负责创建和运行容器。containerd是高级容器运行时，管理容器生命周期、镜像传输，调用runc运行容器。Docker内部使用containerd+runc。"),
    ("什么是seccomp？", "medium", "seccomp(Linux安全计算模式)限制进程可以调用的系统调用。两种模式：strict(只允许read/write/exit/sigreturn)和filter(BPF规则过滤)。用于沙盒和容器安全。"),
    ("什么是AppArmor和SELinux？", "hard", "都是Linux安全模块(LSM)，实现强制访问控制(MAC)。SELinux基于安全上下文策略，更严格但配置复杂。AppArmor基于路径，配置简单。容器常使用AppArmor限制访问。"),
    ("Linux中什么是cgroup的CPU份额？", "easy", "cpu.shares控制cgroup获得CPU时间的比例，默认1024。只在CPU竞争时生效，空闲时可以超过份额。cpu.cfs_quota_us和cpu.cfs_period_us可以设置绝对限制。"),
    ("什么是内存cgroup的OOM策略？", "medium", "memory.oom_control控制cgroup的OOM行为。oom_kill_disable=1禁用OOM killer，进程在超出限制时睡眠。memory.oom_control还显示OOM事件计数。"),
    ("Linux中什么是perf_event？", "hard", "perf_event是Linux内核提供的性能监控接口，支持硬件性能计数器(PMU)和软件事件。可以统计CPU周期、指令数、缓存命中/缺失等。是perf工具的底层接口。"),
    ("什么是ftrace？", "medium", "ftrace是Linux内核的追踪框架，可以追踪内核函数调用。功能：1.函数追踪 2.函数图追踪 3.事件追踪 4.动态追踪。通过debugfs/tracing接口使用。"),
    ("什么是SystemTap？", "hard", "SystemTap是Linux内核动态追踪工具，编写脚本在内核中插入探针。无需重新编译内核，可以实时收集内核运行信息。类似于DTrace。"),
    ("Linux中什么是netfilter？", "medium", "netfilter是Linux内核的网络过滤框架，在协议栈中设置钩子点。iptables/nftables基于netfilter实现防火墙功能。支持包过滤、NAT、mangle等。"),
    ("什么是VXLAN？", "medium", "VXLAN(Virtual eXtensible LAN)是网络虚拟化技术，在UDP上封装二层以太网帧。支持1600万个虚拟网络(VNI 24位)，用于数据中心和容器网络。"),
    ("什么是eBPF XDP？", "hard", "XDP(eXpress Data Path)在网卡驱动层运行eBPF程序，实现高性能包处理。比iptables快4-5倍。用于DDoS防护、负载均衡、防火墙。Cilium使用XDP实现网络策略。"),
    ("Linux中什么是cgroup freezer？", "easy", "cgroup freezer可以冻结和解冻cgroup中的所有进程。冻结的进程不会被调度，但状态保持不变。用于容器暂停、快照、迁移等场景。"),
    ("什么是PID namespace？", "easy", "PID namespace隔离进程ID空间，不同namespace中的进程可以有相同的PID。容器使用PID namespace实现进程隔离，容器内PID 1是容器init进程。"),
    ("什么是Mount namespace？", "easy", "Mount namespace隔离文件系统挂载点视图。每个namespace有自己的挂载点列表，挂载/卸载操作不影响其他namespace。容器使用它实现文件系统隔离。"),
    ("什么是Network namespace？", "easy", "Network namespace隔离网络资源：网络设备、IP地址、端口、路由表等。每个namespace有独立的网络栈。容器使用它实现网络隔离，通过veth pair连接。"),
    ("什么是User namespace？", "medium", "User namespace映射UID/GID，容器内root映射到宿主机普通用户。实现容器内特权操作不影响宿主机。是容器安全的重要机制。"),
    ("什么是UTS namespace？", "easy", "UTS namespace隔离hostname和domainname。每个容器可以有独立的hostname，不影响宿主机和其他容器。"),
    ("什么是IPC namespace？", "easy", "IPC namespace隔离System V IPC和POSIX消息队列。容器内的IPC通信不会影响其他容器或宿主机。"),
    ("什么是cgroup namespace？", "medium", "cgroup namespace隔离cgroup视图，进程只能看到自己所属的cgroup及其子cgroup。防止容器内进程看到宿主机的cgroup信息。"),
    ("什么是time namespace？", "medium", "time namespace隔离CLOCK_MONOTONIC和CLOCK_BOOTTIME时钟。用于容器迁移后调整时间，不影响宿主机时间。"),
    ("什么是CRI(Container Runtime Interface)？", "medium", "CRI是Kubernetes定义的容器运行时接口，kubelet通过CRI与容器运行时通信。支持containerd、CRI-O等运行时。gRPC协议，包括RuntimeService和ImageService。"),
    ("什么是OCI(Open Container Initiative)？", "easy", "OCI是容器标准化组织，定义了容器镜像规范(Image Spec)和运行时规范(Runtime Spec)。确保容器可以在不同运行时之间移植。runc是OCI参考实现。"),
    ("什么是容器镜像层？", "medium", "容器镜像由多个只读层组成，每层对应Dockerfile的一条指令。运行时在最上层添加可写层。层通过联合文件系统(OverlayFS)合并。共享层可以节省存储和传输。"),
    ("什么是OverlayFS？", "medium", "OverlayFS是Linux的联合文件系统，将多个目录(层)合并为一个视图。lower层只读，upper层可写。修改文件时使用COW机制。是Docker的默认存储驱动。"),
    ("什么是容器网络模型(CNM)？", "medium", "CNM是Docker的网络模型，定义了Sandbox(网络配置)、Endpoint(网络接口)、Network(通信域)三个概念。Libnetwork是CNM的参考实现。"),
    ("什么是CNI(Container Network Interface)？", "medium", "CNI是Kubernetes使用的容器网络接口，比CNM更简单。插件负责配置网络，支持bridge、vlan、vxlan等。Calico、Flannel、Cilium都是CNI插件。"),
    ("什么是容器安全上下文？", "medium", "安全上下文定义容器的安全策略：1.runAsNonRoot 2.allowPrivilegeEscalation 3.capabilities 4.seccompProfile 5.readOnlyRootFilesystem。Kubernetes通过SecurityContext配置。"),
    ("什么是Linux Capabilities？", "medium", "Linux Capabilities将root权限分解为细粒度能力：CAP_NET_BIND_SERVICE(绑定低端口)、CAP_SYS_ADMIN(系统管理)等。容器可以只添加需要的能力，而不是使用全部root权限。"),
    ("什么是Seccomp Profile？", "medium", "Seccomp Profile定义容器可以使用的系统调用白名单/黑名单。Docker默认禁止约44个系统调用。自定义Profile可以进一步限制攻击面。"),
    ("什么是Pod Security Policy？", "medium", "PSP是Kubernetes的安全策略，控制Pod的安全相关配置。限制：特权容器、hostPath、能力等。Kubernetes 1.25+已替换为Pod Security Admission。"),
    ("什么是容器资源QoS？", "medium", "Kubernetes定义三种QoS等级：Guaranteed(requests=limits)、Burstable(requests<limits)、BestEffort(无requests/limits)。资源不足时优先驱逐BestEffort Pod。"),
    ("什么是CPU Manager？", "hard", "Kubernetes CPU Manager为Guaranteed Pod分配独占CPU核心。策略：none(默认共享)和static(独占)。需要kubelet配置--cpu-manager-policy=static。"),
    ("什么是Device Manager？", "hard", "Kubernetes Device Manager为容器分配专用设备(GPU、RDMA等)。通过Device Plugin接口与kubelet交互。需要--feature-gates=DevicePlugins=true。"),
    ("什么是Memory Manager？", "hard", "Kubernetes Memory Manager为Guaranteed Pod保证NUMA节点的内存分配。策略：None和Static。与CPU Manager和Device Manager协同工作。"),
    ("什么是Topology Manager？", "hard", "Kubernetes Topology Manager优化资源分配的NUMA拓扑亲和性。策略：none/best-effort/restricted/single-numa-node。确保CPU、内存和设备在同一NUMA节点。"),
    ("什么是cgroup v2的递归资源限制？", "medium", "cgroup v2支持递归资源限制，父cgroup的限制会递归应用到所有子cgroup。子cgroup可以进一步限制但不能超过父cgroup的限制。"),
    ("什么是psi(Pressure Stall Information)？", "medium", "psi是cgroup v2的压力监控机制，报告CPU、内存、IO的压力指标。some表示部分任务延迟，full表示所有任务延迟。用于自动扩缩容和性能分析。"),
    ("什么是容器运行时安全？", "hard", "容器运行时安全包括：1.镜像扫描(漏洞检测) 2.运行时监控(异常行为检测) 3.网络策略(微隔离) 4.文件完整性监控 5.系统调用过滤。Falco是流行的运行时安全工具。"),
    ("什么是容器镜像签名？", "medium", "镜像签名使用数字签名验证镜像的完整性和来源。cosign和Notary是常用工具。Kubernetes可以通过Admission Controller强制只部署签名镜像。"),
    ("什么是容器沙箱运行时？", "hard", "沙箱运行时提供比runc更强的隔离：1.gVisor(用户态内核) 2.Kata Containers(轻量VM) 3.Firecracker(microVM)。适用于多租户和不信任工作负载。"),
    ("什么是Service Mesh？", "medium", "Service Mesh是服务间通信的基础设施层，以Sidecar代理方式运行。功能：流量管理、安全(mTLS)、可观测性。Istio和Linkerd是主流实现。"),
    ("什么是eBPF Service Mesh？", "hard", "eBPF Service Mesh使用eBPF替代Sidecar代理，减少资源开销和延迟。Cilium Service Mesh是代表实现。优点：更低延迟、更少资源、无Sidecar。"),
    ("什么是容器网络策略？", "medium", "NetworkPolicy控制Pod间的网络访问规则。规则基于标签选择器、IP块和端口。Calico、Cilium支持更丰富的网络策略，包括七层策略。"),
    ("什么是容器存储接口(CSI)？", "medium", "CSI是Kubernetes的存储插件接口标准。允许第三方存储供应商编写插件，无需修改Kubernetes代码。支持动态卷创建、快照、扩容等。"),
    ("什么是容器设备接口(CDI)？", "hard", "CDI是容器设备描述标准，定义设备在容器中的可见方式。解决GPU等复杂设备的容器化问题。由OCI社区推动。"),
]

for i, (title, diff, answer) in enumerate(os_questions):
    custom_questions.append({
        'id': f'os-custom-{i+1}',
        'title': title,
        'category': 'os',
        'difficulty': diff,
        'content': answer[:200],
        'answer': answer,
        'sourceType': 'builtin',
        'source': '面试高频题',
        'tags': ['操作系统'],
    })

print(f"OS custom questions: {len(os_questions)}")

# Network questions
net_questions = [
    ("TCP三次握手的过程？为什么是三次？", "easy", "客户端发送SYN，服务端回复SYN+ACK，客户端发送ACK。三次握手确保双方都能收发数据，防止历史连接请求导致的资源浪费。两次无法确认客户端接收能力，四次则冗余。"),
    ("TCP四次挥手的过程？为什么是四次？", "medium", "主动方发送FIN，被动方回复ACK；被动方发送FIN，主动方回复ACK。四次是因为TCP全双工，每个方向需要单独关闭。被动方的FIN和ACK可能不同时发送。"),
    ("TCP和UDP的区别？", "easy", "TCP：面向连接、可靠传输、流量控制、拥塞控制、字节流。UDP：无连接、不可靠、无流量/拥塞控制、数据报。TCP适用于文件传输，UDP适用于实时音视频。"),
    ("什么是HTTP/2？与HTTP/1.1的区别？", "medium", "HTTP/2改进：1.二进制分帧 2.多路复用(一个连接多个请求) 3.头部压缩(HPACK) 4.服务器推送 5.流优先级。解决了HTTP/1.1的队头阻塞问题。"),
    ("什么是HTTP/3？", "medium", "HTTP/3基于QUIC协议(UDP)，改进：1.0-RTT连接建立 2.无队头阻塞(每个流独立) 3.连接迁移(基于CID而非四元组) 4.内置TLS 1.3加密。"),
    ("什么是HTTPS？TLS握手过程？", "medium", "HTTPS = HTTP + TLS。TLS 1.3握手：1.ClientHello(支持的密码套件) 2.ServerHello(选择的套件+证书) 3.客户端验证证书+生成密钥 4.双方开始加密通信。1-RTT完成。"),
    ("什么是CDN？工作原理？", "easy", "CDN(内容分发网络)将内容缓存到离用户最近的边缘节点。工作原理：1.DNS解析到最近的CDN节点 2.用户从CDN获取内容 3.CDN回源获取未缓存内容。减少延迟和源站压力。"),
    ("什么是DNS？递归查询和迭代查询？", "easy", "DNS将域名解析为IP地址。递归查询：客户端问本地DNS，本地DNS负责完整解析。迭代查询：本地DNS依次问根DNS、顶级DNS、权威DNS。客户端通常使用递归查询。"),
    ("什么是负载均衡？常见算法？", "medium", "负载均衡将请求分发到多台服务器。算法：1.轮询 2.加权轮询 3.最少连接 4.IP Hash 5.一致性Hash 6.随机。L4负载均衡基于传输层，L7基于应用层。"),
    ("什么是反向代理？与正向代理的区别？", "easy", "反向代理代表服务器接收请求(Nginx)，正向代理代表客户端发送请求(VPN)。反向代理用于负载均衡、缓存、安全，正向代理用于访问控制、匿名。"),
    ("什么是WebSocket？", "medium", "WebSocket是全双工通信协议，基于HTTP升级建立。特点：1.持久连接 2.双向通信 3.低开销(帧头2-10字节) 4.支持文本和二进制。适用于实时聊天、推送、游戏。"),
    ("什么是Cookie、Session、Token？", "easy", "Cookie存储在客户端，每次请求自动发送。Session存储在服务端，通过SessionID关联。Token(JWT)是无状态的令牌，包含用户信息和签名，服务端无需存储。"),
    ("什么是跨域？如何解决？", "medium", "跨域是浏览器的同源策略限制。解决方案：1.CORS(服务端设置Access-Control-Allow-Origin) 2.JSONP(只支持GET) 3.代理服务器 4.postMessage 5.WebSocket不受同源限制。"),
    ("什么是RESTful API？设计原则？", "easy", "REST是资源导向的API设计风格。原则：1.使用HTTP方法(GET/POST/PUT/DELETE) 2.无状态 3.统一接口 4.资源用URL标识 5.HATEOAS。返回合适的HTTP状态码。"),
    ("什么是微服务？与单体架构的区别？", "medium", "微服务将应用拆分为独立部署的小服务。优点：独立部署、技术栈灵活、故障隔离。缺点：分布式复杂性、数据一致性、运维成本。需要服务发现、配置中心、链路追踪。"),
    ("TCP的拥塞控制机制？", "hard", "四个阶段：1.慢启动(cwnd指数增长) 2.拥塞避免(cwnd线性增长) 3.快重传(收到3个重复ACK立即重传) 4.快恢复(cwnd减半而非降为1)。AIMD算法保证公平性。"),
    ("什么是滑动窗口？", "medium", "滑动窗口是TCP流量控制机制，接收方通过窗口大小告知发送方可以发送的数据量。发送方维护发送窗口，接收方维护接收窗口。窗口大小动态调整。"),
    ("什么是Nagle算法？", "medium", "Nagle算法减少小包数量：如果之前的小包还未确认，则将数据缓存直到收到ACK或积累足够数据。与延迟ACK冲突，实时应用应禁用(TCP_NODELAY)。"),
    ("什么是SYN Flood攻击？如何防御？", "hard", "SYN Flood利用TCP三次握手，发送大量SYN但不完成握手，耗尽服务端半连接队列。防御：1.SYN Cookie(不分配资源) 2.增大半连接队列 3.缩短超时 4.防火墙限速。"),
    ("什么是DDoS攻击？防御方法？", "hard", "DDoS利用大量僵尸主机发起攻击，耗尽目标资源。类型：流量型(带宽)、协议型(SYN Flood)、应用层(CC攻击)。防御：CDN、WAF、流量清洗、限流、Anycast。"),
    ("什么是ARP协议？ARP欺骗？", "medium", "ARP将IP地址映射为MAC地址。ARP欺骗：攻击者发送伪造ARP应答，将目标IP映射到攻击者MAC。防御：静态ARP、ARP检测、DHCP Snooping。"),
    ("什么是OSPF协议？", "hard", "OSPF是链路状态路由协议，使用Dijkstra算法计算最短路径。特点：1.分层设计(区域) 2.快速收敛 3.支持VLSM 4.无路由环路。适用于大型企业网络。"),
    ("什么是BGP协议？", "hard", "BGP是路径矢量协议，用于AS之间的路由交换。eBGP在AS间运行，iBGP在AS内运行。BGP选择最佳路径考虑：本地优先级、AS路径长度、MED等。是互联网的核心路由协议。"),
    ("什么是VLAN？", "medium", "VLAN(虚拟局域网)在交换机上划分广播域。802.1Q标签在以太网帧中插入4字节VLAN ID。相同VLAN的主机可以通信，不同VLAN需要路由。减少广播流量，提高安全性。"),
    ("什么是STP协议？", "medium", "STP(生成树协议)防止交换网络中的环路。选举根桥，阻塞冗余路径。RSTP(快速生成树)收敛更快。MSTP支持多实例。"),
    ("什么是IPsec？", "hard", "IPsec是网络层安全协议，提供数据加密、认证和完整性。两种模式：传输模式(只加密数据)和隧道模式(加密整个包)。AH提供认证，ESP提供加密+认证。用于VPN。"),
    ("什么是SDN？", "medium", "SDN(软件定义网络)将控制面和数据面分离。控制器集中管理网络，下发流表到交换机。OpenFlow是南向接口协议。优点：灵活、可编程、自动化。"),
    ("什么是NFV？", "medium", "NFV(网络功能虚拟化)将网络功能(防火墙、LB等)从专用硬件迁移到虚拟机/容器。降低成本、提高灵活性。与SDN互补。"),
    ("什么是Service Mesh？", "medium", "Service Mesh是微服务通信基础设施层。数据面：Sidecar代理(Envoy)拦截流量。控制面：管理代理配置(Istiod)。功能：流量管理、安全(mTLS)、可观测性。"),
    ("什么是gRPC？", "medium", "gRPC是Google的高性能RPC框架，基于HTTP/2和Protocol Buffers。支持四种模式：一元、服务端流、客户端流、双向流。优点：强类型、高效、多语言支持。"),
    ("什么是消息队列？常见产品？", "medium", "消息队列实现异步通信和解耦。模型：点对点、发布订阅。产品：Kafka(高吞吐)、RabbitMQ(可靠)、RocketMQ(事务)、Pulsar(存储计算分离)。"),
    ("什么是API网关？", "medium", "API网关是微服务的统一入口。功能：1.路由转发 2.认证授权 3.限流熔断 4.日志监控 5.协议转换。产品：Kong、Nginx、Spring Cloud Gateway。"),
    ("什么是OAuth 2.0？", "medium", "OAuth 2.0是授权框架，允许第三方应用访问用户资源。四种模式：1.授权码(最安全) 2.隐式(不推荐) 3.密码(信任应用) 4.客户端凭证(服务间)。"),
    ("什么是JWT？结构？", "easy", "JWT(JSON Web Token)由三部分组成：Header(算法类型).Payload(数据).Signature(签名)。优点：无状态、跨域。缺点：无法撤销、payload明文。"),
    ("什么是CORS预检请求？", "medium", "非简单请求(PUT/DELETE、自定义头等)会先发送OPTIONS预检请求。服务端返回允许的方法和头。预检结果可缓存(Access-Control-Max-Age)。"),
    ("什么是HTTP缓存？", "medium", "强缓存：Cache-Control(max-age)、Expires，直接使用缓存。协商缓存：ETag/If-None-Match、Last-Modified/If-Modified-Since，需要验证。304 Not Modified表示缓存有效。"),
    ("什么是长连接和短连接？", "easy", "短连接：每次请求建立新TCP连接。长连接(Connection: keep-alive)：一个连接处理多个请求。HTTP/1.1默认长连接。长连接减少握手开销，但需要心跳保活。"),
    ("什么是IP分片？", "medium", "IP数据报超过MTU(通常1500字节)时需要分片。每个分片独立路由，到达后重组。DF标志位禁止分片，用于PMTU发现。TCP会避免IP分片(MSS协商)。"),
    ("什么是NAT？类型？", "medium", "NAT(网络地址转换)将私有IP转换为公网IP。类型：1.SNAT(源地址转换，出站) 2.DNAT(目的地址转换，入站) 3.PAT(端口地址转换，多对一)。NAT穿透问题影响P2P。"),
    ("什么是IPv6？与IPv4的区别？", "medium", "IPv6地址128位(vs IPv4 32位)，地址空间2^128。改进：1.简化头部 2.无NAT 3.内置IPsec 4.自动配置(SLAAC) 5.无广播(用组播替代)。"),
    ("什么是组播(Multicast)？", "medium", "组播是一对多通信，数据发送到一组接收者。IGMP管理组播组成员，组播路由协议(PIM)构建分发树。适用于视频会议、直播。"),
    ("什么是Anycast？", "medium", "Anycast将相同IP分配给多台服务器，路由到最近的一台。用于DNS根服务器和CDN。BGP Anycast通过路由协议选择最近节点。"),
    ("什么是网络命名空间(netns)？", "easy", "netns隔离网络栈：网卡、IP、路由、iptables。每个容器有独立的netns。veth pair连接不同netns。ip netns命令管理。"),
    ("什么是veth pair？", "easy", "veth pair是虚拟网线，一端连接一个netns，另一端连接另一个netns或网桥。类似管道，一端发送的数据从另一端接收。容器网络的基础。"),
    ("什么是Linux网桥(bridge)？", "medium", "Linux网桥是虚拟交换机，连接多个网络接口。学习MAC地址，转发帧。docker0是Docker默认网桥。brctl或ip link管理网桥。"),
    ("什么是iptables？五条链？", "medium", "iptables是Linux防火墙工具。五条链：PREROUTING、INPUT、FORWARD、OUTPUT、POSTROUTING。四张表：filter(过滤)、nat(地址转换)、mangle(修改)、raw(连接跟踪)。"),
    ("什么是nftables？", "medium", "nftables是iptables的替代品，统一了IPv4/IPv6/ARP/bridge。改进：1.更简单的语法 2.更高效的规则集 3.原子更新 4.更好的性能。Linux内核推荐使用。"),
    ("什么是TCP Fast Open？", "medium", "TFO允许在SYN包中携带数据，减少一个RTT。首次连接获取Cookie，后续连接SYN携带Cookie和数据。适用于短连接场景。"),
    ("什么是MPTCP？", "hard", "MPTCP(多路径TCP)允许一个TCP连接使用多个子流(如WiFi和4G同时)。提高吞吐量和可靠性。Linux 5.6+支持。适用于移动设备网络切换。"),
    ("什么是QUIC协议？", "hard", "QUIC是Google设计的传输协议，基于UDP。特点：1.0-RTT连接 2.无队头阻塞 3.连接迁移 4.内置加密 5.用户态实现。是HTTP/3的基础。"),
    ("什么是网络拓扑？常见类型？", "easy", "网络拓扑是网络设备的连接方式。类型：1.星型(中心交换机) 2.环型 3.总线型 4.网状(全连接) 5.树型 6.混合型。数据中心常用叶脊(Spine-Leaf)拓扑。"),
    ("什么是BGP Anycast？", "medium", "BGP Anycast将相同IP通告到多个位置，BGP选择最短路径。用于DNS(8.8.8.8)和CDN。优点：就近访问、负载均衡、高可用。"),
    ("什么是网络切片？", "hard", "5G网络切片在同一物理网络上创建多个虚拟网络，每个切片有不同的SLA(带宽、延迟、可靠性)。使用SDN和NFV技术实现。"),
    ("什么是零信任网络？", "medium", "零信任原则：不信任任何内部或外部网络。核心：1.身份验证 2.最小权限 3.微隔离 4.持续验证 5.设备健康检查。BeyondCorp是Google的零信任实现。"),
    ("什么是SNI？ESNI？", "medium", "SNI(Server Name Indication)在TLS握手时发送域名，支持同一IP多证书。ESNI加密SNI，防止监听。需要DNS HTTPS记录发布公钥。"),
    ("什么是证书透明度(CT)？", "medium", "CT要求CA将签发的证书记录到公开日志中，可审计。浏览器验证证书是否在CT日志中。防止CA误发或恶意签发证书。"),
    ("什么是DNS over HTTPS(DoH)？", "easy", "DoH将DNS查询通过HTTPS加密传输，防止DNS监听和篡改。端口443，与普通HTTPS流量混合。DoT(DNS over TLS)使用端口853。"),
    ("什么是DNSSEC？", "medium", "DNSSEC为DNS响应添加数字签名，验证数据来源和完整性。使用KSK和ZSK两对密钥。不加密DNS数据，只验证真实性。"),
    ("什么是mDNS？", "easy", "mDNS(组播DNS)在局域网内解析域名，无需DNS服务器。使用组播地址224.0.0.251。.local域。Bonjour和Avahi使用mDNS。用于设备发现。"),
    ("什么是SRV记录？", "medium", "SRV记录指定服务的服务器和端口。格式：_service._proto.name TTL SRV priority weight port target。用于SIP、XMPP、LDAP等服务发现。"),
]

for i, (title, diff, answer) in enumerate(net_questions):
    custom_questions.append({
        'id': f'net-custom-{i+1}',
        'title': title,
        'category': 'network',
        'difficulty': diff,
        'content': answer[:200],
        'answer': answer,
        'sourceType': 'builtin',
        'source': '面试高频题',
        'tags': ['计算机网络'],
    })

print(f"Network custom questions: {len(net_questions)}")

# Database questions
db_questions = [
    ("什么是ACID？", "easy", "ACID是事务的四个特性：原子性(Atomicity，全部成功或全部失败)、一致性(Consistency，数据从一个一致状态到另一个)、隔离性(Isolation，事务间不干扰)、持久性(Durability，提交后永久保存)。"),
    ("MySQL的索引类型？B+树索引原理？", "medium", "索引类型：主键索引、唯一索引、普通索引、组合索引、全文索引。B+树索引：非叶子节点只存键值，叶子节点存数据并链表连接。优点：范围查询快、磁盘IO少。"),
    ("什么是事务隔离级别？", "medium", "四种隔离级别：1.读未提交(脏读) 2.读已提交(不可重复读) 3.可重复读(幻读，MySQL默认) 4.串行化(无并发问题)。MySQL通过MVCC和间隙锁解决幻读。"),
    ("什么是MVCC？", "hard", "MVCC(多版本并发控制)通过保存数据的多个版本实现无锁读。每行有创建版本号和删除版本号。读操作只看已提交且在事务开始前的版本。写操作加锁。"),
    ("什么是锁？乐观锁和悲观锁？", "medium", "悲观锁：先加锁再操作(SELECT FOR UPDATE)。乐观锁：先操作再检查(版本号/CAS)。MySQL行锁、表锁、间隙锁、意向锁。InnoDB支持行锁，MyISAM只有表锁。"),
    ("什么是分库分表？", "hard", "分库分表解决单库单表数据量过大问题。水平分表：按规则拆分到多个表。垂直分库：按业务拆分到不同库。常用中间件：ShardingSphere、MyCat。需要考虑分布式事务和跨库查询。"),
    ("Redis的数据类型？", "easy", "五种基本类型：String(字符串)、Hash(哈希)、List(列表)、Set(集合)、ZSet(有序集合)。扩展类型：Bitmap、HyperLogLog、Geo、Stream。"),
    ("Redis的持久化方式？", "medium", "RDB：定时快照，文件小恢复快，可能丢数据。AOF：追加写日志，数据安全，文件大。混合持久化(RDB+AOF)：RDB间隔用AOF。Redis 4.0+支持。"),
    ("什么是缓存穿透、击穿、雪崩？", "medium", "穿透：查询不存在的数据(布隆过滤器/空值缓存)。击穿：热点key过期(互斥锁/永不过期)。雪崩：大量key同时过期(随机过期时间/多级缓存)。"),
    ("MySQL的主从复制原理？", "medium", "1.Master写binlog 2.Slave的IO线程拉取binlog写入relay log 3.Slave的SQL线程重放relay log。模式：异步(默认)、半同步、全同步。延迟问题可通过并行复制优化。"),
    ("什么是CAP定理？", "medium", "CAP：一致性(Consistency)、可用性(Availability)、分区容错性(Partition tolerance)。分布式系统最多同时满足两个。CP系统：ZooKeeper。AP系统：Eureka。"),
    ("什么是BASE理论？", "easy", "BASE：基本可用(Basically Available)、软状态(Soft State)、最终一致性(Eventually Consistent)。是CAP中AP的延伸，适用于大型分布式系统。"),
    ("什么是Raft协议？", "hard", "Raft是分布式一致性协议。角色：Leader、Follower、Candidate。选举：超时后Candidate请求投票，获多数票成为Leader。日志复制：Leader将日志复制到Follower，多数确认后提交。"),
    ("什么是Paxos协议？", "hard", "Paxos是分布式一致性协议，比Raft更难理解但更早提出。Basic Paxos：Proposer提出值，Acceptor接受值，Learner学习值。Multi-Paxos优化连续提案。"),
    ("什么是ZooKeeper？用途？", "medium", "ZooKeeper是分布式协调服务，提供：1.配置管理 2.命名服务 3.分布式锁 4.集群管理。基于ZAB协议。数据模型是树形结构，每个节点叫znode。"),
    ("什么是ETCD？与ZooKeeper的区别？", "medium", "etcd是分布式KV存储，基于Raft协议。与ZK区别：1.更简单的数据模型(KV) 2.HTTP+gRPC接口 3.更轻量 4.Kubernetes默认使用。ZK使用自定义协议。"),
    ("MongoDB和MySQL的区别？", "medium", "MongoDB是文档数据库，MySQL是关系数据库。MongoDB：无模式、JSON文档、水平扩展、适合非结构化数据。MySQL：强模式、SQL、ACID事务、适合结构化数据。"),
    ("什么是Elasticsearch？", "medium", "ES是分布式搜索和分析引擎，基于Lucene。特点：1.全文搜索 2.近实时 3.分布式 4.RESTful API 5.倒排索引。用于日志分析(ELK)和搜索。"),
    ("什么是ClickHouse？", "medium", "ClickHouse是列式OLAP数据库，适合大数据分析。特点：1.列式存储 2.向量化执行 3.高性能聚合 4.支持SQL。不适合OLTP(点查和更新)。"),
    ("什么是时序数据库？", "medium", "时序数据库(TSDB)专门存储时间序列数据。特点：1.高写入吞吐 2.数据压缩 3.时间范围查询 4.自动过期。产品：InfluxDB、TimescaleDB、Prometheus。"),
    ("什么是图数据库？", "medium", "图数据库以节点和边存储数据，擅长关系查询。产品：Neo4j、JanusGraph。适用场景：社交网络、推荐系统、知识图谱、欺诈检测。"),
    ("SQL和NoSQL的区别？", "easy", "SQL：关系型、强模式、ACID、SQL查询、垂直扩展。NoSQL：非关系型、灵活模式、BASE、多种查询方式、水平扩展。NoSQL类型：文档、键值、列族、图。"),
    ("什么是数据库连接池？", "easy", "连接池预先创建数据库连接，复用连接减少开销。参数：最小/最大连接数、超时时间、空闲检测。HikariCP是Java最流行的连接池。"),
    ("什么是慢查询？如何优化？", "medium", "慢查询是执行时间超过阈值的SQL。优化：1.EXPLAIN分析执行计划 2.添加合适索引 3.避免SELECT * 4.优化JOIN 5.分页优化 6.读写分离。"),
    ("什么是数据库范式？", "easy", "1NF：属性不可分割。2NF：消除部分依赖。3NF：消除传递依赖。BCNF：每个决定因素都是候选键。实际中常在性能和范式间权衡，适度反范式。"),
    ("什么是SQL注入？如何防止？", "easy", "SQL注入是通过输入恶意SQL代码攻击数据库。防止：1.参数化查询(预编译) 2.输入验证 3.ORM框架 4.最小权限 5.WAF。永远不要拼接SQL字符串。"),
    ("什么是数据库死锁？如何处理？", "medium", "死锁是两个事务互相等待对方持有的锁。处理：1.超时回滚 2.死锁检测(等待图) 3.固定加锁顺序 4.减少事务粒度。InnoDB自动检测死锁并回滚代价小的事务。"),
    ("什么是数据库触发器？", "easy", "触发器是表上特定事件(INSERT/UPDATE/DELETE)自动执行的SQL。类型：BEFORE/AFTER触发器。用途：数据验证、审计日志、级联更新。过多触发器影响性能。"),
    ("什么是存储过程？", "easy", "存储过程是预编译的SQL语句集合，存储在数据库中。优点：减少网络传输、复用、安全。缺点：调试困难、不可移植、业务逻辑混入数据库。"),
    ("什么是视图？物化视图？", "easy", "视图是虚拟表，基于查询定义。物化视图实际存储查询结果，需要刷新。视图简化查询，物化视图提高查询性能。MySQL不支持物化视图，可用定时任务模拟。"),
    ("什么是数据库分区？", "medium", "分区将大表分为多个小表，对应用透明。类型：RANGE(范围)、LIST(列表)、HASH(哈希)、KEY。优点：查询只扫描相关分区、维护方便。缺点：跨分区查询性能差。"),
    ("什么是数据库分片(Sharding)？", "hard", "分片将数据分布到多个数据库实例。策略：1.范围分片 2.哈希分片 3.目录分片。需要考虑：分片键选择、跨分片查询、分布式事务、数据迁移。"),
    ("什么是NewSQL？", "medium", "NewSQL结合了NoSQL的扩展性和SQL的ACID。产品：TiDB、CockroachDB、Spanner。特点：1.分布式架构 2.SQL接口 3.强一致性 4.水平扩展。"),
    ("什么是TiDB？", "medium", "TiDB是开源NewSQL数据库，兼容MySQL协议。架构：TiDB(SQL层)+TiKV(存储层)+PD(调度)。特点：1.HTAP 2.水平扩展 3.强一致性 4.MySQL兼容。"),
    ("什么是HTAP？", "hard", "HTAP(混合事务/分析处理)同时支持OLTP和OLAP。传统方案需要ETL从TP库同步到AP库。HTAP在一个系统中同时处理，减少延迟和复杂度。TiDB和OceanBase支持。"),
    ("什么是WAL(Write-Ahead Logging)？", "medium", "WAL先写日志再写数据，保证崩溃恢复。MySQL的redo log、PostgreSQL的WAL都是这个原理。日志顺序写性能高，数据随机写性能低。"),
    ("什么是LSM树？", "hard", "LSM(Log-Structured Merge)树是写优化数据结构。写入：先到MemTable(内存)，满了刷到SSTable(磁盘)。读取：MemTable->SSTable(从新到旧)。需要compaction合并。LevelDB/RocksDB使用。"),
    ("什么是B树和B+树？区别？", "medium", "B树每个节点存键值和数据。B+树只在叶子节点存数据，非叶子节点只存键值。B+树优点：1.叶子链表便于范围查询 2.非叶子节点更小，树更矮 3.查询稳定(O(log n))。"),
    ("什么是数据库索引下推(ICP)？", "hard", "ICP(Index Condition Pushdown)将部分WHERE条件下推到存储引擎层过滤，减少回表次数。MySQL 5.6+支持。适用于联合索引中无法使用最左前缀的列。"),
    ("什么是覆盖索引？", "medium", "覆盖索引包含查询所需的所有列，不需要回表。EXPLAIN中Extra显示Using index。设计查询时尽量使用覆盖索引，减少IO。"),
    ("什么是最左前缀原则？", "medium", "联合索引(a,b,c)生效规则：查询条件必须从最左列开始，不能跳过。a、ab、abc可以用索引，b、bc、c不能。范围查询(>、<)后的列无法使用索引。"),
    ("什么是数据库事务传播行为？", "medium", "Spring定义7种传播行为：REQUIRED(默认，加入当前事务)、REQUIRES_NEW(新建事务)、NESTED(嵌套事务)等。决定方法调用时事务的行为。"),
    ("什么是分布式事务？", "hard", "分布式事务跨多个服务/数据库。2PC：协调者通知参与者prepare，全部OK则commit。3PC增加CanCommit阶段减少阻塞。TCC：Try-Confirm-Cancel。Saga：补偿事务链。"),
    ("什么是Saga模式？", "hard", "Saga将长事务拆分为多个本地事务，每个事务有补偿操作。两种模式：1.编排(中心协调器) 2.协作(事件驱动)。失败时执行补偿事务回滚。适用于微服务。"),
    ("什么是Seata？", "medium", "Seata是阿里开源的分布式事务框架。四种模式：1.AT(自动补偿，推荐) 2.TCC(手动补偿) 3.Saga(长事务) 4.XA(强一致)。AT模式通过undo log实现自动回滚。"),
    ("什么是数据库读写分离？", "medium", "写操作走主库，读操作走从库。实现：1.代码层(数据源路由) 2.中间件(ShardingSphere、ProxySQL) 3.MySQL Router。需要处理主从延迟问题。"),
    ("什么是数据库中间件？", "medium", "数据库中间件代理SQL请求。功能：1.读写分离 2.分库分表 3.连接池 4.SQL审计。产品：ShardingSphere、MyCat、ProxySQL。ShardingSphere最活跃。"),
    ("什么是数据湖？", "medium", "数据湖存储原始数据(结构化+非结构化)，以原始格式保存。技术：HDFS、S3、Delta Lake、Iceberg、Hudi。数据仓库存储处理后的结构化数据。"),
    ("什么是数据仓库？", "medium", "数据仓库是面向分析的数据存储。特点：1.面向主题 2.集成 3.不可变 4.随时间变化。架构：ODS->DWD->DWS->ADS。产品：Hive、Snowflake、Redshift。"),
    ("什么是CDC(Change Data Capture)？", "medium", "CDC捕获数据库变更事件。实现：1.基于查询(定时轮询) 2.基于日志(binlog/WAL)。产品：Canal(MySQL)、Debezium(多数据库)、Flink CDC。用于数据同步。"),
    ("什么是数据库审计？", "easy", "数据库审计记录所有SQL操作。内容：谁、何时、从哪里、执行了什么SQL。用途：1.安全合规 2.问题排查 3.性能分析。MySQL Enterprise Audit、MariaDB Audit Plugin。"),
    ("什么是数据库高可用方案？", "hard", "MySQL高可用：1.MHA(主从切换) 2.MGR(MySQL Group Replication) 3.InnoDB Cluster 4.Oracle MHA。云方案：RDS多可用区。关键指标：RPO(数据丢失)和RTO(恢复时间)。"),
    ("什么是数据库备份策略？", "easy", "备份类型：全量、增量、差异。策略：每周全量+每日增量。工具：mysqldump、xtrabackup、mysqlbackup。需要定期验证备份可恢复。3-2-1原则：3份备份、2种介质、1份异地。"),
    ("什么是Redis Cluster？", "medium", "Redis Cluster是Redis的分布式方案。16384个哈希槽分配到节点。客户端重定向(MOVED/ASK)。支持节点动态扩缩容。至少6个节点(3主3从)。"),
    ("什么是Redis Sentinel？", "medium", "Sentinel是Redis高可用方案。功能：1.监控 2.通知 3.自动故障转移。至少3个Sentinel节点。选举新Master：优先级->复制偏移量->RunID。"),
    ("什么是Redis的LRU淘汰？", "medium", "LRU(最近最少使用)淘汰策略：1.allkeys-lru(所有key) 2.volatile-lru(有过期时间的key) 3.allkeys-lfu(最不经常使用) 4.volatile-lfu。Redis使用近似LRU(采样)。"),
    ("什么是Redis的发布订阅？", "medium", "Pub/Sub模式：发布者发送消息到频道，订阅者接收频道消息。不支持持久化和消息确认。Redis 5.0+的Stream类型支持消费者组和消息确认，更适合消息队列。"),
    ("什么是Redis的Lua脚本？", "medium", "Redis执行Lua脚本保证原子性(单线程执行)。EVAL命令执行脚本，EVALSHA缓存脚本。KEYS和ARGV数组传参。注意：脚本不能长时间阻塞，否则影响其他命令。"),
]

for i, (title, diff, answer) in enumerate(db_questions):
    custom_questions.append({
        'id': f'db-custom-{i+1}',
        'title': title,
        'category': 'database',
        'difficulty': diff,
        'content': answer[:200],
        'answer': answer,
        'sourceType': 'builtin',
        'source': '面试高频题',
        'tags': ['数据库'],
    })

print(f"Database custom questions: {len(db_questions)}")

# System Design questions
sd_questions = [
    ("如何设计一个短链接系统？", "medium", "核心：长URL映射短URL。方案：1.自增ID+Base62编码 2.MD5哈希取前6-8位 3.预生成短码。需要：布隆过滤器去重、缓存加速、301/302重定向。"),
    ("如何设计一个秒杀系统？", "hard", "核心：高并发、防超卖。方案：1.前端限流(验证码、倒计时) 2.CDN静态化 3.Redis预减库存 4.消息队列异步下单 5.数据库乐观锁。关键：库存不在数据库扣减。"),
    ("如何设计一个消息队列？", "hard", "核心组件：Producer、Broker、Consumer。设计：1.存储(顺序写+索引) 2.分区和副本 3.消费者组 4.消息确认和重试 5.消息顺序性 6. Exactly-Once语义。"),
    ("如何设计一个搜索引擎？", "hard", "核心：倒排索引。流程：1.爬虫采集 2.分词 3.建立倒排索引 4.查询解析 5.相关性排序(TF-IDF/BM25) 6.结果返回。优化：分片、缓存、实时索引。"),
    ("如何设计一个推荐系统？", "hard", "两类算法：1.协同过滤(用户/物品相似度) 2.内容推荐(特征匹配)。架构：1.离线计算(批处理) 2.近线计算(流处理) 3.在线计算(实时)。AB测试评估效果。"),
    ("如何设计一个限流系统？", "medium", "算法：1.固定窗口(临界突刺) 2.滑动窗口 3.漏桶(匀速) 4.令牌桶(允许突发)。分布式限流：Redis+Lua、Sentinel。限流维度：IP、用户、接口。"),
    ("如何设计一个分布式ID生成器？", "medium", "方案：1.UUID(无序、长) 2.数据库自增(单点) 3.号段模式(批量获取) 4.Redis自增 5.Snowflake雪花算法(时间戳+机器ID+序列号)。Snowflake最常用。"),
    ("如何设计一个分布式锁？", "hard", "方案：1.Redis SETNX+过期时间+Lua释放 2.Redisson(看门狗续期) 3.ZooKeeper临时节点 4.etcd租约。关键：互斥、可重入、防死锁、高可用。"),
    ("如何设计一个爬虫系统？", "medium", "架构：1.URL管理器(去重-布隆过滤器) 2.下载器(异步HTTP) 3.解析器(HTML解析) 4.存储。难点：反爬(IP代理池、验证码)、去重、增量爬取、分布式。"),
    ("如何设计一个社交信息流？", "hard", "两种模式：1.推模式(写时推送到粉丝收件箱) 2.拉模式(读时从关注列表拉取)。大V用拉模式，普通用户用推模式(推拉结合)。缓存三层：Redis->SSD->DB。"),
    ("如何设计一个键值存储？", "hard", "参考Dynamo论文。1.一致性哈希(虚拟节点) 2.向量时钟(版本冲突) 3.Merkle树(反熵) 4.读修复 5.提示移交。可调一致性(NWR模型)。"),
    ("如何设计一个文件存储系统？", "hard", "参考GFS/HDFS。架构：NameNode(元数据)+DataNode(数据块)。小文件合并、副本策略、数据校验、负载均衡。对象存储(S3)更适合小文件。"),
    ("如何设计一个即时通讯系统？", "hard", "协议：XMPP/WebSocket/MQTT。架构：1.接入层(长连接网关) 2.逻辑层(消息路由) 3.存储层(消息持久化)。消息投递：在线推送、离线拉取。群消息用写扩散。"),
    ("如何设计一个支付系统？", "hard", "核心：一致性、幂等性。流程：1.创建订单 2.扣减库存 3.调用支付渠道 4.回调通知 5.更新状态。关键：TCC分布式事务、对账系统、防重复支付。"),
    ("如何设计一个配置中心？", "medium", "功能：1.配置存储和版本管理 2.长轮询实时推送 3.灰度发布 4.回滚 5.权限管理。Apollo/Nacos是成熟方案。客户端缓存+长轮询保证实时性和可用性。"),
    ("如何设计一个网关系统？", "medium", "功能：1.路由 2.认证 3.限流 4.熔断 5.日志 6.协议转换。架构：1.接入层(Nginx/OpenResty) 2.逻辑层(插件化) 3.数据层(配置存储)。Kong/APISIX。"),
    ("如何设计一个任务调度系统？", "medium", "功能：1.定时触发 2.分布式执行 3.失败重试 4.任务依赖 5.监控告警。方案：1.时间轮 2.数据库轮询 3.Redis ZSET 4.XXL-Job/ElasticJob。"),
    ("如何设计一个日志系统？", "medium", "ELK架构：1.Filebeat采集 2.Logstash处理 3.Elasticsearch存储 4.Kibana展示。进阶：Kafka缓冲、Fluentd替代Logstash。日志格式标准化。"),
    ("如何设计一个监控告警系统？", "medium", "架构：1.数据采集(Exporter) 2.数据存储(TSDB) 3.查询和可视化 4.告警规则和通知。Prometheus+Grafana+Alertmanager是标准方案。"),
    ("如何设计一个分布式追踪系统？", "hard", "OpenTelemetry标准。概念：Trace(一次请求)、Span(一次操作)。架构：1.SDK埋点 2.Collector收集 3.存储(Jaeger/Zipkin) 4.查询展示。采样策略减少开销。"),
    ("如何设计一个对象存储系统？", "hard", "参考S3/MinIO。架构：1.元数据服务 2.数据节点 3.网关。数据分片+副本。纠删码节省存储。支持S3 API。小文件合并减少元数据。"),
    ("如何设计一个CDN系统？", "hard", "架构：1.源站 2.边缘节点 3.DNS调度 4.缓存层。缓存策略：LRU、TTL。回源策略：合并回源、分层回源。安全：防盗链、WAF。"),
    ("如何设计一个弹幕系统？", "hard", "架构：1.WebSocket长连接 2.消息广播 3.Redis Pub/Sub 4.消息聚合(批量发送)。难点：高并发、消息有序、弹幕防刷、历史弹幕回放。"),
    ("如何设计一个Feed流系统？", "hard", "三种模式：1.推模式(写扩散) 2.拉模式(读扩散) 3.推拉结合。微博方案：大V拉模式，普通用户推模式。Redis ZSET存储时间线，score为时间戳。"),
    ("如何设计一个排行榜系统？", "medium", "方案：1.Redis ZSET(score为分数) 2.定时更新 3.分页查询。优化：1.只缓存Top N 2.分段排行榜 3.合并相同分数。实时排行榜用Redis，历史排行榜用DB。"),
    ("如何设计一个预约系统？", "medium", "核心：并发防超卖。方案：1.库存预扣减(Redis DECR) 2.数据库乐观锁 3.消息队列削峰。需要：取消释放库存、超时自动取消、幂等性保证。"),
    ("如何设计一个地图服务？", "hard", "核心：空间索引。方案：1.Geohash(编码经纬度) 2.R树(空间范围查询) 3.Google S2。附近的人：Geohash前缀匹配+距离计算。路线规划：Dijkstra/A*。"),
    ("如何设计一个验证码系统？", "medium", "类型：1.图形验证码 2.短信验证码 3.滑块验证码 4.行为验证。防刷：1.频率限制 2.IP限制 3.设备指纹 4.风控规则。验证码存储用Redis+过期时间。"),
    ("如何设计一个单点登录系统(SSO)？", "medium", "方案：1.Cookie+Session(同域) 2.CAS协议(中央认证) 3.OAuth 2.0 4.SAML 5.JWT。核心：认证中心颁发Token，各子系统验证Token。"),
    ("如何设计一个权限系统(RBAC)？", "medium", "RBAC(基于角色的访问控制)：用户->角色->权限。扩展：RBAC1(角色继承)、RBAC2(约束)、RBAC3(1+2)。数据权限：行级和列级。ABAC(属性)更灵活。"),
    ("如何设计一个多租户系统？", "medium", "三种隔离级别：1.共享数据库共享表(字段隔离) 2.共享数据库独立表(Schema隔离) 3.独立数据库。权衡：成本、隔离性、运维复杂度。SaaS常用方案2。"),
    ("如何设计一个审计日志系统？", "medium", "记录：谁(用户)、何时(时间)、做了什么(操作)、对什么(资源)、结果如何(状态)。实现：1.AOP拦截 2.数据库触发器 3.Canal监听binlog。日志不可修改。"),
    ("如何设计一个灰度发布系统？", "medium", "策略：1.按用户ID 2.按百分比 3.按地域 4.按设备类型。实现：1.网关路由规则 2.特性开关(Feature Flag) 3.服务网格(Istio)。需要快速回滚能力。"),
    ("如何设计一个数据同步系统？", "medium", "场景：1.数据库间同步(Canal/Debezium) 2.缓存同步(双写/Canal) 3.搜索引擎同步。策略：同步双写、异步消息、binlog监听。需要处理数据一致性。"),
    ("如何设计一个工作流引擎？", "hard", "参考Activiti/Camunda。核心：1.流程定义(BPMN) 2.流程实例 3.任务分配 4.网关(排他/并行/包含) 5.事件(定时/信号)。状态机驱动。"),
    ("如何设计一个规则引擎？", "medium", "方案：1.Drools( rete算法) 2.Easy Rules 3.Aviator表达式 4.自研。设计：1.规则定义DSL 2.规则存储 3.规则编译 4.规则执行 5.版本管理。"),
    ("如何设计一个分布式存储系统？", "hard", "参考Ceph/GlusterFS。核心：1.数据分片(CRUSH算法) 2.副本策略 3.数据恢复 4.一致性模型 5.元数据管理。Ceph支持对象、块、文件三种接口。"),
    ("如何设计一个实时计算系统？", "hard", "架构：1.数据采集(Flume/Kafka) 2.流计算(Flink/Spark Streaming) 3.结果存储(Redis/ClickHouse) 4.可视化。Flink支持Exactly-Once和窗口计算。"),
    ("如何设计一个批处理系统？", "medium", "架构：1.数据输入(HDFS/S3) 2.计算(Spark/Hive) 3.输出(数据库/文件)。Spark比Hive快(内存计算)。调度：Airflow/DolphinScheduler。"),
    ("如何设计一个数据管道？", "medium", "ETL流程：Extract(抽取)->Transform(转换)->Load(加载)。工具：DataX、SeaTunnel、Flink CDC。需要：数据质量检查、错误处理、断点续传。"),
]

for i, (title, diff, answer) in enumerate(sd_questions):
    custom_questions.append({
        'id': f'sd-custom-{i+1}',
        'title': title,
        'category': 'system-design',
        'difficulty': diff,
        'content': answer[:200],
        'answer': answer,
        'sourceType': 'builtin',
        'source': '面试高频题',
        'tags': ['系统设计'],
    })

print(f"System Design custom questions: {len(sd_questions)}")

# Frontend questions
fe_questions = [
    ("什么是闭包？应用场景？", "medium", "闭包是函数和其词法作用域的组合。内部函数可以访问外部函数的变量。应用：1.数据私有化 2.柯里化 3.防抖节流 4.模块模式。注意内存泄漏。"),
    ("什么是事件循环(Event Loop)？", "medium", "事件循环是JS的异步执行机制。宏任务：setTimeout、setInterval、I/O。微任务：Promise.then、MutationObserver。执行顺序：同步代码->微任务->下一个宏任务。"),
    ("什么是原型链？", "medium", "每个对象有__proto__指向其构造函数的prototype。属性查找沿原型链向上直到null。Object.create()创建指定原型的对象。class是prototype的语法糖。"),
    ("什么是Promise？", "easy", "Promise是异步编程的解决方案。三种状态：pending、fulfilled、rejected。链式调用.then().catch()。Promise.all并行执行，Promise.race取最快。"),
    ("什么是async/await？", "easy", "async/await是Promise的语法糖，让异步代码看起来像同步。async函数返回Promise，await等待Promise解决。错误处理用try/catch。"),
    ("什么是Vue的响应式原理？", "hard", "Vue 2：Object.defineProperty劫持getter/setter，收集依赖(Dep)，触发更新(Watcher)。Vue 3：Proxy代理整个对象，支持动态属性和数组。虚拟DOM+Diff算法高效更新。"),
    ("什么是Virtual DOM？", "medium", "虚拟DOM是JS对象表示的DOM树。更新时先比较新旧虚拟DOM(Diff算法)，只更新变化的部分(最小化DOM操作)。React和Vue都使用虚拟DOM。"),
    ("什么是React Hooks？", "medium", "Hooks让函数组件使用状态和副作用。常用：1.useState(状态) 2.useEffect(副作用) 3.useContext(上下文) 4.useMemo(缓存) 5.useCallback(缓存函数) 6.useRef(引用)。"),
    ("什么是Redux？", "medium", "Redux是状态管理库。三大原则：1.单一数据源 2.State只读 3.纯函数修改。流程：dispatch(action)->reducer->new state->re-render。中间件处理异步。"),
    ("什么是Webpack？核心概念？", "medium", "Webpack是模块打包工具。核心：1.Entry(入口) 2.Output(输出) 3.Loader(转换) 4.Plugin(插件) 5.Mode(模式)。Vite是替代方案，开发时用ESM。"),
    ("什么是浏览器渲染流程？", "hard", "1.解析HTML生成DOM树 2.解析CSS生成CSSOM 3.合并生成渲染树 4.布局(计算位置大小) 5.绘制(填充像素) 6.合成(图层合并)。JS阻塞DOM解析。"),
    ("什么是重排和重绘？", "medium", "重排(回流)：元素几何属性变化(大小、位置)，重新布局。重绘：外观变化(颜色、背景)，不影响布局。重排一定重绘。优化：批量修改、使用transform、避免频繁读取布局属性。"),
    ("什么是CSS BFC？", "medium", "BFC(块格式化上下文)是独立的渲染区域。触发：overflow:hidden、display:flex/grid、position:absolute/fixed。用途：1.清除浮动 2.防止margin重叠 3.阻止元素被浮动覆盖。"),
    ("什么是跨域？解决方案？", "medium", "同源策略限制：协议+域名+端口必须相同。解决方案：1.CORS(服务端设置头) 2.JSONP(GET) 3.代理 4.postMessage 5.WebSocket。CORS最常用。"),
    ("什么是XSS攻击？如何防御？", "medium", "XSS(跨站脚本)注入恶意脚本。类型：存储型、反射型、DOM型。防御：1.输入过滤 2.输出编码(转义HTML) 3.CSP(Content-Security-Policy) 4.HttpOnly Cookie。"),
    ("什么是CSRF攻击？如何防御？", "medium", "CSRF(跨站请求伪造)利用已登录状态发起请求。防御：1.CSRF Token 2.SameSite Cookie 3.验证Referer/Origin 4.关键操作二次确认。"),
    ("什么是SSR？与CSR的区别？", "medium", "SSR(服务端渲染)：HTML在服务端生成，首屏快、SEO友好。CSR(客户端渲染)：JS在浏览器渲染，交互快、服务器压力小。Next.js(SSR)和Nuxt.js是常用框架。"),
    ("什么是PWA？", "medium", "PWA(渐进式Web应用)让网页像原生应用。核心：1.Service Worker(离线缓存) 2.Manifest(安装到桌面) 3.Push Notification(推送)。Lighthouse评分。"),
    ("什么是TypeScript？为什么使用？", "easy", "TypeScript是JavaScript的超集，添加了类型系统。优点：1.类型安全(编译时检查) 2.更好的IDE支持 3.代码可维护性 4.团队协作。缺点：学习成本、编译时间。"),
    ("什么是Flex布局？", "easy", "Flex是弹性盒布局。容器属性：flex-direction、justify-content、align-items、flex-wrap。项目属性：flex-grow、flex-shrink、flex-basis。适用于一维布局。"),
    ("什么是Grid布局？", "medium", "Grid是二维网格布局。容器属性：grid-template-columns/rows、gap、grid-template-areas。项目属性：grid-column/row。比Flex更适合复杂二维布局。"),
    ("什么是响应式设计？", "easy", "响应式设计让网页适配不同屏幕。方法：1.媒体查询(@media) 2.弹性布局(Flex/Grid) 3.相对单位(rem/vw) 4.图片自适应(srcset) 5.移动优先。"),
    ("什么是Web Components？", "medium", "Web Components是浏览器原生组件化方案。三个API：1.Custom Elements(自定义元素) 2.Shadow DOM(样式隔离) 3.HTML Templates(模板)。跨框架使用。"),
    ("什么是性能优化？常见手段？", "medium", "加载优化：1.代码分割 2.懒加载 3.压缩(Gzip/Brotli) 4.CDN 5.缓存。运行时优化：1.虚拟列表 2.防抖节流 3.Web Worker 4.requestAnimationFrame。"),
    ("什么是防抖和节流？", "easy", "防抖：事件停止触发n秒后执行(搜索框)。节流：每n秒最多执行一次(滚动事件)。防抖适合连续触发只需最后一次，节流适合限制执行频率。"),
    ("什么是深拷贝和浅拷贝？", "easy", "浅拷贝：只复制一层(Object.assign、展开运算符)。深拷贝：递归复制所有层(JSON.parse/stringify不能处理函数和循环引用)。structuredClone是原生深拷贝API。"),
    ("什么是函数式编程？", "medium", "核心概念：1.纯函数(相同输入相同输出，无副作用) 2.不可变数据 3.高阶函数 4.函数组合 5.柯里化。优点：可测试、可预测、可并行。"),
    ("什么是设计模式？常见前端模式？", "medium", "常见模式：1.单例(Vuex/Redux store) 2.观察者(EventEmitter) 3.发布订阅(EventBus) 4.策略(表单验证) 5.代理(Vue响应式) 6.装饰器(HOC) 7.工厂(React.createElement)。"),
    ("什么是微前端？", "hard", "微前端将前端应用拆分为独立部署的子应用。方案：1.qiankun(基于single-spa) 2.Module Federation(Webpack 5) 3.iframe 4.Web Components。需要处理样式隔离和通信。"),
    ("什么是WebAssembly？", "hard", "WASM是二进制指令格式，可以在浏览器中以接近原生的速度运行。适用于：1.图像/视频处理 2.游戏 3.加密计算 4.C/C++/Rust编译目标。与JS互操作。"),
    ("什么是Service Worker？", "medium", "Service Worker是浏览器后台运行的脚本，独立于网页。功能：1.离线缓存(Cache API) 2.推送通知 3.后台同步 4.请求拦截。生命周期：install->activate->fetch。"),
    ("什么是HTTP缓存策略？", "medium", "强缓存：Cache-Control(max-age)、Expires，不发请求。协商缓存：ETag/If-None-Match、Last-Modified/If-Modified-Since，发请求验证。304使用缓存。"),
    ("什么是前端安全？", "medium", "主要威胁：1.XSS(注入脚本) 2.CSRF(伪造请求) 3.点击劫持(iframe透明层) 4.中间人攻击(HTTPS) 5.开放重定向。防御：CSP、HttpOnly、SameSite、CORS。"),
    ("什么是前端工程化？", "medium", "前端工程化包括：1.构建工具(Webpack/Vite) 2.代码规范(ESLint/Prettier) 3.类型检查(TypeScript) 4.测试(Jest/Cypress) 5.CI/CD 6.文档(Storybook)。"),
    ("什么是DOM Diff算法？", "hard", "React Diff策略：1.树级别：只比较同层节点 2.组件级别：同类型组件才比较 3.元素级别：同key复用节点。Vue类似。key的作用：标识节点身份，帮助Diff识别移动。"),
    ("什么是Fiber架构？", "hard", "React Fiber是新的协调引擎。将渲染工作拆分为小单元(fiber)，可中断和恢复。优先级调度：高优先级(用户交互)先执行。实现：链表结构、时间切片(requestIdleCallback)。"),
    ("什么是Concurrent Mode？", "hard", "Concurrent Mode是React的并发渲染模式。特性：1.可中断渲染 2.优先级调度 3.Suspense 4.useTransition 5.useDeferredValue。React 18默认启用。"),
    ("什么是Server Components？", "hard", "React Server Components在服务端渲染，减少客户端JS体积。特点：1.零客户端JS 2.直接访问后端资源 3.与Client Components混合使用。Next.js App Router基于此。"),
    ("什么是CSS-in-JS？", "medium", "CSS-in-JS在JS中写CSS。方案：1.styled-components(模板字符串) 2.Emotion 3.CSS Modules(编译时)。优点：作用域隔离、动态样式。缺点：运行时开销。"),
    ("什么是Tailwind CSS？", "easy", "Tailwind是原子化CSS框架，通过类名组合样式。优点：1.不需要命名 2.一致的设计系统 3.按需生成 4.响应式方便。缺点：类名长、HTML臃肿。"),
    ("什么是状态机？前端应用？", "medium", "状态机定义有限状态和转换规则。前端应用：1.表单状态(编辑/提交/成功/失败) 2.登录流程 3.游戏状态。XState是JS状态机库，可视化状态图。"),
    ("什么是Web Worker？", "medium", "Web Worker在后台线程运行JS，不阻塞UI。类型：1.Dedicated Worker(一对一) 2.Shared Worker(多标签共享) 3.Service Worker(网络代理)。通过postMessage通信。"),
    ("什么是Intersection Observer？", "easy", "Intersection Observer异步观察元素与视口的交叉状态。用途：1.懒加载图片 2.无限滚动 3.曝光统计 4.动画触发。比scroll事件性能好。"),
    ("什么是Mutation Observer？", "medium", "Mutation Observer监听DOM变化。可观察：1.子节点变化 2.属性变化 3.文本内容变化。比MutationEvent性能好(异步批处理)。用于框架响应式和DevTools。"),
    ("什么是Resize Observer？", "easy", "Resize Observer监听元素尺寸变化。用途：1.响应式组件 2.图表自适应 3.布局计算。比window.resize精确(元素级别)。"),
    ("什么是Performance API？", "medium", "Performance API测量页面性能。关键指标：1.FCP(首次内容绘制) 2.LCP(最大内容绘制) 3.FID(首次输入延迟) 4.CLS(累积布局偏移)。Web Vitals标准。"),
    ("什么是WebRTC？", "hard", "WebRTC实现浏览器间实时通信。核心API：1.getUserMedia(获取媒体) 2.RTCPeerConnection(P2P连接) 3.RTCDataChannel(数据通道)。NAT穿透(STUN/TURN)。"),
    ("什么是WebGL/WebGPU？", "hard", "WebGL在浏览器中渲染3D图形(基于OpenGL ES)。WebGPU是下一代API(基于Vulkan/Metal)，更底层、更高效。Three.js是WebGL框架。适用于游戏和数据可视化。"),
    ("什么是SSE(Server-Sent Events)？", "medium", "SSE是服务器向客户端单向推送的协议。基于HTTP长连接，文本格式，自动重连。比WebSocket简单，但只能服务器到客户端。适用于通知、实时日志。"),
    ("什么是前端监控？", "medium", "前端监控三类：1.性能监控(加载时间、Web Vitals) 2.错误监控(JS错误、资源加载失败) 3.行为监控(PV/UV、点击、路径)。Sentry是错误监控工具。"),
    ("什么是AB测试？", "medium", "AB测试将用户随机分组，比较不同方案的效果。流程：1.确定假设 2.设计实验 3.分流(Feature Flag) 4.收集数据 5.统计分析。需要足够样本量和实验时间。"),
    ("什么是前端国际化(i18n)？", "medium", "i18n让应用支持多语言。要点：1.文本外置(JSON文件) 2.日期/数字格式化(Intl API) 3.布局方向(RTL) 4.图片本地化 5.动态切换。库：i18next、vue-i18n。"),
    ("什么是无障碍(a11y)？", "medium", "a11y让残障人士也能使用网页。要点：1.语义化HTML 2.ARIA属性 3.键盘导航 4.颜色对比度 5.焦点管理 6.屏幕阅读器测试。WCAG 2.1标准。"),
]

for i, (title, diff, answer) in enumerate(fe_questions):
    custom_questions.append({
        'id': f'fe-custom-{i+1}',
        'title': title,
        'category': 'frontend',
        'difficulty': diff,
        'content': answer[:200],
        'answer': answer,
        'sourceType': 'builtin',
        'source': '面试高频题',
        'tags': ['前端'],
    })

print(f"Frontend custom questions: {len(fe_questions)}")

# Language questions (Java/C++/Python/Go)
lang_questions = [
    ("Java中==和equals的区别？", "easy", "==比较引用(地址)，equals比较内容。String重写了equals方法比较字符串内容。基本类型用==比较值。建议重写equals时也重写hashCode。"),
    ("Java的垃圾回收机制？", "hard", "GC自动回收不再引用的对象。算法：1.标记-清除 2.复制(新生代) 3.标记-整理(老年代)。分代收集：新生代(Eden+S0+S1)、老年代。收集器：CMS、G1、ZGC。"),
    ("Java的HashMap原理？", "hard", "JDK1.8：数组+链表+红黑树。put：计算hash定位桶，链表尾插，长度>=8转红黑树。扩容：容量翻倍，重新hash。线程不安全，用ConcurrentHashMap。"),
    ("Java的线程池？核心参数？", "medium", "7个参数：corePoolSize、maximumPoolSize、keepAliveTime、unit、workQueue、threadFactory、handler。执行流程：核心线程->队列->最大线程->拒绝策略。"),
    ("Java的synchronized和ReentrantLock？", "medium", "synchronized：JVM层面、自动释放、非公平。ReentrantLock：API层面、手动释放、可公平/非公平、可中断、可超时。都是可重入锁。"),
    ("Java的JVM内存模型？", "hard", "运行时数据区：1.堆(对象实例，GC管理) 2.方法区(类信息、常量) 3.栈(局部变量、操作栈) 4.本地方法栈 5.程序计数器。堆是线程共享，栈是线程私有。"),
    ("Java的volatile关键字？", "medium", "volatile保证：1.可见性(修改立即刷新到主内存) 2.有序性(禁止指令重排)。不保证原子性(i++不是原子操作)。适用于状态标志和双检锁单例。"),
    ("Java的Spring IOC和AOP？", "medium", "IOC(控制反转)：将对象创建和依赖管理交给Spring容器。DI(依赖注入)是IOC的实现方式。AOP(面向切面)：将横切关注点(日志、事务)模块化。通过动态代理实现。"),
    ("C++的智能指针？", "medium", "三种智能指针：1.unique_ptr(独占，不可复制) 2.shared_ptr(共享，引用计数) 3.weak_ptr(弱引用，不增加计数)。解决内存泄漏问题。RAII原则。"),
    ("C++的虚函数和多态？", "medium", "虚函数通过vtable(虚函数表)实现运行时多态。派生类重写虚函数，基类指针调用时执行派生类版本。纯虚函数(=0)定义抽象类。override关键字确保重写。"),
    ("C++的移动语义？", "hard", "移动语义避免不必要的拷贝。右值引用(&&)绑定临时对象。move()将左值转为右值。移动构造和移动赋值转移资源而非拷贝。适用于大对象(如vector、string)。"),
    ("Python的GIL？", "medium", "GIL(全局解释器锁)同一时刻只允许一个线程执行Python字节码。影响CPU密集型多线程。解决方案：1.multiprocessing多进程 2.C扩展释放GIL 3.异步IO。"),
    ("Python的装饰器？", "medium", "装饰器是修改函数行为的高阶函数。@decorator语法糖。带参数装饰器需要三层嵌套。functools.wraps保留原函数元信息。类装饰器实现__call__。"),
    ("Python的生成器？", "medium", "生成器用yield返回值，暂停函数执行。next()恢复执行。惰性求值，节省内存。生成器表达式(g = (x**2 for x in range(10)))。send()向生成器传值。"),
    ("Go的goroutine和channel？", "medium", "goroutine是轻量级线程(2KB初始栈)，go关键字启动。channel是goroutine间通信管道。无缓冲channel同步，有缓冲channel异步。select处理多个channel。"),
    ("Go的接口？", "easy", "Go接口是隐式实现(鸭子类型)。类型只要实现了接口的所有方法就自动实现该接口。空接口interface{}可以接收任何类型。接口组合优于继承。"),
    ("Go的defer？", "easy", "defer延迟执行函数，在函数返回前执行。多个defer按LIFO顺序执行。用途：1.关闭文件 2.释放锁 3.错误处理。defer的参数在声明时求值。"),
    ("Go的slice和array区别？", "easy", "array是固定长度，slice是动态长度。slice底层是array的引用，包含指针、长度、容量。append可能触发扩容(2倍或1.25倍)。slice传参是引用语义。"),
    ("Go的map是并发安全的吗？", "medium", "标准map不是并发安全的，并发读写会panic。sync.Map是并发安全的。或者用sync.RWMutex保护map。Go 1.9+的sync.Map适合读多写少场景。"),
    ("Go的垃圾回收？", "medium", "Go使用三色标记法+混合写屏障。STW(Stop The World)时间很短。GC触发条件：1.堆大小达到上次2倍 2.2分钟未触发 3.手动runtime.GC()。GOGC控制阈值。"),
    ("Rust的所有权系统？", "hard", "Rust所有权规则：1.每个值有唯一所有者 2.同一时刻只能有一个所有者 3.所有者离开作用域值被释放。借用(&)不转移所有权。可变借用(&mut)独占。编译时检查。"),
    ("Rust的生命周期？", "hard", "生命周期确保引用在使用期间有效。标注：'a。函数签名中标注生命周期帮助编译器推断。省略规则：输入生命周期从参数推导，输出从输入推导。static生命周期贯穿整个程序。"),
    ("什么是函数式编程语言？", "medium", "函数式编程强调：1.纯函数 2.不可变数据 3.高阶函数 4.递归 5.模式匹配。Haskell是纯函数式语言。Scala/Clojure是JVM上的函数式语言。"),
    ("什么是编译型和解释型语言？", "easy", "编译型：源代码编译为机器码再执行(C/C++/Go)，运行快。解释型：逐行解释执行(Python/JavaScript)，跨平台。Java是混合型(编译为字节码+JIT)。"),
    ("什么是动态类型和静态类型？", "easy", "静态类型：编译时确定类型(Java/C++/Go)，IDE支持好。动态类型：运行时确定类型(Python/JS)，灵活但容易出错。TypeScript是JS的静态类型超集。"),
]

for i, (title, diff, answer) in enumerate(lang_questions):
    custom_questions.append({
        'id': f'lang-custom-{i+1}',
        'title': title,
        'category': 'language',
        'difficulty': diff,
        'content': answer[:200],
        'answer': answer,
        'sourceType': 'builtin',
        'source': '面试高频题',
        'tags': ['编程语言'],
    })

print(f"Language custom questions: {len(lang_questions)}")

# Scenario questions
sc_questions = [
    ("如何处理线上OOM问题？", "hard", "1.查看OOM日志和堆转储 2.jmap -histo查看对象分布 3.MAT分析堆转储 4.定位大对象或内存泄漏 5.修复并验证。预防：设置-XX:+HeapDumpOnOutOfMemoryError。"),
    ("如何处理数据库慢查询？", "medium", "1.开启慢查询日志 2.EXPLAIN分析执行计划 3.检查是否使用索引 4.优化SQL(避免SELECT *、合理JOIN) 5.添加索引 6.考虑读写分离或缓存。"),
    ("如何处理缓存与数据库不一致？", "hard", "策略：1.Cache Aside(先更新DB再删缓存) 2.延迟双删(更新DB->删缓存->延迟再删) 3.监听binlog更新缓存 4.设置合理过期时间。最终一致性。"),
    ("如何设计高可用系统？", "hard", "原则：1.消除单点(冗余) 2.故障检测(心跳) 3.快速故障转移 4.降级和熔断 5.限流 6.灰度发布。指标：99.99%可用性=年停机53分钟。"),
    ("如何进行容量规划？", "medium", "1.评估当前资源使用率 2.预测增长趋势 3.压测确定单机极限 4.计算所需机器数(含冗余) 5.制定扩容计划。关注：CPU、内存、磁盘IO、网络带宽、QPS。"),
    ("如何处理分布式事务？", "hard", "方案：1.2PC(强一致但阻塞) 2.TCC(柔性事务) 3.Saga(长事务) 4.本地消息表 5.可靠消息最终一致性。根据业务选择：强一致用2PC，最终一致用消息。"),
    ("如何设计灰度发布策略？", "medium", "步骤：1.定义灰度规则(用户ID百分比) 2.网关层路由 3.监控核心指标 4.逐步扩大范围 5.全量发布或回滚。需要：Feature Flag、监控告警、快速回滚。"),
    ("如何处理消息队列积压？", "hard", "1.紧急扩容消费者 2.检查消费者是否异常 3.临时丢弃非核心消息 4.增加分区/队列 5.批量消费提高吞吐。预防：监控积压量、设置告警、容量规划。"),
    ("如何排查CPU 100%问题？", "medium", "1.top找到高CPU进程 2.top -Hp找到高CPU线程 3.jstack导出线程栈 4.将线程ID转为16进制 5.在栈中查找对应线程。常见：死循环、频繁GC、正则回溯。"),
    ("如何排查内存泄漏？", "hard", "1.监控内存使用趋势(持续增长) 2.jmap导出堆转储 3.MAT分析支配树 4.找到GC Root引用链 5.定位泄漏对象。常见：集合未清理、ThreadLocal、监听器未注销。"),
    ("如何设计异地多活？", "hard", "架构：1.单元化(用户路由到固定单元) 2.数据同步(异步复制) 3.全局唯一ID 4.分布式事务 5.流量调度。挑战：数据一致性、冲突解决、运维复杂度。"),
    ("如何处理突发流量？", "medium", "1.自动扩容(K8s HPA) 2.限流(令牌桶) 3.降级(关闭非核心功能) 4.熔断(防止级联故障) 5.排队(消息队列缓冲) 6.CDN分流。预案和演练很重要。"),
    ("如何设计数据迁移方案？", "hard", "步骤：1.评估数据量和影响 2.双写(新旧库同时写) 3.历史数据迁移 4.数据校验(对比) 5.灰度切读 6.全量切读 7.停止双写。回滚方案：切回旧库。"),
    ("如何保证接口幂等性？", "medium", "方案：1.唯一请求ID+去重表 2.数据库唯一约束 3.乐观锁(版本号) 4.状态机(只允许特定状态转换) 5.Token机制(预获取+验证)。支付和下单必须幂等。"),
    ("如何设计服务降级？", "medium", "策略：1.关闭非核心功能(推荐、评论) 2.返回缓存数据 3.简化逻辑(不查DB) 4.限流排队 5.熔断(快速失败)。降级分级：一级(核心)、二级(重要)、三级(一般)。"),
    ("如何设计服务熔断？", "medium", "熔断器模式：1.关闭(正常请求) 2.打开(失败率超阈值，快速失败) 3.半开(放少量请求测试)。Hystrix/Resilience4j/Sentinel实现。防止级联故障。"),
    ("如何排查网络延迟问题？", "medium", "1.ping/traceroute检查连通性 2.mtr持续监测 3.tcpdump抓包分析 4.检查DNS解析时间 5.检查服务端处理时间 6.检查CDN缓存命中率。"),
    ("如何设计零停机部署？", "medium", "方案：1.蓝绿部署(两套环境切换) 2.滚动更新(逐个替换) 3.金丝雀发布(先小范围) 4.特性开关(代码已部署但未启用)。K8s RollingUpdate默认零停机。"),
    ("如何处理数据热点问题？", "medium", "1.本地缓存(Guava/Caffeine) 2.读写分离 3.分片打散热点Key 4.热点探测+提前预热 5.请求合并。监控：Redis hotkey检测、QPS分布。"),
    ("如何设计数据归档方案？", "medium", "1.定义归档规则(时间、状态) 2.归档存储(冷存储、对象存储) 3.在线数据只保留近期 4.归档数据可查询但慢 5.定期清理过期归档。减少在线库数据量。"),
    ("如何排查死锁问题？", "medium", "1.show engine innodb status查看死锁信息 2.分析涉及SQL和锁 3.检查加锁顺序 4.优化事务(缩短持锁时间) 5.统一加锁顺序。预防：按固定顺序访问资源。"),
    ("如何设计全链路压测？", "hard", "步骤：1.梳理核心链路 2.构造测试数据(脱敏) 3.隔离压测流量(影子库) 4.逐步加压 5.监控各环节瓶颈 6.优化后复测。需要：流量录制回放、全链路标记。"),
    ("如何处理Redis大Key问题？", "medium", "大Key：value>10KB或集合元素>5000。危害：阻塞Redis、网络拥塞。处理：1.拆分(按字段/分片) 2.压缩 3.本地缓存 4.异步删除(UNLINK)。redis-rdb-tools扫描。"),
    ("如何设计服务健康检查？", "easy", "两种探针：1.存活探针(Liveness，失败重启) 2.就绪探针(Readiness，失败摘除流量)。K8s配置：httpGet、tcpSocket、exec。需要：超时、重试、阈值。"),
    ("如何设计日志规范？", "medium", "规范：1.统一格式(JSON) 2.必填字段(时间、级别、traceId、服务名) 3.敏感信息脱敏 4.合理级别(ERROR/WARN/INFO/DEBUG) 5.异步日志 6.日志轮转。"),
    ("如何设计监控告警体系？", "medium", "分层：1.基础设施(CPU/内存/磁盘) 2.应用(JVM/QPS/延迟) 3.业务(订单量/成功率)。告警原则：1.可操作性 2.分级(P0-P3) 3.避免告警风暴 4.定期Review。"),
    ("如何处理跨域问题？", "easy", "方案：1.CORS(服务端设置Access-Control-Allow-Origin) 2.Nginx代理 3.JSONP(GET) 4.WebSocket不受限。CORS最常用，需要处理预检请求(OPTIONS)。"),
    ("如何设计API版本管理？", "medium", "方案：1.URL路径(/v1/api) 2.请求头(Api-Version: 1) 3.查询参数(?version=1)。推荐URL路径，直观且易于路由。废弃版本需要过渡期和通知。"),
    ("如何设计错误码体系？", "medium", "规范：1.全局唯一 2.分层(系统+模块+错误) 3.有含义(不是纯数字) 4.文档化。示例：SYS_AUTH_TOKEN_EXPIRED。包含：错误码、错误消息、文档链接。"),
    ("如何设计配置管理？", "medium", "原则：1.配置与代码分离 2.环境区分(dev/staging/prod) 3.敏感信息加密 4.版本管理 5.热更新。方案：Apollo、Nacos、Spring Cloud Config。"),
    ("如何处理时区问题？", "medium", "原则：1.存储用UTC 2.显示用本地时间 3.API传ISO 8601格式 4.数据库TIMESTAMP自动转UTC。Java用ZonedDateTime，JS用Intl API。"),
    ("如何设计数据权限？", "hard", "方案：1.行级权限(数据范围过滤) 2.列级权限(字段脱敏) 3.数据权限与角色关联 4.SQL拦截自动拼接条件。MyBatis Plus的DataPermissionInterceptor。"),
    ("如何设计审计追踪？", "medium", "记录：操作人、时间、操作类型、变更前后数据。实现：1.AOP拦截 2.数据库触发器 3.binlog监听。数据不可修改，可查询。满足合规要求。"),
    ("如何处理并发更新冲突？", "medium", "方案：1.乐观锁(版本号/CAS) 2.悲观锁(SELECT FOR UPDATE) 3.分布式锁 4.事件溯源。乐观锁适合低冲突，悲观锁适合高冲突。"),
    ("如何设计数据备份策略？", "easy", "3-2-1原则：3份备份、2种介质、1份异地。MySQL：xtrabackup全量+增量。Redis：RDB+AOF。验证：定期恢复测试。自动化：crontab+脚本+告警。"),
    ("如何设计限流策略？", "medium", "维度：1.IP限流 2.用户限流 3.接口限流 4.服务限流。算法：1.固定窗口 2.滑动窗口 3.漏桶 4.令牌桶。分布式：Redis+Lua、Sentinel。"),
    ("如何设计熔断策略？", "medium", "指标：1.异常比例 2.慢调用比例 3.异常数量。状态：关闭->打开(超阈值)->半开(试探)->关闭/打开。Sentinel支持慢调用比例和异常比例两种策略。"),
    ("如何设计降级策略？", "medium", "降级方式：1.返回默认值 2.返回缓存 3.关闭非核心功能 4.简化逻辑 5.人工开关。分级：P0(不可降级)、P1(可简化)、P2(可关闭)。"),
    ("如何设计重试策略？", "medium", "原则：1.幂等操作才重试 2.指数退避(1s,2s,4s...) 3.最大重试次数 4.重试不同实例 5.记录重试日志。Spring Retry/Resilience4j。"),
    ("如何设计超时策略？", "easy", "原则：1.设置合理的超时时间 2.区分连接超时和读取超时 3.上游超时>下游超时 4.超时后释放资源。HTTP：连接5s+读取30s。数据库：查询3s。"),
    ("如何设计补偿机制？", "hard", "场景：分布式事务失败后需要补偿。方案：1.TCC(Try-Confirm-Cancel) 2.Saga(正向+补偿) 3.本地消息表+定时补偿 4.人工补偿。补偿操作必须幂等。"),
    ("如何设计幂等方案？", "medium", "核心：同一操作执行多次结果相同。方案：1.唯一ID+去重表 2.数据库唯一约束 3.乐观锁(版本号) 4.状态机 5.Token机制。关键：全局唯一ID生成。"),
    ("如何设计数据一致性方案？", "hard", "强一致：2PC、Paxos/Raft。最终一致：1.消息队列 2.binlog同步 3.定时对账 4.补偿机制。根据业务选择：金融用强一致，社交用最终一致。"),
    ("如何设计灰度发布平台？", "hard", "功能：1.灰度规则配置 2.流量分配 3.效果对比 4.一键回滚 5.多维度灰度(用户/地域/设备)。架构：网关层路由+配置中心+监控。"),
    ("如何设计链路追踪？", "hard", "OpenTelemetry标准。核心：1.TraceID(全局唯一) 2.SpanID(操作标识) 3.ParentSpanID(调用关系)。采样：1.全量(性能差) 2.概率 3.自适应。"),
    ("如何设计服务网格？", "hard", "数据面：Sidecar代理(Envoy)拦截所有流量。控制面：1.Pilot(服务发现+路由) 2.Citadel(证书管理) 3.Galley(配置验证)。Istio是主流实现。"),
    ("如何设计混沌工程？", "hard", "原则：1.定义稳态假设 2.模拟真实事件 3.在生产环境运行 4.最小爆炸半径 5.自动化。工具：Chaos Mesh、LitmusChaos。实验：网络延迟、节点宕机、磁盘满。"),
    ("如何设计SLO/SLI/SLA？", "medium", "SLI(指标)：延迟P99、可用性、错误率。SLO(目标)：P99<200ms、可用性>99.9%。SLA(协议)：不满足SLO的赔偿条款。Error Budget=1-SLO，用于决定是否发版。"),
    ("如何设计On-Call体系？", "medium", "1.轮值制度(Primary+Secondary) 2.升级路径(L1->L2->L3) 3.Runbook(操作手册) 4.告警分级 5.事后复盘(Blameless)。目标：5分钟响应、30分钟恢复。"),
    ("如何设计灾备方案？", "hard", "RPO(恢复点目标)：可接受的数据丢失量。RTO(恢复时间目标)：恢复服务的时间。方案：1.主备(冷备/热备) 2.双活 3.两地三中心。定期灾备演练。"),
    ("如何设计容量评估？", "medium", "步骤：1.收集当前指标(QPS、延迟、资源) 2.压测确定单机极限 3.计算安全容量(极限*70%) 4.规划扩容阈值 5.制定扩容方案。关注木桶效应。"),
    ("如何设计技术方案评审？", "easy", "评审内容：1.需求理解 2.方案设计(架构图) 3.技术选型 4.性能和安全 5.降级和回滚 6.工作量评估。参与者：架构师、开发、测试、运维。"),
    ("如何设计代码审查规范？", "easy", "规范：1.每次PR<400行 2.必须有人Approve 3.CI必须通过 4.关注：逻辑正确性、安全性、性能、可读性 5.建设性反馈。工具：GitHub/GitLab MR。"),
    ("如何设计技术债务管理？", "medium", "1.登记技术债务(类型、影响、修复成本) 2.按优先级排序 3.每个迭代分配20%时间还债 4.新代码不允许增加债务 5.定期Review。工具：JIRA标签。"),
    ("如何设计知识库？", "medium", "内容：1.架构文档 2.API文档 3.Runbook 4.最佳实践 5.故障案例。工具：Confluence、Notion、GitBook。原则：写有用的文档、保持更新、易于搜索。"),
]

for i, (title, diff, answer) in enumerate(sc_questions):
    custom_questions.append({
        'id': f'sc-custom-{i+1}',
        'title': title,
        'category': 'scenario',
        'difficulty': diff,
        'content': answer[:200],
        'answer': answer,
        'sourceType': 'builtin',
        'source': '面试高频题',
        'tags': ['场景题'],
    })

print(f"Scenario custom questions: {len(sc_questions)}")

# Combine all
all_new = custom_questions
print(f"\nTotal new custom questions: {len(all_new)}")

# Count by category
cat_counts = {}
for q in all_new:
    c = q['category']
    cat_counts[c] = cat_counts.get(c, 0) + 1
print(f"Category distribution: {json.dumps(cat_counts, ensure_ascii=False)}")

with open('new_questions.json', 'w', encoding='utf-8') as f:
    json.dump(all_new, f, ensure_ascii=False, indent=2)

print("Saved to new_questions.json")
