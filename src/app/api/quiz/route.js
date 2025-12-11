export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category") || 9; // default

  const apiUrl = `https://opentdb.com/api.php?amount=10&category=${category}&type=multiple`;

  const res = await fetch(apiUrl);
  const data = await res.json();

  // Convertiamo il formato OpenTDB nel tuo formato
  const questions = data.results.map((q) => ({
    question: q.question,
    correct: q.correct_answer,
    answers: shuffle([q.correct_answer, ...q.incorrect_answers]),
  }));

  return Response.json(questions);
}

// Funzione per mischiare le risposte
function shuffle(arr) {
  return arr.sort(() => Math.random() - 0.5);
}