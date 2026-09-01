/**
 * Content layer for every editor pane.
 *
 * Static facts live here. Anything that changes on its own (LeetCode stats,
 * merged pull requests) comes from live-stats.json, refreshed by
 * `npm run sync` and automatically before each build.
 */

import live from './live-stats.json'

export type FileId =
  | 'home'
  | 'about'
  | 'projects'
  | 'skills'
  | 'experience'
  | 'opensource'
  | 'publications'
  | 'contact'
  | 'readme'

export interface EditorFile {
  id: FileId
  name: string
  folder: 'src' | 'data' | 'root'
  lang: string
  icon: string
}

export const WORKSPACE = 'athang-kali'
export const SITE = 'https://www.athangkali.me'
export const SYNCED_AT = live.generatedAt

export const FILES: EditorFile[] = [
  { id: 'home', name: 'home.tsx', folder: 'src', lang: 'TypeScript React', icon: 'tsx' },
  { id: 'about', name: 'about.md', folder: 'src', lang: 'Markdown', icon: 'md' },
  { id: 'projects', name: 'projects.tsx', folder: 'src', lang: 'TypeScript React', icon: 'tsx' },
  { id: 'opensource', name: 'opensource.go', folder: 'src', lang: 'Go', icon: 'go' },
  { id: 'experience', name: 'experience.ts', folder: 'src', lang: 'TypeScript', icon: 'ts' },
  { id: 'skills', name: 'skills.json', folder: 'data', lang: 'JSON', icon: 'json' },
  { id: 'publications', name: 'publications.bib', folder: 'data', lang: 'BibTeX', icon: 'bib' },
  { id: 'contact', name: 'contact.sh', folder: 'src', lang: 'Shell Script', icon: 'sh' },
  { id: 'readme', name: 'README.md', folder: 'root', lang: 'Markdown', icon: 'md' },
]

export const RESUME = { name: 'Athang_Kali_Resume.pdf', href: '/Athang_Kali_Resume.pdf' }

/* ------------------------------------------------------------ live data */

export const LEETCODE = live.leetcode
export const TOTAL_MERGED = live.totalMerged
export const TOTAL_OPEN = live.totalOpen

/* ---------------------------------------------------------------- home */

export const HERO = {
  first: 'Athang',
  last: 'Kali',
  roles: ['Systems Engineer', 'Cloud Native / Backend', 'Open Source Contributor'],
  affiliation: 'CNCF Contributor · Headlamp · KubeArmor',
  typed: [
    'kernel adjacent systems in C++.',
    'Go services that hold under load.',
    'security fixes for CNCF projects.',
    'distributed fleet management.',
  ],
  summary:
    'Systems focused software engineer with significant open source contributions across CNCF projects, spanning security policy enforcement, plugin architecture and supply chain hardening. Proficient in Go and C++, with hands-on experience in kernel level systems programming, container orchestration internals and Kubernetes ecosystem development.',
  seeking: 'Open to software engineering roles in Systems, Cloud Native and Backend Development.',
  stats: [
    { value: String(TOTAL_MERGED), label: 'PRs merged' },
    { value: '104', label: 'CNCF contributions' },
    { value: String(LEETCODE.solved), label: 'problems solved' },
    { value: String(LEETCODE.rating), label: 'LeetCode rating' },
  ],
}

/* --------------------------------------------------------------- about */

export const ABOUT = {
  intro:
    'I work on systems software, mostly in Go and C++, close to the metal: kernel level programming, container orchestration internals and distributed agents. Most of that work happens in the open, across CNCF projects like Headlamp and KubeArmor, where 32 of my pull requests have been merged. I am in my final year of an engineering degree, and I spend most of it writing code that ships.',
  focus: [
    { icon: '01', text: 'Plugin architecture, Helm internals and frontend stability in Headlamp, the CNCF Kubernetes dashboard' },
    { icon: '02', text: 'Runtime security in KubeArmor: policy enforcement, container lifecycle events, CI reliability' },
    { icon: '03', text: 'Supply chain hardening through SLSA, OpenSSF Scorecard and signed release artifacts' },
    { icon: '04', text: 'C++ systems work: distributed Linux fleet agents and parallel file processing' },
    { icon: '05', text: `LeetCode ${LEETCODE.rating} rating, top ${LEETCODE.topPercentage}%, ${LEETCODE.solved} problems solved` },
    { icon: '06', text: 'Happy to talk about Go, C++, Kubernetes internals or eBPF' },
  ],
  education: [
    {
      school: 'Shri Guru Gobind Singhji Institute of Engineering and Technology',
      place: 'Nanded, Maharashtra',
      period: '2023 to 2027',
      degree: 'B.Tech, Electronics and Telecommunication Engineering',
      notes: ['CGPA 9.21 / 10', 'Final year, with relevant computer science coursework performed'],
    },
  ],
}

