// ========================================
// Life RPG Dashboard — Data Store & RPG Engine
// ========================================
const Store = {
  _key: 'lifeRpgData',
  _defaults: {
    character: {
      name: '발명가', level: 0, dreamJob: '부업 연봉 1억',
      exp: 0, expMax: 100, hp: 100, hpMax: 100, mp: 100, mpMax: 100,
      focusSetting: 10, yearGoal: 0, coins: 0
    },
    profile: {
      mode: '이지모드', gender: '남자', age: 37,
      height: 178, weight: 94, birthdate: '1987-11-09'
    },
    // 6 RPG power areas
    powerScores: { action: 0, willpower: 0, finance: 0, intel: 0, creativity: 0, physical: 0 },
    // Action Power - 실행력
    actionStats: { rank: '아이언', monthlyMinutes: 0, alerts: 0, active: 0, frozen: 0 },
    // Strategic Projects (전략 프로젝트 - gallery cards)
    projects: [
      { id: 1, title: '유튜브 시작하기', status: 'active', progress: 0, deadline: '2025-04-30', stageSize: 88, overdue: true, cover: '🎬' },
      { id: 2, title: 'New Project', status: 'active', progress: 0, deadline: '2025-06-30', stageSize: 30, overdue: true, cover: '📂' },
      { id: 3, title: 'New Project', status: 'active', progress: 0, deadline: '', stageSize: 20, overdue: false, cover: '📂' }
    ],
    // Quests (개별 퀘스트 - MAIN/SUB 계층)
    quests: [
      { id: 101, title: '아침러닝10km', type: 'MAIN', status: 'todo', timeSpent: 0, timerRunning: false, timerStart: null, projectId: 2, deadline: '', category: 'action' },
      { id: 102, title: '유튜브 영상 하나 업로드', type: 'MAIN', status: 'todo', timeSpent: 0, timerRunning: false, timerStart: null, projectId: 1, deadline: '', category: 'action' },
      { id: 103, title: '공략집 숙지 및 출력', type: 'MAIN', status: 'todo', timeSpent: 0, timerRunning: false, timerStart: null, projectId: 1, deadline: '', category: 'action' },
      { id: 104, title: '유튜브 채널 만들기', type: 'MAIN', status: 'todo', timeSpent: 0, timerRunning: false, timerStart: null, projectId: 1, deadline: '', category: 'action' },
      { id: 105, title: '유튜브 첫번째 영상 기획', type: 'MAIN', status: 'todo', timeSpent: 0, timerRunning: false, timerStart: null, projectId: 1, deadline: '', category: 'action' },
      { id: 106, title: '첫번째 영상 피드백', type: 'MAIN', status: 'todo', timeSpent: 0, timerRunning: false, timerStart: null, projectId: 1, deadline: '', category: 'action' }
    ],
    // Finance
    finances: [],
    assets: [
      { id: 1, name: '국민은행', balance: 0, type: 'bank' },
      { id: 2, name: '현금', balance: 0, type: 'cash' }
    ],
    debts: [],
    subscriptions: [
      { id: 1, name: 'Notion', amount: 8000, cycle: '월간', icon: '📝', paidThisMonth: false },
      { id: 2, name: 'TradingView', amount: 15000, cycle: '월간', icon: '📈', paidThisMonth: false },
      { id: 3, name: 'YouTube Premium', amount: 14900, cycle: '월간', icon: '🎬', paidThisMonth: false }
    ],
    // Intelligence
    books: [
      { id: 1, title: '돈의 심리학', author: '모건 하우절', currentPage: 130, totalPages: 200, status: 'reading' },
      { id: 2, title: '원씽', author: '게리 켈러', currentPage: 60, totalPages: 200, status: 'reading' }
    ],
    lectures: [],
    // Willpower - Habits
    goodHabits: [
      { id: 1, name: '기상 후 물 한 잔', streak: 5, history: {} },
      { id: 2, name: '30분 독서', streak: 3, history: {} },
      { id: 3, name: '운동 30분', streak: 7, history: {} },
      { id: 4, name: '감사일기 쓰기', streak: 2, history: {} }
    ],
    badHabits: [
      { id: 5, name: '유튜브 1시간 이상', streak: 0, history: {} },
      { id: 6, name: '야식', streak: 0, history: {} }
    ],
    // Daily Journal
    journal: [],
    dailyLogs: [], // { date, condition: {physical, mental, note}, schedule: [{time, task}] }
    // Rewards
    rewards: [
      { id: 1, name: '맛있는 외식', cost: 50, icon: '🍽️', purchased: 0 },
      { id: 2, name: '게임 1시간', cost: 30, icon: '🎮', purchased: 0 },
      { id: 3, name: '영화 관람', cost: 40, icon: '🎬', purchased: 0 }
    ],
    rewardLog: [],
    // Strategy - Yearly Goals
    yearlyGoals: [
      { id: 1, title: '75kg 달성', current: 94, target: 75, unit: 'kg', category: 'physical' },
      { id: 2, title: '유튜브 구독자 1000명', current: 0, target: 1000, unit: '명', category: 'creativity' }
    ],
    // Inventory - Ideas
    ideas: [],
    _nextId: 100
  },
  load() {
    try {
      const raw = localStorage.getItem(this._key);
      if (raw) {
        const data = JSON.parse(raw);
        const defaults = JSON.parse(JSON.stringify(this._defaults));
        // Deep merge: ensure all default keys exist, including nested
        for (const k of Object.keys(defaults)) {
          if (!(k in data)) {
            data[k] = defaults[k];
          } else if (typeof defaults[k] === 'object' && !Array.isArray(defaults[k]) && defaults[k] !== null) {
            // Merge nested object keys (e.g., character.coins)
            for (const nk of Object.keys(defaults[k])) {
              if (data[k][nk] === undefined) data[k][nk] = defaults[k][nk];
            }
          }
        }
        return data;
      }
    } catch(e) { console.error(e); }
    return JSON.parse(JSON.stringify(this._defaults));
  },
  save(data) { localStorage.setItem(this._key, JSON.stringify(data)); },
  get data() { if (!this._cache) this._cache = this.load(); return this._cache; },
  commit() { this.save(this._cache); },
  nextId() { this._cache._nextId = (this._cache._nextId || 100) + 1; this.commit(); return this._cache._nextId; },
  reset() { localStorage.removeItem(this._key); this._cache = null; }
};

