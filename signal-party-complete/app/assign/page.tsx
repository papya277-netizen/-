'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

interface Row { table_no: number; seat_no: number; participants: { nickname: string; gender: string } | null }

export default function AssignPage() {
  const [rows, setRows] = useState<Row[]>([]);

  useEffect(() => {
    supabase.from('assignments').select('table_no,seat_no,participants(nickname,gender)').order('table_no').order('seat_no').then(({ data }) => {
      setRows((data ?? []) as Row[]);
    });
  }, []);

  return <main className="container"><div className="card"><h1>전체 자리 배치표</h1>{rows.map((r, i) => <div key={i} className="listItem">T{r.table_no}-S{r.seat_no} / {r.participants?.nickname ?? '-'} ({r.participants?.gender ?? '-'})</div>)}</div></main>;
}