/* ------------------------------------------------------------ projects */

export interface Project {
  tags: string[]
  title: string
  blurb: string
  bullets: string[]
  stack: string[]
  github: string | null
  live: string | null
}

export const PROJECT_LIST: Project[] = [
  {
    tags: ['Distributed', 'C++', 'Observability'],
    title: 'Distributed Linux Fleet Management',
    blurb:
      'A distributed host monitoring platform in C++ with a lightweight Linux agent collecting live /proc and /sys metrics, plus a zero touch systemd onboarding pipeline that registers a new node from a single generated shell command.',
    bullets: [
      'Lightweight C++ agent built on Drogon, streaming live /proc and /sys metrics from every node',
      'Zero touch systemd onboarding: one generated shell command registers a new host',
      'Remote command execution secured with HMAC-SHA256 request signing, constant time verification and a server side whitelist',
      'Dual observability pipelines: a custom PostgreSQL backed dashboard alongside self hosted Prometheus and Grafana scraping',
    ],
    stack: ['C++', 'Drogon', 'systemd', 'PostgreSQL', 'Prometheus', 'Grafana', 'HMAC-SHA256'],
    github: 'https://github.com/Athang69/Distributed-Linux-Fleet-Management',
    live: null,
  },
  {
    tags: ['Systems', 'C++', 'Concurrency'],
    title: 'File Encrypter / Decrypter',
    blurb:
      'A C++ CLI utility for protecting sensitive files at rest through recursive directory encryption, using a producer consumer task queue with POSIX fork() to cut encryption time across large directory trees.',
    bullets: [
      'Recursive directory encryption driven by a producer consumer task queue',
      'POSIX fork() parallelism, measurably cutting time across large trees',
      'Flexible key derivation supporting hex, decimal and UTF-8 key material',
      'RAII smart pointers and move semantics transferring file stream ownership safely across IO, Task and ProcessManagement layers',
    ],
    stack: ['C++', 'POSIX', 'RAII', 'Parallel Processing', 'CLI'],
    github: 'https://github.com/Athang69/file_encrypter_decrypter',
    live: null,
  },
  {
    tags: ['Backend', 'Go', 'Redis'],
    title: 'URL Shortener API',
    blurb:
      'A production ready containerised REST API in Go using Fiber and Redis for high throughput link management, reaching sub 10ms redirect latency through O(1) key lookups with TTL based expiry.',
    bullets: [
      'Sub 10ms redirects via Redis O(1) lookups with TTL based expiry',
      'Custom alias support and domain validation on write',
      'Per IP rate limiting on a dedicated Redis database, logically isolated from link storage, so abuse is blocked without touching redirect throughput',
      'Containerised with Docker Compose for reproducible deployment',
    ],
    stack: ['Go', 'Fiber', 'Redis', 'Docker', 'Docker Compose'],
    github: 'https://github.com/Athang69/shorten-url-fiber-redis',
    live: null,
  },
  {
    tags: ['Full Stack', 'MERN', 'Fintech'],
    title: 'Expense Tracker System',
    blurb:
      'A full stack MERN expense manager: track income and spending, then read it back as interactive Chart.js breakdowns, with JWT auth and bcrypt hashed passwords guarding every route.',
    bullets: [
      'MongoDB, Express, React and Node end to end',
      'Chart.js visualisations for income versus expense trends and category breakdowns',
      'JWT and bcrypt authentication protecting all financial data',
      'Reworked MongoDB queries cutting read latency by roughly 15%',
    ],
    stack: ['React.js', 'Node.js', 'Express.js', 'MongoDB', 'Chart.js', 'JWT'],
    github: 'https://github.com/Athang69/Expense-Tracker',
    live: 'https://expense-tracker-lemon-eta-39.vercel.app/',
  },
]

/* ---------------------------------------------------------- open source */

