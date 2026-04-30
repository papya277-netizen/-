'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

interface Participant { id: number; nickname: string; gender: 'M' | 'F'; heart_sent: boolean; }

export default function HeartPage() {
  const [me, setMe] = useState<number | null>(null);
  const [list, setList] = useState<Participant[]>([]);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    const pid = Number(localStorage.getItem('participant_id'));
    if (pid) setMe(pid);
    supabase.from('participants').select('id,nickname,gender,heart_sent').order('created_at').then(({ data }) => {
      if (data) setList(data);
    });
  }, []);

  const sendHeart = async (toId: number) => {
    if (!me) return setMsg('먼저 체크인 해주세요.');
    const { data: sender } = await supabase.from('participants').select('heart_sent').eq('id', me).single();
    if (sender?.heart_sent) return setMsg('이미 하트를 보냈습니다.');
    const { error } = await supabase.from('hearts').insert({ from_participant_id: me, to_participant_id: toId, event_id: 1 });
    if (error) return setMsg(error.message);
    await supabase.from('participants').update({ heart_sent: true }).eq('id', me);
    setMsg('하트 전송 완료!');
  };

  return (
    <main className="container">
      <div className="card">
        <h1>하트 시그널</h1>
        {msg && <p className="success">{msg}</p>}
        {list.filter((p) => p.id !== me).map((p) => (
          <div className="listItem" key={p.id}>
            <strong>{p.nickname}</strong> ({p.gender})
            <button onClick={() => sendHeart(p.id)}>이 참가자에게 하트 보내기</button>
          </div>
        ))}
      </div>
    </main>
  );
}
