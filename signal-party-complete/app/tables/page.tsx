'use client';

import { FormEvent, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

interface SeatTable { id: number; table_no: number; seat_count: number }

export default function TablesPage() {
  const [tableNo, setTableNo] = useState(1);
  const [seatCount, setSeatCount] = useState(2);
  const [tables, setTables] = useState<SeatTable[]>([]);

  const load = async () => {
    const { data } = await supabase.from('seat_tables').select('*').order('table_no');
    if (data) setTables(data);
  };

  useEffect(() => { load(); }, []);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    await supabase.from('seat_tables').insert({ event_id: 1, table_no: tableNo, seat_count: seatCount });
    setTableNo((v) => v + 1);
    load();
  };

  return (
    <main className="container">
      <div className="card">
        <h1>테이블 설정</h1>
        <form onSubmit={submit}>
          <label>테이블 번호</label>
          <input type="number" value={tableNo} onChange={(e) => setTableNo(Number(e.target.value))} />
          <label>좌석 수</label>
          <input type="number" value={seatCount} onChange={(e) => setSeatCount(Number(e.target.value))} />
          <button>등록</button>
        </form>
      </div>
      <div className="card">
        <h2>등록된 테이블</h2>
        {tables.map((t) => <p key={t.id}>{t.table_no}번 테이블 - {t.seat_count}석</p>)}
      </div>
    </main>
  );
}
