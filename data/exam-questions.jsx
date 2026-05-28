/* exam-questions.jsx — actual questions from the AOS Endterm (both variants).
   Tagged with exam: true so they show a special badge. */

(function () {
  function push(lecId, items) {
    if (!window.LECTURES[lecId]) return;
    window.LECTURES[lecId].quiz.push(...items.map(it => ({ ...it, exam: true })));
  }

  // ---------- LECTURE 1 ----------
  push(1, [
    {
      q: "In a virtual machine manager, what should happen when an application requests more memory than the VM can provide?",
      opts: [
        "The launch should be rejected with an error",
        "The VM should report a fake success",
        "The request should silently ignore memory constraints",
        "The hypervisor should delete another VM"
      ],
      correct: 0,
      expl: "When a guest exceeds the resources granted by the VMM, the request must fail explicitly. Silently lying or destroying other VMs would break isolation and correctness.",
      explRu: "Когда гость превышает выделенные VMM ресурсы, запрос должен явно завершиться ошибкой. Молча врать или удалять другие VM — нарушение изоляции и корректности."
    }
  ]);

  // ---------- LECTURE 3 (process scheduling fairness) ----------
  push(3, [
    {
      q: "Why should scheduling algorithms be compared using the same workload?",
      opts: [
        "To avoid calculating waiting time",
        "To guarantee identical completion order",
        "To make the comparison fair",
        "To remove the need for simulation"
      ],
      correct: 2,
      expl: "A meaningful comparison of schedulers requires identical inputs (arrival times, burst times). Different workloads would favor whichever algorithm happens to match — that's not a fair test.",
      explRu: "Корректное сравнение алгоритмов планирования требует одинаковых входных данных (момент прибытия, длительность burst). Разные нагрузки исказили бы результат — это нечестное сравнение."
    }
  ]);

  // ---------- LECTURE 4 (Threads & Concurrency) ----------
  push(4, [
    {
      q: "When a mutex protects a critical section, it ensures that:",
      opts: [
        "All threads update a variable at exactly the same time",
        "Every process receives the same CPU burst",
        "All page faults disappear automatically",
        "Only one thread enters the protected section at a time"
      ],
      correct: 3,
      expl: "A mutex (mutual exclusion) guarantees that at most one thread is inside the critical section at any instant — the very definition of mutual exclusion.",
      explRu: "Мьютекс (взаимное исключение) гарантирует, что в защищённой секции в любой момент находится не более одного потока — это и есть определение взаимного исключения."
    },
    {
      q: "If a sequential program takes 12 seconds and a parallel version takes 4 seconds, what is the speedup?",
      opts: ["A. 4", "B. 3", "C. 8", "D. 48"],
      correct: 1,
      expl: "Speedup = T_sequential / T_parallel = 12 / 4 = 3. By Amdahl's law this is bounded by the inherently sequential fraction of the program.",
      explRu: "Ускорение = T_последовательное / T_параллельное = 12 / 4 = 3. По закону Амдала оно ограничено непараллельной частью программы."
    },
    {
      q: "If a shared counter is updated by several threads without proper synchronization, the result may show:",
      opts: [
        "Lost updates",
        "Guaranteed correctness",
        "Perfect speedup",
        "Automatic deadlock recovery"
      ],
      correct: 0,
      expl: "Without synchronization, two threads can read the same counter value, increment in parallel, and both write the same +1 — losing one of the updates. Classic race condition.",
      explRu: "Без синхронизации два потока могут прочитать одно и то же значение счётчика, инкрементировать параллельно и оба записать +1 — одно обновление потеряется. Классический race condition."
    }
  ]);

  // ---------- LECTURE 5 (Main Memory) — biggest exam coverage ----------
  push(5, [
    {
      q: "What do base and limit registers primarily define for a process?",
      opts: [
        "Its disk allocation strategy",
        "Its valid logical address range",
        "Its network communication port range",
        "Its password storage format"
      ],
      correct: 1,
      expl: "Base & limit registers define the contiguous range of legal logical addresses for a process. Every memory access is checked against them — accesses outside cause a trap.",
      explRu: "Регистры base и limit задают допустимый диапазон логических адресов процесса. Каждое обращение проверяется на попадание; выход за пределы вызывает trap."
    },
    {
      q: "If a program's final memory location is not known before loading, which binding stage requires relocatable code?",
      opts: ["Compile-time binding", "Shutdown binding", "Interrupt binding", "Load-time binding"],
      correct: 3,
      expl: "Load-time binding fixes addresses when the program is loaded. The compiler emits relocatable code; the loader patches addresses based on where it ends up in memory.",
      explRu: "Load-time связывание фиксирует адреса при загрузке. Компилятор выдаёт перемещаемый код; загрузчик корректирует адреса по фактическому расположению."
    },
    {
      q: "Which statement correctly distinguishes a page from a frame?",
      opts: [
        "A page is physical; a frame is logical",
        "A page is logical; a frame is physical",
        "Both are variable-size disk extents",
        "Both are network transport units"
      ],
      correct: 1,
      expl: "Pages are units of LOGICAL (virtual) memory; frames are equal-size units of PHYSICAL memory. They are the same SIZE but live in different address spaces.",
      explRu: "Страницы — единицы ЛОГИЧЕСКОЙ (виртуальной) памяти; фреймы — равные им по размеру единицы ФИЗИЧЕСКОЙ памяти. Размер одинаков, адресные пространства разные."
    },
    {
      q: "What is the main function of a page table?",
      opts: [
        "To list every I/O device",
        "To map pages to physical frames",
        "To store password attempts",
        "To balance distributed jobs across worker nodes"
      ],
      correct: 1,
      expl: "A page table maps each virtual page number to its current physical frame number, plus protection and present bits. Indexed by the page number portion of a virtual address.",
      explRu: "Таблица страниц отображает номер виртуальной страницы на номер физического фрейма, плюс биты защиты и присутствия. Индексируется частью «номер страницы» виртуального адреса."
    },
    {
      q: "The segment-table length register (STLR) indicates:",
      opts: [
        "The total number of disk drives",
        "The size of the TCP receive window",
        "The number of valid segments",
        "The count of failed login attempts"
      ],
      correct: 2,
      expl: "STLR holds how many segments are valid for the process. A reference with segment# ≥ STLR is illegal — caught at translation time and trapped.",
      explRu: "STLR хранит число валидных сегментов процесса. Обращение с номером сегмента ≥ STLR — недопустимо: обнаруживается при трансляции и вызывает trap."
    },
    {
      q: "Which statement best describes a logical address in an operating system?",
      opts: [
        "A permanent location on a storage device",
        "A physical slot in an I/O controller",
        "An address generated by the CPU for a process",
        "A unique identifier assigned to an open file descriptor"
      ],
      correct: 2,
      expl: "Logical (a.k.a. virtual) addresses are produced by the CPU as a program executes. The MMU then translates them to physical addresses at every access.",
      explRu: "Логические (виртуальные) адреса генерируются CPU при выполнении программы. MMU транслирует их в физические на каждом обращении."
    },
    {
      q: "What is the primary role of the Memory-Management Unit (MMU)?",
      opts: [
        "To schedule blocked I/O operations",
        "To map virtual addresses to physical addresses",
        "To store directory entries in cache",
        "To select the next process for execution on a CPU core"
      ],
      correct: 1,
      expl: "The MMU is the hardware that translates virtual addresses to physical ones, typically using a page table and TLB. It also enforces protection.",
      explRu: "MMU — аппаратный блок, транслирующий виртуальные адреса в физические через таблицу страниц и TLB. Также реализует защиту."
    },
    {
      q: "Dynamic loading improves memory use because a routine is loaded only when it is:",
      opts: [
        "Created by the compiler before the executable is started",
        "Actually needed during execution",
        "Copied into swap space",
        "Placed into a page table"
      ],
      correct: 1,
      expl: "With dynamic loading a routine stays on disk until first called — code paths that never execute never consume RAM.",
      explRu: "При динамической загрузке процедура остаётся на диске до первого вызова — ветви, которые не выполняются, не занимают ОЗУ."
    },
    {
      q: "In swapping, a process is temporarily moved from main memory to:",
      opts: [
        "A CPU register",
        "An interrupt vector",
        "A page-table entry",
        "A backing store"
      ],
      correct: 3,
      expl: "Swapped-out processes (or pages) are written to the backing store — typically a swap partition or swap file on disk.",
      explRu: "Выгруженные процессы (или страницы) пишутся на backing store — обычно swap-раздел или файл подкачки на диске."
    },
    {
      q: "Which memory-management method avoids external fragmentation by using fixed-size units?",
      opts: [
        "Contiguous allocation",
        "Variable partitioning",
        "Paging",
        "Segmentation only"
      ],
      correct: 2,
      expl: "Paging breaks memory into equal-size frames; any free frame fits any page — so external fragmentation cannot occur. Internal fragmentation in the last page can still happen.",
      explRu: "Страничная организация делит память на равные фреймы; любой свободный фрейм подходит любой странице — внешняя фрагментация невозможна. Внутренняя в последней странице остаётся."
    },
    {
      q: "Why is a Translation Look-aside Buffer (TLB) useful?",
      opts: [
        "It speeds up address translation",
        "It allocates disk blocks",
        "It prevents all page faults during program execution",
        "It stores process credentials"
      ],
      correct: 0,
      expl: "The TLB caches recent virtual→physical translations. On a hit, translation costs almost nothing; without it, every memory access would need an extra page-table read.",
      explRu: "TLB кэширует недавние трансляции виртуальный→физический. При попадании — почти бесплатно; без него каждое обращение требовало бы дополнительного чтения таблицы."
    },
    {
      q: "A logical address in segmentation normally contains:",
      opts: [
        "A segment number and an offset",
        "A page number and a frame number",
        "A device number and an IRQ",
        "A track number and a sector"
      ],
      correct: 0,
      expl: "Each segmented logical address is a pair (segment#, offset). The segment# indexes the segment table; the offset is checked against the segment's length.",
      explRu: "Каждый сегментированный логический адрес — пара (номер сегмента, смещение). Номер индексирует таблицу сегментов; смещение сверяется с длиной сегмента."
    },
    {
      q: "With paging, which type of fragmentation may still occur?",
      opts: [
        "No fragmentation of any kind",
        "Internal fragmentation",
        "External fragmentation only",
        "Network fragmentation"
      ],
      correct: 1,
      expl: "Pages are fixed size, so the last page of a file/process is usually only partly used — internal fragmentation. External fragmentation is gone.",
      explRu: "Страницы фикс. размера: последняя страница процесса обычно занята не полностью — внутренняя фрагментация. Внешней нет."
    }
  ]);

  // ---------- LECTURE 6 (I/O Systems) ----------
  push(6, [
    {
      q: "Memory-mapped I/O works by:",
      opts: [
        "Converting files into page tables",
        "Executing user code inside device firmware during ordinary application I/O",
        "Placing device registers in the processor address space",
        "Replacing device drivers with passwords"
      ],
      correct: 2,
      expl: "MMIO maps a device's control/data registers into the CPU's physical address space, so the driver reads and writes them using ordinary load/store instructions.",
      explRu: "MMIO отображает регистры устройства в физическое адресное пространство CPU — драйвер читает и пишет их обычными инструкциями load/store."
    },
    {
      q: "What typically triggers interrupt-driven I/O?",
      opts: [
        "A process changes its file extension",
        "A page table becomes empty",
        "A device sends an interrupt request",
        "A user opens a folder"
      ],
      correct: 2,
      expl: "When a device has data ready or finishes a transfer it raises an interrupt request (IRQ) line; the CPU then runs the registered ISR.",
      explRu: "Когда у устройства есть данные или оно завершило операцию, оно поднимает линию IRQ; CPU вызывает зарегистрированный обработчик ISR."
    },
    {
      q: "Before a DMA transfer begins, the operating system prepares:",
      opts: [
        "A DMA command block",
        "A new network topology",
        "A file lock table",
        "A user-role matrix"
      ],
      correct: 0,
      expl: "The OS fills in a DMA command block: source/destination addresses, transfer length, direction, and any per-device flags. The DMA controller reads it and executes the transfer.",
      explRu: "ОС заполняет блок команд DMA: адреса источника/приёмника, длину передачи, направление, флаги. DMA-контроллер читает его и выполняет передачу."
    },
    {
      q: "Nonblocking I/O returns:",
      opts: [
        "Only after the complete transfer has fully finished and returned to the caller",
        "Only when the system reboots",
        "After all processes have stopped",
        "Immediately with currently available data or status"
      ],
      correct: 3,
      expl: "A nonblocking call returns straight away — possibly with 0 bytes — and the caller checks again later. Contrast with blocking I/O which suspends the caller.",
      explRu: "Неблокирующий вызов возвращается сразу — возможно с 0 байтами — а вызывающий проверяет позже. В отличие от блокирующего, который приостанавливает поток."
    },
    {
      q: "Why are I/O instructions usually privileged?",
      opts: [
        "To make every program run in kernel mode",
        "To disable interrupts in regular applications before every device access",
        "To prevent user programs from disrupting hardware control",
        "To turn open files into swap pages"
      ],
      correct: 2,
      expl: "If any user program could directly touch device registers, malicious or buggy code could overwrite firmware, corrupt other users' data, or crash the bus. So I/O instructions are privileged and require a syscall.",
      explRu: "Если бы любая программа могла трогать регистры устройств, вредоносный или баговый код мог бы перезаписать прошивку, испортить данные других пользователей, обрушить шину. Поэтому I/O-инструкции — привилегированные."
    },
    {
      q: "Why can polling be inefficient for a slow I/O device?",
      opts: [
        "It disables all storage access",
        "It wastes CPU time while waiting",
        "It increases the number of files",
        "It removes the need for drivers"
      ],
      correct: 1,
      expl: "Polling means looping while reading a status register. If the device is slow, the CPU spins doing no useful work — interrupts solve this by letting the device signal when ready.",
      explRu: "Опрос — это цикл с чтением status-регистра. На медленном устройстве CPU крутится впустую — прерывания решают это: устройство само сигналит о готовности."
    },
    {
      q: "What does an interrupt vector help the operating system determine?",
      opts: [
        "Which page should be swapped out during memory pressure",
        "Which handler should process the interrupt",
        "Which memory block is free",
        "Which file has the largest size"
      ],
      correct: 1,
      expl: "The interrupt vector is a table indexed by interrupt number; each entry holds the address of the ISR that handles that interrupt. The CPU dispatches via the vector.",
      explRu: "Вектор прерываний — таблица, индексируемая номером прерывания; в каждой ячейке адрес ISR для данного прерывания. CPU использует её для диспетчеризации."
    },
    {
      q: "Direct Memory Access (DMA) is mainly used to:",
      opts: [
        "Translate virtual addresses",
        "Move large data blocks with limited CPU involvement",
        "Lock a user account after failures",
        "Choose a CPU scheduling algorithm for every blocked process"
      ],
      correct: 1,
      expl: "DMA offloads bulk data transfers from the CPU. The controller moves blocks directly between device and memory, generating one interrupt per block.",
      explRu: "DMA снимает с CPU массовые передачи. Контроллер перемещает блоки напрямую между устройством и памятью, выдавая одно прерывание на блок."
    },
    {
      q: "Asynchronous I/O allows a process to:",
      opts: [
        "Block until every transfer and notification has fully completed",
        "Bypass the operating system kernel",
        "Read only from memory-mapped files",
        "Continue running while the I/O request is handled"
      ],
      correct: 3,
      expl: "Async I/O hands the request to the kernel and immediately returns control to the caller; a callback, signal, or status check notifies completion later.",
      explRu: "Асинхронный I/O передаёт запрос ядру и сразу возвращает управление вызывающему; о завершении сообщает callback, сигнал или проверка статуса."
    },
    {
      q: "In the kernel I/O subsystem, buffering means:",
      opts: [
        "Encrypting every device request",
        "Removing all waiting processes",
        "Replacing interrupt-driven transfers with continuous polling",
        "Temporarily holding data during transfer"
      ],
      correct: 3,
      expl: "A buffer is a kernel staging area between producer and consumer. It smooths speed mismatches, supports copy semantics, and adapts different transfer sizes.",
      explRu: "Буфер — промежуточное хранилище в ядре между производителем и потребителем. Сглаживает разные скорости, даёт copy semantics, согласует размеры передач."
    }
  ]);

  // ---------- LECTURE 7 (File-System Interface) ----------
  push(7, [
    {
      q: "Which file operation changes the current position for the next read or write?",
      opts: ["Mount", "Seek", "Fork", "Hash"],
      correct: 1,
      expl: "seek() (lseek in UNIX, SetFilePointer in Windows) moves the file's read/write pointer. Subsequent reads/writes start at that offset.",
      explRu: "seek() (lseek в UNIX, SetFilePointer в Windows) перемещает указатель чтения/записи. Следующие операции начинаются с этого смещения."
    },
    {
      q: "In sequential file access, operations typically proceed by:",
      opts: [
        "Jumping to any arbitrary block only",
        "Reading the next record in order",
        "Rewriting the page table first",
        "Invalidating all cached files"
      ],
      correct: 1,
      expl: "Sequential access reads one record then the next, in order — like a tape. Direct/random access lets you jump anywhere by block number.",
      explRu: "Последовательный доступ читает запись за записью по порядку — как ленту. Прямой/случайный доступ — переход по номеру блока."
    },
    {
      q: "A two-level directory structure mainly provides:",
      opts: [
        "One shared directory for all users only",
        "A direct replacement for page tables",
        "Automatic file encryption",
        "A separate directory for each user"
      ],
      correct: 3,
      expl: "In a two-level scheme each user gets their own private directory under a master directory — eliminating the name collisions that plague a single flat dir.",
      explRu: "Двухуровневая схема: у каждого пользователя свой каталог под мастер-каталогом — нет коллизий имён, как в плоском одноуровневом."
    },
    {
      q: "Which file attribute is directly related to access rights?",
      opts: ["Creation time", "Storage location", "Protection", "File extension"],
      correct: 2,
      expl: "The 'protection' attribute (UNIX rwx bits, ACLs, Windows DACLs) encodes who may read, write, or execute the file.",
      explRu: "Атрибут «protection» (биты rwx в UNIX, ACL, DACL в Windows) задаёт, кто может читать, писать, исполнять файл."
    },
    {
      q: "What does an open-file table record?",
      opts: [
        "Only deleted files",
        "All free memory frames",
        "Files that are currently open",
        "Every active network route currently held in memory"
      ],
      correct: 2,
      expl: "The open-file table tracks every file currently open: location, access mode, read/write pointer, and a reference count for shared opens.",
      explRu: "Таблица открытых файлов отслеживает все открытые файлы: расположение, режим, указатель чтения/записи, счётчик ссылок."
    },
    {
      q: "An advisory file lock differs from a mandatory lock because it:",
      opts: [
        "Always blocks every possible file operation without cooperation",
        "Is stored only inside the CPU cache",
        "Cannot be used with shared files",
        "Can be inspected and respected by cooperating processes"
      ],
      correct: 3,
      expl: "Advisory locks rely on processes voluntarily checking them. Mandatory locks are enforced by the kernel and block any conflicting access regardless of cooperation.",
      explRu: "Advisory-локи работают, только если процессы их проверяют. Mandatory — обязательны: ядро блокирует конфликтующий доступ независимо от «согласия» процессов."
    },
    {
      q: "Which allocation method stores a file in consecutive disk blocks?",
      opts: [
        "Contiguous allocation",
        "Linked allocation",
        "Indexed allocation",
        "Indexed block allocation"
      ],
      correct: 0,
      expl: "Contiguous allocation places a file in a run of consecutive blocks — fast random access, but suffers external fragmentation and growth issues.",
      explRu: "Непрерывное размещение кладёт файл в подряд идущие блоки — быстрый случайный доступ, но внешняя фрагментация и трудности с ростом файла."
    },
    {
      q: "What does a bit vector in free-space management represent?",
      opts: [
        "Only files opened by administrators",
        "Used and available disk blocks",
        "The order of process interrupts",
        "Passwords stored in plain text"
      ],
      correct: 1,
      expl: "Each bit corresponds to one block on disk: 0 = used, 1 = free (or vice versa). Bitwise scans find free blocks quickly.",
      explRu: "Каждый бит — один блок диска: 0 — занят, 1 — свободен (или наоборот). Битовые операции быстро находят свободные блоки."
    }
  ]);

  // ---------- LECTURE 8 (FS Internals & Windows) ----------
  push(8, [
    {
      q: "The Network File System (NFS) is designed to:",
      opts: [
        "Share files across machines over a network",
        "Schedule CPU bursts across local ready queues during execution",
        "Compress memory images",
        "Replace all access checks"
      ],
      correct: 0,
      expl: "NFS lets a client mount a remote directory exported by a server so its files look local. It uses RPC + XDR for cross-platform interoperability.",
      explRu: "NFS позволяет клиенту смонтировать удалённый каталог, экспортированный сервером, чтобы файлы выглядели локальными. Использует RPC + XDR для совместимости платформ."
    },
    {
      q: "In NFS, a mounted remote directory appears to users as:",
      opts: [
        "A separate CPU execution queue for remote jobs",
        "An unformatted disk region",
        "An interrupt controller entry",
        "Part of the local file-system tree"
      ],
      correct: 3,
      expl: "Mounting splices the remote subtree into the local namespace at a chosen mount point — applications see it as just another directory.",
      explRu: "Монтирование вставляет удалённое поддерево в локальное пространство имён в точке монтирования — приложения видят его как обычный каталог."
    },
    {
      q: "What does the Windows Object Manager supervise?",
      opts: [
        "Kernel objects, handles, and security checks",
        "Only physical disk cooling",
        "Only network packet encryption",
        "Only password lockout timers within the authentication service"
      ],
      correct: 0,
      expl: "The Object Manager is a core Windows Executive component: it creates, names, tracks, and protects kernel objects (processes, threads, files, events) and dispatches handle operations through security checks.",
      explRu: "Object Manager — компонент Windows Executive: создаёт, именует, отслеживает и защищает объекты ядра (процессы, потоки, файлы, события), управляет handle через проверки безопасности."
    },
    {
      q: "What is the basic allocation unit used by NTFS on disk?",
      opts: ["Cluster", "Page table", "Interrupt", "Thread"],
      correct: 0,
      expl: "NTFS allocates space in CLUSTERS — groups of consecutive sectors (typically 4 KB on modern volumes). Files consist of one or more clusters.",
      explRu: "NTFS выделяет место КЛАСТЕРАМИ — группами подряд идущих секторов (обычно 4 КБ на современных томах). Файлы состоят из одного или нескольких кластеров."
    },
    {
      q: "What is stored in the NTFS Master File Table (MFT)?",
      opts: [
        "Active TCP acknowledgements and retransmission counters",
        "CPU branch predictions",
        "Records describing files and metadata",
        "Only volatile cache lines"
      ],
      correct: 2,
      expl: "The MFT contains one record per file/directory holding metadata: name, timestamps, permissions, and the file's data runs (or small files inline).",
      explRu: "MFT содержит по одной записи на файл/каталог: имя, временные метки, права, описания фрагментов данных файла (или сами данные для маленьких файлов)."
    },
    {
      q: "The Virtual File System (VFS) layer is useful because it:",
      opts: [
        "Turns every remote disk into swap space",
        "Eliminates the need for directories",
        "Offers a common interface to different file-system types",
        "Replaces the operating-system scheduler during file requests"
      ],
      correct: 2,
      expl: "VFS exposes one set of file syscalls and dispatches to the correct FS implementation underneath — local (ext4, NTFS), remote (NFS, SMB) or virtual (procfs).",
      explRu: "VFS даёт один набор системных вызовов и диспетчирует к нужной реализации ФС — локальной (ext4, NTFS), удалённой (NFS, SMB) или виртуальной (procfs)."
    }
  ]);

  // ---------- LECTURE 9 (Security & Protection) ----------
  push(9, [
    {
      q: "A breach of confidentiality occurs when data is:",
      opts: [
        "Read by an unauthorized party",
        "Modified without permission",
        "Made unavailable by overload",
        "Scheduled with a short time slice"
      ],
      correct: 0,
      expl: "Confidentiality = secrecy. Breach of confidentiality means someone read information they shouldn't. Modification is an integrity breach; overload-induced unavailability is a DoS.",
      explRu: "Конфиденциальность = секретность. Её нарушение — кто-то прочитал то, что не должен был. Модификация — нарушение целостности; перегрузка-недоступность — DoS."
    },
    {
      q: "Masquerading is an attack in which someone:",
      opts: [
        "Pretends to be an authorized user",
        "Deletes unused disk blocks",
        "Splits a file into extents",
        "Improves network redundancy by hiding user identities"
      ],
      correct: 0,
      expl: "Masquerading means impersonating a legitimate principal to gain their access. It is the prototypical authentication breach.",
      explRu: "Маскарад — выдача себя за легитимного пользователя ради его доступа. Классическое нарушение аутентификации."
    },
    {
      q: "A man-in-the-middle attack involves:",
      opts: [
        "Allocating memory for background services",
        "Rewriting file systems after a crash",
        "Switching scheduling algorithms automatically during communication",
        "Intercepting communication between two parties"
      ],
      correct: 3,
      expl: "MitM positions the attacker between sender and receiver, masquerading as each to the other and potentially reading or modifying the traffic.",
      explRu: "MitM ставит атакующего между отправителем и получателем; он выдаёт себя каждой стороне за противоположную, может читать и модифицировать трафик."
    },
    {
      q: "Why is a Message Authentication Code (MAC) used?",
      opts: [
        "To allocate a new network adapter whenever packet delivery fails",
        "To verify integrity and authenticity with a shared secret",
        "To identify free physical frames",
        "To create a process control block"
      ],
      correct: 1,
      expl: "A MAC is a tag computed over a message + a shared secret key. Anyone with the key can verify the message wasn't altered AND came from a holder of that key.",
      explRu: "MAC — тег, вычисленный по сообщению и общему секретному ключу. Любой с ключом убедится, что сообщение не изменено И пришло от владельца ключа."
    },
    {
      q: "A digital certificate primarily links:",
      opts: [
        "A file size to a disk sector",
        "A public key to an identity",
        "An interrupt to a scheduler",
        "A page fault to a network route"
      ],
      correct: 1,
      expl: "An X.509 certificate is essentially a signed statement: 'this public key belongs to this entity.' The signature comes from a trusted Certificate Authority.",
      explRu: "Сертификат X.509 — подписанное утверждение: «этот открытый ключ принадлежит данному субъекту». Подпись ставит доверенный CA."
    },
    {
      q: "Before a protected file operation is executed in an access-control system, the program should first:",
      opts: [
        "Create a new user account automatically",
        "Hash the file name into a page number before any authorization check",
        "Verify that the role has the required permission",
        "Reduce the process priority"
      ],
      correct: 2,
      expl: "Access control means: identify the principal, check their rights against the resource's policy, then allow or deny. Skipping the check is a security bug.",
      explRu: "Контроль доступа: установить субъекта, проверить его права против политики ресурса, разрешить или запретить. Пропуск проверки — уязвимость."
    },
    {
      q: "What is a threat in computer security?",
      opts: [
        "A potential security violation",
        "A fully completed system shutdown",
        "A valid login by an administrator",
        "A compressed archive on disk"
      ],
      correct: 0,
      expl: "A threat is a POTENTIAL violation — the possibility of an attack. An attack is the actual attempt; a vulnerability is the weakness the threat exploits.",
      explRu: "Угроза — ВОЗМОЖНОЕ нарушение, потенциал атаки. Атака — само действие; уязвимость — слабость, через которую угроза реализуется."
    },
    {
      q: "The Principle of Least Privilege requires that users receive:",
      opts: [
        "All permissions by default",
        "Administrative rights during every session",
        "Only the access needed for their tasks",
        "The same rights as the operating system kernel"
      ],
      correct: 2,
      expl: "Least Privilege grants each principal the MINIMUM rights needed. Limits blast radius if the account is compromised.",
      explRu: "Least Privilege выдаёт каждому субъекту МИНИМУМ необходимых прав. Ограничивает урон при компрометации."
    },
    {
      q: "Ransomware is typically designed to:",
      opts: [
        "Improve file-system indexing",
        "Reduce memory fragmentation",
        "Balance traffic across nodes during distributed communication",
        "Encrypt data and demand payment for restoration"
      ],
      correct: 3,
      expl: "Ransomware encrypts victim files (often with strong asymmetric crypto) and extorts payment for the decryption key.",
      explRu: "Шифровальщик шифрует файлы жертвы (часто сильной асимметричной криптографией) и требует выкуп за ключ дешифровки."
    },
    {
      q: "Symmetric cryptography uses:",
      opts: [
        "One shared secret key",
        "A public key only",
        "An interrupt descriptor",
        "A disk block bitmap"
      ],
      correct: 0,
      expl: "Symmetric ciphers (AES, ChaCha20) use the same key for encryption and decryption — fast and compact, but key distribution is the hard problem.",
      explRu: "Симметричные шифры (AES, ChaCha20) используют один и тот же ключ для шифрования и дешифровки — быстро и компактно, но распределение ключей трудно."
    },
    {
      q: "What does a cryptographic hash function produce?",
      opts: [
        "A new process state",
        "A network route table for packet forwarding",
        "A physical memory frame",
        "A fixed-size digest of input data"
      ],
      correct: 3,
      expl: "A cryptographic hash maps arbitrary-length input to a fixed-size digest (e.g. 256 bits for SHA-256) that is hard to invert or collide.",
      explRu: "Криптографический хеш отображает данные произвольной длины в фикс. размер (256 бит для SHA-256), который трудно обратить или найти коллизию."
    }
  ]);

  // ---------- LECTURE 10 (Network & Distributed Systems) ----------
  push(10, [
    {
      q: "What does transparency mean in a distributed system?",
      opts: [
        "Showing every internal server address and storage location to users",
        "Disabling access to remote resources",
        "Hiding distribution details from users where possible",
        "Using only local file systems"
      ],
      correct: 2,
      expl: "Transparency hides the fact that data and computation live across multiple machines — location, migration, replication, failure should all be invisible to users.",
      explRu: "Прозрачность скрывает от пользователя факт распределения данных и вычислений — местоположение, миграция, репликация, сбои должны быть незаметны."
    },
    {
      q: "Which network type generally covers a small geographic area such as a campus or office?",
      opts: ["LAN", "WAN", "TLB", "VFS"],
      correct: 0,
      expl: "LAN = Local Area Network: a building or campus. WAN spans cities/countries; TLB and VFS aren't network types at all.",
      explRu: "LAN — Local Area Network: здание или кампус. WAN — города/страны; TLB и VFS — вообще не типы сетей."
    },
    {
      q: "What protocol resolves an IPv4 address to a MAC address on a local network?",
      opts: ["TCP", "NFS", "DMA", "ARP"],
      correct: 3,
      expl: "ARP (Address Resolution Protocol) broadcasts 'who has IP X?' on the LAN; the owner replies with its MAC. The result is cached briefly.",
      explRu: "ARP (Address Resolution Protocol) шлёт широковещание «у кого IP X?» в LAN; владелец отвечает MAC-адресом. Результат недолго кэшируется."
    },
    {
      q: "In a cache-coherence scheme, invalidating another processor's shared copy is normally required when:",
      opts: [
        "One processor writes a new value to that same address",
        "A process opens a read-only file",
        "A login attempt succeeds once",
        "A scheduler recalculates turnaround time for an unrelated process"
      ],
      correct: 0,
      expl: "Write-invalidate protocols (MESI etc.) ensure that when one core writes, all other caches holding that line transition to Invalid — preserving a single coherent view of memory.",
      explRu: "Протоколы write-invalidate (MESI и др.): когда одно ядро пишет, все другие кэши с этой строкой переходят в Invalid — сохраняя единое согласованное представление памяти."
    },
    {
      q: "A distributed system is best described as:",
      opts: [
        "Multiple connected nodes working together",
        "One CPU core executing a single thread",
        "A standalone file in local storage",
        "A private cache without cross-node synchronization"
      ],
      correct: 0,
      expl: "Distributed = multiple autonomous nodes coordinating over a network to achieve a common goal, often presenting a single-system illusion.",
      explRu: "Распределённая = несколько автономных узлов, координирующихся по сети ради общей цели, часто с иллюзией одной системы."
    },
    {
      q: "In distributed systems, load balancing aims to:",
      opts: [
        "Delete jobs when queues grow",
        "Move work toward less busy resources",
        "Disable remote communication",
        "Replace authentication with caching on less busy resources"
      ],
      correct: 1,
      expl: "Load balancing redirects requests/jobs from busy nodes to idler ones, smoothing utilization and improving overall throughput and latency.",
      explRu: "Балансировка нагрузки перенаправляет запросы/задания с занятых узлов к свободным, выравнивая загрузку и улучшая пропускную способность и задержки."
    },
    {
      q: "Which transport protocol is reliable and connection-oriented?",
      opts: ["UDP", "ARP", "DNS", "TCP"],
      correct: 3,
      expl: "TCP establishes a connection (3-way handshake), sequences bytes, retransmits losses, and tears down cleanly. UDP is connectionless and unreliable.",
      explRu: "TCP устанавливает соединение (3-way handshake), упорядочивает байты, переотправляет потерянные, корректно завершается. UDP — без соединения и без гарантий."
    }
  ]);

  // Tag count for UI:
  window.AOS_EXAM_COUNT = 60;
})();
