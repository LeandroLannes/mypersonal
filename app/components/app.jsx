'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import { supabase } from '../lib/supabase';

const C = {
  bg: '#18181B', card: '#27272A', card2: '#323235', border: '#3F3F46',
  accent: '#C8F135', accentDim: 'rgba(200,241,53,0.12)',
  orange: '#FF8C42', orangeDim: 'rgba(255,140,66,0.12)',
  blue: '#58C4F6', blueDim: 'rgba(88,196,246,0.12)',
  text: '#FAFAFA', muted: '#A1A1AA', muted2: '#52525B',
  danger: '#EF4444', warn: '#F59E0B',
};

const SPLIT = {
  domingo:  { nome: 'A1', titulo: 'Pernas — quadríceps', subtitulo: 'Abdômen incluído', cor: C.accent,
    exercicios: [
      { id: 'pendulum_squat', nome: 'Pendulum squat', series: '4x6-8', rir: '2/2/1/1', descanso: '2-3min', principal: true },
      { id: 'belt_squat', nome: 'Belt squat', series: '3x6-8', rir: '2/1/1', descanso: '2min', principal: true },
      { id: 'agach_smith', nome: 'Agachamento no Smith', series: '3x8-10', rir: '2/1/1', descanso: '2min', principal: false },
      { id: 'extensora_a1', nome: 'Cadeira extensora', series: '3x8-10', rir: '2/1/0-1', descanso: '90s', principal: false },
      { id: 'afundo_smith_a1', nome: 'Afundo no Smith', series: '3x8-10/perna', rir: '2/1/1', descanso: '90-120s', principal: false },
      { id: 'mesa_flexora_a1', nome: 'Mesa flexora', series: '3x8-10', rir: '2/1/0-1', descanso: '90s', principal: false },
      { id: 'pant_pe_a1', nome: 'Panturrilha em pé', series: '4x8-10', rir: '2/1/1/0-1', descanso: '90s', principal: false },
      { id: 'pant_sentada_a1', nome: 'Panturrilha sentada', series: '3x10-12', rir: '2/1/0-1', descanso: '60-90s', principal: false },
      { id: 'cable_crunch', nome: 'Cable crunch', series: '3x8-12', rir: '2/1/0-1', descanso: '60-75s', principal: false },
      { id: 'prancha_a1', nome: 'Prancha com carga', series: '3x30-45s', rir: '1-2/1/1', descanso: '60s', principal: false },
    ]
  },
  segunda:  { nome: 'B1', titulo: 'Peito, ombros e tríceps', subtitulo: '', cor: C.orange,
    exercicios: [
      { id: 'supino_barra_b1', nome: 'Supino reto com barra', series: '4x6-8', rir: '2/2/1/1', descanso: '2-3min', principal: true },
      { id: 'supino_incl_maq', nome: 'Supino inclinado na máquina', series: '3x6-8', rir: '2/1/1', descanso: '2min', principal: true },
      { id: 'supino_conv', nome: 'Supino convergente', series: '3x8-10', rir: '2/1/1', descanso: '90-120s', principal: false },
      { id: 'peck_deck_b1', nome: 'Peck deck / crucifixo máquina', series: '3x10-12', rir: '2/1/0-1', descanso: '75-90s', principal: false },
      { id: 'paralelas_b1', nome: 'Paralelas', series: '3x6-8', rir: '2/1/1', descanso: '2min', principal: false },
      { id: 'desenv_maq_b1', nome: 'Desenvolvimento na máquina', series: '3x6-8', rir: '2/1/1', descanso: '2min', principal: false },
      { id: 'elev_lat_maq_b1', nome: 'Elevação lateral na máquina', series: '4x10-12', rir: '2/1/1/0-1', descanso: '60-75s', principal: false },
      { id: 'triceps_polia', nome: 'Tríceps polia barra V/corda', series: '3x8-10', rir: '2/1/0-1', descanso: '75-90s', principal: false },
      { id: 'triceps_frances_b1', nome: 'Tríceps francês na polia', series: '3x8-10', rir: '2/1/0-1', descanso: '75-90s', principal: false },
      { id: 'flexao_ctrl', nome: 'Flexão de braço controlada', series: '2x8-12', rir: '1-2/1', descanso: '60-90s', principal: false },
    ]
  },
  terca:    { nome: 'C1', titulo: 'Costas e bíceps', subtitulo: 'Abdômen incluído', cor: C.blue,
    exercicios: [
      { id: 'barra_fixa_c1', nome: 'Barra fixa', series: '4x6-8', rir: '2/2/1/1', descanso: '2-3min', principal: true },
      { id: 'remada_t_c1', nome: 'Remada T / cavalinho', series: '4x6-8', rir: '2/2/1/1', descanso: '2-3min', principal: true },
      { id: 'puxada_alta', nome: 'Puxada alta aberta', series: '3x8-10', rir: '2/1/1', descanso: '90-120s', principal: false },
      { id: 'remada_baixa_c1', nome: 'Remada baixa neutra', series: '3x8-10', rir: '2/1/1', descanso: '90-120s', principal: false },
      { id: 'remada_unilat_c1', nome: 'Remada unilateral máquina', series: '3x8-10/lado', rir: '2/1/1', descanso: '90s', principal: false },
      { id: 'pulldown_ext', nome: 'Pulldown braços estendidos', series: '3x10-12', rir: '2/1/0-1', descanso: '75-90s', principal: false },
      { id: 'crucifixo_inv_c1', nome: 'Crucifixo inverso máquina', series: '3x10-12', rir: '2/1/0-1', descanso: '60-75s', principal: false },
      { id: 'rosca_w_c1', nome: 'Rosca direta barra W', series: '3x6-8', rir: '2/1/1', descanso: '90s', principal: false },
      { id: 'rosca_scott_c1', nome: 'Rosca Scott máquina', series: '3x8-10', rir: '2/1/0-1', descanso: '75-90s', principal: false },
      { id: 'elev_pernas_c1', nome: 'Elevação de pernas', series: '3x8-12', rir: '2/1/0-1', descanso: '60-75s', principal: false },
      { id: 'pallof_c1', nome: 'Pallof press na polia', series: '3x10-12/lado', rir: '2/1/1', descanso: '45-60s', principal: false },
    ]
  },
  quarta:   { nome: 'A2', titulo: 'Pernas — posterior e glúteos', subtitulo: '', cor: C.accent,
    exercicios: [
      { id: 'terra_romeno', nome: 'Terra romeno', series: '4x6-8', rir: '2/2/1/1', descanso: '2-3min', principal: true },
      { id: 'mesa_flexora_a2', nome: 'Mesa flexora', series: '4x6-8', rir: '2/1/1/0-1', descanso: '90-120s', principal: true },
      { id: 'flexora_unilat', nome: 'Cadeira flexora unilateral', series: '3x8-10/perna', rir: '2/1/0-1', descanso: '75-90s', principal: false },
      { id: 'hip_thrust', nome: 'Hip thrust', series: '4x6-8', rir: '2/2/1/1', descanso: '2min', principal: true },
      { id: 'belt_squat_a2', nome: 'Belt squat passada longa', series: '3x8-10', rir: '2/1/1', descanso: '2min', principal: false },
      { id: 'extensora_a2', nome: 'Extensora moderada', series: '3x8-10', rir: '2/1/1', descanso: '90s', principal: false },
      { id: 'adutora_a2', nome: 'Adutora', series: '3x8-10', rir: '2/1/0-1', descanso: '75-90s', principal: false },
      { id: 'abdutora_a2', nome: 'Abdutora', series: '3x10-12', rir: '2/1/0-1', descanso: '60-75s', principal: false },
      { id: 'pant_maq_a2', nome: 'Panturrilha máquina', series: '4x8-10', rir: '2/1/1/0-1', descanso: '90s', principal: false },
      { id: 'pant_sentada_a2', nome: 'Panturrilha sentada', series: '3x10-12', rir: '2/1/0-1', descanso: '60-90s', principal: false },
    ]
  },
  quinta:   { nome: 'B2', titulo: 'Peito, ombros e tríceps', subtitulo: 'Abdômen incluído', cor: C.orange,
    exercicios: [
      { id: 'supino_incl_barra', nome: 'Supino inclinado com barra', series: '4x6-8', rir: '2/2/1/1', descanso: '2-3min', principal: true },
      { id: 'supino_conv_b2', nome: 'Supino convergente reto', series: '3x6-8', rir: '2/1/1', descanso: '2min', principal: false },
      { id: 'chest_press_b2', nome: 'Chest press sentado', series: '3x8-10', rir: '2/1/1', descanso: '90-120s', principal: false },
      { id: 'crossover_alto', nome: 'Crossover polia alta', series: '3x10-12', rir: '2/1/0-1', descanso: '75-90s', principal: false },
      { id: 'desenv_smith_b2', nome: 'Desenvolvimento máquina/Smith', series: '3x6-8', rir: '2/1/1', descanso: '2min', principal: true },
      { id: 'elev_lat_halt', nome: 'Elevação lateral com halteres', series: '3x10-12', rir: '2/1/0-1', descanso: '60-75s', principal: false },
      { id: 'elev_lat_cabo', nome: 'Elevação lateral cabo unilateral', series: '3x10-12/lado', rir: '2/1/0-1', descanso: '60s', principal: false },
      { id: 'triceps_testa', nome: 'Tríceps testa polia/barra W', series: '3x8-10', rir: '2/1/0-1', descanso: '75-90s', principal: false },
      { id: 'triceps_unilat', nome: 'Tríceps unilateral na polia', series: '3x10-12/braço', rir: '2/1/0-1', descanso: '60-75s', principal: false },
      { id: 'ab_wheel', nome: 'Ab wheel / rollout', series: '3x6-10', rir: '2/1/1', descanso: '75-90s', principal: false },
      { id: 'prancha_lat', nome: 'Prancha lateral', series: '3x25-40s/lado', rir: '1-2/1/1', descanso: '45-60s', principal: false },
    ]
  },
  sexta:    { nome: 'C2', titulo: 'Costas e bíceps', subtitulo: '', cor: C.blue,
    exercicios: [
      { id: 'puxada_neut', nome: 'Puxada neutra/supinada', series: '4x6-8', rir: '2/2/1/1', descanso: '2min', principal: true },
      { id: 'remada_curv_c2', nome: 'Remada curvada/apoiada pesada', series: '4x6-8', rir: '2/2/1/1', descanso: '2-3min', principal: true },
      { id: 'remada_unilat_c2', nome: 'Remada unilateral máquina', series: '3x8-10/lado', rir: '2/1/1', descanso: '90s', principal: false },
      { id: 'remada_baixa_c2', nome: 'Remada baixa aberta/neutra', series: '3x8-10', rir: '2/1/1', descanso: '90-120s', principal: false },
      { id: 'pulldown_unilat', nome: 'Pulldown unilateral polia', series: '3x8-10/lado', rir: '2/1/0-1', descanso: '75-90s', principal: false },
      { id: 'encolh_c2', nome: 'Encolhimento halteres/máquina', series: '3x8-10', rir: '2/1/1', descanso: '90s', principal: false },
      { id: 'crucifixo_inv_c2', nome: 'Crucifixo inverso máquina/polia', series: '3x10-12', rir: '2/1/0-1', descanso: '60-75s', principal: false },
      { id: 'rosca_scott_c2', nome: 'Rosca Scott máquina', series: '3x6-8', rir: '2/1/0-1', descanso: '90s', principal: false },
      { id: 'rosca_bayesian', nome: 'Rosca bayesian na polia', series: '3x8-10/braço', rir: '2/1/0-1', descanso: '75-90s', principal: false },
      { id: 'rosca_martelo', nome: 'Rosca martelo halteres/corda', series: '3x8-10', rir: '2/1/0-1', descanso: '75-90s', principal: false },
    ]
  },
  sabado:   { nome: '—', titulo: 'Descanso', subtitulo: 'Recuperação ativa', cor: C.muted,
    exercicios: [
      { id: 'descanso', nome: 'Descanso ou aeróbico leve', series: '—', rir: '—', descanso: '—', principal: false },
    ]
  },
};

