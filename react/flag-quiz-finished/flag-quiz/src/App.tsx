import "./App.css";
import { useQuery } from "@tanstack/react-query";
import { GetAllCountries, type Country } from "./api/countryApi";
import { useEffect, useState } from "react";

type Question = {
  options: Country[];
  answer: Country;
  correct: boolean;
};

type GameState = "initial" | "started" | "showinganswer" | "ended";

function App() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<number>(0);
  const [questionCount, setQuestionCount] = useState<number>(10);
  const [gameState, setGameState] = useState<GameState>("initial");
  const countriesQuery = useQuery({
    queryKey: ["countries"],
    queryFn: GetAllCountries,
  });

  function initGame() {
    const questionsForGame = getQuestions(questionCount, countriesQuery.data!);
    setQuestions(questionsForGame);
    setCurrentQuestion(0);
    setGameState("started");
  }

  function answer(answerId: string) {
    setQuestions(
      questions.map((x) =>
        x === questions[currentQuestion]
          ? { ...x, correct: x.answer.id == answerId }
          : x
      )
    );

    if (currentQuestion === questionCount - 1) {
      setGameState("ended");
    } else setGameState("showinganswer");
  }

  useEffect(() => {
    if (gameState === "showinganswer") {
      const timeout = setTimeout(() => {
        setGameState("started");
        setCurrentQuestion((x) => x + 1);
      }, 1000);

      return () => {
        clearTimeout(timeout);
      };
    }
  }, [gameState]);

  const numCorrect = questions.filter((x) => x.correct).length;

  return (
    <div className="my-5 mx-20">
      <div className="flex flex-col items-center">
        {countriesQuery.isLoading && <p>Loading...</p>}
        {countriesQuery.isSuccess && gameState === "initial" && (
          <button
            onClick={initGame}
            type="button"
            className="text-xl m-2 p-2 grow cursor-pointer bg-gray-800 rounded border border-gray-600"
          >
            Start Game
          </button>
        )}
        {gameState === "started" && (
          <>
            <h1>
              Question {currentQuestion} of {questionCount}
            </h1>
            <h2 className="text-green-500">{numCorrect} correct</h2>
            <img src={questions[currentQuestion].answer.flagUrl} />
            <div className="flex">
              {questions[currentQuestion].options.map((x) => (
                <button
                  onClick={() => answer(x.id)}
                  key={x.id}
                  className="m-2 p-2 grow cursor-pointer bg-gray-800 rounded border border-gray-600"
                >
                  {x.name}
                </button>
              ))}
            </div>
          </>
        )}

        {gameState === "showinganswer" &&
          questions[currentQuestion].correct && (
            <p className="text-green-500 text-3xl">Correct 🎉</p>
          )}

        {gameState === "showinganswer" &&
          !questions[currentQuestion].correct && (
            <p className="text-red-500 text-3xl">
              😭 it was {questions[currentQuestion].answer.name}
            </p>
          )}
        {gameState === "ended" && (
          <div className="flex flex-col items-center">
            <h1>Game Over!</h1>
            <p>You got {numCorrect} correct!</p>
            <div>
              {questions.map((x) => (
                <div
                  key={crypto.randomUUID()}
                  className="flex justify-start border m-2 rounded border-gray-600"
                >
                  <span className="m-2">{x.correct ? "✅" : "🚫"}</span>
                  <img src={x.answer.flagUrl} className="h-[30px] m-2" />
                  <span className="m-2">{x.answer.name}</span>
                </div>
              ))}
            </div>
            <button onClick={initGame}>Play again</button>
          </div>
        )}
      </div>
    </div>
  );
}

function getQuestions(count: number, allCountries: Country[]) {
  const questions = [];

  for (let i = 0; i < count; i++) {
    const random4 = allCountries
      .sort((a, b) => (crypto.randomUUID() > crypto.randomUUID() ? 1 : -1))
      .slice(0, 4);

    const question = {
      options: random4,
      answer: random4.at(Math.random() * 4)!,
      correct: false,
    } satisfies Question;
    questions.push(question);
  }

  return questions;
}

export default App;
