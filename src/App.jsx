import { useState, useEffect, useCallback } from "react";
import logo from '../public/Rompiendo_barreras.jpeg'
import "./App.css";

// ─── DATA ────────────────────────────────────────────────────────────────────
const SOCIETIES = {
  SA: {
    name: "S.A.",
    full: "Sociedad Anónima",
    color: "#0396A6",
    traits: [
      "Puede cotizar en bolsa",
      "Sin límite de accionistas",
      "Capital dividido en acciones",
      "Transmisión de acciones libre",
      "Aportación mínima de 60,000 soles",
    ],
  },
  EIRL: {
    name: "E.I.R.L.",
    full: "Empresa Individual de Resp. Ltda.",
    color: "#2EA684",
    traits: [
      "Un solo titular",
      "Patrimonio personal separado",
      "Sin socios",
      "El dueño toma todas las decisiones",
      "Número mínimo de socios es 1",
    ],
  },
  SAC: {
    name: "S.A.C.",
    full: "Sociedad Anónima Cerrada",
    color: "#5ABF69",
    traits: [
      "2 a 20 socios",
      "Acciones no se venden al público",
      "Ideal para startups y pymes",
      "Transferencia de acciones restringida",
      "Tiene Directorio opcional",
    ],
  },
  SRL: {
    name: "S.R.L.",
    full: "Sociedad de Responsabilidad Ltda.",
    color: "#0AA6A6",
    traits: [
      "Socios con responsabilidad limitada al aporte",
      "Capital dividido en participaciones",
      "Ideal para negocios familiares",
      "2 a 20 socios máximo",
      "No puede cotizar en bolsa",
    ],
  },
};

// Chain: left=society shown, right=trait that belongs to NEXT society
const DOMINO_CHAIN = [
  { left: "SA",   right: "Un solo titular" },          // → EIRL
  { left: "EIRL", right: "2 a 20 socios" },            // → SAC
  { left: "SAC",  right: "Socios con responsabilidad limitada al aporte" }, // → SRL
  { left: "SRL",  right: "Puede cotizar en bolsa" },   // → SA
  { left: "SA",   right: "Capital dividido en participaciones" }, // → SRL
  { left: "SRL",  right: "Número mínimo de socios es 1" }, // → EIRL
  { left: "EIRL", right: "Transferencia de acciones restringida" }, // → SAC
  { left: "SAC",  right: "Sin límite de accionistas" }, // → SA
  { left: "SA",   right: "Ideal para negocios familiares" }, // → SRL
  { left: "SRL",  right: "Patrimonio personal separado" }, // → EIRL
];

// For each chain step, which society is the correct answer
const CORRECT_ANSWERS = ["EIRL","SAC","SRL","SA","SRL","EIRL","SAC","SA","SRL","EIRL"];