/** Curated narrative per repo. PR lists and counts come from live-stats.json. */
const REPO_META: Record<string, { tag: string; blurb: string; wins: string[]; order: number }> = {
  'kubernetes-sigs/headlamp': {
    order: 0,
    tag: 'CNCF Kubernetes Dashboard',
    blurb:
      'Headlamp is the CNCF Kubernetes dashboard. My work spans the React frontend, the Helm layer and the Go backend, mostly on crashes, routing failures, release integrity and test coverage.',
    wins: [
      'Fixed a CronJob UI crash, a portforward handler exposing userID suffixes in responses, and a test that corrupted the real user kubeconfig.',
      'Broke a circular frontend import by moving cluster hooks to api/v1/hooks, unblocking static analysis.',
      'Added authenticated Helm repository support, enabling private registry workflows.',
      'Raised pkg/config test coverage from 74.2% to 83.9%.',
      'Hardened isValidRedirectPath against whitespace and URL encoded protocol bypass.',
      'Added cosign keyless signing for release checksums.',
    ],
  },
  'kubearmor/KubeArmor': {
    order: 1,
    tag: 'CNCF Runtime Security',
    blurb:
      'KubeArmor is a runtime security engine for Kubernetes. I work on correctness in the enforcement and container lifecycle paths, and on hardening the project supply chain.',
    wins: [
      'Integrated Renovate and pinned dependencies, lifting the OpenSSF Scorecard from 0/10 to 6/10.',
      'Fixed containerd exit event handling by unmarshalling through the TaskExit type.',
      'Updated Go dependencies to clear known security vulnerabilities.',
      'Added unit tests for the main package and stabilised intermittent blockposture CI failures.',
      'Added openEuler 24.03 LTS-SP3 to the supported platform matrix.',
    ],
  },
  'vfarcic/dot-ai-headlamp': {
    order: 2,
    tag: 'AI and Kubernetes',
    blurb: 'Improvements to the AI enhanced Headlamp plugin ecosystem.',
    wins: [],
  },
}

export interface OssRepo {
  repo: string
  tag: string
  blurb: string
  wins: string[]
  merged: number
  open: number
  firstMerged: string | null
  lastMerged: string | null
  allPrs: string
  prs: { number: number; title: string; url: string; mergedAt: string | null }[]
}

export const OSS: OssRepo[] = live.oss
  .map((o) => ({
    ...o,
    ...(REPO_META[o.repo] ?? { tag: 'Open Source', blurb: '', wins: [], order: 99 }),
    allPrs: `https://github.com/${o.repo}/pulls?q=is%3Apr+author%3AAthang69`,
  }))
  .sort((a, b) => a.order - b.order)

/* ------------------------------------------------------- CNCF contributor */

/** Mirrors the official CNCF contributor card for Athang69. */
export const CNCF_CARD = {
  handle: 'Athang69',
  contributions: 104,
  repoCount: 3,
  repos: ['headlamp', 'KubeArmor', 'plugins'],
  counts: [
    { label: 'commits', value: 36 },
    { label: 'pull requests', value: 55 },
    { label: 'issues', value: 13 },
  ],
  years: ['2026'],
  firstContribution: {
    repo: 'kubearmor/KubeArmor',
    title: 'docs(getting-started): fix typos in default_posture and alert_throttling',
    date: '1 April 2026',
    url: 'https://github.com/kubearmor/KubeArmor/pull/2513',
  },
}

/* ----------------------------------------------------------- experience */

export const EXPERIENCE_LIST = [
  {
    period: 'Apr 2026 to present',
    role: 'Open Source Contributor',
    org: 'CNCF · Headlamp and KubeArmor',
    mode: 'Community',
    current: true,
    link: { label: 'View contributions', url: 'https://github.com/Athang69' },
    bullets: [
      `${TOTAL_MERGED} pull requests merged across Headlamp and KubeArmor, with ${TOTAL_OPEN} more in review, totalling ${CNCF_CARD.contributions} contributions to ${CNCF_CARD.repoCount} CNCF repositories.`,
      'Shipped stability fixes into Headlamp: a CronJob detail crash, a portforward handler leaking userID suffixes, and a test that overwrote real user kubeconfig.',
      'Added authenticated Helm repository support to Headlamp, unlocking private registry workflows for operators.',
      'Broke a circular frontend import in Headlamp by relocating cluster hooks, unblocking static analysis across the codebase.',
      'Raised the KubeArmor OpenSSF Scorecard from 0/10 to 6/10 by introducing Renovate and pinning every dependency.',
      'Corrected containerd exit event handling in KubeArmor and stabilised intermittent CI failures in the block posture suite.',
    ],
    stack: ['Go', 'Kubernetes', 'React', 'TypeScript', 'Helm', 'OpenSSF Scorecard'],
  },
  {
    period: 'Sep 2026 to Nov 2026',
    role: 'Full Stack Developer Intern',
    org: 'Aeons Technologies',
    mode: 'Remote',
    current: true,
    link: {
      label: 'View certificate',
      url: 'https://drive.google.com/file/d/1Elxi4uv47QLZAEnGCjGRs3Ow731NBdCi/view?usp=sharing',
    },
    bullets: [
      'Shipped full stack features across React, Node and MongoDB, improving application responsiveness by 30%.',
      'Designed RESTful APIs that cut data retrieval latency by 20%, and reworked MongoDB indexing to bring query times down materially.',
      'Introduced input validation and consistent error handling, reducing runtime failures in production.',
      'Worked to an agile Git workflow: branch hygiene, peer reviewed pull requests and continuous integration.',
    ],
    stack: ['React.js', 'Node.js', 'MongoDB', 'REST APIs', 'Git', 'Agile'],
  },
]

