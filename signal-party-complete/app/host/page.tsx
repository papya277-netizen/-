'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

interface Participant { id: number; gender: 'M' | 'F' }
interface SeatTable { table_no: number; seat_count: number }

export default function Host() {
  const [pin, setPin] = useState('');
  const [ok, setOk] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    setOk(localStorage.getItem('host_ok') === '1');
  }, []);

  const check = () => {
    if (pin === process.env.NEXT_PUBLIC_HOST_PIN) {
      localStorage.setItem('host_ok', '1');
      setOk(true);
      setMsg('인증 성공');
    } else setMsg('PIN이 다릅니다.');
  };

  const startRound = async () => {
    await supabase.from('rounds').update({ status: 'closed' }).eq('status', 'open');
    await supabase.from('rounds').insert({ event_id: 1, status: 'open' });
    setMsg('라운드 시작');
  };
  const endRound = async () => {
    await supabase.from('rounds').update({ status: 'closed' }).eq('status', 'open');
    setMsg('라운드 마감');
  };

  const autoAssign = async () => {
    const [{ data: ps }, { data: ts }, { data: hearts }] = await Promise.all([
      supabase.from('participants').select('id,gender').order('created_at'),
      supabase.from('seat_tables').select('table_no,seat_count').order('table_no'),
      supabase.from('hearts').select('to_participant_id')
    ]);
    if (!ps || !ts) return;

    const heartMap = new Map<number, number>();
    (hearts ?? []).forEach((h) => heartMap.set(h.to_participant_id, (heartMap.get(h.to_participant_id) ?? 0) + 1));

    const males = (ps as Participant[]).filter((p) => p.gender === 'M').sort((a, b) => (heartMap.get(b.id) ?? 0) - (heartMap.get(a.id) ?? 0));
    const females = (ps as Participant[]).filter((p) => p.gender === 'F').sort((a, b) => (heartMap.get(b.id) ?? 0) - (heartMap.get(a.id) ?? 0));
    const seats: Array<{ table_no: number; seat_no: number }> = [];
    (ts as SeatTable[]).forEach((t) => { for (let i = 1; i <= t.seat_count; i += 1) seats.push({ table_no: t.table_no, seat_no: i }); });

    const odd = seats.filter((s) => s.seat_no % 2 === 1);
    const even = seats.filter((s) => s.seat_no % 2 === 0);
    const rows: Array<{ event_id: number; participant_id: number; table_no: number; seat_no: number }> = [];

    males.forEach((p, i) => { if (odd[i]) rows.push({ event_id: 1, participant_id: p.id, ...odd[i] }); });
    females.forEach((p, i) => { if (even[i]) rows.push({ event_id: 1, participant_id: p.id, ...even[i] }); });

    const used = new Set(rows.map((r) => `${r.table_no}-${r.seat_no}`));
    const remainingSeats = seats.filter((s) => !used.has(`${s.table_no}-${s.seat_no}`));
    const unassigned = [...males.slice(odd.length), ...females.slice(even.length)];
    unassigned.forEach((p, i) => { if (remainingSeats[i]) rows.push({ event_id: 1, participant_id: p.id, ...remainingSeats[i] }); });

    await supabase.from('assignments').delete().eq('event_id', 1);
    if (rows.length) await supabase.from('assignments').insert(rows);
    setMsg(`자동 좌석 배치 완료 (${rows.length}명)`);
  };

  const runMatch = async (mode: 'same' | 'cross') => {
    const res = await fetch('/api/match', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ mode }) });
    const json = await res.json();
    setMsg(`매칭 완료: ${json.count}쌍`);
  };

  if (!ok) return <main className="container"><div className="card"><h1>HOST LOGIN</h1><input value={pin} onChange={(e) => setPin(e.target.value)} placeholder="PIN" /><button onClick={check}>입장</button><p>{msg}</p></div></main>;

  return <main className="container"><div className="card"><h1>호스트 관리자</h1><button onClick={startRound}>라운드 시작</button><button onClick={endRound}>라운드 마감</button><button onClick={autoAssign}>자동 좌석 배치 실행</button><Link href="/tables"><button className="secondary">테이블 설정</button></Link><Link href="/assign"><button className="secondary">전체 배치표</button></Link><Link href="/play"><button className="secondary">O/X 투표 페이지</button></Link><button onClick={() => runMatch('same')}>같은 선택끼리 랜덤 매칭</button><button onClick={() => runMatch('cross')}>다른 선택끼리 랜덤 매칭</button><p className="success">{msg}</p></div></main>;
}
