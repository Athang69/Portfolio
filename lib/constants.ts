export const PERSONAL_INFO = {
  name: 'Athang Kali',
  degree: 'B.Tech Electronics and Telecommunication Engineering',
  institution: 'Shri Guru Gobind Singhji Institute of Engineering and Technology, Nanded',
  shortInstitution: 'SGGS Nanded',
  year: 'Third Year (2023–2027)',
  cgpa: '9.16',
  email: 'athangkali21@gmail.com',
  phone: '+91 9309588914',
  tagline: 'Precise. Ambitious. Builder.',
}

export const SOCIAL_LINKS = {
  github: 'https://github.com/Athang69',
  linkedin: 'https://www.linkedin.com/in/athang-kali-56341426a/',
  leetcode: 'https://leetcode.com/u/AthangOP/',
  twitter: 'https://x.com/AthangKali',
  portfolio: 'https://athang-portfolio.vercel.app/',
}

export const TYPING_PHRASES = [
  'full-stack web applications.',
  'scalable REST APIs & backends.',
  'open-source Kubernetes tools.',
  'interactive UI/UX experiences.',
  'systems that perform at scale.',
]

export const NAV_LINKS = [
  { label: 'About', href: '#about' },
  { label: 'Projects', href: '#projects' },
  { label: 'Open Source', href: '#opensource' },
  { label: 'Experience', href: '#experience' },
  { label: 'Contact', href: '#contact' },
]

export const TICKER_ITEMS = [
  'CGPA 9.16 / 10',
  'LeetCode Top 14%',
  '1650+ Rating',
  '400+ Problems Solved',
  'MERN Stack Developer',
  'Kubernetes Contributor',
  'Open Source · 12+ Merged PRs',
  'React.js · Node.js · TypeScript',
  'Docker · Prometheus · Grafana',
  'SGGS Nanded · Class of 2027',
  'Full Stack Engineer',
]

export const SKILLS = {
  Languages: ['C++', 'JavaScript', 'TypeScript', 'Python', 'SQL', 'Shell / Bash', 'YAML'],
  Frontend: ['React.js', 'Next.js', 'Tailwind CSS', 'WebSocket', 'HTML5', 'CSS3'],
  Backend: ['Node.js', 'Express.js', 'REST APIs', 'JWT Auth', 'Bcrypt', 'Input Validation'],
  Database: ['MongoDB', 'MySQL', 'PostgreSQL', 'Prisma ORM', 'Firebase', 'Mongoose'],
  DevOps: ['Docker', 'Git', 'GitHub', 'Linux', 'Unix', 'Vercel', 'Render'],
  Monitoring: ['Prometheus', 'Grafana', 'Node Exporter'],
  'CS Core': ['Data Structures & Algorithms', 'Computer Networks', 'Operating Systems'],
  Process: ['Agile / Scrum', 'Code Review', 'Technical Documentation', 'Version Control'],
}

export const SKILL_CATEGORIES = [
  { key: 'All', label: 'All' },
  { key: 'Languages', label: 'Languages' },
  { key: 'Frontend', label: 'Frontend' },
  { key: 'Backend', label: 'Backend' },
  { key: 'Database', label: 'Database' },
  { key: 'DevOps', label: 'DevOps' },
  { key: 'CS Core', label: 'CS Core' },
]

export const PROJECTS = [
  {
    number: '01',
    title: 'Expense Tracker System',
    featured: true,
    description:
      'A production-ready full-stack expense management application where users can track income and expenses, visualize their financial data through interactive charts, and manage their money with confidence. Built with security and performance as first-class priorities — JWT authentication, bcrypt-hashed passwords, and optimized MongoDB queries with 15% reduced latency.',
    highlights: [
      'Full MERN stack — MongoDB, Express, React, Node — end-to-end',
      'Chart.js visualizations for income vs. expense trends and category breakdowns',
      'Secure JWT + Bcrypt authentication protecting all financial data',
      'RESTful API architecture with optimized MongoDB queries (15% latency reduction)',
      'Responsive UI — works on mobile, tablet, and desktop',
    ],
    stack: ['React.js', 'Node.js', 'Express.js', 'MongoDB', 'Chart.js', 'JWT', 'Bcrypt', 'REST API', 'Vercel'],
    github: 'https://github.com/Athang69/Expense-Tracker',
    live: 'https://expense-tracker-lemon-eta-39.vercel.app/',
  },
  {
    number: '02',
    title: 'Second Brain',
    featured: false,
    description:
      'A full-stack knowledge management platform — your personal digital brain. Capture notes, ideas, bookmarks, and references. Access them from any device with real-time synchronization powered by Firebase and MongoDB. Designed for engineers who think fast and need their tools to keep up.',
    highlights: [
      'Real-time cross-device sync using Firebase + MongoDB hybrid approach (40% consistency improvement)',
      'Note retrieval latency reduced by 30% through smart caching and query optimization',
      'Modular RESTful API architecture — easy to extend with new content types',
      'Responsive component system boosting user workflow efficiency by 35%',
    ],
    stack: ['React.js', 'Node.js', 'MongoDB', 'Firebase', 'Express.js', 'REST API', 'Tailwind CSS'],
    github: 'https://github.com/Athang69/Second-Brain',
    live: null,
  },
  {
    number: '03',
    title: 'StationeryX Backend',
    featured: false,
    description:
      'A robust backend system for a stationery inventory management platform. Handles product catalog management, order processing, and real-time stock tracking through a modular API architecture. Built to demonstrate clean separation of concerns, proper error handling, and scalable database design.',
    highlights: [
      'Modular Node.js API supporting product management, orders, and inventory tracking',
      'Optimized MongoDB queries and indexing improved query performance by 25%',
      'Comprehensive input validation and error handling for production reliability',
      'Clean RESTful endpoint design following REST conventions strictly',
    ],
    stack: ['Node.js', 'Express.js', 'MongoDB', 'REST API', 'Input Validation', 'Mongoose'],
    github: 'https://github.com/aeonstechdevops/StationaryX-BD',
    live: null,
  },
]