const DIAS_KEY = ['domingo','segunda','terca','quarta','quinta','sexta','sabado'];
const DIAS_LABEL = { domingo:'Dom',segunda:'Seg',terca:'Ter',quarta:'Qua',quinta:'Qui',sexta:'Sex',sabado:'Sáb' };
const COMPOSTOS = ['pendulum_squat','belt_squat','terra_romeno','hip_thrust','barra_fixa_c1','supino_barra_b1','supino_incl_barra','remada_t_c1','remada_curv_c2','puxada_neut','desenv_smith_b2'];

const HISTORICO_PESO_INICIAL = [
  {data:"2026-01-05",peso:"99.2",gordura:"32.3",muscular:"63.79",visceral:"15.9",agua:"48.9",tmb:"1820",fonte:"relax"},
  {data:"2026-01-17",peso:"95.4",gordura:"30.4",muscular:"63.1",visceral:"14.6",agua:"50.3",tmb:"1804",fonte:"relax"},
  {data:"2026-02-01",peso:"93.0",gordura:"29.1",muscular:"62.62",visceral:"13.9",agua:"51.2",tmb:"1793",fonte:"relax"},
  {data:"2026-02-15",peso:"92.25",gordura:"28.8",muscular:"62.39",visceral:"13.7",agua:"51.4",tmb:"1788",fonte:"relax"},
  {data:"2026-03-01",peso:"90.4",gordura:"27.9",muscular:"61.92",visceral:"13.1",agua:"52.1",tmb:"1777",fonte:"relax"},
  {data:"2026-03-15",peso:"88.4",gordura:"26.8",muscular:"61.45",visceral:"12.5",agua:"52.8",tmb:"1767",fonte:"relax"},
  {data:"2026-04-01",peso:"86.25",gordura:"25.8",muscular:"60.83",visceral:"11.8",agua:"53.6",tmb:"1753",fonte:"relax"},
  {data:"2026-04-15",peso:"83.55",gordura:"24.2",muscular:"60.13",visceral:"10.9",agua:"54.7",tmb:"1737",fonte:"relax"},
  {data:"2026-05-01",peso:"81.05",gordura:"23.0",muscular:"59.27",visceral:"10.1",agua:"55.6",tmb:"1717",fonte:"relax"},
  {data:"2026-05-15",peso:"79.25",gordura:"22.1",muscular:"58.65",visceral:"9.6",agua:"56.2",tmb:"1703",fonte:"relax"},
  {data:"2026-05-31",peso:"77.4",gordura:"21.2",muscular:"57.94",visceral:"9.0",agua:"56.9",tmb:"1687",fonte:"relax"},
  {data:"2026-06-27",peso:"76.8",gordura:"13.8",muscular:"38.1",visceral:"4",agua:"48.7",tmb:"1800",fonte:"inbody"},
];

const CICLO_INICIO = new Date('2026-06-29');
const CICLO_SEMANAS = 13;

const dateKey = (d = new Date()) => d.toISOString().split('T')[0];
const getDiaKey = (d = new Date()) => DIAS_KEY[d.getDay()];
const semanaAtual = () => Math.max(1, Math.floor((new Date() - CICLO_INICIO) / (7 * 864e5)) + 1);
const parseNum = (s) => { const m = String(s||'').replace('+','').match(/-?\d+(\.\d+)?/); return m ? +m[0] : null; };

