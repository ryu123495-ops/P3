'use client';

import { useEffect, useState } from 'react';
import { ArrowDown, ArrowRight, ArrowUpRight, Check, CircleHelp, Pause, Play, RotateCcw, Sparkles, Ticket, Zap } from 'lucide-react';

const ODDS = 8145060;
const TICKETS = 100;
const WEEKLY_WIN = 1 - Math.pow(1 - 1 / ODDS, TICKETS);
type Status = 'ready' | 'running' | 'paused' | 'won';
type Entry = { week: number; won: boolean; numbers: number[] };
const format = (n: number) => n.toLocaleString('ko-KR');
const balls = () => Array.from({ length: 45 }, (_, i) => i + 1).sort(() => Math.random() - 0.5).slice(0, 6).sort((a, b) => a - b);
const makeEntry = (week: number, won = false): Entry => ({ week, won, numbers: balls() });

export default function Home() {
  const [status, setStatus] = useState<Status>('ready');
  const [week, setWeek] = useState(0);
  const [history, setHistory] = useState<Entry[]>([]);

  useEffect(() => {
    if (status !== 'running') return;
    const timer = window.setInterval(() => {
      const won = Math.random() < WEEKLY_WIN;
      setWeek(previous => {
        const next = previous + 1;
        setHistory(items => [makeEntry(next, won), ...items].slice(0, 4));
        return next;
      });
      if (won) setStatus('won');
    }, 100);
    return () => window.clearInterval(timer);
  }, [status]);

  const reset = () => { setStatus('ready'); setWeek(0); setHistory([]); };
  const skip = () => {
    // The geometric distribution samples the number of independent weeks until success.
    const remaining = Math.floor(Math.log1p(-Math.random()) / Math.log1p(-WEEKLY_WIN)) + 1;
    const finalWeek = week + remaining;
    setWeek(finalWeek);
    setHistory([makeEntry(finalWeek, true)]);
    setStatus('won');
  };
  const chance = 1 - Math.pow(1 - WEEKLY_WIN, week);
  const percent = chance < 0.0001 && chance > 0 ? '<0.01' : (chance * 100).toFixed(2);

  return <main>
    <header className="header"><div className="header-inner"><a href="#" className="brand"><span className="brand-icon"><Sparkles size={17} fill="currentColor" /></span><span>LUCKY LAB<span className="brand-dot">.</span></span></a><span className="header-label">작은 호기심을 위한 실험실 <span>✳</span></span></div></header>
    <div className="page">
      <section className="hero"><div className="eyebrow"><span className="eyebrow-dot" /> LOTTO SIMULATION <span className="eyebrow-line" /> NO. 001</div><h1>로또 1등,<br /><span>언젠가는 될까요?</span></h1><p>매주 로또 100장씩 산다면, 1등에 당첨되기까지<br className="desktop" /> 얼마나 오랜 시간이 걸릴지 직접 확인해 보세요.</p><div className="hero-bottom"><span>당신의 행운을 실험해 보세요</span><ArrowDown size={15}/></div><div className="hero-art" aria-hidden="true"><div className="orbit orbit-one"/><div className="orbit orbit-two"/><div className="art-sparkle">✳</div><div className="art-ball ball-a">7</div><div className="art-ball ball-b">24</div><div className="art-ball ball-c">✦</div><div className="art-shadow"/></div></section>
      <section className="simulation"><div className="section-heading"><div><div className="section-kicker"><span>01</span> THE EXPERIMENT</div><h2>행운 시뮬레이션</h2><p>버튼을 누르고 당신의 첫 번째 1등을 기다려 보세요.</p></div><div className="live-badge"><span className={status === 'running' ? 'pulse' : ''}/>{status === 'running' ? '시뮬레이션 진행 중' : status === 'won' ? '시뮬레이션 완료' : '시뮬레이션 준비 완료'}</div></div>
        <div className="dashboard"><div className="dashboard-top"><div className="dash-title"><div className="ticket-icon"><Ticket size={19}/></div><div><strong>나의 로또 여정</strong><small>매주 100장 · 게임당 1,000원</small></div></div><span className="speed"><span/> 0.1초 = 1주</span></div><div className="metrics"><div className="metric main-metric"><span>지나간 시간 <CircleHelp size={13}/></span><div><strong>{format(week)}</strong><b>주</b></div><small>약 {format(Math.floor(week / 52))}년 {week % 52}주</small></div><div className="metric"><span>구매한 로또</span><div><strong>{format(week * TICKETS)}</strong><b>장</b></div><small>매주 100장씩 구매</small></div><div className="metric"><span>지금까지 쓴 금액</span><div><strong>{format(week * TICKETS * 1000)}</strong><b>원</b></div><small>게임당 1,000원 기준</small></div></div><div className="progress-row"><div><span>누적 1등 당첨 확률</span><strong>{percent}%</strong></div><div className="progress-track"><div style={{width: `${chance * 100}%`}} /></div><p>이 기간 동안 1등에 한 번 이상 당첨될 확률이에요.</p></div><div className="controls"><button className="primary" onClick={() => setStatus(status === 'running' ? 'paused' : 'running')} disabled={status === 'won'}>{status === 'running' ? <><Pause size={17} fill="currentColor"/> 일시정지</> : <><Play size={17} fill="currentColor"/> {status === 'paused' ? '이어서 시작하기' : status === 'won' ? '1등 당첨 완료!' : '시뮬레이션 시작하기'}</>}</button><button className="icon-button" onClick={reset} aria-label="초기화" title="초기화"><RotateCcw size={18}/></button><button className="skip" onClick={skip} disabled={status === 'won'}><Zap size={15}/> 결과 바로 보기 <ArrowRight size={15}/></button></div></div>
      </section>
      <section className="lower-grid"><div className="history-card"><div className="card-heading"><div><span className="section-kicker"><span>02</span> LIVE HISTORY</span><h3>주간 추첨 기록</h3></div><span className="latest">최근 기록 <ArrowUpRight size={14}/></span></div>{history.length === 0 ? <div className="empty"><div className="empty-icon"><Ticket size={23}/></div><strong>아직 추첨 기록이 없어요</strong><p>시뮬레이션을 시작하면 이곳에<br/>매주 추첨 결과가 나타나요.</p></div> : <div className="history-list">{history.map(item => <div className="history-item" key={item.week}><div><strong>{format(item.week)}주차</strong><small>100장 구매</small></div><div className="number-balls">{item.numbers.map(n => <span key={n}>{n}</span>)}</div><span className={item.won ? 'result won' : 'result'}>{item.won ? '1등 당첨!' : '1등 미당첨'}</span></div>)}</div>}<div className="history-note">표시된 번호는 이해를 돕기 위한 임의의 추첨 번호입니다.</div></div><div className="info-card"><div className="info-top"><span className="section-kicker"><span>03</span> DID YOU KNOW?</span><Sparkles size={19}/></div><h3>행운에도<br/>확률이 있어요.</h3><p>로또 6/45의 1등 당첨 확률은<br/>한 게임당 <strong>8,145,060분의 1</strong>이에요.</p><div className="info-divider"/><div className="info-stat"><span>매주 100장씩 구매한다면</span><strong>평균 약 1,566년 <ArrowUpRight size={16}/></strong></div><div className="info-foot"><Check size={13}/> 확률은 매주 독립적으로 적용돼요</div></div></section>
      <div className="disclaimer"><CircleHelp size={15}/><span>이 시뮬레이션은 확률에 대한 이해를 돕기 위한 것으로, 실제 당첨 결과와는 관계가 없습니다. 즐거움으로만 가볍게 즐겨주세요.</span></div>
    </div><footer><div><a href="#" className="footer-brand">LUCKY LAB<span>.</span></a><span>일상 속 작은 궁금증을 실험합니다.</span><small>© 2025 LUCKY LAB. ALL RIGHTS RESERVED.</small></div></footer>
  </main>;
}
