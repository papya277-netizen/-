'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function MatchPage() {
  const [text, setText] = useState('매칭 결과를 불러오는 중...');

  useEffect(() => {
    const load = async () => {
      const pid = Number(localStorage.getItem('participant_id'));
      if (!pid) return setText('체크인 정보가 없습니다.');
      const { data: round } = await supabase.from('rounds').select('id').order('id', { ascending: false }).limit(1).single();
      if (!round) return setText('라운드가 없습니다.');
      const { data: matches } = await supabase.from('matches').select('*').eq('round_id', round.id);
      const myMatch = (matches ?? []).find((m) => m.participant_a_id === pid || m.participant_b_id === pid);
      if (!myMatch) return setText('현재 매칭 상대가 없습니다.');
      const other = myMatch.participant_a_id === pid ? myMatch.participant_b_id : myMatch.participant_a_id;
      const { data: partner } = await supabase.from('participants').select('nickname,gender').eq('id', other).single();
      setText(partner ? `${partner.nickname} (${partner.gender})` : '상대 정보 없음');
    };
    load();
  }, []);

  return <main className="container"><div className="card"><h1>내 매칭 결과</h1><p>{text}</p></div></main>;
}