// ─── APP ────────────────────────────────────────────────────────
export default function App() {
  const [aba, setAba] = useState('hoje');
  const [registros, setRegistros] = useState({});
  const [pesoHist, setPesoHist] = useState([]);
  const [historicoTreinos, setHistoricoTreinos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [aiOpen, setAiOpen] = useState(false);
  const [timer, setTimer] = useState(null);
  const timerRef = useRef(null);

  // Carregar dados do Supabase
  useEffect(() => {
    (async () => {
      try {
        // Carregar registros de treino
        const { data: regs } = await supabase.from('registros').select('*');
        if (regs) {
          const mapa = {};
          regs.forEach(r => { mapa[`reg:${r.data}`] = { ...r.exercicios, exercicios: r.exercicios, checkin: r.checkin, cardio: r.cardio, horaInicio: r.hora_inicio, horaFim: r.hora_fim, duracaoMin: r.duracao_min, concluido: r.concluido, diaKey: r.dia_key }; });
          setRegistros(mapa);
          setHistoricoTreinos(regs.filter(r => r.concluido).sort((a,b) => b.data.localeCompare(a.data)));
        }

        // Carregar histórico de peso
        const { data: pesos } = await supabase.from('peso_historico').select('*').order('data', { ascending: true });
        if (pesos && pesos.length > 0) {
          setPesoHist(pesos);
        } else {
          // Popular com dados iniciais na primeira vez
          const { error } = await supabase.from('peso_historico').insert(HISTORICO_PESO_INICIAL);
          if (!error) setPesoHist(HISTORICO_PESO_INICIAL);
        }
      } catch (e) {
        console.error('Erro ao carregar dados:', e);
      } finally {
        setCarregando(false);
      }
    })();
  }, []);

  const salvarRegistro = useCallback(async (key, dados) => {
    const data = key.replace('reg:', '');
    setRegistros(p => ({ ...p, [key]: dados }));
    try {
      await supabase.from('registros').upsert({
        data,
        dia_key: dados.diaKey,
        exercicios: dados.exercicios || {},
        checkin: dados.checkin || {},
        cardio: dados.cardio || {},
        hora_inicio: dados.horaInicio,
        hora_fim: dados.horaFim,
        duracao_min: dados.duracaoMin,
        concluido: dados.concluido || false,
      }, { onConflict: 'data' });
      if (dados.concluido) {
        const { data: regs } = await supabase.from('registros').select('*').eq('concluido', true).order('data', { ascending: false });
        if (regs) setHistoricoTreinos(regs);
      }
    } catch (e) { console.error('Erro ao salvar registro:', e); }
  }, []);

  const salvarPeso = useCallback(async (entrada) => {
    try {
      await supabase.from('peso_historico').upsert(entrada, { onConflict: 'data' });
      const { data: pesos } = await supabase.from('peso_historico').select('*').order('data', { ascending: true });
      if (pesos) setPesoHist(pesos);
    } catch (e) { console.error('Erro ao salvar peso:', e); }
  }, []);

  const iniciarTimer = useCallback((segundos) => {
    if (timerRef.current) clearInterval(timerRef.current);
    setTimer({ seg: segundos, total: segundos });
    timerRef.current = setInterval(() => {
      setTimer(p => {
        if (!p) return null;
        if (p.seg <= 1) {
          clearInterval(timerRef.current);
          try { navigator.vibrate([400, 100, 400, 100, 400]); } catch {}
          try {
            const ctx = new (window.AudioContext || window.webkitAudioContext)();
            [0, 0.35, 0.7].forEach(t => {
              const o = ctx.createOscillator(); const g = ctx.createGain();
              o.connect(g); g.connect(ctx.destination);
              o.frequency.value = 880;
              g.gain.setValueAtTime(0.4, ctx.currentTime + t);
              g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + t + 0.3);
              o.start(ctx.currentTime + t); o.stop(ctx.currentTime + t + 0.3);
            });
          } catch {}
          return null;
        }
        return { ...p, seg: p.seg - 1 };
      });
    }, 1000);
  }, []);

  const fecharTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    setTimer(null);
  }, []);

  if (carregando) {
    return (
      <div style={{ background: C.bg, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Inter, system-ui, sans-serif' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: 40, height: 40, borderRadius: '50%', border: `3px solid ${C.border}`, borderTopColor: C.accent, animation: 'spin 0.8s linear infinite', margin: '0 auto 12px' }}/>
          <p style={{ color: C.muted, fontSize: 13 }}>Carregando...</p>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  const hoje = dateKey();
  const diaKey = getDiaKey();
  const treino = SPLIT[diaKey];
  const regKey = `reg:${hoje}`;
  const regHoje = registros[regKey] || {};

  return (
    <div style={{ background: C.bg, minHeight: '100vh', fontFamily: 'Inter, system-ui, sans-serif', color: C.text, maxWidth: 430, margin: '0 auto', position: 'relative', paddingBottom: 80 }}>
      {aba === 'hoje'      && <TelaHoje treino={treino} diaKey={diaKey} regKey={regKey} regHoje={regHoje} salvarRegistro={salvarRegistro} iniciarTimer={iniciarTimer} pesoHist={pesoHist} salvarPeso={salvarPeso} />}
      {aba === 'corpo'     && <TelaCorpo pesoHist={pesoHist} salvarPeso={salvarPeso} />}
      {aba === 'progresso' && <TelaProgresso registros={registros} />}
      {aba === 'historico' && <TelaHistorico historicoTreinos={historicoTreinos} />}
      {aba === 'ciclo'     && <TelaCiclo registros={registros} />}
      <Nav aba={aba} setAba={setAba} setAiOpen={setAiOpen} />
      {timer && <TimerFlutuante timer={timer} fechar={fecharTimer} />}
      {aiOpen && <AiConsulta registros={registros} pesoHist={pesoHist} fechar={() => setAiOpen(false)} />}
    </div>
  );
}

// ─── NAV ────────────────────────────────────────────────────────
function Nav({ aba, setAba, setAiOpen }) {
  const itens = [
    { id: 'hoje', label: 'Hoje', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg> },
    { id: 'corpo', label: 'Corpo', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6zM6.5 8a1 1 0 0 0-.8.4l-3 4a1 1 0 0 0 1.6 1.2L6 11.3V20a1 1 0 0 0 2 0v-4h8v4a1 1 0 0 0 2 0v-8.7l1.7 2.3a1 1 0 1 0 1.6-1.2l-3-4A1 1 0 0 0 17.5 8h-11z"/></svg> },
    { id: 'historico', label: 'Histórico', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 8v4l3 3M3.05 11a9 9 0 1 0 .5-3" strokeLinecap="round"/><polyline points="3 4 3 11 10 11"/></svg> },
    { id: 'progresso', label: 'Progresso', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg> },
    { id: 'ciclo', label: 'Ciclo', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12a9 9 0 11-9-9" strokeLinecap="round"/><polyline points="21 3 21 9 15 9"/></svg> },
  ];
  return (
    <div style={{ position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: '100%', maxWidth: 430, background: 'rgba(24,24,27,0.96)', backdropFilter: 'blur(16px)', borderTop: `1px solid ${C.border}`, display: 'flex' }}>
      {itens.map(item => {
        const ativo = aba === item.id;
        return (
          <button key={item.id} onClick={() => setAba(item.id)} style={{ flex: 1, padding: '10px 0 8px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, border: 'none', background: 'none', cursor: 'pointer', color: ativo ? C.accent : C.muted }}>
            {item.icon}
            <span style={{ fontSize: 9, letterSpacing: '0.04em', textTransform: 'uppercase' }}>{item.label}</span>
          </button>
        );
      })}
      <button onClick={() => setAiOpen(true)} style={{ width: 48, display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', background: 'none', cursor: 'pointer', paddingBottom: 8 }}>
        <div style={{ width: 34, height: 34, borderRadius: 10, background: C.card2, border: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={C.accent} strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01" strokeLinecap="round"/></svg>
        </div>
      </button>
    </div>
  );
}

// ─── TELA HOJE ──────────────────────────────────────────────────
function TelaHoje({ treino, diaKey, regKey, regHoje, salvarRegistro, iniciarTimer, pesoHist, salvarPeso }) {
  const [expandido, setExpandido] = useState(null);
  const [ex, setEx] = useState(regHoje.exercicios || {});
  const [checkin, setCheckin] = useState(regHoje.checkin || { sono: '', fc: '', energia: 0, dor: '', dorLocal: '' });
  const [pesoInput, setPesoInput] = useState(() => pesoHist.find(r => r.data === dateKey())?.peso || '');
  const [iniciado] = useState(() => regHoje.horaInicio || new Date().toISOString());
  const [concluido, setConcluido] = useState(!!regHoje.concluido);

  useEffect(() => {
    if (!regHoje.horaInicio) {
      salvarRegistro(regKey, { exercicios: ex, checkin, horaInicio: iniciado, diaKey, concluido: false });
    }
  }, []);

  const salvar = (novoEx, novoCheckin, extra = {}) => {
    salvarRegistro(regKey, { exercicios: novoEx ?? ex, checkin: novoCheckin ?? checkin, horaInicio: iniciado, diaKey, concluido, ...extra });
  };

  const atualizarEx = (id, campo, valor) => {
    const novoEx = { ...ex, [id]: { ...(ex[id] || {}), [campo]: valor } };
    setEx(novoEx); salvar(novoEx, null);
  };

  const atualizarCheckin = (campo, valor) => {
    const novo = { ...checkin, [campo]: valor };
    setCheckin(novo); salvar(null, novo);
  };

  const salvarPesoHoje = () => {
    const v = parseFloat(pesoInput);
    if (!v) return;
    salvarPeso({ data: dateKey(), peso: String(v), gordura: null, muscular: null, visceral: null, agua: null, tmb: null, fonte: 'manual' });
  };

  const finalizarTreino = () => {
    const horaFim = new Date().toISOString();
    const duracaoMin = Math.round((new Date(horaFim) - new Date(iniciado)) / 60000);
    setConcluido(true);
    salvar(null, null, { concluido: true, horaFim, duracaoMin });
  };

  const total = treino.exercicios.length;
  const feitos = treino.exercicios.filter(e => ex[e.id]?.feito).length;
  const pct = total > 0 ? Math.round((feitos / total) * 100) : 0;
  const ultimoPeso = pesoHist.length > 0 ? pesoHist[pesoHist.length - 1] : null;
  const duracaoMin = regHoje.duracaoMin || Math.round((new Date() - new Date(iniciado)) / 60000);

  if (concluido) {
    return (
      <div style={{ padding: '40px 20px 0' }}>
        <div style={{ fontSize: 64, marginBottom: 16, textAlign: 'center' }}>💪</div>
        <p style={{ fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase', color: C.muted, margin: '0 0 8px', textAlign: 'center' }}>Treino concluído</p>
        <h1 style={{ fontSize: 32, fontWeight: 900, margin: '0 0 4px', letterSpacing: '-0.02em', color: C.accent, textAlign: 'center' }}>{treino.nome}</h1>
        <p style={{ fontSize: 16, color: C.muted, margin: '0 0 24px', textAlign: 'center' }}>{treino.titulo}</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 16 }}>
          {[
            { label: 'Exercícios', val: `${feitos}/${total}` },
            { label: 'Duração', val: `${duracaoMin}min` },
            { label: 'Energia', val: checkin.energia ? `${checkin.energia}/5` : '—' },
          ].map((m, i) => (
            <div key={i} style={{ background: C.card, borderRadius: 14, padding: '14px', border: `1px solid ${C.border}`, textAlign: 'center' }}>
              <p style={{ fontSize: 9, color: C.muted, margin: '0 0 4px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{m.label}</p>
              <p style={{ fontSize: 22, fontWeight: 800, margin: 0, color: C.accent }}>{m.val}</p>
            </div>
          ))}
        </div>
        {checkin.dor === 'sim' && checkin.dorLocal && (
          <div style={{ background: 'rgba(239,68,68,0.08)', border: `1px solid rgba(239,68,68,0.2)`, borderRadius: 12, padding: '12px 14px', marginBottom: 16 }}>
            <p style={{ fontSize: 12, color: C.danger, margin: 0 }}>⚠️ Dor registrada: {checkin.dorLocal}</p>
          </div>
        )}
        <CardioPostTreino regKey={regKey} regHoje={regHoje} salvarRegistro={salvarRegistro} ex={ex} checkin={checkin} iniciado={iniciado} duracaoMin={duracaoMin} diaKey={diaKey} concluido={concluido} />
        <p style={{ fontSize: 13, color: C.muted2, marginTop: 16, textAlign: 'center', marginBottom: 32 }}>
          Ótimo trabalho. Descansa bem — a hipertrofia acontece na recuperação.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div style={{ padding: '24px 20px 0' }}>
        <p style={{ fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase', color: C.muted, margin: 0 }}>
          {new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}
        </p>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 }}>
          <div>
            <h1 style={{ fontSize: 26, fontWeight: 800, margin: 0, letterSpacing: '-0.02em' }}>
              <span style={{ color: treino.cor }}>{treino.nome}</span> — {treino.titulo}
            </h1>
            {treino.subtitulo && <p style={{ fontSize: 12, color: C.muted, margin: '2px 0 0' }}>{treino.subtitulo}</p>}
          </div>
          <div style={{ position: 'relative', width: 48, height: 48, flexShrink: 0 }}>
            <svg viewBox="0 0 36 36" style={{ width: 48, height: 48, transform: 'rotate(-90deg)' }}>
              <circle cx="18" cy="18" r="15" fill="none" stroke={C.border} strokeWidth="3"/>
              <circle cx="18" cy="18" r="15" fill="none" stroke={treino.cor} strokeWidth="3" strokeLinecap="round"
                strokeDasharray={`${2*Math.PI*15}`} strokeDashoffset={`${2*Math.PI*15*(1-pct/100)}`} style={{ transition: 'stroke-dashoffset 0.5s' }}/>
            </svg>
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: C.text }}>{feitos}/{total}</div>
          </div>
        </div>
        <div style={{ height: 2, background: C.border, borderRadius: 1, marginTop: 12 }}>
          <div style={{ height: 2, background: treino.cor, borderRadius: 1, width: `${pct}%`, transition: 'width 0.4s' }}/>
        </div>
      </div>

      <div style={{ margin: '14px 20px 0', background: C.card, borderRadius: 16, padding: '14px 16px', border: `1px solid ${C.border}` }}>
        <p style={{ fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', color: C.muted, margin: '0 0 10px' }}>Check-in</p>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10, paddingBottom: 10, borderBottom: `1px solid ${C.border}` }}>
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: 10, color: C.muted, margin: '0 0 4px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Peso hoje (kg)</p>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <input type="number" step="0.1" value={pesoInput} onChange={e => setPesoInput(e.target.value)}
                placeholder={ultimoPeso?.peso || '76.8'}
                style={{ width: 90, background: C.card2, border: `1px solid ${C.border}`, borderRadius: 8, padding: '8px 10px', color: C.text, fontSize: 18, fontWeight: 700, outline: 'none' }}
                onBlur={salvarPesoHoje} />
              {pesoInput && ultimoPeso && parseFloat(pesoInput) !== parseFloat(ultimoPeso.peso) && (
                <span style={{ fontSize: 12, color: parseFloat(pesoInput) < parseFloat(ultimoPeso.peso) ? C.accent : C.danger, fontWeight: 700 }}>
                  {parseFloat(pesoInput) < parseFloat(ultimoPeso.peso) ? '↓' : '↑'} {Math.abs(parseFloat(pesoInput) - parseFloat(ultimoPeso.peso)).toFixed(1)}kg
                </span>
              )}
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 10, marginBottom: 10 }}>
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: 10, color: C.muted, margin: '0 0 4px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Sono (h)</p>
            <input type="number" step="0.5" value={checkin.sono} onChange={e => atualizarCheckin('sono', e.target.value)}
              placeholder="7.5" style={{ width: '100%', background: C.card2, border: `1px solid ${C.border}`, borderRadius: 8, padding: '8px 10px', color: C.orange, fontSize: 18, fontWeight: 700, outline: 'none' }} />
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: 10, color: C.muted, margin: '0 0 4px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>FC repouso</p>
            <input type="number" value={checkin.fc} onChange={e => atualizarCheckin('fc', e.target.value)}
              placeholder="58" style={{ width: '100%', background: C.card2, border: `1px solid ${C.border}`, borderRadius: 8, padding: '8px 10px', color: C.blue, fontSize: 18, fontWeight: 700, outline: 'none' }} />
          </div>
        </div>
        <div style={{ marginBottom: 10 }}>
          <p style={{ fontSize: 10, color: C.muted, margin: '0 0 6px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Energia hoje</p>
          <div style={{ display: 'flex', gap: 6 }}>
            {[1,2,3,4,5].map(n => (
              <button key={n} onClick={() => atualizarCheckin('energia', n)}
                style={{ flex: 1, padding: '8px 0', borderRadius: 8, border: `1px solid ${checkin.energia === n ? C.accent : C.border}`, background: checkin.energia === n ? C.accentDim : 'transparent', color: checkin.energia === n ? C.accent : C.muted, fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>
                {n}
              </button>
            ))}
          </div>
        </div>
        <div>
          <p style={{ fontSize: 10, color: C.muted, margin: '0 0 6px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Alguma dor ou desconforto?</p>
          <div style={{ display: 'flex', gap: 6, marginBottom: checkin.dor === 'sim' ? 8 : 0 }}>
            {['não','sim'].map(v => (
              <button key={v} onClick={() => atualizarCheckin('dor', v)}
                style={{ flex: 1, padding: '8px 0', borderRadius: 8, border: `1px solid ${checkin.dor === v ? (v === 'sim' ? C.danger : C.accent) : C.border}`, background: checkin.dor === v ? (v === 'sim' ? 'rgba(239,68,68,0.1)' : C.accentDim) : 'transparent', color: checkin.dor === v ? (v === 'sim' ? C.danger : C.accent) : C.muted, fontSize: 13, fontWeight: 600, cursor: 'pointer', textTransform: 'capitalize' }}>
                {v}
              </button>
            ))}
          </div>
          {checkin.dor === 'sim' && (
            <input value={checkin.dorLocal} onChange={e => atualizarCheckin('dorLocal', e.target.value)}
              placeholder="Onde? (ex: tornozelo direito, lombar...)"
              style={{ width: '100%', background: C.card2, border: `1px solid ${C.danger}`, borderRadius: 8, padding: '8px 10px', color: C.text, fontSize: 13, outline: 'none', boxSizing: 'border-box' }} />
          )}
        </div>
      </div>

      <div style={{ padding: '14px 20px 0' }}>
        <p style={{ fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', color: C.muted, margin: '0 0 8px' }}>Exercícios</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {treino.exercicios.map((e, i) => {
            const dados = ex[e.id] || {};
            const aberto = expandido === e.id;
            const feito = !!dados.feito;
            return (
              <div key={e.id} style={{ background: feito ? 'rgba(200,241,53,0.04)' : C.card, borderRadius: 12, border: `1px solid ${feito ? 'rgba(200,241,53,0.2)' : C.border}`, overflow: 'hidden' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '11px 12px', cursor: 'pointer' }} onClick={() => setExpandido(aberto ? null : e.id)}>
                  <button onClick={ev => { ev.stopPropagation(); atualizarEx(e.id, 'feito', !feito); }}
                    style={{ width: 26, height: 26, borderRadius: 8, border: `2px solid ${feito ? C.accent : C.muted2}`, background: feito ? C.accent : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, cursor: 'pointer' }}>
                    {feito && <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><polyline points="2,6.5 5,9.5 11,3" stroke="#18181B" strokeWidth="2.5" strokeLinecap="round"/></svg>}
                  </button>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: 14, fontWeight: 600, margin: 0, color: feito ? C.muted : C.text, textDecoration: feito ? 'line-through' : 'none', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{i+1}. {e.nome}</p>
                    <p style={{ fontSize: 11, color: C.muted, margin: '2px 0 0' }}>{e.series} · RIR {e.rir}</p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
                    {dados.carga && <span style={{ fontSize: 12, color: C.accent, fontWeight: 700 }}>{dados.carga}kg</span>}
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C.muted} strokeWidth="2" style={{ transform: aberto ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}><polyline points="6 9 12 15 18 9"/></svg>
                  </div>
                </div>
                {aberto && (
                  <div style={{ padding: '0 12px 12px', borderTop: `1px solid ${C.border}`, paddingTop: 10 }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 8 }}>
                      <div>
                        <p style={{ fontSize: 10, color: C.muted, margin: '0 0 4px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Carga (kg)</p>
                        <input type="text" value={dados.carga||''} onChange={ev => atualizarEx(e.id,'carga',ev.target.value)}
                          placeholder="—" style={{ width:'100%', background:C.card2, border:`1px solid ${C.border}`, borderRadius:8, padding:'10px', color:C.accent, fontSize:18, fontWeight:700, outline:'none', boxSizing:'border-box' }} />
                      </div>
                      <div>
                        <p style={{ fontSize: 10, color: C.muted, margin: '0 0 4px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>RIR médio</p>
                        <input type="text" value={dados.rir||''} onChange={ev => atualizarEx(e.id,'rir',ev.target.value)}
                          placeholder="0-2" style={{ width:'100%', background:C.card2, border:`1px solid ${C.border}`, borderRadius:8, padding:'10px', color:C.text, fontSize:18, fontWeight:700, outline:'none', boxSizing:'border-box' }} />
                      </div>
                    </div>
                    <div style={{ marginBottom: 8 }}>
                      <p style={{ fontSize: 10, color: C.muted, margin: '0 0 4px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Reps por série (ex: 8,7,6,6)</p>
                      <input type="text" value={dados.reps||''} onChange={ev => atualizarEx(e.id,'reps',ev.target.value)}
                        placeholder="8,7,6,6" style={{ width:'100%', background:C.card2, border:`1px solid ${C.border}`, borderRadius:8, padding:'10px', color:C.text, fontSize:15, outline:'none', boxSizing:'border-box' }} />
                    </div>
                    <div style={{ background: C.card2, borderRadius: 10, padding: '10px 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div>
                        <p style={{ fontSize: 10, color: C.muted, margin: 0, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Descanso</p>
                        <p style={{ fontSize: 15, fontWeight: 700, margin: '2px 0 0', color: C.text }}>{e.descanso}</p>
                      </div>
                      <button onClick={() => {
                        const s = e.descanso;
                        const seg = s.includes('3') ? 180 : s.includes('2-3') ? 150 : s.includes('2') ? 120 : s.includes('90-120') ? 105 : s.includes('90') ? 90 : s.includes('75') ? 75 : 60;
                        iniciarTimer(seg);
                      }} style={{ background: C.accent, color: '#18181B', border: 'none', borderRadius: 8, padding: '9px 16px', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>
                        ▶ Iniciar
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
        <button onClick={finalizarTreino}
          style={{ width: '100%', marginTop: 16, marginBottom: 8, background: C.accent, color: '#18181B', border: 'none', borderRadius: 14, padding: '16px', fontSize: 16, fontWeight: 800, cursor: 'pointer' }}>
          Finalizar treino
        </button>
        <p style={{ fontSize: 11, color: C.muted2, textAlign: 'center', margin: '0 0 24px' }}>
          {feitos}/{total} exercícios feitos — você pode finalizar a qualquer momento
        </p>
      </div>
    </div>
  );
}

// ─── CARDIO PÓS-TREINO ──────────────────────────────────────────
function CardioPostTreino({ regKey, regHoje, salvarRegistro, ex, checkin, iniciado, duracaoMin, diaKey, concluido }) {
  const [aberto, setAberto] = useState(!!regHoje.cardio?.tipo);
  const [tipo, setTipo] = useState(regHoje.cardio?.tipo || '');
  const [dados, setDados] = useState(regHoje.cardio?.dados || {});
  const [extraindo, setExtraindo] = useState(false);
  const [erroFoto, setErroFoto] = useState('');
  const [fotoUrl, setFotoUrl] = useState(null);
  const inputFotoRef = useRef(null);

  const salvarCardio = (novoTipo, novosDados) => {
    salvarRegistro(regKey, {
      exercicios: ex, checkin, horaInicio: iniciado, diaKey, concluido,
      duracaoMin, cardio: { tipo: novoTipo ?? tipo, dados: novosDados ?? dados }
    });
  };

  const atualizarDado = (campo, valor) => {
    const novo = { ...dados, [campo]: valor };
    setDados(novo); salvarCardio(null, novo);
  };

  const selecionarTipo = (t) => {
    setTipo(t); setDados({}); salvarCardio(t, {});
  };

  const processarFoto = async (file) => {
    if (!file) return;
    setExtraindo(true); setErroFoto('');
    try {
      const base64 = await new Promise((res, rej) => {
        const reader = new FileReader();
        reader.onload = () => res(reader.result.split(',')[1]);
        reader.onerror = rej;
        reader.readAsDataURL(file);
      });
      const prompt = tipo === 'shape'
        ? `Esta é uma foto da tela de resultado de uma esteira Shape Space com câmara de vácuo e EMS. Extraia os campos visíveis: tempo (mm:ss ou minutos), distancia_m (metros), velocidade_media_kmh, ekcal, pulso_bpm, ems_medio_pct, ems_maximo_pct, inclinacao_media. Retorne APENAS JSON válido, sem texto adicional. Use null para campos não visíveis.`
        : `Esta é uma foto da tela de resultado de uma esteira comum. Extraia os campos visíveis: tempo, distancia_km, velocidade_media_kmh, calorias. Retorne APENAS JSON válido, sem texto adicional. Use null para campos não visíveis.`;

      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system: 'Você extrai dados de fotos de telas de equipamentos de academia. Retorne APENAS JSON válido, sem markdown.',
          messages: [{ role: 'user', content: [
            { type: 'image', source: { type: 'base64', media_type: file.type || 'image/jpeg', data: base64 } },
            { type: 'text', text: prompt }
          ]}]
        })
      });
      const data = await res.json();
      const texto = data.content?.map(c => c.text || '').join('') || '';
      const extraido = JSON.parse(texto.replace(/```json|```/g, '').trim());
      const novosDados = {};
      Object.entries(extraido).forEach(([k, v]) => { if (v !== null && v !== undefined) novosDados[k] = String(v); });
      setDados(novosDados); salvarCardio(null, novosDados);
      setFotoUrl(URL.createObjectURL(file));
    } catch (e) {
      setErroFoto('Não consegui ler a foto. Preencha os campos manualmente.');
    } finally { setExtraindo(false); }
  };

  if (!aberto) {
    return (
      <button onClick={() => setAberto(true)}
        style={{ width: '100%', background: 'transparent', border: `1px dashed ${C.border}`, borderRadius: 14, padding: '14px', color: C.muted, fontSize: 14, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
        <span style={{ fontSize: 18 }}>🏃</span> Adicionar cardio pós-treino (opcional)
      </button>
    );
  }

  const camposShape = [
    { key: 'tempo', label: 'Tempo', placeholder: '30:00' },
    { key: 'distancia_m', label: 'Distância (m)', placeholder: '3717' },
    { key: 'velocidade_media_kmh', label: 'Vel. média (km/h)', placeholder: '6.8' },
    { key: 'ekcal', label: 'E-Kcal', placeholder: '2012' },
    { key: 'ems_medio_pct', label: 'EMS médio (%)', placeholder: '11.1' },
    { key: 'ems_maximo_pct', label: 'EMS máximo (%)', placeholder: '20' },
    { key: 'inclinacao_media', label: 'Inclinação (°)', placeholder: '0.0' },
    { key: 'pulso_bpm', label: 'Pulso (bpm)', placeholder: '—' },
  ];
  const camposEsteira = [
    { key: 'tempo', label: 'Tempo', placeholder: '30:00' },
    { key: 'distancia_km', label: 'Distância (km)', placeholder: '3.7' },
    { key: 'velocidade_media_kmh', label: 'Vel. média (km/h)', placeholder: '7.5' },
    { key: 'calorias', label: 'Calorias', placeholder: '280' },
  ];
  const campos = tipo === 'shape' ? camposShape : camposEsteira;

  return (
    <div style={{ background: C.card, borderRadius: 16, padding: '16px', border: `1px solid ${C.border}` }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 18 }}>🏃</span>
          <p style={{ fontSize: 13, fontWeight: 700, margin: 0 }}>Cardio pós-treino</p>
        </div>
        <button onClick={() => { setAberto(false); salvarCardio('', {}); }}
          style={{ background: 'none', border: 'none', color: C.muted, cursor: 'pointer', fontSize: 20, padding: 0, lineHeight: 1 }}>×</button>
      </div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
        {[{ id: 'esteira', label: '🏃 Esteira comum' }, { id: 'shape', label: '⚡ Shape Space' }].map(t => (
          <button key={t.id} onClick={() => selecionarTipo(t.id)}
            style={{ flex: 1, padding: '10px', borderRadius: 10, border: `1px solid ${tipo === t.id ? C.accent : C.border}`, background: tipo === t.id ? C.accentDim : 'transparent', color: tipo === t.id ? C.accent : C.muted, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
            {t.label}
          </button>
        ))}
      </div>
      {tipo && (
        <>
          <input ref={inputFotoRef} type="file" accept="image/*" capture="environment"
            onChange={e => processarFoto(e.target.files[0])} style={{ display: 'none' }} />
          <button onClick={() => inputFotoRef.current?.click()} disabled={extraindo}
            style={{ width: '100%', background: extraindo ? C.card2 : 'rgba(88,196,246,0.1)', border: `1px solid ${extraindo ? C.border : C.blue}`, borderRadius: 10, padding: '12px', color: extraindo ? C.muted : C.blue, fontSize: 13, fontWeight: 700, cursor: extraindo ? 'default' : 'pointer', marginBottom: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
            {extraindo ? <><span>⏳</span> Lendo a foto...</> : <><span>📷</span> Fotografar tela de resultado</>}
          </button>
          {erroFoto && <p style={{ fontSize: 12, color: C.danger, margin: '-8px 0 10px', textAlign: 'center' }}>{erroFoto}</p>}
          {fotoUrl && <div style={{ marginBottom: 12, borderRadius: 10, overflow: 'hidden', border: `1px solid ${C.border}` }}><img src={fotoUrl} alt="Resultado" style={{ width: '100%', display: 'block', maxHeight: 120, objectFit: 'cover' }} /></div>}
          <p style={{ fontSize: 10, color: C.muted, margin: '0 0 8px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            {Object.keys(dados).length > 0 ? 'Dados extraídos — confirme ou corrija' : 'Ou preencha manualmente'}
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            {campos.map(c => (
              <div key={c.key}>
                <p style={{ fontSize: 9, color: C.muted, margin: '0 0 3px', textTransform: 'uppercase' }}>{c.label}</p>
                <input type="text" value={dados[c.key] || ''} onChange={e => atualizarDado(c.key, e.target.value)} placeholder={c.placeholder}
                  style={{ width: '100%', background: dados[c.key] ? 'rgba(200,241,53,0.06)' : C.card2, border: `1px solid ${dados[c.key] ? 'rgba(200,241,53,0.3)' : C.border}`, borderRadius: 8, padding: '8px', color: dados[c.key] ? C.accent : C.muted, fontSize: 14, fontWeight: dados[c.key] ? 700 : 400, outline: 'none', boxSizing: 'border-box' }} />
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// ─── TIMER FLUTUANTE ─────────────────────────────────────────────
function TimerFlutuante({ timer, fechar }) {
  const min = Math.floor(timer.seg / 60);
  const sec = timer.seg % 60;
  const pct = timer.total > 0 ? (timer.seg / timer.total) : 0;
  const r = 28; const circ = 2 * Math.PI * r;
  return (
    <div style={{ position: 'fixed', bottom: 90, right: 20, zIndex: 100, background: C.card, border: `1px solid ${C.border}`, borderRadius: 20, padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 14, boxShadow: '0 8px 32px rgba(0,0,0,0.5)' }}>
      <div style={{ position: 'relative', width: 64, height: 64 }}>
        <svg viewBox="0 0 64 64" style={{ width: 64, height: 64, transform: 'rotate(-90deg)' }}>
          <circle cx="32" cy="32" r={r} fill="none" stroke={C.border} strokeWidth="4"/>
          <circle cx="32" cy="32" r={r} fill="none" stroke={C.accent} strokeWidth="4" strokeLinecap="round"
            strokeDasharray={circ} strokeDashoffset={circ * (1 - pct)}/>
        </svg>
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 800, color: pct < 0.3 ? C.danger : C.text }}>
          {min}:{String(sec).padStart(2,'0')}
        </div>
      </div>
      <div>
        <p style={{ fontSize: 11, color: C.muted, margin: '0 0 2px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Descansando</p>
        <p style={{ fontSize: 13, fontWeight: 600, margin: 0, color: C.text }}>Próxima série em breve</p>
      </div>
      <button onClick={fechar} style={{ background: 'none', border: 'none', color: C.muted, cursor: 'pointer', padding: 4 }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>
    </div>
  );
}

// ─── TELA HISTÓRICO ──────────────────────────────────────────────
function TelaHistorico({ historicoTreinos }) {
  const [selecionado, setSelecionado] = useState(null);

  if (selecionado) {
    const t = selecionado;
    const treino = SPLIT[t.dia_key] || {};
    const exerciciosFeitos = Object.entries(t.exercicios || {}).filter(([, v]) => v?.feito);
    const exerciciosComCarga = Object.entries(t.exercicios || {}).filter(([, v]) => v?.carga);
    return (
      <div style={{ padding: '24px 20px 0' }}>
        <button onClick={() => setSelecionado(null)} style={{ background: 'none', border: 'none', color: C.muted, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, padding: 0, marginBottom: 16, fontSize: 13 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
          Voltar ao histórico
        </button>
        <p style={{ fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase', color: C.muted, margin: 0 }}>{t.data}</p>
        <h1 style={{ fontSize: 28, fontWeight: 800, margin: '4px 0 4px', letterSpacing: '-0.02em', color: treino.cor || C.accent }}>{treino.nome || t.dia_key}</h1>
        <p style={{ fontSize: 14, color: C.muted, margin: '0 0 20px' }}>{treino.titulo}</p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 16 }}>
          {[
            { label: 'Exercícios', val: `${exerciciosFeitos.length}/${treino.exercicios?.length || '—'}` },
            { label: 'Duração', val: t.duracao_min ? `${t.duracao_min}min` : '—' },
            { label: 'Energia', val: t.checkin?.energia ? `${t.checkin.energia}/5` : '—' },
          ].map((m, i) => (
            <div key={i} style={{ background: C.card, borderRadius: 12, padding: '12px', border: `1px solid ${C.border}`, textAlign: 'center' }}>
              <p style={{ fontSize: 9, color: C.muted, margin: '0 0 4px', textTransform: 'uppercase' }}>{m.label}</p>
              <p style={{ fontSize: 18, fontWeight: 800, margin: 0, color: C.accent }}>{m.val}</p>
            </div>
          ))}
        </div>

        {t.checkin?.sono && (
          <div style={{ background: C.card, borderRadius: 14, padding: '14px 16px', border: `1px solid ${C.border}`, marginBottom: 12 }}>
            <p style={{ fontSize: 10, color: C.muted, margin: '0 0 8px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Check-in</p>
            <div style={{ display: 'flex', gap: 16 }}>
              {t.checkin.sono && <div><p style={{ fontSize: 9, color: C.muted, margin: '0 0 2px' }}>SONO</p><p style={{ fontSize: 16, fontWeight: 700, margin: 0, color: C.orange }}>{t.checkin.sono}h</p></div>}
              {t.checkin.fc && <div><p style={{ fontSize: 9, color: C.muted, margin: '0 0 2px' }}>FC REPOUSO</p><p style={{ fontSize: 16, fontWeight: 700, margin: 0, color: C.blue }}>{t.checkin.fc}bpm</p></div>}
              {t.checkin.dor === 'sim' && <div><p style={{ fontSize: 9, color: C.muted, margin: '0 0 2px' }}>DOR</p><p style={{ fontSize: 13, fontWeight: 600, margin: 0, color: C.danger }}>{t.checkin.dorLocal || 'Registrada'}</p></div>}
            </div>
          </div>
        )}

        {exerciciosComCarga.length > 0 && (
          <div style={{ background: C.card, borderRadius: 14, padding: '14px 16px', border: `1px solid ${C.border}`, marginBottom: 12 }}>
            <p style={{ fontSize: 10, color: C.muted, margin: '0 0 10px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Cargas registradas</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {exerciciosComCarga.map(([id, v]) => {
                const nomeEx = Object.values(SPLIT).flatMap(d => d.exercicios).find(e => e.id === id)?.nome || id;
                return (
                  <div key={id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 8, borderBottom: `1px solid ${C.border}` }}>
                    <span style={{ fontSize: 13, color: C.text }}>{nomeEx}</span>
                    <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                      {v.reps && <span style={{ fontSize: 11, color: C.muted }}>{v.reps}</span>}
                      <span style={{ fontSize: 15, fontWeight: 700, color: C.accent }}>{v.carga}kg</span>
                      {v.rir && <span style={{ fontSize: 11, color: C.muted }}>RIR {v.rir}</span>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {t.cardio?.tipo && (
          <div style={{ background: C.card, borderRadius: 14, padding: '14px 16px', border: `1px solid ${C.border}` }}>
            <p style={{ fontSize: 10, color: C.muted, margin: '0 0 10px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              Cardio — {t.cardio.tipo === 'shape' ? '⚡ Shape Space' : '🏃 Esteira comum'}
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              {Object.entries(t.cardio.dados || {}).map(([k, v]) => (
                <div key={k}>
                  <p style={{ fontSize: 9, color: C.muted, margin: '0 0 2px', textTransform: 'uppercase' }}>{k.replace(/_/g,' ')}</p>
                  <p style={{ fontSize: 15, fontWeight: 700, margin: 0, color: C.blue }}>{v}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div style={{ padding: '24px 20px 0' }}>
      <p style={{ fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase', color: C.muted, margin: 0 }}>Todos os treinos</p>
      <h1 style={{ fontSize: 28, fontWeight: 800, margin: '4px 0 16px', letterSpacing: '-0.02em' }}>Histórico</h1>

      {historicoTreinos.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px 0' }}>
          <p style={{ fontSize: 48, marginBottom: 12 }}>📋</p>
          <p style={{ color: C.muted, fontSize: 14 }}>Nenhum treino concluído ainda.</p>
          <p style={{ color: C.muted2, fontSize: 12 }}>Finalize o treino de hoje para ele aparecer aqui.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {historicoTreinos.map(t => {
            const treino = SPLIT[t.dia_key] || {};
            const feitos = Object.values(t.exercicios || {}).filter(v => v?.feito).length;
            const total = treino.exercicios?.length || 0;
            const temCardio = !!t.cardio?.tipo;
            return (
              <button key={t.id} onClick={() => setSelecionado(t)}
                style={{ background: C.card, borderRadius: 14, padding: '14px 16px', border: `1px solid ${C.border}`, textAlign: 'left', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: `${treino.cor || C.accent}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <span style={{ fontSize: 13, fontWeight: 900, color: treino.cor || C.accent }}>{treino.nome || '—'}</span>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 14, fontWeight: 700, margin: 0, color: C.text }}>{treino.titulo || t.dia_key}</p>
                  <p style={{ fontSize: 11, color: C.muted, margin: '2px 0 0' }}>
                    {t.data} · {feitos}/{total} exercícios · {t.duracao_min ? `${t.duracao_min}min` : '—'}
                    {temCardio && ` · ${t.cardio.tipo === 'shape' ? '⚡' : '🏃'}`}
                  </p>
                </div>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C.muted} strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── TELA CORPO ──────────────────────────────────────────────────
function TelaCorpo({ pesoHist, salvarPeso }) {
  const [novoPeso, setNovoPeso] = useState('');
  const [novaGordura, setNovaGordura] = useState('');
  const [novaMuscular, setNovaMuscular] = useState('');

  const ultimo = pesoHist.length > 0 ? pesoHist[pesoHist.length-1] : null;
  const primeiro = pesoHist[0];
  const ultimoInBody = [...pesoHist].reverse().find(r => r.fonte === 'inbody');
  const deltaPeso = ultimo && primeiro ? (parseFloat(ultimo.peso) - parseFloat(primeiro.peso)).toFixed(1) : null;

  const pontos = pesoHist.filter((_, i) => i % 3 === 0 || i === pesoHist.length-1);
  const pesos = pontos.map(r => parseFloat(r.peso));
  const minP = Math.min(...pesos) - 2; const maxP = Math.max(...pesos) + 2;
  const gW = 320; const gH = 80;
  const pts = pontos.map((r, i) => ({
    x: 5 + (i / Math.max(pontos.length-1, 1)) * gW,
    y: gH - ((parseFloat(r.peso) - minP) / (maxP - minP)) * gH,
    label: r.data.slice(5).replace('-','/'), inbody: r.fonte === 'inbody'
  }));
  const pathD = pts.map((p, i) => `${i===0?'M':'L'}${p.x},${p.y}`).join(' ');

  const registrarMedicao = () => {
    if (!novoPeso) return;
    salvarPeso({ data: dateKey(), peso: novoPeso, gordura: novaGordura||null, muscular: novaMuscular||null, visceral: null, agua: null, tmb: null, fonte: 'manual' });
    setNovoPeso(''); setNovaGordura(''); setNovaMuscular('');
  };

  return (
    <div style={{ padding: '24px 20px 0' }}>
      <p style={{ fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase', color: C.muted, margin: 0 }}>Composição corporal</p>
      <h1 style={{ fontSize: 28, fontWeight: 800, margin: '4px 0 16px', letterSpacing: '-0.02em' }}>Seu corpo</h1>

      <div style={{ background: C.card, borderRadius: 16, padding: '18px', border: `1px solid ${C.border}` }}>
        <p style={{ fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', color: C.muted, margin: '0 0 6px' }}>Peso atual</p>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8 }}>
          <span style={{ fontSize: 60, fontWeight: 900, letterSpacing: '-0.04em', color: C.accent, lineHeight: 1 }}>{ultimo?.peso || '—'}</span>
          <span style={{ fontSize: 18, color: C.muted, paddingBottom: 6 }}>kg</span>
          {deltaPeso && <span style={{ marginLeft: 'auto', background: parseFloat(deltaPeso) < 0 ? C.accentDim : 'rgba(239,68,68,0.1)', color: parseFloat(deltaPeso) < 0 ? C.accent : C.danger, borderRadius: 8, padding: '4px 10px', fontSize: 13, fontWeight: 700 }}>{parseFloat(deltaPeso) > 0 ? '+' : ''}{deltaPeso}kg</span>}
        </div>
        {primeiro && <p style={{ fontSize: 12, color: C.muted, margin: '6px 0 12px' }}>desde {primeiro.data} · {primeiro.peso}kg</p>}
        <div style={{ overflow: 'hidden' }}>
          <svg width="100%" viewBox="0 0 330 100" preserveAspectRatio="none" style={{ display: 'block' }}>
            <defs>
              <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={C.accent} stopOpacity="0.2"/>
                <stop offset="100%" stopColor={C.accent} stopOpacity="0"/>
              </linearGradient>
            </defs>
            <path d={pathD + ` L${pts[pts.length-1]?.x||0},${gH} L5,${gH} Z`} fill="url(#g1)"/>
            <path d={pathD} fill="none" stroke={C.accent} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            {[0, Math.floor(pts.length/2), pts.length-1].filter((v,i,a)=>a.indexOf(v)===i).map(i => pts[i] && (
              <g key={i}>
                <circle cx={pts[i].x} cy={pts[i].y} r={pts[i].inbody ? 6 : (i===pts.length-1?5:3)}
                  fill={pts[i].inbody ? C.orange : (i===pts.length-1?C.accent:C.card)}
                  stroke={pts[i].inbody ? C.orange : C.accent} strokeWidth="1.5"/>
                <text x={Math.min(Math.max(pts[i].x, 18), gW-10)} y={gH+16} textAnchor="middle" fontSize="9" fill={C.muted}>{pts[i].label}</text>
              </g>
            ))}
          </svg>
        </div>
      </div>

      {ultimoInBody && (
        <div style={{ marginTop: 8, background: C.orangeDim, border: `1px solid rgba(255,140,66,0.3)`, borderRadius: 14, padding: '14px 16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <p style={{ fontSize: 10, color: C.orange, margin: 0, textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700 }}>InBody — {ultimoInBody.data}</p>
            <span style={{ fontSize: 10, color: C.orange, background: 'rgba(255,140,66,0.2)', padding: '2px 8px', borderRadius: 6 }}>Profissional</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 8 }}>
            {[
              { label: 'Gordura', val: `${ultimoInBody.gordura}%` },
              { label: 'M. Musc.', val: `${ultimoInBody.muscular}kg` },
              { label: 'Visceral', val: `Nível ${ultimoInBody.visceral}` },
              { label: 'TMB', val: `${ultimoInBody.tmb}kcal` },
            ].map((m,i) => (
              <div key={i} style={{ textAlign: 'center' }}>
                <p style={{ fontSize: 9, color: C.orange, margin: '0 0 3px', textTransform: 'uppercase' }}>{m.label}</p>
                <p style={{ fontSize: 13, fontWeight: 700, margin: 0, color: C.text }}>{m.val}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 8 }}>
        {[
          { label: 'Gordura corporal', val: ultimo?.gordura ? `${ultimo.gordura}%` : '—', cor: C.orange },
          { label: 'Massa muscular', val: ultimo?.muscular ? `${ultimo.muscular}kg` : '—', cor: C.blue },
          { label: 'Gordura visceral', val: ultimo?.visceral ? `Nível ${ultimo.visceral}` : '—', cor: C.orange },
          { label: 'Água corporal', val: ultimo?.agua ? `${ultimo.agua}L` : '—', cor: C.blue },
        ].map((m, i) => (
          <div key={i} style={{ background: C.card, borderRadius: 14, padding: '14px', border: `1px solid ${C.border}` }}>
            <p style={{ fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: C.muted, margin: '0 0 5px' }}>{m.label}</p>
            <p style={{ fontSize: 22, fontWeight: 800, margin: 0, letterSpacing: '-0.02em', color: m.cor }}>{m.val}</p>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 8, background: C.card, borderRadius: 16, padding: '16px', border: `1px solid ${C.border}` }}>
        <p style={{ fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', color: C.muted, margin: '0 0 10px' }}>Registrar peso diário</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 10 }}>
          {[
            { label: 'Peso (kg)', val: novoPeso, set: setNovoPeso, placeholder: '76.8' },
            { label: 'Gordura %', val: novaGordura, set: setNovaGordura, placeholder: '13.8' },
            { label: 'Músculo kg', val: novaMuscular, set: setNovaMuscular, placeholder: '38.1' },
          ].map(f => (
            <div key={f.label}>
              <p style={{ fontSize: 9, color: C.muted, margin: '0 0 4px', textTransform: 'uppercase' }}>{f.label}</p>
              <input type="number" step="0.1" value={f.val} onChange={e => f.set(e.target.value)} placeholder={f.placeholder}
                style={{ width: '100%', background: C.card2, border: `1px solid ${C.border}`, borderRadius: 8, padding: '8px', color: C.text, fontSize: 15, fontWeight: 700, outline: 'none', boxSizing: 'border-box' }} />
            </div>
          ))}
        </div>
        <button onClick={registrarMedicao} style={{ width: '100%', background: C.accent, color: '#18181B', border: 'none', borderRadius: 10, padding: '12px', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>Salvar medição</button>
      </div>

      <div style={{ marginTop: 8, background: C.orangeDim, border: `1px solid rgba(255,140,66,0.25)`, borderRadius: 12, padding: '12px 14px', marginBottom: 20 }}>
        <p style={{ fontSize: 12, color: C.orange, margin: 0, lineHeight: 1.5 }}>
          <strong>Referência InBody:</strong> a medição profissional mensal é mais precisa que a balança doméstica. Os dados do InBody são a referência principal para acompanhamento do ciclo.
        </p>
      </div>
    </div>
  );
}

// ─── TELA PROGRESSO ──────────────────────────────────────────────
function TelaProgresso({ registros }) {
  const todosEx = [];
  Object.values(SPLIT).forEach(dia => dia.exercicios.forEach(e => { if (e.id !== 'descanso') todosEx.push(e); }));
  const compostos = todosEx.filter(e => COMPOSTOS.includes(e.id));
  const [selecionado, setSelecionado] = useState(compostos[0]?.id || '');

  const entradas = Object.entries(registros).sort((a,b) => a[0].localeCompare(b[0]));
  const historicoCarga = entradas
    .filter(([,r]) => r.exercicios?.[selecionado]?.carga)
    .map(([k,r]) => ({ data: k.replace('reg:','').slice(5).replace('-','/'), carga: parseNum(r.exercicios[selecionado].carga) }))
    .filter(h => h.carga !== null);

  const temDados = historicoCarga.length >= 2;
  const ultimaCarga = historicoCarga.length > 0 ? historicoCarga[historicoCarga.length-1].carga : null;
  const primeiraCarga = historicoCarga.length > 0 ? historicoCarga[0].carga : null;
  const deltaEx = ultimaCarga !== null && primeiraCarga !== null ? ultimaCarga - primeiraCarga : null;

  const gW = 310; const gH = 80;
  let pathEx = ''; let ptsEx = [];
  if (temDados) {
    const cargas = historicoCarga.map(h => h.carga);
    const minC = Math.min(...cargas) - 3; const maxC = Math.max(...cargas) + 3;
    ptsEx = historicoCarga.map((h, i) => ({
      x: 5 + (i / (historicoCarga.length-1)) * gW,
      y: gH - ((h.carga - minC) / (maxC - minC)) * gH, label: h.data
    }));
    pathEx = ptsEx.map((p,i) => `${i===0?'M':'L'}${p.x},${p.y}`).join(' ');
  }

  const ultimas7 = entradas.slice(-7);
  const medSono = ultimas7.filter(([,r])=>r.checkin?.sono).map(([,r])=>parseFloat(r.checkin.sono));
  const medFc = ultimas7.filter(([,r])=>r.checkin?.fc).map(([,r])=>parseFloat(r.checkin.fc));
  const medEn = ultimas7.filter(([,r])=>r.checkin?.energia).map(([,r])=>r.checkin.energia);
  const media = arr => arr.length ? (arr.reduce((a,b)=>a+b,0)/arr.length).toFixed(1) : '—';

  return (
    <div style={{ padding: '24px 20px 0' }}>
      <p style={{ fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase', color: C.muted, margin: 0 }}>Evolução de cargas</p>
      <h1 style={{ fontSize: 28, fontWeight: 800, margin: '4px 0 14px', letterSpacing: '-0.02em' }}>Progresso</h1>

      <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 4 }}>
        {compostos.map(e => (
          <button key={e.id} onClick={() => setSelecionado(e.id)}
            style={{ flexShrink: 0, padding: '6px 14px', borderRadius: 20, border: `1px solid ${selecionado===e.id ? C.accent : C.border}`, background: selecionado===e.id ? C.accentDim : 'transparent', color: selecionado===e.id ? C.accent : C.muted, fontSize: 12, fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap' }}>
            {e.nome.split(' ').slice(0,2).join(' ')}
          </button>
        ))}
      </div>

      <div style={{ marginTop: 10, background: C.card, borderRadius: 16, padding: '16px', border: `1px solid ${C.border}`, overflow: 'hidden' }}>
        {temDados ? (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 10 }}>
              <div>
                <p style={{ fontSize: 11, color: C.muted, margin: 0, textTransform: 'uppercase', letterSpacing: '0.1em' }}>{todosEx.find(e=>e.id===selecionado)?.nome}</p>
                <p style={{ fontSize: 32, fontWeight: 800, margin: '2px 0 0', color: C.text }}>{ultimaCarga}<span style={{ fontSize: 14, color: C.muted, fontWeight: 500 }}>kg</span></p>
              </div>
              {deltaEx !== null && <span style={{ background: deltaEx >= 0 ? C.accentDim : 'rgba(239,68,68,0.1)', color: deltaEx >= 0 ? C.accent : C.danger, borderRadius: 8, padding: '4px 10px', fontSize: 13, fontWeight: 700 }}>{deltaEx>=0?'+':''}{deltaEx}kg</span>}
            </div>
            <svg width="100%" viewBox="0 0 330 104" preserveAspectRatio="none" style={{ display: 'block' }}>
              <defs><linearGradient id="g2" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={C.accent} stopOpacity="0.15"/><stop offset="100%" stopColor={C.accent} stopOpacity="0"/></linearGradient></defs>
              <path d={pathEx + ` L${ptsEx[ptsEx.length-1]?.x||0},${gH} L5,${gH} Z`} fill="url(#g2)"/>
              <path d={pathEx} fill="none" stroke={C.accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              {ptsEx.map((p, i) => (
                <g key={i}>
                  <circle cx={p.x} cy={p.y} r={i===ptsEx.length-1?5:3} fill={i===ptsEx.length-1?C.accent:C.card} stroke={C.accent} strokeWidth="1.5"/>
                  <text x={Math.min(Math.max(p.x,18),gW-10)} y={gH+18} textAnchor="middle" fontSize="9" fill={C.muted}>{p.label}</text>
                  {i===ptsEx.length-1 && <text x={Math.min(p.x,gW-15)} y={p.y-10} textAnchor="end" fontSize="10" fontWeight="700" fill={C.accent}>{p.carga}kg</text>}
                </g>
              ))}
            </svg>
          </>
        ) : (
          <div style={{ textAlign: 'center', padding: '24px 0' }}>
            <p style={{ color: C.muted, fontSize: 13 }}>Ainda sem dados para este exercício.</p>
            <p style={{ color: C.muted2, fontSize: 12 }}>Registre a carga nos treinos para ver a evolução aqui.</p>
          </div>
        )}
      </div>

      <div style={{ marginTop: 10 }}>
        <p style={{ fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', color: C.muted, margin: '0 0 8px' }}>Média — últimos 7 treinos</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 6 }}>
          {[
            { label: 'Sono', val: `${media(medSono)}h`, cor: C.orange },
            { label: 'FC rep.', val: medFc.length ? `${media(medFc)}` : '—', cor: C.blue },
            { label: 'Energia', val: medEn.length ? `${media(medEn)}/5` : '—', cor: C.accent },
          ].map((m,i) => (
            <div key={i} style={{ background: C.card, borderRadius: 12, padding: '12px', border: `1px solid ${C.border}`, textAlign: 'center' }}>
              <p style={{ fontSize: 9, letterSpacing: '0.1em', textTransform: 'uppercase', color: C.muted, margin: '0 0 4px' }}>{m.label}</p>
              <p style={{ fontSize: 18, fontWeight: 800, margin: 0, color: m.cor }}>{m.val}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── TELA CICLO ──────────────────────────────────────────────────
function TelaCiclo({ registros }) {
  const semana = semanaAtual();
  const pct = Math.min(100, Math.round((semana / CICLO_SEMANAS) * 100));
  const r = 54; const circ = 2 * Math.PI * r;
  const entradas = Object.entries(registros);

  const estagnados = [];
  COMPOSTOS.forEach(exId => {
    const hist = entradas
      .filter(([,r]) => r.exercicios?.[exId]?.carga)
      .sort((a,b) => a[0].localeCompare(b[0]))
      .map(([,r]) => ({ carga: parseNum(r.exercicios[exId].carga), rir: r.exercicios[exId].rir }))
      .filter(h => h.carga !== null);
    if (hist.length < 3) return;
    const ult3 = hist.slice(-3);
    if (ult3[0].carga === ult3[1].carga && ult3[1].carga === ult3[2].carga) {
      const nomeEx = Object.values(SPLIT).flatMap(d => d.exercicios).find(e => e.id === exId)?.nome || exId;
      estagnados.push({ nome: nomeEx, carga: ult3[2].carga, rirZero: ult3.filter(h => h.rir === '0' || h.rir === '0-1').length });
    }
  });

  const motivosForte = [semana >= CICLO_SEMANAS - 1, estagnados.length >= 2, estagnados.some(e => e.rirZero >= 2)].filter(Boolean).length;
  const trocar = motivosForte >= 2;

  return (
    <div style={{ padding: '24px 20px 0' }}>
      <p style={{ fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase', color: C.muted, margin: 0 }}>Mesociclo atual</p>
      <h1 style={{ fontSize: 28, fontWeight: 800, margin: '4px 0 14px', letterSpacing: '-0.02em' }}>Ciclo A/B/C</h1>

      <div style={{ background: C.card, borderRadius: 20, padding: '20px', border: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', gap: 16 }}>
        <div style={{ position: 'relative', width: 120, height: 120, flexShrink: 0 }}>
          <svg viewBox="0 0 128 128" width="120" height="120" style={{ transform: 'rotate(-90deg)' }}>
            <circle cx="64" cy="64" r={r} fill="none" stroke={C.border} strokeWidth="8"/>
            <circle cx="64" cy="64" r={r} fill="none" stroke={pct >= 85 ? C.danger : C.accent} strokeWidth="8" strokeLinecap="round"
              strokeDasharray={circ} strokeDashoffset={circ * (1 - pct/100)} style={{ transition: 'stroke-dashoffset 0.7s' }}/>
          </svg>
          <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: 34, fontWeight: 900, color: C.text, lineHeight: 1 }}>{semana}</span>
            <span style={{ fontSize: 11, color: C.muted }}>de {CICLO_SEMANAS}</span>
          </div>
        </div>
        <div>
          <p style={{ fontSize: 12, color: C.muted, margin: '0 0 3px' }}>Início</p>
          <p style={{ fontSize: 14, fontWeight: 600, margin: '0 0 10px', color: C.text }}>29 jun 2026</p>
          <p style={{ fontSize: 12, color: C.muted, margin: '0 0 3px' }}>Fim previsto</p>
          <p style={{ fontSize: 14, fontWeight: 600, margin: 0, color: C.text }}>28 set 2026</p>
        </div>
      </div>

      <div style={{ marginTop: 8, background: trocar ? 'rgba(239,68,68,0.06)' : C.accentDim, border: `1px solid ${trocar ? 'rgba(239,68,68,0.3)' : 'rgba(200,241,53,0.2)'}`, borderRadius: 12, padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 10 }}>
        <span style={{ fontSize: 18 }}>{trocar ? '⚠️' : '✓'}</span>
        <p style={{ fontSize: 13, color: trocar ? C.danger : C.accent, margin: 0, fontWeight: 500 }}>
          {trocar ? `${estagnados.length} exercício(s) estagnado(s) — considere trocar o split` : 'Ciclo saudável — continue registrando'}
        </p>
      </div>

      <div style={{ marginTop: 14 }}>
        <p style={{ fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', color: C.muted, margin: '0 0 8px' }}>Divisão semanal</p>
        {DIAS_KEY.map(dia => {
          const t = SPLIT[dia];
          const ehHoje = getDiaKey() === dia;
          return (
            <div key={dia} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px', borderBottom: `1px solid ${C.border}`, background: ehHoje ? C.accentDim : 'transparent', borderRadius: ehHoje ? 8 : 0 }}>
              <span style={{ fontSize: 12, color: C.muted, width: 30 }}>{DIAS_LABEL[dia]}</span>
              <span style={{ fontSize: 13, fontWeight: 800, color: t.cor, width: 28 }}>{t.nome}</span>
              <span style={{ fontSize: 13, color: ehHoje ? C.text : C.muted }}>{t.titulo}</span>
              {ehHoje && <span style={{ marginLeft: 'auto', fontSize: 10, color: C.accent, fontWeight: 700 }}>hoje</span>}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── AI CONSULTA ─────────────────────────────────────────────────
function AiConsulta({ registros, pesoHist, fechar }) {
  const [msgs, setMsgs] = useState([{ role: 'assistant', content: 'Olá! Sou seu personal trainer virtual. Pode me perguntar qualquer coisa sobre o treino de hoje, substituições de exercícios, recuperação, ou qualquer dúvida.' }]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const endRef = useRef(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [msgs]);

  const enviar = async () => {
    if (!input.trim() || loading) return;
    const userMsg = input.trim();
    setInput('');
    setMsgs(p => [...p, { role: 'user', content: userMsg }]);
    setLoading(true);
    const ultimoInBody = [...pesoHist].reverse().find(r => r.fonte === 'inbody');
    const ultimoPeso = pesoHist.length > 0 ? pesoHist[pesoHist.length-1] : null;
    const system = `Você é um personal trainer expert em hipertrofia, com profundo conhecimento científico. Responda de forma direta e técnica em português brasileiro. Máximo 150 palavras.

Contexto do atleta:
- Leandro, 41 anos, 1.72m
- Peso atual: ${ultimoPeso?.peso || '76.8'}kg (veio de 99.2kg em janeiro/2026)
- InBody (${ultimoInBody?.data || '27/06/2026'}): gordura ${ultimoInBody?.gordura || '13.8'}%, massa muscular ${ultimoInBody?.muscular || '38.1'}kg, visceral nível ${ultimoInBody?.visceral || '4'}, TMB ${ultimoInBody?.tmb || '1800'}kcal, pontuação 91/100
- Objetivo: hipertrofia em cutting
- Experiência: 20+ anos (avançado)
- Split A/B/C, 6x/semana, início 29/06/2026
- Restrição: dor no tornozelo em sprints — sem restrição para musculação
- Treino de hoje: ${SPLIT[getDiaKey()].nome} — ${SPLIT[getDiaKey()].titulo}`;

    try {
      const history = msgs.slice(-6).map(m => ({ role: m.role, content: m.content }));
      const res = await fetch('/api/ai', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ system, messages: [...history, { role: 'user', content: userMsg }] }),
      });
      const data = await res.json();
      const texto = data.content?.map(c => c.text || '').join('') || 'Erro ao obter resposta.';
      setMsgs(p => [...p, { role: 'assistant', content: texto }]);
    } catch {
      setMsgs(p => [...p, { role: 'assistant', content: 'Erro de conexão. Tente novamente.' }]);
    } finally { setLoading(false); }
  };

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(0,0,0,0.7)', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
      <div style={{ background: C.card, borderRadius: '20px 20px 0 0', maxHeight: '80vh', display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', borderBottom: `1px solid ${C.border}` }}>
          <div>
            <p style={{ fontSize: 11, color: C.muted, margin: 0, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Personal trainer IA</p>
            <p style={{ fontSize: 15, fontWeight: 700, margin: '2px 0 0', color: C.accent }}>Pergunte qualquer coisa</p>
          </div>
          <button onClick={fechar} style={{ background: C.card2, border: 'none', color: C.muted, cursor: 'pointer', width: 32, height: 32, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
        <div style={{ padding: '10px 16px', display: 'flex', gap: 6, overflowX: 'auto' }}>
          {['Substituir exercício com dor no tornozelo', 'Estou cansado hoje, adapto o treino?', 'O que priorizar no cutting?'].map(s => (
            <button key={s} onClick={() => setInput(s)}
              style={{ flexShrink: 0, padding: '6px 12px', borderRadius: 20, border: `1px solid ${C.border}`, background: 'transparent', color: C.muted, fontSize: 11, cursor: 'pointer', whiteSpace: 'nowrap' }}>
              {s}
            </button>
          ))}
        </div>
        <div style={{ flex: 1, overflowY: 'auto', padding: '10px 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
          {msgs.map((m, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start' }}>
              <div style={{ maxWidth: '85%', background: m.role === 'user' ? C.accent : C.card2, color: m.role === 'user' ? '#18181B' : C.text, borderRadius: m.role === 'user' ? '14px 14px 4px 14px' : '14px 14px 14px 4px', padding: '10px 14px', fontSize: 13, lineHeight: 1.5 }}>
                {m.content}
              </div>
            </div>
          ))}
          {loading && (
            <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
              <div style={{ background: C.card2, borderRadius: '14px 14px 14px 4px', padding: '12px 16px', display: 'flex', gap: 4 }}>
                {[0,1,2].map(i => <div key={i} style={{ width: 6, height: 6, borderRadius: '50%', background: C.muted }}/>)}
              </div>
            </div>
          )}
          <div ref={endRef}/>
        </div>
        <div style={{ padding: '12px 16px', borderTop: `1px solid ${C.border}`, display: 'flex', gap: 8 }}>
          <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && enviar()}
            placeholder="Pergunte algo sobre o treino..."
            style={{ flex: 1, background: C.card2, border: `1px solid ${C.border}`, borderRadius: 12, padding: '12px 14px', color: C.text, fontSize: 14, outline: 'none' }} />
          <button onClick={enviar} disabled={loading || !input.trim()}
            style={{ background: C.accent, border: 'none', borderRadius: 12, width: 46, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: loading || !input.trim() ? 0.5 : 1 }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#18181B" strokeWidth="2.5" strokeLinecap="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
          </button>
        </div>
      </div>
    </div>
  );
}
