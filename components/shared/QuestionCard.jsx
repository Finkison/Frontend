export default function QuestionCard({q}){ return <div className="card">{q?.question_text_en || "Question"}</div>; }
