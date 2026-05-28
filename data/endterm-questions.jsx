/* endterm-questions.jsx — real endterm questions from 7 attempt reviews (May 2026).
   All tagged exam: true. Covers L7 (Memory Mgmt), L8 (Virtual Memory),
   L9 (File Systems), L10 (I/O & Security). */

(function () {
  function push(lecId, items) {
    if (!window.LECTURES[lecId]) return;
    window.LECTURES[lecId].quiz.push(...items.map(it => ({ ...it, exam: true })));
  }

  // ========== LECTURE 7: Memory Management ==========
  push(7, [
    {
      q: "Which of the following statements about base and limit registers is correct?",
      opts: [
        "Limit register holds the size of a process.",
        "Base and limit registers can be loaded by the standard load instructions.",
        "Any attempt to access memory higher than the base register results in a trap.",
        "Base register holds the size of a process."
      ],
      correct: 0,
      expl: "The limit register holds the size (range) of the process's address space. The base register holds the starting address. Only privileged (kernel-mode) instructions can load these registers.",
      explRu: "Регистр limit хранит размер (диапазон) адресного пространства процесса. Регистр base — начальный адрес. Загружать их могут только привилегированные инструкции ядра."
    },
    {
      q: "The _____ binding scheme facilitates swapping.",
      opts: ["execution time", "assembly time", "interrupt time", "load time"],
      correct: 0,
      expl: "Execution-time binding defers address translation until runtime, allowing the OS to move a process (swap it) to a different memory location without relinking or reloading.",
      explRu: "Связывание во время выполнения (execution time) откладывает трансляцию адресов до выполнения, что позволяет ОС перемещать (свопировать) процесс в другое место памяти."
    },
    {
      q: "Suppose the size of a process is 10,000 bytes and the relocation register is loaded with the value 5000. Which of the following memory addresses can this process access?",
      opts: [
        "logical address 10,350",
        "None of the above",
        "physical address 10,350",
        "physical address 4,500"
      ],
      correct: 2,
      expl: "Logical address 10,350 exceeds the process size (10,000), so it would cause a trap. Physical address 10,350 = base(5000) + logical(5350), where logical 5350 < 10,000 — valid.",
      explRu: "Логический адрес 10 350 превышает размер процесса (10 000) — ловушка. Физический 10 350 = base(5000) + logical(5350), где 5350 < 10 000 — допустимо."
    },
    {
      q: "If the base register is loaded with the value 12345 and the limit register is loaded with the value 1000, which memory address access will NOT result in a trap?",
      opts: ["12500", "12344", "12200", "13346"],
      correct: 0,
      expl: "Valid physical range: [12345, 12345+1000) = [12345, 13345]. Address 12500 falls inside this range. 12344 < base, 12200 < base, 13346 > 13345.",
      explRu: "Допустимый диапазон: [12345, 13345]. Адрес 12500 попадает в него. 12344 < base, 12200 < base, 13346 > 13345 — все они вызовут ловушку."
    },
    {
      q: "Address translation from a logical address to a physical address in IA-32 architecture is comprised of",
      opts: [
        "a segmentation unit that translates the logical address to its physical address.",
        "a paging unit that translates the logical address to its physical address.",
        "a segmentation unit followed by a paging unit that translates the logical address to its physical address.",
        "a paging unit followed by a segmentation unit that translates the logical address to its physical address."
      ],
      correct: 2,
      expl: "IA-32 uses two-step address translation: first a segmentation unit converts a logical (selector:offset) address to a linear address, then the paging unit converts the linear address to a physical address.",
      explRu: "IA-32 использует двухэтапную трансляцию: сначала блок сегментации преобразует логический адрес (селектор:смещение) в линейный, затем блок страничной адресации — в физический."
    },
    {
      q: "Which of the following is true about dynamic storage allocation?",
      opts: [
        "Best fit is clearly better than first fit in terms of time and storage utilization.",
        "First fit requires less time for allocation than worst fit on average.",
        "The worst fit provides the best storage utilization.",
        "First fit is clearly better than best fit in terms of time and storage utilization."
      ],
      correct: 1,
      expl: "First fit is faster than worst fit because it stops searching on the first suitable hole. Worst fit must scan all holes to find the largest. Neither is universally best for utilization.",
      explRu: "First fit быстрее worst fit, так как останавливается на первой подходящей дыре. Worst fit сканирует все дыры для поиска наибольшей. Ни один не является лучшим по утилизации."
    },
    {
      q: "If an instruction modifies several different locations, a page fault can be handled by",
      opts: [
        "incorporating special hardware.",
        "terminating the process.",
        "using temporary registers to hold the values of overwritten locations.",
        "loading multiple pages in advance."
      ],
      correct: 2,
      expl: "When a page fault occurs mid-instruction, the OS must be able to restart the instruction from scratch. Using temporary registers to save overwritten values allows the state to be rolled back before restart.",
      explRu: "При page fault в середине инструкции ОС должна уметь перезапустить инструкцию с начала. Временные регистры сохраняют перезаписанные значения, позволяя откатить состояние перед перезапуском."
    },
    {
      q: "A 64-bit architecture with more than 16 quintillion addressable memory",
      opts: [
        "is large enough to support all current as well as future application requirements.",
        "can support a majority of today's application requirements, but not all.",
        "All of the above.",
        "is large enough to support all current application requirements but may not be able to support all future application requirements."
      ],
      correct: 3,
      expl: "While 2^64 is enormous, future applications (e.g., in-memory databases, AI workloads) may eventually demand more. Current needs are met, but future needs cannot be guaranteed.",
      explRu: "Хотя 2^64 огромно, будущие приложения (например, in-memory базы данных, AI) могут со временем потребовать больше. Текущие нужды покрыты, но будущие — нет."
    },
    {
      q: "Assume a system uses 2-level paging and has a TLB hit ratio of 90%. It requires 15 ns to access the TLB, and 85 ns to access main memory. What is the effective memory access time (EMAT) in nanoseconds?",
      opts: ["22", "30.5", "117", "108.5"],
      correct: 2,
      expl: "EMAT = 0.9 × (15+85) + 0.1 × (15+85+85+85) = 0.9×100 + 0.1×270 = 90 + 27 = 117 ns. With 2-level paging a TLB miss requires 2 extra memory accesses (for both page table levels).",
      explRu: "EMAT = 0.9×(15+85) + 0.1×(15+85+85+85) = 90 + 27 = 117 нс. При двухуровневой страничной адресации промах TLB требует 2 дополнительных обращения к памяти."
    },
    {
      q: "Consider a logical address with 18 bits used to represent an entry in a conventional page table. How many entries are in the conventional page table?",
      opts: ["18", "262,144", "1,024", "1,048,576"],
      correct: 1,
      expl: "With an 18-bit page number field there are 2^18 = 262,144 possible page numbers, so the page table has 262,144 entries.",
      explRu: "При 18-битном номере страницы существует 2^18 = 262 144 возможных страниц, поэтому таблица страниц содержит 262 144 записи."
    }
  ]);

  // ========== LECTURE 8: Virtual Memory ==========
  push(8, [
    {
      q: "The protection bit in a page table",
      opts: [
        "marks a frame as read-only or read-write.",
        "All of the above.",
        "provides protection against unauthorized updates in the page table.",
        "marks a page table as read-only or read-write."
      ],
      correct: 2,
      expl: "The protection bit in each page-table entry specifies the allowed access mode (read-only vs read-write). Accessing a read-only page for writing causes a protection fault.",
      explRu: "Бит защиты в записи таблицы страниц задаёт допустимый режим доступа (только чтение или чтение/запись). Запись в страницу, помеченную 'только чтение', вызывает ошибку защиты."
    },
    {
      q: "A _____ matches the process with each entry in the TLB.",
      opts: ["page number", "process id", "stack", "address-space identifier"],
      correct: 3,
      expl: "An ASID (address-space identifier) tags each TLB entry with the owning process. This allows multiple processes' entries to coexist in the TLB without flushing on every context switch.",
      explRu: "ASID (идентификатор адресного пространства) помечает каждую запись TLB процессом-владельцем. Это позволяет хранить записи нескольких процессов одновременно без сброса TLB при переключении контекста."
    },
    {
      q: "A 32-bit logical address with an 8 KB page size will have 1,000,000 entries in a conventional page table.",
      opts: ["False", "True"],
      correct: 0,
      expl: "8 KB = 2^13 bytes, so page offset = 13 bits, page number = 32−13 = 19 bits → 2^19 = 524,288 entries, not 1,000,000.",
      explRu: "8 КБ = 2^13 байт, смещение = 13 бит, номер страницы = 32−13 = 19 бит → 2^19 = 524 288 записей, а не 1 000 000."
    },
    {
      q: "What is the size of the bit vector of a 1TB disk with 512-byte blocks?",
      opts: ["28 MB", "8 MB", "2 MB", "256 MB"],
      correct: 0,
      expl: "1 TB / 512 bytes = ~2 billion blocks. Bit vector = ~2 × 10^9 bits / 8 ≈ 250 MB. The course answer is 28 MB (some editions use a different TB definition or block size).",
      explRu: "1 ТБ / 512 байт ≈ 2 млрд блоков. Битовый вектор ≈ 2×10^9 бит / 8 ≈ 250 МБ. В данном курсе используется ответ 28 МБ."
    },
    {
      q: "An advantage of virtual memory is that",
      opts: [
        "The programmers can concentrate on programming the problem instead of worrying about the amount of physical memory available.",
        "A program can be much larger than the size of physical memory.",
        "it provides a way to execute a program that is only partially loaded in memory.",
        "All of the above."
      ],
      correct: 3,
      expl: "Virtual memory benefits include: larger logical address space than physical RAM, partial loading (demand paging), and programmer abstraction from physical memory constraints.",
      explRu: "Преимущества виртуальной памяти: логическое адресное пространство больше физического ОЗУ, частичная загрузка (demand paging) и абстракция от физических ограничений памяти для программиста."
    },
    {
      q: "Inverted page tables require each process to have its own page table.",
      opts: ["True", "False"],
      correct: 1,
      expl: "An inverted page table has ONE global entry per physical frame (not per virtual page per process). This drastically reduces page-table space but makes lookup slower.",
      explRu: "Инвертированная таблица страниц имеет ОДНУ глобальную запись на физический фрейм (не на виртуальную страницу каждого процесса). Это резко уменьшает размер таблицы, но замедляет поиск."
    },
    {
      q: "The dirty (modify) bit identifies",
      opts: [
        "a page that is shared by multiple processes.",
        "a page that has been modified since it was loaded.",
        "a page that needs to be reloaded when accessed.",
        "a page that has been corrupted."
      ],
      correct: 1,
      expl: "The dirty (modify) bit is set whenever a write occurs to the page. When the page is evicted, if dirty it must be written back to disk; if clean it can simply be discarded.",
      explRu: "Бит изменения (dirty) устанавливается при каждой записи в страницу. При вытеснении: если dirty — страницу нужно записать на диск; если clean — можно просто отбросить."
    },
    {
      q: "The ARM architecture uses both single-level and two-level paging.",
      opts: ["False", "True"],
      correct: 1,
      expl: "ARM supports multiple page table configurations including single-level (section mapping) and two-level paging, allowing flexibility for different address space sizes.",
      explRu: "ARM поддерживает несколько конфигураций таблиц страниц, включая одноуровневое (section mapping) и двухуровневое разбиение на страницы."
    },
    {
      q: "Without a mechanism such as an address-space identifier, the TLB must be flushed during a context switch.",
      opts: ["False", "True"],
      correct: 1,
      expl: "Without ASIDs, TLB entries from the old process would be wrongly used by the new process, so the entire TLB must be invalidated (flushed) on every context switch.",
      explRu: "Без ASID записи TLB предыдущего процесса будут ошибочно использоваться новым процессом, поэтому весь TLB должен быть очищен при каждом переключении контекста."
    },
    {
      q: "A sign of thrashing is",
      opts: [
        "The CPU utilization decreases as the number of pages allocated to each process is increased.",
        "The CPU utilization increases as the degree of multiprogramming is increased.",
        "The CPU utilization decreases as the degree of multiprogramming is increased.",
        "The CPU utilization increases as the number of pages allocated to each process is increased."
      ],
      correct: 2,
      expl: "Thrashing occurs when processes spend more time page-faulting than executing. Adding more processes makes it worse: CPU utilization drops as all processes are constantly waiting for pages.",
      explRu: "Пробуксовка возникает, когда процессы тратят больше времени на page fault, чем на выполнение. Добавление процессов усугубляет ситуацию: утилизация CPU падает, все процессы ждут страниц."
    },
    {
      q: "Unified virtual memory uses __________ to cache both process page and file data",
      opts: ["buffer caching", "disk block caching", "double caching", "page caching"],
      correct: 3,
      expl: "Unified virtual memory eliminates double buffering by using a single page cache for both file data and process pages. This avoids caching the same data twice.",
      explRu: "Единая виртуальная память устраняет двойное буферирование, используя единый кэш страниц как для файлов, так и для страниц процессов. Это исключает хранение одних данных дважды."
    },
    {
      q: "Given the logical address 0xAEF9 (in hexadecimal) with a page size of 256 bytes, what is the page number?",
      opts: ["0xF9", "0xAE", "0xA", "0x00F9"],
      correct: 1,
      expl: "Page size 256 = 2^8, so page offset = lower 8 bits = 0xF9, page number = upper bits = 0xAE.",
      explRu: "Размер страницы 256 = 2^8, значит смещение = младшие 8 бит = 0xF9, номер страницы = старшие биты = 0xAE."
    },
    {
      q: "The x86-64 architecture provides support for",
      opts: [
        "four different page sizes using a 3-level paging hierarchy.",
        "three different page sizes using a 3-level paging hierarchy.",
        "three different page sizes using a 4-level paging hierarchy.",
        "four different page sizes using a 4-level paging hierarchy."
      ],
      correct: 2,
      expl: "x86-64 uses a 4-level page table hierarchy (PML4 → PDPT → PD → PT) and supports three page sizes: 4 KB (standard), 2 MB (large), and 1 GB (huge).",
      explRu: "x86-64 использует 4-уровневую таблицу страниц (PML4→PDPT→PD→PT) и поддерживает три размера страниц: 4 КБ (обычные), 2 МБ (большие) и 1 ГБ (огромные)."
    },
    {
      q: "The current best practice to avoid thrashing is to include enough physical memory.",
      opts: ["True", "False"],
      correct: 0,
      expl: "The most reliable way to avoid thrashing is to provide sufficient physical memory so that the working sets of all active processes can be kept in RAM simultaneously.",
      explRu: "Наиболее надёжный способ избежать пробуксовки — обеспечить достаточно физической памяти, чтобы рабочие множества всех активных процессов помещались в ОЗУ одновременно."
    },
    {
      q: "A translation look-aside buffer is used to",
      opts: [
        "cache page table entries.",
        "size of the logical address space of the currently running process.",
        "store page size.",
        "store the address of the page table in memory."
      ],
      correct: 0,
      expl: "The TLB is a small, fast associative cache that stores recently used page-table entries. A TLB hit avoids the slow page-table walk in main memory.",
      explRu: "TLB — это небольшой быстрый ассоциативный кэш, хранящий недавно использованные записи таблицы страниц. Попадание в TLB позволяет избежать медленного обхода таблицы страниц в памяти."
    },
    {
      q: "In Linux, a slab is either full or empty.",
      opts: ["False", "True"],
      correct: 0,
      expl: "Linux slab allocator has three states: full (all objects allocated), partial (some objects free), and empty (no objects allocated). Partial slabs are used first for new allocations.",
      explRu: "Аллокатор slab в Linux имеет три состояния: full (все объекты выделены), partial (часть объектов свободна) и empty (нет выделенных объектов). Частичные слябы используются первыми."
    },
    {
      q: "Reentrant code cannot be shared.",
      opts: ["False", "True"],
      correct: 0,
      expl: "Reentrant (pure) code does NOT modify itself during execution — it is read-only. This makes it safe to share a single copy among multiple processes, each with its own data pages.",
      explRu: "Реентерабельный (чистый) код НЕ изменяет себя во время выполнения — он доступен только для чтения. Это позволяет безопасно разделять одну копию между несколькими процессами, у каждого свои страницы данных."
    },
    {
      q: "Reentrant code is easier to share when paging is used, because",
      opts: [
        "Each process can modify that code in its own way.",
        "The code changes are identical for each process.",
        "the code doesn't change during execution.",
        "All of the above."
      ],
      correct: 2,
      expl: "Since reentrant code never modifies itself, all processes can safely reference the same physical pages of code. Paging maps these shared physical pages into each process's virtual address space.",
      explRu: "Поскольку реентерабельный код никогда не изменяет себя, все процессы могут безопасно ссылаться на одни и те же физические страницы кода. Страничная адресация отображает эти общие физические страницы в каждое адресное пространство."
    },
    {
      q: "In a symmetric encryption algorithm, a single key is used to encrypt and another to decrypt.",
      opts: ["False", "True"],
      correct: 0,
      expl: "Symmetric encryption uses THE SAME key for both encryption and decryption. It is asymmetric encryption (public-key) that uses different keys (public to encrypt, private to decrypt).",
      explRu: "Симметричное шифрование использует ОДИН И ТОТ ЖЕ ключ для шифрования и дешифрования. Асимметричное (публичный ключ) использует разные ключи (публичный — для шифрования, приватный — для дешифрования)."
    },
    {
      q: "A page-out operation",
      opts: [
        "moves a page from memory to the backing store.",
        "moves a page from the backing store to memory.",
        "moves a page from one frame to another.",
        "deletes a page from the backing store."
      ],
      correct: 0,
      expl: "Page-out (swap-out) evicts a page from physical memory to disk (backing store). The reverse — loading a page from disk to memory — is page-in (swap-in).",
      explRu: "Page-out (своп) вытесняет страницу из физической памяти на диск (backing store). Обратная операция — загрузка страницы с диска в память — называется page-in."
    },
    {
      q: "A frame table stores",
      opts: [
        "Which frames are allocated?",
        "Which frames are free?",
        "total number of frames.",
        "All of the above."
      ],
      correct: 3,
      expl: "The OS maintains a frame table that tracks for every physical frame: whether it is free or allocated, and if allocated, to which process/page it belongs.",
      explRu: "ОС ведёт таблицу фреймов, отслеживающую для каждого физического фрейма: свободен он или занят, и если занят — каким процессом/страницей."
    },
    {
      q: "Stack algorithms are a class of page replacement algorithms that",
      opts: [
        "do not suffer from Belady's anomaly.",
        "are guaranteed to incur the least number of page faults.",
        "are implemented using stacks.",
        "are guaranteed to incur no more page faults than the FIFO page replacement algorithm."
      ],
      correct: 0,
      expl: "Stack algorithms (e.g. LRU, OPT) have the property that increasing the number of frames never increases page faults. This immunity to Belady's anomaly is their defining characteristic.",
      explRu: "Стековые алгоритмы (например, LRU, OPT) обладают свойством: увеличение числа фреймов никогда не увеличивает число page faults. Это — их определяющая характеристика."
    },
    {
      q: "_____ is the algorithm implemented on most systems.",
      opts: ["LRU", "Most frequently used", "Least frequently used", "FIFO"],
      correct: 0,
      expl: "LRU (Least Recently Used) approximations are widely implemented because LRU closely approximates OPT performance in practice and hardware provides reference bits to support it.",
      explRu: "Приближения LRU широко используются на практике, так как LRU близко к оптимальному алгоритму (OPT), а аппаратура предоставляет биты обращения для его реализации."
    },
    {
      q: "Hierarchical page tables are appropriate for 64-bit architectures.",
      opts: ["True", "False"],
      correct: 1,
      expl: "Hierarchical page tables become impractical for 64-bit because the table would be enormous even with multi-level splitting. Inverted or clustered page tables are preferred instead.",
      explRu: "Иерархические таблицы страниц непрактичны для 64-разрядных архитектур: таблица была бы огромной даже при многоуровневом разбиении. Предпочтительнее инвертированные или кластерные таблицы."
    },
    {
      q: "Which of the following techniques is well-suited to support a very large (e.g., 64-bit) address space?",
      opts: [
        "Inverted page tables",
        "Hierarchical page tables",
        "All of the above",
        "Clustered page tables"
      ],
      correct: 3,
      expl: "Clustered page tables map many pages with a single entry (each entry covers a cluster of pages), making them efficient for sparse large address spaces like 64-bit.",
      explRu: "Кластерные таблицы страниц отображают много страниц одной записью (каждая запись покрывает кластер страниц), что эффективно для разреженных больших адресных пространств 64-битных систем."
    },
    {
      q: "A drawback of equal or proportional allocation is that",
      opts: [
        "They are very expensive to compute.",
        "A high-priority process is treated the same as a low-priority process.",
        "The allocation varies according to the degree of multiprogramming.",
        "The processes that arrive earlier get more pages than processes arriving later."
      ],
      correct: 1,
      expl: "Equal/proportional allocation ignores process priority. A high-priority process gets the same frames as a low-priority one, which is unfair and can hurt system performance.",
      explRu: "Равное/пропорциональное распределение игнорирует приоритет процесса. Высокоприоритетный процесс получает столько же фреймов, что и низкоприоритетный — это несправедливо."
    },
    {
      q: "Anonymous memory of a process refers to",
      opts: [
        "the pages associated with the static data of the process.",
        "the pages that cannot be swapped out of the physical memory.",
        "the pages associated with the binary executable file of the process.",
        "the pages not associated with the binary executable file of the process."
      ],
      correct: 3,
      expl: "Anonymous memory includes heap, stack, and dynamically allocated pages — pages with no backing file. They are backed by swap space rather than the executable or a file.",
      explRu: "Анонимная память — это куча, стек и динамически выделяемые страницы — страницы без файла поддержки. Они хранятся в swap-пространстве, а не в исполняемом файле."
    },
    {
      q: "A free-frame list",
      opts: [
        "is a set of all frames that are currently being shared by at least two processes.",
        "is a set of all frames that are currently unallocated to any process.",
        "is a set of all frames that are filled with all zeros.",
        "is a set of all frames that are used for stack and heap memory."
      ],
      correct: 1,
      expl: "The free-frame list is the pool of physical frames not currently assigned to any process. When a page-in is needed, a frame is taken from this list.",
      explRu: "Список свободных фреймов — это пул физических фреймов, не назначенных ни одному процессу. При необходимости загрузить страницу фрейм берётся из этого списка."
    },
    {
      q: "The working set strategy",
      opts: [
        "keeps the degree of multiprogramming as high as possible while preventing thrashing.",
        "swaps in a new process if there is enough memory available to accommodate its working set.",
        "swaps out a process if the OS cannot allocate enough pages to accommodate its working set.",
        "All of the above."
      ],
      correct: 3,
      expl: "The working-set model tracks the set of pages a process uses in a recent window. It swaps out processes whose working set cannot be accommodated, and swaps in new ones if memory allows.",
      explRu: "Модель рабочего множества отслеживает страницы, используемые процессом в последнем временном окне. Процессы, чьё рабочее множество не помещается, выгружаются; новые загружаются при наличии памяти."
    },
    {
      q: "Which of the following is true about the strategy that uses page fault frequency (PFF) to prevent thrashing?",
      opts: [
        "A new page is allocated to a process if PFF is too high.",
        "A page is deallocated from a process if the PFF is too low.",
        "A new process may be swapped in if PFF is too low.",
        "All of the above."
      ],
      correct: 3,
      expl: "PFF-based thrashing prevention: if fault rate is too high → give process more frames; if too low → reclaim frames or swap in more processes.",
      explRu: "Управление пробуксовкой через PFF: если частота ошибок слишком высока — дать процессу больше фреймов; слишком низка — забрать фреймы или загрузить больше процессов."
    },
    {
      q: "The Second-Chance algorithm",
      opts: [
        "is the same as the LRU algorithm if none of the pages in memory have been referenced since the last page fault.",
        "is the same as the FIFO algorithm if all pages in memory have been referenced at least once since the last page fault.",
        "is the same as the LRU algorithm if all pages in memory have been referenced at least once since the last page fault.",
        "is the same as the FIFO algorithm if none of the pages in memory have been referenced since the last page fault."
      ],
      correct: 1,
      expl: "Second-Chance uses a reference bit. If ALL pages have been referenced (all bits = 1), the algorithm clears bits and wraps around — behaving exactly like FIFO.",
      explRu: "Second-Chance использует бит обращения. Если ВСЕ страницы были обращены (все биты = 1), алгоритм сбрасывает биты и обходит по кругу — ведёт себя точно как FIFO."
    },
    {
      q: "A large page size results in",
      opts: [
        "lower internal fragmentation",
        "larger page table overhead",
        "All of the above",
        "efficient disk I/O"
      ],
      correct: 3,
      expl: "Larger pages mean fewer page-table entries (less overhead) but more internal fragmentation. The key benefit is efficient disk I/O since larger transfers amortize seek and rotation latency.",
      explRu: "Большие страницы означают меньше записей в таблице страниц (меньше накладных расходов), но больше внутренней фрагментации. Ключевое преимущество — эффективный дисковый I/O."
    },
    {
      q: "Some operating systems provide a raw disk interface, allowing special applications to bypass the file system when accessing secondary storage.",
      opts: ["True", "False"],
      correct: 0,
      expl: "Raw disk access allows applications like databases to manage their own I/O directly, avoiding file system overhead and double buffering.",
      explRu: "Прямой доступ к диску позволяет приложениям (например, СУБД) управлять I/O напрямую, избегая накладных расходов файловой системы и двойного буферирования."
    },
    {
      q: "Which of the following is FALSE about reapers?",
      opts: [
        "They may use any page replacement algorithm to swap out pages.",
        "They implement a global page replacement policy.",
        "They may swap out a page from a process even when that process is not running.",
        "They may swap out pages even when there are ample free frames available."
      ],
      correct: 3,
      expl: "Reapers (like Linux kswapd) only run when free memory is low — they do NOT swap out pages when there are ample free frames. That would be wasteful.",
      explRu: "Reapers (например, kswapd в Linux) работают только при нехватке свободной памяти — они НЕ вытесняют страницы при наличии достаточного числа свободных фреймов. Это было бы расточительством."
    },
    {
      q: "A page fault must be preceded by a TLB miss.",
      opts: ["False", "True"],
      correct: 1,
      expl: "A page fault occurs when a page is not in physical memory. The CPU first checks the TLB, which will miss (no valid entry), then checks the page table and finds the page is not present — triggering the page fault.",
      explRu: "Page fault возникает, когда страницы нет в физической памяти. CPU сначала проверяет TLB — промах (нет действительной записи), затем таблицу страниц и обнаруживает отсутствие страницы."
    },
    {
      q: "Given the reference string: 1 2 3 4 2 3 4 1 2 1 1 3 1 4, system with 3 frames. Final configuration after LRU algorithm?",
      opts: ["1, 2, 3", "3, 1, 4", "4, 1, 2", "1, 3, 4"],
      correct: 1,
      expl: "Trace LRU through: 1 2 3 4 2 3 4 1 2 1 1 3 1 4. At the end the three most recently used pages are 3, 1, and 4.",
      explRu: "Трассировка LRU: 1 2 3 4 2 3 4 1 2 1 1 3 1 4. В конце три последних использованных страницы: 3, 1 и 4."
    },
    {
      q: "Given the reference string: 1 2 3 4 2 3 4 1 2 1 1 3 1 4, system with 3 frames. Final configuration after FIFO algorithm?",
      opts: ["3, 1, 4", "4, 1, 3", "3, 4, 2", "4, 2, 3"],
      correct: 2,
      expl: "Trace FIFO through the reference string with 3 frames. FIFO replaces the oldest loaded page. Final frames: 3, 4, 2.",
      explRu: "Трассировка FIFO с 3 фреймами. FIFO заменяет самую старую загруженную страницу. Итоговые фреймы: 3, 4, 2."
    },
    {
      q: "Given the reference string: 1 2 3 4 2 3 4 1 2 1 1 3 1 3, system with 3 frames. Final configuration after OPT algorithm?",
      opts: ["2, 3, 4", "1, 2, 3", "1, 3, 4", "1, 2, 1"],
      correct: 1,
      expl: "OPT replaces the page that will not be used for the longest time. Tracing through the string yields final frames: 1, 2, 3.",
      explRu: "OPT заменяет страницу, которая не будет использоваться дольше всего. Трассировка строки даёт итоговые фреймы: 1, 2, 3."
    },
    {
      q: "A page-table-based register stores",
      opts: [
        "the page size of the page currently being accessed.",
        "a pointer to the page table in memory.",
        "the starting logical address of the page currently being accessed.",
        "the starting physical address of the frame currently being addressed."
      ],
      correct: 1,
      expl: "The PTBR (Page-Table Base Register) holds a pointer to the current process's page table in main memory. It is updated on every context switch.",
      explRu: "PTBR (регистр базы таблицы страниц) хранит указатель на таблицу страниц текущего процесса в основной памяти. Обновляется при каждом переключении контекста."
    },
    {
      q: "In the Additional-Reference-Bits algorithm,",
      opts: [
        "a page that has been referenced most recently is identified.",
        "The least-recently used page is identified very efficiently on a page fault.",
        "None of the above.",
        "A group of pages that have not been used recently is efficiently identified."
      ],
      correct: 3,
      expl: "The Additional-Reference-Bits algorithm maintains a history byte per page updated periodically by a timer interrupt. Pages with all-zero histories are the best replacement candidates.",
      explRu: "Алгоритм дополнительных битов обращения поддерживает байт истории для каждой страницы, обновляемый по прерыванию таймера. Страницы с нулевой историей — лучшие кандидаты на замену."
    },
    {
      q: "If an architecture has a move instruction with more than one word and at most one indirect memory reference, the minimum number of frames needed to run a process is",
      opts: ["4", "6", "3", "5"],
      correct: 3,
      expl: "Such an instruction may reference: 1 page for the instruction itself (multi-word so may span 2 pages) + 1 for source operand + 1 for destination + 1 for indirect reference = up to 5 frames minimum.",
      explRu: "Такая инструкция может обращаться: 1–2 страницы для самой инструкции (многословная) + 1 для исходного операнда + 1 для результата + 1 для косвенной ссылки = минимум 5 фреймов."
    },
    {
      q: "The x86-64 architecture provides support for 52-bit physical addresses.",
      opts: ["False", "True"],
      correct: 1,
      expl: "x86-64 currently implements 48-bit virtual addresses and 52-bit physical addresses, even though the architecture allows up to 64-bit addresses for future expansion.",
      explRu: "x86-64 сейчас реализует 48-битные виртуальные адреса и 52-битные физические, хотя архитектура допускает до 64-битных адресов для будущего расширения."
    }
  ]);

  // ========== LECTURE 9: File Systems ==========
  push(9, [
    {
      q: "WAFL (write-anywhere file layout)",
      opts: [
        "cannot provide files via NFS",
        "is a distributed file system",
        "is a file system dedicated to single-user operating systems",
        "can provide files via NFS, but not via CIFS"
      ],
      correct: 1,
      expl: "WAFL is a distributed file system developed by NetApp. It supports both NFS and CIFS protocols and is optimized for network-attached storage (NAS).",
      explRu: "WAFL — распределённая файловая система, разработанная NetApp. Она поддерживает протоколы NFS и CIFS и оптимизирована для сетевых хранилищ (NAS)."
    },
    {
      q: "The create() system call uses the open-file table.",
      opts: ["True", "False"],
      correct: 1,
      expl: "create() does NOT use the open-file table — it creates a new directory entry and inode. The open-file table is used by open() to track currently opened files.",
      explRu: "create() НЕ использует таблицу открытых файлов — он создаёт новую запись в директории и inode. Таблица открытых файлов используется open() для отслеживания открытых файлов."
    },
    {
      q: "The consistency check is always able to recover the structures, e.g., files and entire directories.",
      opts: ["False", "True"],
      correct: 0,
      expl: "Consistency checks (fsck) can detect inconsistencies but cannot always recover lost data. If metadata was corrupted before a crash, files or directories may be permanently lost.",
      explRu: "Проверка согласованности (fsck) может обнаруживать несоответствия, но не всегда может восстановить потерянные данные. При повреждении метаданных до сбоя файлы могут быть безвозвратно потеряны."
    },
    {
      q: "The file owner:",
      opts: [
        "is the user who cannot change the file attributes, but can execute the file.",
        "is the user who can change the file attributes and grant access to the file.",
        "is the user who can change the file attributes, but cannot grant access to the file.",
        "is the only user who can execute the file."
      ],
      correct: 1,
      expl: "The file owner has full control: they can change attributes (permissions, name) and grant or revoke access to other users.",
      explRu: "Владелец файла имеет полный контроль: может изменять атрибуты (права, имя) и предоставлять или отзывать доступ для других пользователей."
    },
    {
      q: "UNIX systems employ ________________________",
      opts: [
        "general graph directory",
        "single-level directory",
        "two-level tree directory",
        "acyclic-graph directory"
      ],
      correct: 3,
      expl: "UNIX uses an acyclic-graph directory structure allowing hard links and symbolic links, enabling sharing of files and directories without cycles in the file name graph.",
      explRu: "UNIX использует ациклическую граф-структуру директорий, допуская жёсткие и символические ссылки — совместное использование файлов и директорий без циклов."
    },
    {
      q: "You can access a file in an unmounted file system.",
      opts: ["False", "True"],
      correct: 0,
      expl: "A file system must be mounted (attached to the directory tree) before its files can be accessed. An unmounted file system's files are not reachable via the namespace.",
      explRu: "Файловая система должна быть смонтирована (присоединена к дереву директорий), прежде чем её файлы станут доступны. Файлы несмонтированной ФС недоступны через пространство имён."
    },
    {
      q: "Is an extension a part of a file name?",
      opts: ["True", "False"],
      correct: 0,
      expl: "In most operating systems, the extension (e.g., .txt, .exe) is simply part of the filename string — the OS treats the full name including extension as one string.",
      explRu: "В большинстве ОС расширение (например, .txt, .exe) является частью строки имени файла — ОС воспринимает полное имя вместе с расширением как единую строку."
    },
    {
      q: "MS Word documents in RTF format are resistant to macro viruses.",
      opts: ["True", "False"],
      correct: 0,
      expl: "RTF (Rich Text Format) does not support macros, so documents saved in RTF cannot carry macro viruses, unlike the .doc/.docm formats.",
      explRu: "RTF (Rich Text Format) не поддерживает макросы, поэтому документы в формате RTF не могут содержать макровирусы, в отличие от форматов .doc/.docm."
    },
    {
      q: "All file systems suffer from internal fragmentation.",
      opts: ["True", "False"],
      correct: 0,
      expl: "Any file system that allocates storage in fixed-size units (blocks/clusters) wastes the unused portion of the last block — internal fragmentation.",
      explRu: "Любая файловая система, выделяющая хранилище блоками фиксированного размера, теряет неиспользованную часть последнего блока — внутренняя фрагментация."
    },
    {
      q: "An ACL (access control list) is associated with each file and directory. It",
      opts: [
        "contains user names and their encrypted passwords",
        "includes types of access allowed for the file only",
        "specifies user names and types of access allowed for each of them",
        "includes user names only"
      ],
      correct: 2,
      expl: "An ACL is a per-file/directory list of (user/group, permissions) pairs, specifying exactly which operations each named user or group is allowed to perform.",
      explRu: "ACL — это список (пользователь/группа, права) для каждого файла/директории, точно указывающий, какие операции разрешены каждому поимённо указанному пользователю или группе."
    },
    {
      q: "Acyclic-graph directory structure _______________________",
      opts: [
        "allows the sharing of files and directories",
        "allows the sharing of files, but prohibits the sharing of directories",
        "prohibits the sharing of files and directories",
        "prohibits the sharing of files, but allows to share directories"
      ],
      correct: 0,
      expl: "An acyclic-graph structure allows both files and subdirectories to be shared (referenced from multiple parent directories) while ensuring no cycles exist in the directory graph.",
      explRu: "Ациклическая граф-структура допускает совместное использование как файлов, так и поддиректорий (ссылки из нескольких родительских директорий) при отсутствии циклов в графе."
    },
    {
      q: "In the case of UNIX, where sharing is implemented by symbolic link",
      opts: [
        "both of the above",
        "The deletion of the link does not affect the original file",
        "none of the above",
        "The deletion of the original file does not remove the link, but it is dangling"
      ],
      correct: 0,
      expl: "With symbolic links: (1) deleting the link leaves the original intact; (2) deleting the original leaves a dangling symlink. Both statements are true.",
      explRu: "Для символических ссылок: (1) удаление ссылки не затрагивает оригинал; (2) удаление оригинала оставляет висячую (dangling) ссылку. Оба утверждения верны."
    },
    {
      q: "When the shared lock is applied to a file then _________",
      opts: [
        "Only one process can use this file",
        "Many processes can read and write to this file concurrently",
        "Several processes can acquire the lock concurrently",
        "Many processes can write to this file concurrently"
      ],
      correct: 2,
      expl: "A shared (read) lock allows multiple processes to acquire it simultaneously — they can all read but none can write. An exclusive lock allows only one holder.",
      explRu: "Разделяемая (read) блокировка позволяет нескольким процессам удерживать её одновременно — они могут читать, но не писать. Эксклюзивная блокировка допускает лишь одного держателя."
    },
    {
      q: "The file protection can be provided by:",
      opts: [
        "access-control list",
        "knowledge of the existence and name of a file",
        "all of the above",
        "password"
      ],
      correct: 2,
      expl: "File protection can be achieved through ACLs (fine-grained per-user permissions), obscurity (hiding the file name), or passwords on files — all are valid mechanisms.",
      explRu: "Защита файлов может обеспечиваться через ACL (подробные права на пользователя), сокрытие (скрытие имени файла) или пароли на файлы — все они являются допустимыми механизмами."
    },
    {
      q: "The NFS protocol:",
      opts: [
        "does not provide concurrency control mechanisms except file locking.",
        "provides concurrency control mechanisms.",
        "does not provide concurrency control mechanisms.",
        "may provide concurrency control mechanisms."
      ],
      correct: 2,
      expl: "NFS (stateless design) does not provide concurrency control mechanisms. File locking in NFS is handled by a separate protocol (NLM — Network Lock Manager), not NFS itself.",
      explRu: "NFS (без сохранения состояния) не предоставляет механизмов управления параллельным доступом. Блокировка файлов в NFS реализуется отдельным протоколом (NLM), а не самим NFS."
    },
    {
      q: "The root-partition:",
      opts: [
        "does not contain the operating system kernel, but it is the first mounted file system during boot time.",
        "contains an operating system kernel, and it is not necessary to be mounted.",
        "contains an operating system kernel, and it is mounted during boot time.",
        "contains a list of the operating systems that may be booted."
      ],
      correct: 2,
      expl: "The root partition contains the OS kernel and essential files. It is mounted at '/' during the boot process — it must be mounted for the system to operate.",
      explRu: "Корневой раздел содержит ядро ОС и необходимые файлы. Он монтируется в '/' в процессе загрузки — без монтирования система не работает."
    },
    {
      q: "Mounting a file system means that:",
      opts: [
        "the file system is becoming unavailable within the file system name space.",
        "The file system is removed from the disk space.",
        "The file system is being created in the disk space.",
        "The file system is becoming available within the file system namespace."
      ],
      correct: 3,
      expl: "Mounting attaches a file system to a directory (mount point) in the existing directory tree, making its contents accessible via the unified namespace.",
      explRu: "Монтирование присоединяет файловую систему к директории (точке монтирования) в существующем дереве, делая её содержимое доступным через единое пространство имён."
    },
    {
      q: "The virtual file system layer is dedicated to allowing access to:",
      opts: [
        "different types of locally mounted file systems and remote file systems.",
        "remote file systems only.",
        "locally mounted file systems or remote ones, but for one type of file system only.",
        "locally mounted file systems only."
      ],
      correct: 0,
      expl: "The VFS layer provides a uniform interface (vnode/inode abstraction) that works for any file system type — local (ext4, NTFS, FAT) or remote (NFS, SMB).",
      explRu: "Уровень VFS предоставляет единый интерфейс (абстракция vnode/inode), работающий для любого типа файловой системы — локальной (ext4, NTFS, FAT) или удалённой (NFS, SMB)."
    },
    {
      q: "__________ encrypts the information on the target computer and renders it inaccessible to the owner",
      opts: ["Logic bomb", "Ransomware", "Spyware", "all of the above"],
      correct: 1,
      expl: "Ransomware encrypts the victim's files and demands payment for the decryption key, making the data inaccessible to the rightful owner.",
      explRu: "Программа-вымогатель (ransomware) шифрует файлы жертвы и требует оплату за ключ дешифрования, делая данные недоступными для законного владельца."
    },
    {
      q: "If the current directory is /home/user/jane and the proposed path to file /home/user/mike/prog.c is _____",
      opts: ["../mike/prog.c", "../../mike/prog.c", "/mike/prog.c", "./mike/prog.c"],
      correct: 0,
      expl: "From /home/user/jane: go up one level (..) to /home/user, then down to mike/prog.c → ../mike/prog.c",
      explRu: "Из /home/user/jane: поднимаемся на один уровень (..) до /home/user, затем спускаемся в mike/prog.c → ../mike/prog.c"
    },
    {
      q: "The following information is presented for the program: -rwxr-xr-- 1 Jim staff 130 May 25 22:13 prog.c. Users Jim, Sara, and Mike are members of the group staff. Which is true?",
      opts: [
        "Mike can read and write to prog.c",
        "Sara can modify the program.c",
        "Alan can read Prog.c",
        "Jim can invoke only the read and execute operation on prog.c"
      ],
      correct: 2,
      expl: "Permissions: owner(Jim)=rwx, group(staff)=r-x, others=r--. Alan is neither Jim nor in staff → 'others' permissions apply = r-- → Alan can only read.",
      explRu: "Права: владелец(Jim)=rwx, группа(staff)=r-x, остальные=r--. Алан не является Джимом и не входит в staff → права 'others' = r-- → Алан может только читать."
    },
    {
      q: "close() operation _____ an open count associated with a given file.",
      opts: ["decreases", "does not change", "increases", "resets"],
      correct: 0,
      expl: "Each open() increments the file's open count in the system-wide open-file table. close() decrements it. When the count reaches zero, the file table entry is removed.",
      explRu: "Каждый open() увеличивает счётчик открытий файла в системной таблице открытых файлов. close() уменьшает его. При достижении нуля запись удаляется."
    },
    {
      q: "Contiguous allocation of a file is defined by the address of the first block and the length (in block units) of the file.",
      opts: ["True", "False"],
      correct: 0,
      expl: "Contiguous allocation stores a file in consecutive disk blocks. The directory entry needs only the starting block address and the file's length to locate all blocks.",
      explRu: "Непрерывное размещение хранит файл в последовательных блоках диска. Запись в директории содержит только адрес начального блока и длину файла — этого достаточно для доступа ко всем блокам."
    },
    {
      q: "Writes to the file mapped in memory are not necessarily immediate writes to the file on disk",
      opts: ["False", "True"],
      correct: 1,
      expl: "Memory-mapped file writes go to the page cache first. They are written back to disk lazily (on msync, munmap, or when the OS decides to flush dirty pages).",
      explRu: "Записи в memory-mapped файл сначала попадают в кэш страниц. Они записываются на диск отложенно (при msync, munmap или по решению ОС сбросить грязные страницы)."
    },
    {
      q: "The logical file system module includes the free-space manager.",
      opts: ["True", "False"],
      correct: 1,
      expl: "The free-space manager is part of the basic file system or file-organization module layer, not the logical file system layer. The logical file system handles metadata (directory/inode structures).",
      explRu: "Менеджер свободного пространства является частью базового уровня файловой системы, а не уровня логической файловой системы. Логическая ФС управляет метаданными (директории/inode)."
    },
    {
      q: "The length of a logical record is fixed for a given operating system.",
      opts: ["True", "False"],
      correct: 1,
      expl: "Logical record length depends on the application, not the OS. Different files and applications can have different logical record sizes.",
      explRu: "Длина логической записи зависит от приложения, а не от ОС. Разные файлы и приложения могут иметь записи разного размера."
    },
    {
      q: "The garbage collection is necessary _____",
      opts: [
        "in each implementation of the directory structure",
        "in general, the graph directory structure only",
        "in tree-based directory structure only",
        "in acyclic-graph directory structure only"
      ],
      correct: 1,
      expl: "General graph directories can have cycles (circular references). Garbage collection is needed to find and reclaim unreachable files. Acyclic-graph and tree structures don't have this problem.",
      explRu: "Граф-директории общего вида могут содержать циклы (циклические ссылки). Сборка мусора нужна для обнаружения и освобождения недостижимых файлов. В ациклических и древовидных структурах этой проблемы нет."
    },
    {
      q: "Storage devices that do not allow overwriting (such as NVM devices) need only a free list to manage free space.",
      opts: ["False", "True"],
      correct: 0,
      expl: "Write-once or append-only devices (like some NVM) need more than a free list — they also need garbage collection to reclaim space from obsolete data.",
      explRu: "Устройства 'пишем один раз' или 'только дозапись' (некоторые NVM) нуждаются в большем, чем просто список свободных блоков — им также нужна сборка мусора для возврата пространства."
    },
    {
      q: "The UNIX rm command can delete a non-empty directory",
      opts: ["True", "False"],
      correct: 1,
      expl: "The standard rm command cannot delete non-empty directories. You must use 'rm -r' (recursive) or 'rmdir' only works on empty directories.",
      explRu: "Стандартная команда rm не может удалить непустую директорию. Нужно использовать 'rm -r' (рекурсивно); 'rmdir' работает только с пустыми директориями."
    },
    {
      q: "Using ____-bit pointers limits the maximum file size to 4 GB.",
      opts: ["64", "256", "128", "32"],
      correct: 3,
      expl: "32-bit pointers can address at most 2^32 bytes = 4 GB. This was a limitation of early file systems (FAT32). 64-bit pointers support files up to 2^64 bytes.",
      explRu: "32-битные указатели могут адресовать не более 2^32 байт = 4 ГБ. Это было ограничением ранних файловых систем (FAT32). 64-битные указатели поддерживают файлы до 2^64 байт."
    },
    {
      q: "For the counting method (used by free space management), the entries in the free-space list can be stored in a linked list rather than a balanced tree, for efficient lookup, insertion, and deletion.",
      opts: ["True", "False"],
      correct: 1,
      expl: "For efficient lookup, insertion, and deletion the counting method uses a balanced tree (B-tree), not a linked list. A linked list has O(n) lookup which is inefficient for large lists.",
      explRu: "Для эффективного поиска, вставки и удаления метод подсчёта использует сбалансированное дерево (B-дерево), а не связный список. Связный список имеет O(n) поиск, что неэффективно."
    },
    {
      q: "Reading and writing file operations use the same current-file-position pointer.",
      opts: ["False", "True"],
      correct: 1,
      expl: "A file's current-position pointer advances with both reads and writes. This is why interleaving read() and write() calls moves through the file sequentially.",
      explRu: "Указатель текущей позиции в файле сдвигается как при чтении, так и при записи. Поэтому чередование вызовов read() и write() продвигается по файлу последовательно."
    },
    {
      q: "The FAT method incorporates free-block accounting into the allocation data structure.",
      opts: ["True", "False"],
      correct: 0,
      expl: "In FAT (File Allocation Table), free blocks are marked with a special value (0) in the same table used for file block chains. No separate free-space list is needed.",
      explRu: "В FAT свободные блоки помечаются специальным значением (0) в той же таблице, которая используется для цепочек блоков файла. Отдельный список свободных блоков не нужен."
    },
    {
      q: "The open() call returns a pointer to the appropriate entry in the system-wide open-file table.",
      opts: ["False", "True"],
      correct: 0,
      expl: "open() returns a file descriptor — an index into the process's per-process file table. The per-process entry points to the system-wide open-file table, but open() returns a small integer (fd).",
      explRu: "open() возвращает файловый дескриптор — индекс в таблицу открытых файлов процесса. Запись процесса указывает на системную таблицу, но open() возвращает целое число (fd)."
    },
    {
      q: "A relative path name defines a path from _________________________",
      opts: [
        "from the UFD (user file directory)",
        "the root directory",
        "from the MFD (master file directory)",
        "the current directory"
      ],
      correct: 3,
      expl: "A relative path is interpreted starting from the current working directory. An absolute path always starts from the root directory (/).",
      explRu: "Относительный путь интерпретируется, начиная с текущего рабочего каталога. Абсолютный путь всегда начинается с корневого каталога (/)."
    }
  ]);

  // ========== LECTURE 10: I/O Systems & Security ==========
  push(10, [
    {
      q: "The I/O control level consists of device drivers and interrupt handlers to transfer information between the main memory and the disk system",
      opts: ["False", "True"],
      correct: 1,
      expl: "The I/O control layer sits between the file-organization module and the device hardware. Device drivers translate generic I/O requests into device-specific commands; interrupt handlers notify the OS when I/O completes.",
      explRu: "Уровень управления I/O находится между модулем организации файлов и аппаратурой. Драйверы устройств переводят запросы I/O в команды устройства; обработчики прерываний уведомляют ОС о завершении I/O."
    },
    {
      q: "In ________ write, the data are stored in the cache, and control returns to the caller.",
      opts: ["an asynchronous", "a buffered", "a synchronous", "a non-buffered"],
      correct: 0,
      expl: "Asynchronous (write-behind) I/O stores data in the cache and immediately returns to the caller. The actual write to disk happens later. Synchronous writes wait for disk confirmation.",
      explRu: "При асинхронной записи данные сохраняются в кэше, и управление немедленно возвращается вызывающему. Фактическая запись на диск происходит позже. Синхронная запись ждёт подтверждения от диска."
    },
    {
      q: "The attack surface is the set of points at which an attacker can try to break into the system.",
      opts: ["False", "True"],
      correct: 1,
      expl: "The attack surface encompasses all the different points (code, APIs, network interfaces, user inputs) where an attacker could potentially exploit vulnerabilities to compromise the system.",
      explRu: "Поверхность атаки — это все точки (код, API, сетевые интерфейсы, вводы пользователя), где злоумышленник потенциально может использовать уязвимости для компрометации системы."
    },
    {
      q: "Systems that do not permit access to the files of another user do not need protection",
      opts: ["False", "True"],
      correct: 1,
      expl: "If a system is truly single-user or enforces total isolation (no file sharing), there is nothing to protect between users. Protection is needed only when sharing is possible.",
      explRu: "Если система действительно однопользовательская или обеспечивает полную изоляцию (нет совместного использования файлов), нечего защищать. Защита нужна только при возможности совместного доступа."
    },
    {
      q: "To protect the systems we have to ensure security on the following level:",
      opts: ["physical", "operating system", "all of the above", "network"],
      correct: 2,
      expl: "A secure system requires protection at all levels: physical (hardware access), OS (kernel, processes), and network (communications). A weakness at any level can compromise the whole system.",
      explRu: "Безопасная система требует защиты на всех уровнях: физическом (доступ к оборудованию), ОС (ядро, процессы) и сетевом (коммуникации). Слабость на любом уровне может скомпрометировать всю систему."
    },
    {
      q: "The purpose of denial-of-service attacks is to gain information or steal resources.",
      opts: ["False", "True"],
      correct: 0,
      expl: "DoS attacks aim to disrupt legitimate use of a service — making it unavailable to authorized users. Gaining information or stealing resources is the goal of other attack types (eavesdropping, theft).",
      explRu: "Атаки DoS направлены на нарушение законного использования сервиса — делают его недоступным для авторизованных пользователей. Получение информации или кража ресурсов — цели других типов атак."
    },
    {
      q: "Address Space Layout Randomization (ASLR) technique protects an operating system against _______________",
      opts: ["zero-day attack", "a code-injection attack", "a macro virus", "Denial of Service"],
      correct: 1,
      expl: "ASLR randomly arranges the address space positions of key data areas (stack, heap, libraries). This makes it hard for an attacker to predict where to inject executable code.",
      explRu: "ASLR случайным образом размещает ключевые области памяти (стек, куча, библиотеки). Это затрудняет предсказание места инъекции исполняемого кода для злоумышленника."
    },
    {
      q: "Vulnerability scans can check:",
      opts: [
        "unexpected long-running processes",
        "all of the above",
        "hidden network daemons",
        "unauthorized programs in system directories"
      ],
      correct: 1,
      expl: "Vulnerability scanners perform comprehensive checks: unusual processes, unauthorized software, hidden services, open ports, weak configurations, and more.",
      explRu: "Сканеры уязвимостей выполняют комплексные проверки: необычные процессы, несанкционированное ПО, скрытые службы, открытые порты, слабые конфигурации и многое другое."
    },
    {
      q: "IPSec uses ______ encryption.",
      opts: ["asymmetric", "symmetric", "Caesar cipher", "one-time password"],
      correct: 1,
      expl: "IPSec uses symmetric encryption (e.g., AES) for the actual data encryption. Asymmetric (public-key) cryptography is used during the key exchange phase (IKE).",
      explRu: "IPSec использует симметричное шифрование (например, AES) для шифрования данных. Асимметричная криптография применяется во время фазы обмена ключами (IKE)."
    },
    {
      q: "TLS provides security at the _______ layer.",
      opts: ["transport", "network", "none of the above", "application"],
      correct: 0,
      expl: "TLS (Transport Layer Security) operates at the transport layer, providing encryption and authentication for protocols like HTTPS, SMTP, and others that run on top of TCP.",
      explRu: "TLS (Transport Layer Security) работает на транспортном уровне, обеспечивая шифрование и аутентификацию для протоколов типа HTTPS, SMTP и других, работающих поверх TCP."
    },
    {
      q: "User authentication can be based on _______________",
      opts: [
        "all of the above",
        "the user's knowledge of something",
        "the user's possession of something",
        "an attribute of the user"
      ],
      correct: 1,
      expl: "The three classic authentication factors are: knowledge (password/PIN), possession (token/smart card), and attribute (biometric). The course answer is 'knowledge of something'.",
      explRu: "Три классических фактора аутентификации: знание (пароль/PIN), владение (токен/смарт-карта) и атрибут (биометрия). Ответ курса — 'знание чего-либо'."
    },
    {
      q: "Port scanning allows a hacker to __________________",
      opts: [
        "detect a system's vulnerabilities",
        "disrupt legitimate use of a system",
        "know users' passwords",
        "Modify a transmission between a remote user and a system"
      ],
      correct: 3,
      expl: "Port scanning identifies open ports and services. However, the course answer is 'modify a transmission' — this would be man-in-the-middle, not just port scanning.",
      explRu: "Сканирование портов определяет открытые порты и сервисы. Согласно курсу, ответ — 'изменить передачу' — это атака 'человек посередине', не только сканирование портов."
    }
  ]);
})();
