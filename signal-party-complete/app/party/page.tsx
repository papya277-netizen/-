'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

interface Participant { id: number; nickname: string; gender: 'M' | 'F'; }

export default function PartyPage() {
  const [participant, setParticipant] = useState<Participant | null>(null);
  const [seat, setSeat] = useState<string>('좌석 배치 대기 중');
  const [heartCount, setHeartCount] = useState<number>(0);

  useEffect(() => {
    const load = async () => {
      const stored = localStorage.getItem('participant_id');
      if (stored) {
        const { data } = await supabase.from('participants').select('id,nickname,gender').eq('id', Number(stored)).single();
        if (data) setParticipant(data);
      } else {
        const { data } = await supabase.from('participants').select('id,nickname,gender').order('created_at', { ascending: false }).limit(1).single();
        if (data) setParticipant(data);
      }
    };
    load();
  }, []);

  useEffect(() => {
    const loadExtra = async () => {
      if (!participant) return;
      const { data: asg } = await supabase.from('assignments').select('table_no,seat_no').eq('participant_id', participant.id).order('created_at', { ascending: false }).limit(1).single();
      if (asg) setSeat(`${asg.table_no}번 테이블 - ${asg.seat_no}번 자리`);
      const { count } = await supabase.from('hearts').select('*', { count: 'exact', head: true }).eq('to_participant_id', participant.id);
      setHeartCount(count ?? 0);
    };
    loadExtra();
  }, [participant]);

  return (
    <main className="container">
      <div className="card">
        <h1>PARTY ROOM</h1>
        <p className="pill">{participant ? `${participant.nickname} (${participant.gender})` : '참가자 확인 중...'}</p>
        <h3>현재 좌석</h3>
        <p>{seat}</p>
        <h3>받은 하트</h3>
        <p>❤️ {heartCount}개</p>
        <Link href="/heart"><button>하트 보내기</button></Link>
      </div>
    </main>
  );
}
