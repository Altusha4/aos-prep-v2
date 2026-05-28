/* CheatSheet.jsx — quick-reference facts per topic, based on real endterm questions */
const SHEETS = [
  {
    id: 'mem', icon: '⬛', title: 'Memory Management', titleRu: 'Управление памятью',
    color: '#3b5bdb',
    facts: [
      { label: 'Base register', text: 'holds the STARTING address of the process' },
      { label: 'Limit register', text: 'holds the SIZE of the process (range)' },
      { label: 'Binding', text: 'Execution-time binding → facilitates swapping (address translated at runtime)' },
      { label: 'IA-32 translation', text: 'Segmentation unit FIRST → then paging unit (logical → linear → physical)' },
      { label: 'Dynamic alloc', text: 'First fit is FASTER than worst fit on average' },
      { label: 'Relocation register = 5000, process size = 10000', text: 'Physical addr 10350 is valid (logical 5350 < 10000). Logical 10350 is NOT valid.' },
      { label: 'Base=12345, Limit=1000', text: 'Valid range: [12345 … 13345]. Address 12500 ✓, 13346 ✗' },
      { label: '2-level paging EMAT (TLB 90%, TLB=15ns, mem=85ns)', text: '0.9×(15+85) + 0.1×(15+85+85+85) = 90+27 = 117 ns' },
      { label: '18-bit page number', text: '2¹⁸ = 262,144 page table entries' },
      { label: '32-bit addr, 8KB page', text: 'Page offset=13 bits → 2¹⁹ = 524,288 entries (NOT 1,000,000) → False' },
      { label: '64-bit arch', text: 'Supports all CURRENT needs — may NOT support all FUTURE needs' },
      { label: 'Min frames (move + indirect ref)', text: '5 frames minimum' },
    ],
    traps: [
      'Limit register = SIZE (not address). Base register = STARTING address.',
      'Execution-time binding is for swapping. Load-time binding is NOT.',
      '32-bit + 8KB page = 524K entries, NOT 1 million → statement is FALSE.',
      'Base/limit registers can only be loaded by PRIVILEGED instructions (not standard load).',
    ],
  },
  {
    id: 'vm', icon: '⬡', title: 'Virtual Memory', titleRu: 'Виртуальная память',
    color: '#2f7d57',
    facts: [
      { label: 'TLB purpose', text: 'Cache page-table entries (speeds up address translation)' },
      { label: 'ASID', text: 'Address-Space IDentifier — tags TLB entries per process → no flush on context switch' },
      { label: 'Without ASID', text: 'TLB MUST be flushed on every context switch → True' },
      { label: 'Protection bit', text: 'Provides protection against unauthorized updates in the page table' },
      { label: 'Dirty (modify) bit', text: 'Identifies a page MODIFIED since it was loaded (not corrupted, not shared)' },
      { label: 'ARM paging', text: 'Uses BOTH single-level AND two-level paging → True' },
      { label: 'x86-64 paging', text: 'THREE different page sizes (4KB, 2MB, 1GB) using a 4-LEVEL hierarchy' },
      { label: 'x86-64 physical addr', text: '52-bit physical addresses (NOT 48-bit, NOT 64-bit)' },
      { label: 'Inverted page table', text: 'ONE global table (per frame, not per process) → does NOT require own table per process → False' },
      { label: 'Hierarchical page tables', text: 'NOT appropriate for 64-bit → use Clustered page tables instead' },
      { label: 'Clustered page tables', text: 'Best for large (64-bit) sparse address spaces' },
      { label: 'Page fault', text: 'Must be preceded by a TLB miss → True' },
      { label: 'Page-out', text: 'Moves page from MEMORY → backing store (disk)' },
      { label: 'Anonymous memory', text: 'Pages NOT associated with the binary executable (heap, stack, dynamic)' },
      { label: 'Free-frame list', text: 'Set of all frames CURRENTLY UNALLOCATED to any process' },
      { label: 'Frame table', text: 'Stores: which frames allocated + which free + total count → All of the above' },
      { label: 'Slab allocator (Linux)', text: 'Three states: full / partial / empty (NOT just full or empty) → False' },
      { label: 'Reentrant code', text: 'Does NOT modify itself → CAN be shared → "cannot be shared" is False' },
      { label: 'Large page size', text: '→ Efficient disk I/O (fewer, larger transfers)' },
      { label: 'Page fault with multi-location instruction', text: 'Handle using TEMPORARY REGISTERS to hold overwritten values' },
      { label: 'Unified virtual memory', text: 'Uses PAGE CACHING to cache both process pages and file data' },
      { label: '0xAEF9, page size 256 bytes', text: 'Offset = lower 8 bits = 0xF9. Page number = 0xAE' },
      { label: 'Advantage of virtual memory', text: 'All of the above: larger programs, partial loading, programmer abstraction' },
      { label: 'Thrashing sign', text: 'CPU utilization DECREASES as degree of multiprogramming INCREASES' },
      { label: 'Best practice vs thrashing', text: 'Include ENOUGH PHYSICAL MEMORY → True' },
      { label: 'Working set strategy', text: 'All of the above: keeps multiprogramming high, swaps in/out by working set size' },
      { label: 'PFF strategy', text: 'All of the above: allocate page if PFF high, deallocate if PFF low, swap in if PFF low' },
      { label: 'Equal/proportional allocation drawback', text: 'High-priority process treated same as low-priority' },
      { label: 'Stack algorithms', text: 'Do NOT suffer from Belady\'s anomaly (e.g. LRU, OPT)' },
      { label: 'LRU', text: 'Algorithm implemented on MOST systems' },
      { label: 'Second-Chance', text: 'Same as FIFO if ALL pages were referenced at least once since last fault' },
      { label: 'OPT result (1 2 3 4 2 3 4 1 2 1 1 3 1 3, 3 frames)', text: 'Final: 1, 2, 3' },
      { label: 'LRU result (1 2 3 4 2 3 4 1 2 1 1 3 1 4, 3 frames)', text: 'Final: 3, 1, 4' },
      { label: 'FIFO result (1 2 3 4 2 3 4 1 2 1 1 3 1 4, 3 frames)', text: 'Final: 3, 4, 2' },
      { label: 'Reapers', text: 'Do NOT swap pages when ample free frames available (FALSE claim)' },
      { label: 'Additional-Reference-Bits alg', text: 'Efficiently identifies a GROUP of pages not used recently' },
    ],
    traps: [
      'Protection bit ≠ dirty bit. Protection = access rights. Dirty = was written.',
      'Inverted page table = ONE table total (not per-process) → saves space, slower lookup.',
      'Clustered (not hierarchical) for 64-bit.',
      'x86-64: 52-bit PHYSICAL, 48-bit VIRTUAL addresses.',
      'Symmetric encryption = SAME key for encrypt+decrypt. IPSec uses symmetric.',
      'Page-OUT = memory→disk. Page-IN = disk→memory.',
    ],
  },
  {
    id: 'fs', icon: '◈', title: 'File Systems', titleRu: 'Файловые системы',
    color: '#b97a2e',
    facts: [
      { label: 'WAFL', text: 'IS a distributed file system (NetApp) — supports NFS AND CIFS' },
      { label: 'Root partition', text: 'Contains the OS kernel AND is mounted during boot time' },
      { label: 'Mounting', text: 'Makes a file system AVAILABLE within the namespace (not removed, not created)' },
      { label: 'Unmounted FS', text: 'You CANNOT access files in an unmounted file system → False' },
      { label: 'File owner', text: 'Can CHANGE file attributes AND GRANT access to others' },
      { label: 'UNIX directory', text: 'Acyclic-graph directory (allows sharing of files AND directories)' },
      { label: 'Acyclic-graph', text: 'ALLOWS sharing of both files and directories' },
      { label: 'Garbage collection', text: 'Necessary ONLY in general graph directory (has cycles)' },
      { label: 'Relative path', text: 'Defined from the CURRENT DIRECTORY (not root, not UFD)' },
      { label: '../mike/prog.c', text: 'Path from /home/user/jane to /home/user/mike/prog.c' },
      { label: 'create()', text: 'Does NOT use the open-file table (only open() does) → False' },
      { label: 'open()', text: 'Returns file descriptor (NOT a pointer to system-wide open-file table) → False' },
      { label: 'close()', text: 'DECREASES the open count of the file' },
      { label: 'read/write pointer', text: 'Reading AND writing use the SAME current-file-position pointer → True' },
      { label: 'Extension', text: 'IS part of the file name → True' },
      { label: 'Contiguous allocation', text: 'Defined by: address of FIRST BLOCK + LENGTH (in blocks) → True' },
      { label: 'Memory-mapped writes', text: 'NOT necessarily immediate writes to disk → True (write-back cache)' },
      { label: 'Logical file system module', text: 'Does NOT include the free-space manager → False' },
      { label: 'Logical record length', text: 'NOT fixed for a given OS — depends on the application → False' },
      { label: 'All file systems', text: 'Suffer from INTERNAL fragmentation (last block partially used) → True' },
      { label: 'ACL', text: 'Specifies USER NAMES and TYPES OF ACCESS allowed for each' },
      { label: 'Shared lock', text: 'SEVERAL processes can acquire it concurrently (read lock)' },
      { label: 'File protection', text: 'Can be provided by: ACL + knowledge of name + password → All of the above' },
      { label: 'UNIX rm', text: 'CANNOT delete non-empty directory (need rm -r) → False' },
      { label: 'Symbolic links (UNIX)', text: 'Delete link → original unaffected. Delete original → dangling link. Both true.' },
      { label: 'NFS', text: 'Does NOT provide concurrency control mechanisms (handled by NLM separately)' },
      { label: 'VFS layer', text: 'Allows access to DIFFERENT TYPES of locally mounted AND remote file systems' },
      { label: '32-bit file pointers', text: 'Limits max file size to 4 GB (2³²)' },
      { label: 'FAT method', text: 'Incorporates free-block accounting INTO the allocation table → True' },
      { label: 'Counting method (free space)', text: 'Uses B-tree, NOT linked list for efficient lookup → linked list statement is False' },
      { label: 'NVM devices', text: 'Need MORE than just a free list (also need garbage collection) → False' },
      { label: 'Raw disk interface', text: 'Some OSes provide it to bypass FS (e.g. databases) → True' },
      { label: 'MS Word RTF', text: 'Resistant to macro viruses (RTF has no macro support) → True' },
      { label: 'Consistency check', text: 'NOT always able to recover files/directories → False' },
      { label: '-rwxr-xr-- (owner=Jim, group=staff=Jim,Sara,Mike)', text: 'Alan (others) = r-- → can only READ' },
    ],
    traps: [
      'create() ≠ open(). create() makes a new inode. open() uses the open-file table.',
      'Mounting = making available (not creating). Unmounting = making unavailable.',
      'Relative path from CURRENT dir. Absolute path from ROOT (/).',
      '../mike/prog.c (one level up from jane, then into mike) — not ../../',
      'NFS has NO built-in concurrency control. NLM is separate.',
      'Acyclic-graph allows sharing. General graph allows cycles (needs garbage collection).',
    ],
  },
  {
    id: 'io', icon: '◎', title: 'I/O & Security', titleRu: 'I/O и безопасность',
    color: '#862e9c',
    facts: [
      { label: 'I/O control level', text: 'Device drivers + interrupt handlers → transfer info between memory and disk → True' },
      { label: 'Asynchronous write', text: 'Data stored in cache → control returns to caller immediately' },
      { label: 'Attack surface', text: 'Set of ALL points where attacker can try to break in → True' },
      { label: 'DoS purpose', text: 'To DISRUPT LEGITIMATE USE — NOT to gain info or steal → False for "gain info"' },
      { label: 'ASLR', text: 'Protects against CODE-INJECTION attacks (randomizes memory layout)' },
      { label: 'Vulnerability scans check', text: 'All of the above: long-running processes, hidden daemons, unauthorized programs' },
      { label: 'IPSec', text: 'Uses SYMMETRIC encryption (same key for both sides)' },
      { label: 'TLS', text: 'Provides security at the TRANSPORT layer' },
      { label: 'Symmetric encryption', text: 'SAME key to encrypt AND decrypt → False that "single key for encrypt, another to decrypt"' },
      { label: 'User authentication', text: 'Based on: knowledge + possession + attribute. Course answer: knowledge of something' },
      { label: 'Port scanning', text: 'Allows hacker to MODIFY transmission (man-in-the-middle)' },
      { label: 'Systems without file sharing', text: 'Do NOT need protection → True' },
      { label: 'Security levels', text: 'Physical + OS + Network — must ensure ALL levels → All of the above' },
      { label: 'Ransomware', text: 'Encrypts info on target and renders it inaccessible to owner' },
    ],
    traps: [
      'DoS = disrupt service (availability attack), NOT information theft.',
      'ASLR protects against code-injection, NOT zero-day or DoS.',
      'Symmetric = SAME key (AES, DES). Asymmetric = public + private keys (RSA).',
      'IPSec uses symmetric. TLS uses both (asymmetric for handshake, symmetric for data).',
      'TLS = Transport layer. IPSec = Network layer.',
    ],
  },
];

