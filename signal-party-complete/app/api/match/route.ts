import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

function shuffle<T>(arr: T[]) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export async function POST(req: NextRequest) {
  const { mode } = await req.json();
  const { data: round } = await supabase.from('rounds').select('id').order('id', { ascending: false }).limit(1).single();
  if (!round) return NextResponse.json({ ok: false, count: 0, roundId: null });

  const { data: votes } = await supabase.from('votes').select('participant_id,choice').eq('round_id', round.id);
  const o = shuffle((votes ?? []).filter((v) => v.choice === 'O').map((v) => v.participant_id));
  const x = shuffle((votes ?? []).filter((v) => v.choice === 'X').map((v) => v.participant_id));

  const pairs: Array<{ round_id: number; participant_a_id: number; participant_b_id: number; mode: string }> = [];

  if (mode === 'same') {
    for (let i = 0; i + 1 < o.length; i += 2) pairs.push({ round_id: round.id, participant_a_id: o[i], participant_b_id: o[i + 1], mode });
    for (let i = 0; i + 1 < x.length; i += 2) pairs.push({ round_id: round.id, participant_a_id: x[i], participant_b_id: x[i + 1], mode });
  } else {
    const n = Math.min(o.length, x.length);
    for (let i = 0; i < n; i += 1) pairs.push({ round_id: round.id, participant_a_id: o[i], participant_b_id: x[i], mode });
  }

  await supabase.from('matches').delete().eq('round_id', round.id);
  if (pairs.length) await supabase.from('matches').insert(pairs);
  return NextResponse.json({ ok: true, count: pairs.length, roundId: round.id });
}
