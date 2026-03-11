import { useState } from "react";

const blocks = [
  {
    id: "entrenamiento",
    title: "Bloque 1 — Entrenamiento",
    color: "#FF7A59",
    items: [
      "Las fuentes de entrenamiento están actualizadas (menos de 90 días desde la última revisión).",
      "El contenido de entrenamiento está limpio y estructurado — sin ruido técnico ni información contradictoria.",
      "El agente tiene instrucciones explícitas de voz de marca: tono, personalidad y límites de expresión.",
      "El alcance del agente está definido con claridad — sabe qué debe responder y qué no.",
      "Las instrucciones del agente no se contradicen entre sí.",
    ],
  },
  {
    id: "supervision",
    title: "Bloque 2 — Supervisión",
    color: "#00BDA5",
    items: [
      "Existe un proceso de revisión periódica de métricas (CSAT, tasa de resolución, escaladas).",
      "El equipo lee CSAT y tasa de resolución en conjunto, no de forma aislada.",
      "Los knowledge gaps del agente se registran y se revisan con regularidad.",
      "Existe un sistema de escalada configurado correctamente.",
      "Alguien en el equipo es el responsable designado de supervisar el desempeño del agente.",
    ],
  },
  {
    id: "autonomia",
    title: "Bloque 3 — Autonomía",
    color: "#516F90",
    items: [
      "La autonomía del agente se otorgó de forma gradual, basada en evidencia de desempeño.",
      "Existen límites explícitos sobre los temas que el agente no debe tratar.",
      "El agente fue testeado en los canales donde opera antes de ser desplegado.",
      "Las decisiones del agente son auditables.",
    ],
  },
  {
    id: "ciclo",
    title: "Bloque 4 — Ciclo de mejora",
    color: "#F5C26B",
    items: [
      "El equipo tiene una cadencia definida para revisar métricas y actualizar el entrenamiento.",
      "Los knowledge gaps identificados se convierten en ajustes concretos al entrenamiento.",
      "Los ajustes al entrenamiento se testean antes de volver a producción.",
      "El tiempo liberado por el agente se redistribuye parcialmente a su gestión.",
    ],
  },
];

const STATUS = { YES: "yes", NO: "no", UNKNOWN: "unknown" };