function CheatSheet({ setView }) {
  const [active, setActive] = React.useState('mem');
  const sheet = SHEETS.find(s => s.id === active);

  return (
    <div>
      <div className="page-head">
        <div>
          <div className="eyebrow">CHEAT SHEET · ШПАРГАЛКА</div>
          <h1>Quick-reference facts</h1>
          <p style={{ marginTop: 6, color: 'var(--muted)', maxWidth: 600 }}>
            Key facts, numbers and common exam traps — one page per topic.
          </p>
          <p style={{ fontSize: 13, color: 'var(--muted)', fontStyle: 'italic' }}>
            Ключевые факты, числа и типичные ловушки экзамена — одна страница на тему.
          </p>
        </div>
      </div>

      {/* Topic tabs */}
      <div className="filter-row" style={{ marginBottom: 24 }}>
        {SHEETS.map(s => (
          <button
            key={s.id}
            className={`chip ${active === s.id ? 'active' : ''}`}
            onClick={() => setActive(s.id)}
            style={active === s.id ? { borderColor: s.color, color: s.color, background: s.color + '14' } : {}}
          >
            {s.icon} {s.title}
          </button>
        ))}
      </div>

      {/* Key facts table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden', marginBottom: 16 }}>
        <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--line)', background: sheet.color + '0e', display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 20 }}>{sheet.icon}</span>
          <div>
            <div style={{ fontWeight: 700, fontSize: 16, color: sheet.color }}>{sheet.title}</div>
            <div style={{ fontSize: 12, color: 'var(--muted)', fontStyle: 'italic' }}>{sheet.titleRu}</div>
          </div>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <tbody>
            {sheet.facts.map((f, i) => (
              <tr key={i} style={{ borderBottom: '1px solid var(--line)', background: i % 2 === 0 ? 'transparent' : 'var(--bg-tint)' }}>
                <td style={{ padding: '10px 20px', width: '38%', fontFamily: 'var(--font-mono)', fontSize: 12, color: sheet.color, fontWeight: 600, verticalAlign: 'top', lineHeight: 1.5 }}>
                  {f.label}
                </td>
                <td style={{ padding: '10px 20px', fontSize: 13.5, color: 'var(--ink)', lineHeight: 1.55, verticalAlign: 'top' }}>
                  {f.text}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Exam traps */}
      <div className="card" style={{ borderColor: 'var(--bad)', background: 'rgba(179,66,42,0.04)' }}>
        <h3 style={{ color: 'var(--bad)', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
          <span>⚠</span> Common exam traps · Типичные ловушки
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {sheet.traps.map((t, i) => (
            <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
              <span style={{ color: 'var(--bad)', fontWeight: 700, flexShrink: 0, fontFamily: 'var(--font-mono)', fontSize: 12 }}>✕</span>
              <span style={{ fontSize: 13.5, color: 'var(--ink-2)', lineHeight: 1.5 }}>{t}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ marginTop: 24, textAlign: 'center' }}>
        <button className="btn btn-primary" onClick={() => setView({ kind: 'final' })}>
          Go to Exam Simulator →
        </button>
      </div>
    </div>
  );
}

window.CheatSheet = CheatSheet;