// --- RPG Engine ---
const RPG = {
  // Calculate EXP from 6 power areas (weighted average)
  calcEXP() {
    const s = Store.data.powerScores;
    const total = (s.action + s.willpower + s.finance + s.intel + s.creativity + s.physical);
    const avg = Math.round(total / 6);
    Store.data.character.exp = Math.min(avg, Store.data.character.expMax);
  },
  // Calculate HP from daily condition
  calcHP() {
    const today = todayStr();
    const log = Store.data.dailyLogs.find(l => l.date === today);
    if (log && log.condition) {
      Store.data.character.hp = Math.min(100, Math.round((log.condition.physical + log.condition.mental) / 2));
    }
  },
  // Calculate MP from focus/habit completion
  calcMP() {
    const today = todayStr();
    const totalHabits = Store.data.goodHabits.length;
    if (!totalHabits) return;
    const doneToday = Store.data.goodHabits.filter(h => h.history[today]).length;
    Store.data.character.mp = Math.min(100, Math.round((doneToday / totalHabits) * 100));
  },
  // Award coins for completing quests/habits
  awardCoins(amount) {
    Store.data.character.coins += amount;
    Store.commit();
  },
  // Update power score from activity
  updatePowerScore(area, delta) {
    Store.data.powerScores[area] = Math.max(0, Math.min(100, (Store.data.powerScores[area] || 0) + delta));
    this.calcEXP();
    Store.commit();
  },
  // Recalculate all stats
  refresh() {
    this.calcEXP();
    this.calcHP();
    this.calcMP();
    // Year goal progress
    const goals = Store.data.yearlyGoals;
    if (goals.length) {
      const avgProgress = goals.reduce((s, g) => {
        const p = g.target > g.current ? ((g.current / g.target) * 100) : 100;
        return s + Math.min(100, Math.abs(p));
      }, 0) / goals.length;
      Store.data.character.yearGoal = Math.round(avgProgress);
    }
    Store.commit();
  }
};

// --- Finance Engine ---
const Finance = {
  totalAssets() { return Store.data.assets.reduce((s, a) => s + (a.balance || 0), 0); },
  totalDebts() { return Store.data.debts.reduce((s, d) => s + (d.remaining || 0), 0); },
  netWorth() { return this.totalAssets() - this.totalDebts(); },
  monthlyIncome() {
    const ym = new Date().toISOString().slice(0, 7);
    return Store.data.finances.filter(f => f.type === 'income' && f.date?.startsWith(ym)).reduce((s, f) => s + f.amount, 0);
  },
  monthlyExpense() {
    const ym = new Date().toISOString().slice(0, 7);
    return Store.data.finances.filter(f => f.type === 'expense' && f.date?.startsWith(ym)).reduce((s, f) => s + f.amount, 0);
  },
  monthlyNet() { return this.monthlyIncome() - this.monthlyExpense(); },
  monthlySubs() { return Store.data.subscriptions.reduce((s, sub) => s + sub.amount, 0); }
};

// --- Utilities ---
function todayStr() { return new Date().toISOString().slice(0, 10); }
function formatMoney(n) { return (n < 0 ? '-' : '') + '₩' + Math.abs(n).toLocaleString('ko-KR'); }
function formatTime(mins) {
  if (mins < 60) return `${mins}분`;
  return `${Math.floor(mins/60)}시간 ${mins%60}분`;
}
function getWeekNumber() {
  const d = new Date(); const start = new Date(d.getFullYear(), 0, 1);
  return Math.ceil(((d - start) / 86400000 + start.getDay() + 1) / 7);
}
function daysUntil(dateStr) {
  if (!dateStr) return null;
  const diff = Math.ceil((new Date(dateStr) - new Date()) / 86400000);
  return diff;
}
