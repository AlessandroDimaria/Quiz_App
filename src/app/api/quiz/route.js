import { NextResponse } from "next/server";

// ✅ Decodifica entità HTML
function decodeHTML(html) {
  return html
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

// ✅ Shuffle
function shuffle(arr) {
  return arr.sort(() => Math.random() - 0.5);
}

export async function GET() {
  try {
    // 1. Ottieni token
    const tokenRes = await fetch("https://opentdb.com/api_token.php?command=request");
    const tokenData = await tokenRes.json();
    const token = tokenData.token;

    // 2. Richiedi domande
    const res = await fetch(
      `https://opentdb.com/api.php?amount=5&type=multiple&token=${token}`
    );

    const data = await res.json();

    if (!data.results) {
      console.error("OpenTDB non ha restituito results:", data);
      return NextResponse.json([], { status: 200 });
    }

    // 3. Formattazione lato server
    const formatted = data.results.map((q) => {
      const question = decodeHTML(q.question);
      const correct = decodeHTML(q.correct_answer);
      const incorrect = q.incorrect_answers.map((a) => decodeHTML(a));

      return {
        question,
        answers: shuffle([correct, ...incorrect]),
        correct,
      };
    });

    return NextResponse.json(formatted);

  } catch (err) {
    console.error("Errore server:", err);
    return NextResponse.json([], { status: 200 }); // ✅ mai 500
  }
}