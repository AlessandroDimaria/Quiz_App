export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category") || 9;

  const apiUrl = `https://opentdb.com/api.php?amount=10&category=${category}&type=multiple`;

  // Prova finché non ottiene results validi, max 5 tentativi
  const data = await fetchQuestionsWithRetry(apiUrl, 5);

  if (!data) {
    return Response.json(
      { error: "Impossibile ottenere domande dal servizio esterno" },
      { status: 500 }
    );
  }

  const questions = data.results.map((q) => ({
    question: q.question,
    correct: q.correct_answer,
    answers: shuffle([q.correct_answer, ...q.incorrect_answers]),
  }));

  return Response.json(questions);
}

async function fetchQuestionsWithRetry(url, maxTries = 5) {
  for (let i = 0; i < maxTries; i++) {
    try {
      const res = await fetch(url);

      if (!res.ok) throw new Error("Bad response: " + res.status);

      const text = await res.text();

      let data;
      try {
        data = JSON.parse(text);
      } catch {
        throw new Error("Invalid JSON");
      }

      // Controllo che OpenTDB abbia davvero mandato domande
      if (
        data &&
        data.response_code === 0 &&
        Array.isArray(data.results) &&
        data.results.length > 0
      ) {
        return data;
      } else {
        console.error(
          `Tentativo ${i + 1}: formato valido ma senza domande (response_code: ${data.response_code}, results: ${data.results?.length})`
        );
      }
    } catch (err) {
      console.error(`Tentativo ${i + 1} fallito:`, err.message);
    }

    // se non è l'ultimo tentativo, aspetto e riprovo
    if (i < maxTries - 1) {
      await new Promise((r) => setTimeout(r, 300 * 2 ** i)); // 300, 600, 1200, ...
    }
  }

  // dopo maxTries, rinuncio
  return null;
}

function shuffle(arr) {
  return arr.sort(() => Math.random() - 0.5);
}