export default function App() {
  const [answers, setAnswers] = useState({});
  const [phase, setPhase] = useState("intro");
  const [actions, setActions] = useState([
    { brecha: "", accion: "", responsable: "", fecha: "" },
    { brecha: "", accion: "", responsable: "", fecha: "" },
    { brecha: "", accion: "", responsable: "", fecha: "" },
  ]);
  const [reviewDate, setReviewDate] = useState("");
  const [done, setDone] = useState(false);

  const setAnswer = (blockId, idx, val) => {
    setAnswers(prev => ({ ...prev, [`${blockId}-${idx}`]: val }));
  };

  const getAnswer = (blockId, idx) => answers[`${blockId}-${idx}`] || null;

  const totalItems = blocks.reduce((s, b) => s + b.items.length, 0);
  const answered = Object.keys(answers).length;
  const yesCount = Object.values(answers).filter(v => v === STATUS.YES).length;
  const noCount = Object.values(answers).filter(v => v === STATUS.NO).length;
  const unknownCount = Object.values(answers).filter(v => v === STATUS.UNKNOWN).length;
  const score = answered > 0 ? Math.round((yesCount / totalItems) * 100) : 0;
  const scoreColor = score >= 75 ? "#00BDA5" : score >= 50 ? "#F5C26B" : "#FF7A59";
  const scoreLabel = score >= 75 ? "Gestión sólida" : score >= 50 ? "Gestión en desarrollo" : "Gestión crítica";

  const gaps = [];
  blocks.forEach(b => {
    b.items.forEach((item, idx) => {
      const a = getAnswer(b.id, idx);
      if (a === STATUS.NO || a === STATUS.UNKNOWN) gaps.push({ block: b.title, item });
    });
  });

  const updateAction = (i, field, val) => {
    setActions(prev => prev.map((a, idx) => idx === i ? { ...a, [field]: val } : a));
  };

  const canComplete = actions[0].brecha && actions[0].accion;

  if (done) {
    return (
      <div style={{ fontFamily: "'Inter', sans-serif", minHeight: "100vh", background: "#F5F8FA", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
        <div style={{ maxWidth: 560, width: "100%", background: "white", borderRadius: 16, padding: 40, textAlign: "center", boxShadow: "0 4px 24px rgba(0,0,0,0.08)" }}>
          <div style={{ fontSize: 56, marginBottom: 16 }}>🎉</div>
          <h2 style={{ color: "#00BDA5", margin: "0 0 12px", fontSize: 24 }}>¡Ejercicio completado!</h2>
          <p style={{ color: "#516F90", lineHeight: 1.7, margin: "0 0 24px", fontSize: 15 }}>
            Completaste el diagnóstico de gestión de tu agente y definiste un plan de acción concreto. Recuerda: la gestión de un agente no es un evento — es un ciclo. Vuelve a este checklist en tu próxima revisión y observa cómo evoluciona el estado de tu agente con el tiempo.
          </p>
          <div style={{ background: "#F0FDF4", borderRadius: 10, padding: "16px 20px", marginBottom: 24 }}>
            <div style={{ fontSize: 32, fontWeight: 800, color: scoreColor }}>{score}%</div>
            <div style={{ fontSize: 14, fontWeight: 600, color: scoreColor }}>{scoreLabel}</div>
            <div style={{ fontSize: 13, color: "#516F90", marginTop: 4 }}>{yesCount} de {totalItems} ítems cubiertos</div>
          </div>
          <button onClick={() => { setDone(false); setPhase("intro"); setAnswers({}); setActions([{ brecha: "", accion: "", responsable: "", fecha: "" }, { brecha: "", accion: "", responsable: "", fecha: "" }, { brecha: "", accion: "", responsable: "", fecha: "" }]); setReviewDate(""); }}
            style={{ background: "#FF7A59", color: "white", border: "none", borderRadius: 8, padding: "12px 28px", fontWeight: 700, fontSize: 14, cursor: "pointer" }}>
            Hacer otra evaluación
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ fontFamily: "'Inter', sans-serif", minHeight: "100vh", background: "#F5F8FA" }}>
      <div style={{ background: "white", borderBottom: "1px solid #DFE3EB", padding: "16px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ background: "#FF7A59", borderRadius: 6, padding: "4px 10px" }}>
            <span style={{ color: "white", fontWeight: 700, fontSize: 11, letterSpacing: 0.5 }}>HUBSPOT ACADEMY</span>
          </div>
          <span style={{ fontWeight: 700, fontSize: 15, color: "#1C3A56" }}>Diagnóstico de gestión de agentes de IA</span>
        </div>
        {answered > 0 && (
          <div style={{ fontSize: 13, color: "#516F90" }}>{answered}/{totalItems} respondidos</div>
        )}
      </div>

      <div style={{ maxWidth: 720, margin: "0 auto", padding: "24px 16px" }}>

        {phase === "intro" && (
          <div style={{ background: "white", borderRadius: 14, padding: 36, boxShadow: "0 2px 12px rgba(0,0,0,0.06)", textAlign: "center" }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🤖</div>
            <h1 style={{ fontSize: 22, fontWeight: 800, color: "#1C3A56", margin: "0 0 12px" }}>
              Checklist de gestión de agentes de IA
            </h1>
            <p style={{ color: "#516F90", lineHeight: 1.7, margin: "0 0 28px", fontSize: 15, maxWidth: 480, marginLeft: "auto", marginRight: "auto" }}>
              Evalúa el estado de gestión de un agente activo en tu organización. Al finalizar, obtendrás un diagnóstico y un plan de acción con tus prioridades más urgentes.
            </p>
            <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap", marginBottom: 32 }}>
              {[
                { icon: "📋", text: "18 ítems en 4 bloques" },
                { icon: "⏱", text: "20–30 minutos" },
                { icon: "🎯", text: "Plan de acción personalizado" },
              ].map(f => (
                <div key={f.text} style={{ background: "#F5F8FA", borderRadius: 8, padding: "8px 14px", fontSize: 13, color: "#516F90", display: "flex", alignItems: "center", gap: 6 }}>
                  <span>{f.icon}</span><span>{f.text}</span>
                </div>
              ))}
            </div>
            <button onClick={() => setPhase("checklist")}
              style={{ background: "#FF7A59", color: "white", border: "none", borderRadius: 8, padding: "14px 36px", fontWeight: 700, fontSize: 15, cursor: "pointer", boxShadow: "0 2px 8px rgba(255,122,89,0.3)" }}>
              Comenzar diagnóstico →
            </button>
          </div>
        )}

        {phase === "checklist" && (
          <>
            <div style={{ background: "white", borderRadius: 10, padding: "14px 18px", marginBottom: 20, boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <span style={{ fontSize: 13, color: "#516F90" }}>Progreso del diagnóstico</span>
                <span style={{ fontSize: 13, fontWeight: 600, color: "#33475B" }}>{Math.round((answered / totalItems) * 100)}%</span>
              </div>
              <div style={{ background: "#DFE3EB", borderRadius: 99, height: 8 }}>
                <div style={{ background: "#FF7A59", borderRadius: 99, height: 8, width: `${(answered / totalItems) * 100}%`, transition: "width 0.3s" }} />
              </div>
            </div>

            {blocks.map(block => (
              <div key={block.id} style={{ background: "white", borderRadius: 12, marginBottom: 20, overflow: "hidden", boxShadow: "0 1px 6px rgba(0,0,0,0.06)" }}>
                <div style={{ background: block.color, padding: "12px 20px" }}>
                  <span style={{ color: "white", fontWeight: 700, fontSize: 14 }}>{block.title}</span>
                </div>
                {block.items.map((item, idx) => {
                  const ans = getAnswer(block.id, idx);
                  return (
                    <div key={idx} style={{ padding: "14px 20px", borderBottom: idx < block.items.length - 1 ? "1px solid #F5F8FA" : "none", display: "flex", alignItems: "flex-start", gap: 14,
                      background: ans === STATUS.YES ? "#F0FDF4" : ans === STATUS.NO ? "#FFF5F2" : ans === STATUS.UNKNOWN ? "#F8F9FA" : "white", transition: "background 0.2s" }}>
                      <div style={{ flex: 1, fontSize: 14, lineHeight: 1.6, paddingTop: 4, color: "#33475B" }}>{item}</div>
                      <div style={{ display: "flex", gap: 6, flexShrink: 0, flexWrap: "wrap", justifyContent: "flex-end" }}>
                        {[
                          { val: STATUS.YES, label: "Sí", activeColor: "#00BDA5" },
                          { val: STATUS.NO, label: "No", activeColor: "#FF7A59" },
                          { val: STATUS.UNKNOWN, label: "No sé", activeColor: "#516F90" },
                        ].map(opt => (
                          <button key={opt.val} onClick={() => setAnswer(block.id, idx, opt.val)}
                            style={{ padding: "5px 12px", borderRadius: 6, cursor: "pointer", fontSize: 12, fontWeight: 600, transition: "all 0.15s",
                              border: `1.5px solid ${ans === opt.val ? opt.activeColor : "#DFE3EB"}`,
                              background: ans === opt.val ? opt.activeColor : "white",
                              color: ans === opt.val ? "white" : "#516F90" }}>
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}

            {answered === totalItems && (
              <div style={{ background: "white", borderRadius: 12, padding: 24, boxShadow: "0 2px 12px rgba(0,0,0,0.08)", marginBottom: 20 }}>
                <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
                  {[
                    { label: "Cubierto", val: yesCount, color: "#00BDA5", icon: "✅" },
                    { label: "Brecha", val: noCount, color: "#FF7A59", icon: "❌" },
                    { label: "Por definir", val: unknownCount, color: "#516F90", icon: "❓" },
                  ].map(s => (
                    <div key={s.label} style={{ flex: 1, background: "#F5F8FA", borderRadius: 10, padding: "14px 12px", textAlign: "center" }}>
                      <div style={{ fontSize: 22, marginBottom: 2 }}>{s.icon}</div>
                      <div style={{ fontSize: 22, fontWeight: 800, color: s.color }}>{s.val}</div>
                      <div style={{ fontSize: 11, color: "#516F90", fontWeight: 600 }}>{s.label}</div>
                    </div>
                  ))}
                </div>
                <div style={{ textAlign: "center", marginBottom: 16 }}>
                  <div style={{ fontSize: 36, fontWeight: 800, color: scoreColor }}>{score}%</div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: scoreColor }}>{scoreLabel}</div>
                </div>
                <button onClick={() => setPhase("plan")}
                  style={{ width: "100%", padding: "13px", background: "#FF7A59", color: "white", border: "none", borderRadius: 8, fontWeight: 700, fontSize: 15, cursor: "pointer" }}>
                  Ver mis brechas y crear plan de acción →
                </button>
              </div>
            )}
          </>
        )}

        {phase === "plan" && (
          <>
            {gaps.length > 0 && (
              <div style={{ background: "white", borderRadius: 12, padding: 20, marginBottom: 20, boxShadow: "0 1px 6px rgba(0,0,0,0.06)" }}>
                <div style={{ fontWeight: 700, fontSize: 15, color: "#1C3A56", marginBottom: 4 }}>Brechas identificadas</div>
                <div style={{ fontSize: 13, color: "#516F90", marginBottom: 14 }}>
                  Respondiste "No" o "No sé" en {gaps.length} {gaps.length === 1 ? "ítem" : "ítems"}. Selecciona los tres más críticos para tu plan.
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {gaps.map((g, i) => (
                    <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", padding: "8px 12px", background: "#FFF5F2", borderRadius: 7, fontSize: 13, color: "#33475B" }}>
                      <span style={{ color: "#FF7A59", fontWeight: 700, flexShrink: 0 }}>→</span>
                      <span>{g.item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div style={{ fontWeight: 700, fontSize: 16, color: "#1C3A56", marginBottom: 16 }}>Define tu plan de acción</div>

            {actions.map((action, i) => (
              <div key={i} style={{ background: "white", border: i === 0 ? "2px solid #FF7A59" : "1px solid #DFE3EB", borderRadius: 12, padding: 20, marginBottom: 16, boxShadow: "0 1px 6px rgba(0,0,0,0.05)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
                  <div style={{ background: i === 0 ? "#FF7A59" : "#DFE3EB", color: i === 0 ? "white" : "#516F90", borderRadius: "50%", width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 13 }}>{i + 1}</div>
                  <span style={{ fontWeight: 700, fontSize: 14, color: i === 0 ? "#FF7A59" : "#516F90" }}>
                    {i === 0 ? "Prioridad crítica" : i === 1 ? "Segunda prioridad" : "Tercera prioridad"}
                  </span>
                </div>
                {[
                  { field: "brecha", label: "Brecha a resolver", placeholder: "¿Qué área de gestión necesita atención urgente?" },
                  { field: "accion", label: "Acción concreta", placeholder: "¿Qué vas a hacer específicamente para cerrarla?" },
                  { field: "responsable", label: "Responsable", placeholder: "¿Quién lo ejecuta?" },
                  { field: "fecha", label: "Fecha límite", placeholder: "¿Para cuándo?" },
                ].map(f => (
                  <div key={f.field} style={{ marginBottom: 10 }}>
                    <label style={{ fontSize: 12, fontWeight: 600, color: "#516F90", display: "block", marginBottom: 4 }}>{f.label}{i === 0 && (f.field === "brecha" || f.field === "accion") ? " *" : ""}</label>
                    <input value={action[f.field]} onChange={e => updateAction(i, f.field, e.target.value)}
                      placeholder={f.placeholder}
                      style={{ width: "100%", padding: "9px 12px", border: "1px solid #DFE3EB", borderRadius: 7, fontSize: 13, color: "#33475B", boxSizing: "border-box", outline: "none" }} />
                  </div>
                ))}
              </div>
            ))}

            <div style={{ background: "white", borderRadius: 12, padding: 20, marginBottom: 24, boxShadow: "0 1px 6px rgba(0,0,0,0.05)" }}>
              <label style={{ fontSize: 13, fontWeight: 700, color: "#1C3A56", display: "block", marginBottom: 8 }}>
                📅 Fecha de próxima revisión del agente
              </label>
              <input type="date" value={reviewDate} onChange={e => setReviewDate(e.target.value)}
                style={{ padding: "9px 12px", border: "1px solid #DFE3EB", borderRadius: 7, fontSize: 13, color: "#33475B" }} />
            </div>

            <button onClick={() => setDone(true)} disabled={!canComplete}
              style={{ width: "100%", padding: "14px", background: canComplete ? "#00BDA5" : "#DFE3EB",
                color: canComplete ? "white" : "#516F90", border: "none", borderRadius: 8,
                fontWeight: 700, fontSize: 15, cursor: canComplete ? "pointer" : "not-allowed",
                boxShadow: canComplete ? "0 2px 8px rgba(0,189,165,0.3)" : "none" }}>
              {canComplete ? "Completar ejercicio ✓" : "Completa al menos la prioridad 1 para continuar"}
            </button>

            <button onClick={() => setPhase("checklist")}
              style={{ width: "100%", marginTop: 10, padding: "10px", background: "transparent", color: "#516F90", border: "1px solid #DFE3EB", borderRadius: 8, fontWeight: 600, fontSize: 13, cursor: "pointer" }}>
              ← Volver al diagnóstico
            </button>
          </>
        )}
      </div>
    </div>
  );
}
