# Build Together!

## Getting set up

1. npm create vite@latest
2. Tailwind

   ```
   npm install tailwindcss @tailwindcss/vite
   ```

   ```typescript
   import { defineConfig } from "vite";
   import tailwindcss from "@tailwindcss/vite";

   export default defineConfig({
     plugins: [tailwindcss()],
   });
   ```

3. Feel free to delete a bunch of CSS
4. Prettier + Format on Save

## Set up our API calls for data

1.  Declare a type for country
    ```typescript
    export type Country = {
      id: string;
      name: string;
      flagUrl: string;
    };
    ```
2.  Create a function for getting all the countries called "GetAllCountries"

    ```typescript
    export async function GetAllCountries(): Promise<Country[]> {
      const response = await fetch(
        `https://restcountries.com/v3.1/all?fields=name,population,region,capital,flags,cioc`
      );
      const countriesResult = await response.json();
      const result = countriesResult
        .filter((x: any) => x.cioc !== undefined && x.cioc !== "")
        .map(
          (x: any) =>
            ({
              id: x.cioc,
              name: x.name.common,
              flagUrl: x.flags.png,
            } satisfies Country)
        );
      return result;
    }
    ```

3.  Set up Tanstack Query (you can also use a useEffect)

    ```
        npm i @tanstack/react-query
    ```

    in our main.tsx

    ```typescript
    import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

    const queryClient = new QueryClient();
    createRoot(document.getElementById("root")!).render(
      <StrictMode>
        <QueryClientProvider client={queryClient}>
          <App />
        </QueryClientProvider>
      </StrictMode>
    );
    ```

    Handles so many problems associated with calling an API, including error states, retries, caching.

4.  Add a query to App.tsx

    ```typescript
    const countriesQuery = useQuery({
      queryKey: ["countries"],
      queryFn: GetAllCountries,
    });
    ```

    ```html
    <div>{JSON.stringify(countriesQuery.data)}</div>
    ```

5.  Add game states

    ```typescript
    type GameState = "initial" | "started" | "showinganswer" | "ended";
    ```

    ```typescript
    const [gameState, setGameState] = useState<GameState>("initial");
    ```

6.  For debugging purposes, let's display the game state

    ```html
    <div>Game State: {gameState}</div>
    ```

7.  Add a "Start Game" button

    ```html
    <button onClick="{initGame}" type="button">Start Game</button>
    ```

    and add an initGame function

    ```typescript
    function initGame() {
      setGameState("started");
    }
    ```

8.  Only display the button when game state is "initial"

    ```typescript
    {
      gameState === "initial" && <button></button>;
    }
    ```

9.  Once the game is started, we'll need to have some questions to display. Here is some pre-generated logic to get a list of questions from the countries query above.

    ```typescript
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
    ```

10. Create a type for Question

    ```typescript
    type Question = {
      options: Country[];
      answer: Country;
      correct: boolean;
    };
    ```

11. Create a state variable for our questions

    ```typescript
    const [questions, setQuestions] = useState<Question[]>([]);
    ```

12. Show our question state variable for debugging purposes

    ```html
    <div>{JSON.stringify(questions)}</div>
    ```

13. Populate our list of questions when "Start Game" is clicked

    ```typescript
    const questionsForGame = getQuestions(4, countriesQuery.data!);
    setQuestions(questionsForGame);
    ```

    and maybe let's add a const for that question count

    ```typescript
    const QUESTION_COUNT = 4;
    ```

14. Add state for current question

    ```typescript
    const [currentQuestion, setCurrentQuestion] = useState<number>(0);
    ```

    reset current question to 0 on init game

    ```typescript
    setCurrentQuestion(0);
    ```

15. Add display for question
    ```html
    {gameState === "started" && (
    <div>
      <img src="{questions[currentQuestion].answer.flagUrl}" />
      <div className="flex">
        {questions[currentQuestion].options.map((x) => (
        <button key="{x.id}">{x.name}</button>
        ))}
      </div>
    </div>
    )}
    ```
16. When answer is selected, move to next question

    ```typescript
    function answer(answerId: string) {
      setCurrentQuestion((x) => x + 1);
    }
    ```

    ```html
    <button key={x.id} onClick={() => answer(x.id)}>
    ```

17. Add logic for game ended. When answering and question is last question.

    ```typescript
    if (currentQuestion === QUESTION_COUNT - 1) {
      setGameState("ended");
    } else setCurrentQuestion((x) => x + 1);
    ```

18. Set state for questions' answered status

    ```typescript
    setQuestions(
      questions.map((x) =>
        x === questions[currentQuestion]
          ? { ...x, correct: x.answer.id == answerId }
          : x
      )
    );
    ```

19. Add UI for finished game

    ```html
    {gameState === "ended" && (
    <div>
      <h1>Game Over!</h1>
      <p>You got {questions.filter((x) => x.correct).length} correct!</p>
      <div>
        {questions.map((x) => (
        <div key="{crypto.randomUUID()}">
          <span className="m-2">{x.correct ? "✅" : "🚫"}</span>
          <img src="{x.answer.flagUrl}" className="h-[30px] m-2" />
          <span className="m-2">{x.answer.name}</span>
        </div>
        ))}
      </div>
      <button onClick="{initGame}">Play again</button>
    </div>
    )}
    ```

20. Make it perty! Add your own styling
21. Add UI for if the question was answered correctly

That's it!
