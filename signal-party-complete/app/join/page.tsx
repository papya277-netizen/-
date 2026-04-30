'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

const EVENT_ID = 1;

export default function JoinPage() {
  const [nickname, setNickname] = useState('');
  const [gender, setGender] = useState<'M' | 'F'>('M');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!nickname.trim()) return;
    setLoading(true);
    setError('');
    const { data, error: insertError } = await supabase
      .from('participants')
      .insert({ nickname: nickname.trim(), gender, event_id: EVENT_ID })
      .select('id')
      .single();

    setLoading(false);
    if (insertError || !data) {
      setError(insertError?.message ?? '체크인 실패');
      return;
    }

    localStorage.setItem('participant_id', String(data.id));
    router.push('/party');
  };

  return (
    <main className="container">
      <div className="card">
        <h1>SIGNAL PARTY 체크인</h1>
        <form onSubmit={onSubmit}>
          <label>닉네임</label>
          <input value={nickname} onChange={(e) => setNickname(e.target.value)} placeholder="닉네임 입력" />
          <label>성별</label>
          <select value={gender} onChange={(e) => setGender(e.target.value as 'M' | 'F')}>
            <option value="M">M</option>
            <option value="F">F</option>
          </select>
          {error && <p className="error">{error}</p>}
          <button disabled={loading}>{loading ? '체크인 중...' : '체크인 하기'}</button>
        </form>
      </div>
    </main>
  );
}