function getDistractors(correct) {
  return Object.keys(SOCIETIES).filter((k) => k !== correct);
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ─── COMPONENTS ─────────────────────────────────────────────────────────────

function DominoTile({ left, right, onClick, selected, correct, incorrect, disabled }) {
  const soc = SOCIETIES[left];
  return (
    <button
      className={`domino-tile ${selected ? "selected" : ""} ${correct ? "correct" : ""} ${incorrect ? "incorrect" : ""} ${disabled ? "disabled" : ""}`}
      onClick={onClick}
      disabled={disabled}
    >
      <div className="tile-left" style={{ background: soc.color }}>
        <span className="tile-society">{soc.name}</span>
      </div>
      <div className="tile-right">
        <span className="tile-trait">{right}</span>
      </div>
    </button>
  );
}

function ChainPreview({ placed }) {
  return (
    <div className="chain-preview">
      {placed.map((step, i) => {
        const soc = SOCIETIES[step.left];
        return (
          <div key={i} className="chain-item">
            <div className="chain-pill" style={{ borderColor: soc.color }}>
              <span style={{ color: soc.color }}>{soc.name}</span>
              <span className="chain-sep">|</span>
              <span>{step.right}</span>
            </div>
            {i < placed.length - 1 && <div className="chain-arrow">→</div>}
          </div>
        );
      })}
    </div>
  );
}

function GlossaryCard({ society }) {
  const s = SOCIETIES[society];
  return (
    <div className="glossary-card" style={{ borderColor: s.color }}>
      <div className="glossary-badge" style={{ background: s.color }}>
        {s.name}
      </div>
      <p className="glossary-full">{s.full}</p>
      <ul>
        {s.traits.map((t, i) => (
          <li key={i}>{t}</li>
        ))}
      </ul>
    </div>
  );
}

// ─── MAIN GAME ────────────────────────────────────────────────────────────────

export default function App() {
  const [step, setStep] = useState(0);          // 0-9 = game steps
  const [placed, setPlaced] = useState([]);
  const [hand, setHand] = useState([]);
  const [selected, setSelected] = useState(null);
  const [feedback, setFeedback] = useState(null); // null | 'correct' | 'incorrect'
  const [feedbackMsg, setFeedbackMsg] = useState("");
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);

  const buildHand = useCallback((stepIdx) => {
    const correct = CORRECT_ANSWERS[stepIdx];
    const distractors = shuffle(getDistractors(correct));
    // Build 4 tiles: each shows a society on left + one of its traits on right
    const tiles = shuffle([correct, ...distractors.slice(0, 3)]).map((socKey) => ({
      id: socKey,
      left: socKey,
      right: SOCIETIES[socKey].traits[Math.floor(Math.random() * SOCIETIES[socKey].traits.length)],
    }));
    return tiles;
  }, []);

  useEffect(() => {
    setHand(buildHand(0));
  }, [buildHand]);

  const handleSelect = (tile) => {
    if (feedback === "correct" || gameOver) return;
    setSelected(tile.id);
  };

  const handlePlace = () => {
    if (!selected) return;
    const correct = CORRECT_ANSWERS[step];
    const isCorrect = selected === correct;
    setAttempts((a) => a + 1);

    if (isCorrect) {
      const newPlaced = [...placed, DOMINO_CHAIN[step]];
      setPlaced(newPlaced);
      setScore((s) => s + 1);
      setFeedback("correct");
      setFeedbackMsg(`¡Correcto! La ${SOCIETIES[correct].full} cumple esa característica.`);

      setTimeout(() => {
        const nextStep = step + 1;
        if (nextStep >= DOMINO_CHAIN.length) {
          setGameOver(true);
        } else {
          setStep(nextStep);
          setHand(buildHand(nextStep));
          setSelected(null);
          setFeedback(null);
          setFeedbackMsg("");
        }
      }, 1400);
    } else {
      setFeedback("incorrect");
      const wrongSoc = SOCIETIES[selected];
      const correctSoc = SOCIETIES[correct];
      setFeedbackMsg(
        `La ${wrongSoc.full} no corresponde aquí. La característica pertenece a la ${correctSoc.full}.`
      );
      setTimeout(() => {
        setSelected(null);
        setFeedback(null);
        setFeedbackMsg("");
      }, 2200);
    }
  };

  const handleReset = () => {
    setStep(0);
    setPlaced([]);
    setHand(buildHand(0));
    setSelected(null);
    setFeedback(null);
    setFeedbackMsg("");
    setGameOver(false);
    setScore(0);
    setAttempts(0);
  };

  const currentCard = DOMINO_CHAIN[step];

  return (
    <div className="app">
      {/* Header */}
      <header className="header">
        <div className="logo-area">
          <img
          src={logo}
          alt="FundEdu"
          style={{ height: "48px", objectFit: "contain" }}/>
          <div>
            <span className="logo-text">FundEdu</span>
            <span className="logo-tagline">Forma tu futuro con fuerza financiera</span>
          </div>
        </div>
        <div className="header-right">
          <div className="progress-badge">
            <span className="progress-num">{score}</span>
            <span className="progress-sep">/</span>
            <span>10</span>
          </div>
          <button className="btn-reset" onClick={handleReset} title="Reiniciar">
            ↺ Reiniciar
          </button>
        </div>
      </header>

      {!gameOver ? (
        <main className="game-area">
          {/* Progress bar */}
          <div className="progress-bar-wrap">
            <div className="progress-bar-track">
              <div
                className="progress-bar-fill"
                style={{ width: `${(score / 10) * 100}%` }}
              />
            </div>
            <span className="progress-label">{score} de 10 fichas correctas</span>
          </div>

          {/* Board tile */}
          <section className="board-section">
            <p className="section-label">FICHA EN EL TABLERO</p>
            <div className="board-tile">
              <div
                className="board-left"
                style={{ background: SOCIETIES[currentCard.left].color }}
              >
                <span className="board-society">{SOCIETIES[currentCard.left].name}</span>
                <span className="board-full">{SOCIETIES[currentCard.left].full}</span>
              </div>
              <div className="board-right">
                <div className="board-question">¿Qué sociedad tiene esta característica?</div>
                <div className="board-trait">{currentCard.right}</div>
              </div>
            </div>
          </section>

          {/* Hand */}
          <section className="hand-section">
            <p className="section-label">TU MANO — Elige la ficha correcta</p>
            <div className="hand-grid">
              {hand.map((tile) => (
                <DominoTile
                  key={tile.id}
                  left={tile.left}
                  right={tile.right}
                  onClick={() => handleSelect(tile)}
                  selected={selected === tile.id}
                  correct={feedback === "correct" && selected === tile.id}
                  incorrect={feedback === "incorrect" && selected === tile.id}
                  disabled={feedback === "correct"}
                />
              ))}
            </div>
          </section>

          {/* Place button */}
          <div className="action-row">
            <button
              className={`btn-place ${selected ? "active" : ""}`}
              onClick={handlePlace}
              disabled={!selected || feedback === "correct"}
            >
              Colocar ficha →
            </button>
          </div>

          {/* Feedback */}
          {feedbackMsg && (
            <div className={`feedback-banner ${feedback}`}>
              <span className="feedback-icon">{feedback === "correct" ? "✓" : "✗"}</span>
              {feedbackMsg}
            </div>
          )}

          {/* Chain preview */}
          {placed.length > 0 && (
            <section className="chain-section">
              <p className="section-label">CADENA CONSTRUIDA</p>
              <ChainPreview placed={placed} />
            </section>
          )}
        </main>
      ) : (
        /* Victory screen */
        <main className="victory-screen">
          <div className="victory-hero">
            <div className="victory-trophy">🏆</div>
            <h1 className="victory-title">¡Dominó completado!</h1>
            <p className="victory-sub">
              Completaste 10 conexiones correctas en {attempts} intentos
            </p>
            <div className="victory-stats">
              <div className="vstat">
                <span className="vstat-val">{score}</span>
                <span className="vstat-lbl">Fichas correctas</span>
              </div>
              <div className="vstat">
                <span className="vstat-val">{attempts - score}</span>
                <span className="vstat-lbl">Errores</span>
              </div>
              <div className="vstat">
                <span className="vstat-val">{Math.round((score / attempts) * 100)}%</span>
                <span className="vstat-lbl">Precisión</span>
              </div>
            </div>
            <button className="btn-play-again" onClick={handleReset}>
              Jugar de nuevo
            </button>
          </div>

          <div className="glossary-section">
            <p className="section-label" style={{ textAlign: "center", marginBottom: "1.25rem" }}>
              GLOSARIO — LAS 4 SOCIEDADES
            </p>
            <div className="glossary-grid">
              {Object.keys(SOCIETIES).map((key) => (
                <GlossaryCard key={key} society={key} />
              ))}
            </div>
          </div>
        </main>
      )}

      <footer className="footer">
        <span>© 2026 FundEdu - EconoSublime · Derecho Empresarial</span>
      </footer>
    </div>
  );
}