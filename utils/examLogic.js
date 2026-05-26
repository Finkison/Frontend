export function getUnitExamQuestions(questions, subject, grade, unit) {
  return questions.filter((q) => q.subject === subject && q.grade === grade && q.unit === unit).slice(0, 25);
}

export function getMidExamQuestions(questions, subject, grade) {
  return questions.filter((q) => q.subject === subject && q.grade === grade && q.unit >= 1 && q.unit <= 4).slice(0, 40);
}

export function getFinalExamQuestions(questions, subject, grade) {
  return questions.filter((q) => q.subject === subject && q.grade === grade).slice(0, 60);
}

export function getModelExamQuestions(questions, targetGrade, stream) {
  return questions.filter((q) => q.grade >= 9 && q.grade <= targetGrade && (q.stream === stream || q.stream === "common")).slice(0, 80);
}
