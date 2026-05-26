export default function AnswerOption({label,text,onClick}){ return <button className="btn ghost" onClick={onClick}>{label}. {text}</button>; }