/* --------------------------------------------------------- publications */

export const PUBLICATIONS = [
  {
    key: 'kali2026collaborative',
    title: 'Design and Development of a Collaborative Learning System for Interactive Two-Way Education',
    venue: 'IJEDR, International Journal of Engineering Development and Research',
    detail: 'Volume 13, Issue 4, November 2026, pages 198 to 201',
    issn: 'ISSN 2321-9939',
    url: 'https://rjwave.org/ijedr/viewpaperforall.php?paper=IJEDR2504276',
  },
]

/* --------------------------------------------------------------- skills */

export interface SkillGroup {
  group: string
  items: string[]
}

export const SKILL_GROUPS: SkillGroup[] = [
  { group: 'Languages', items: ['Go', 'C++', 'JavaScript', 'TypeScript', 'SQL', 'Shell', 'YAML', 'Python'] },
  { group: 'Cloud Native and Security', items: ['Kubernetes', 'eBPF', 'KubeArmor', 'Docker', 'SLSA', 'OpenSSF Scorecard', 'GitHub Actions'] },
  { group: 'Web', items: ['Next.js', 'React.js', 'Node.js', 'Express.js', 'Tailwind CSS', 'WebSocket', 'REST APIs'] },
  { group: 'Databases', items: ['MySQL', 'MongoDB', 'PostgreSQL', 'Prisma', 'Redis'] },
  { group: 'Observability', items: ['Prometheus', 'Grafana', 'Node Exporter'] },
  { group: 'Tools', items: ['Linux', 'Git', 'Docker', 'Vercel', 'Render'] },
]

export const ALSO_KNOWN = [
  'Drogon', 'systemd', 'HMAC-SHA256', 'POSIX', 'RAII', 'Fiber', 'Docker Compose',
  'Chart.js', 'JWT', 'Data Structures and Algorithms', 'Operating Systems', 'Computer Networks',
]

/* ------------------------------------------------------------ highlights */

export const HIGHLIGHTS = [
  {
    label: `LeetCode ${LEETCODE.rating}, top ${LEETCODE.topPercentage}%`,
    detail: `${LEETCODE.solved} problems solved across ${LEETCODE.contests} contests, with strong algorithmic and DSA fundamentals.`,
    url: 'https://leetcode.com/u/AthangOP/',
  },
  {
    label: 'Open source impact',
    detail: `${TOTAL_MERGED} pull requests merged into CNCF projects, with ${TOTAL_OPEN} currently in review.`,
    url: 'https://github.com/Athang69',
  },
  {
    label: 'Academic record',
    detail: 'CGPA 9.21 in B.Tech Electronics and Telecommunication Engineering.',
    url: null,
  },
]

/* -------------------------------------------------------------- contact */

export const LINKS = [
  { key: 'Email', value: 'athangkali21@gmail.com', href: 'mailto:athangkali21@gmail.com' },
  { key: 'GitHub', value: 'github.com/Athang69', href: 'https://github.com/Athang69' },
  { key: 'LinkedIn', value: 'in/athang-kali', href: 'https://www.linkedin.com/in/athang-kali-56341426a/' },
  { key: 'LeetCode', value: 'leetcode.com/u/AthangOP', href: 'https://leetcode.com/u/AthangOP/' },
  { key: 'X', value: '@AthangKali', href: 'https://x.com/AthangKali' },
  { key: 'Website', value: 'athangkali.me', href: SITE },
  { key: 'Phone', value: '+91 93095 88914', href: 'tel:+919309588914' },
]
