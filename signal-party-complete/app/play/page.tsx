'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function PlayPage() {
  const [msg, setMsg] = useState('');

  const vote = async (choice: 'O' | 'X') => {
    const pid = Number(localStorage.getItem('participant_id'));
    if (!pid) return setMsg('참가자 정보가 없습니다.');
    const { data: round } = await supabase.from('rounds').select('id').eq('status', 'open').order('id', { ascending: false }).limit(1).single();
    if (!round) return setMsg('열린 라운드가 없습니다.');
    const { error } = await supabase.from('votes').insert({ round_id: round.id, participant_id: pid, choice });
    if (error) return setMsg('이미 투표했거나 오류가 발생했습니다.');
    setMsg('투표 완료');
  };

  return <main className="container"><div className="card"><h1>O / X 투표</h1><button onClick={() => vote('O')}>O 선택</button><button onClick={() => vote('X')}>X 선택</button><p>{msg}</p></div></main>;
}