export const OPEN_SOURCE = [
  {
    repo: 'kubernetes-sigs/headlamp',
    tag: 'Kubernetes Dashboard',
    description:
      'Headlamp is a user-friendly Kubernetes UI. I contributed across multiple areas including error handling, test coverage, and API bug fixes.',
    prs: [
      { number: '#5683', url: 'https://github.com/kubernetes-sigs/headlamp/pull/5683', tooltip: 'auth: Bound FuzzSanitizeClusterName input to prevent CI timeout' },
      { number: '#5172', url: 'https://github.com/kubernetes-sigs/headlamp/pull/5172', tooltip: 'k8cache: Add tests for uncovered branches' },
      { number: '#5152', url: 'https://github.com/kubernetes-sigs/headlamp/pull/5152', tooltip: 'persist prettify log preference to localStorage' },
      { number: '#5149', url: 'https://github.com/kubernetes-sigs/headlamp/pull/5149', tooltip: 'helm repository error handling and regression test coverage' },
      { number: '#5139', url: 'https://github.com/kubernetes-sigs/headlamp/pull/5139', tooltip: 'increase pkg/config test coverage' },
      { number: '#5124', url: 'https://github.com/kubernetes-sigs/headlamp/pull/5124', tooltip: 'add unit tests for handler.go' },
      { number: '#5105', url: 'https://github.com/kubernetes-sigs/headlamp/pull/5105', tooltip: 'add backend helm auth token and frontend RouteSwitcher key uniqueness tests' },
      { number: '#5096', url: 'https://github.com/kubernetes-sigs/headlamp/pull/5096', tooltip: 'fix: helm release auth token and route key collision for app catalog' },
      { number: '#5085', url: 'https://github.com/kubernetes-sigs/headlamp/pull/5085', tooltip: 'frontend: cronjob: Handle undefined spec.suspend in List and Details' },
      { number: '#5060', url: 'https://github.com/kubernetes-sigs/headlamp/pull/5060', tooltip: 'docs: fix typos, stale links, and outdated dependency versions' },
    ],
    summary: 'Helm repo error handling · Unit test coverage · CronJob spec.suspend API fix',
  },
  {
    repo: 'kubearmor/KubeArmor',
    tag: 'Security-Focused Kubernetes',
    description:
      'KubeArmor is a runtime Kubernetes security engine. I fixed a critical API client bug involving incorrect function casting and improper timeout handling.',
    prs: [
      { number: '#2513', url: 'https://github.com/kubearmor/KubeArmor/pull/2513', tooltip: 'docs(getting-started): fix typos in default_posture and alert_throttling' },
      { number: '#2591', url: 'https://github.com/kubearmor/KubeArmor/pull/2591', tooltip: 'fix(build): update Go dependencies to resolve known security vulnerabilities' },
    ],
    summary: 'Documentation improvements · API client bug fix (function casting, timeout)',
  },
  {
    repo: 'vfarcic/dot-ai-headlamp',
    tag: 'AI + Kubernetes',
    description: 'Additional improvements to the AI-enhanced Headlamp plugin ecosystem.',
    prs: [
      { number: '#2', url: 'https://github.com/vfarcic/dot-ai-headlamp/pull/2', tooltip: 'Plugin improvements' },
    ],
    summary: 'Plugin improvements',
  },
]

export const EXPERIENCE = {
  company: 'Aeons Technologies',
  role: 'Full Stack Developer',
  type: 'Remote',
  dateRange: 'Sep 2025 – Oct 2025',
  duration: '2 months',
  responsibilities: [
    'Developed full-stack features using React.js, Node.js, and MongoDB, improving overall application responsiveness by 30% through optimized state management and API design.',
    'Designed and integrated scalable RESTful APIs following REST conventions, reducing backend data retrieval latency by 20% through efficient endpoint structuring.',
    'Optimized database queries and indexing strategies in MongoDB, improving transaction processing throughput and significantly reducing average query execution time.',
    'Collaborated in an agile development workflow using Git and version control best practices — branch management, PR reviews, and continuous integration.',
    'Implemented comprehensive input validation and error handling mechanisms, reducing runtime errors and improving overall application reliability and user experience.',
  ],
  skills: ['React.js', 'Node.js', 'MongoDB', 'Express.js', 'Git', 'REST APIs', 'Agile'],
}

export const STATS = [
  { icon: 'GraduationCap', number: '9.16', label: 'CGPA out of 10' },
  { icon: 'Code', number: '400+', label: 'LeetCode problems' },
  { icon: 'TrendUp', number: '1650+', label: 'LeetCode rating' },
  { icon: 'GitMerge', number: '12+', label: 'OSS PRs merged' },
]
