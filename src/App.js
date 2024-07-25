/* eslint-disable default-case */
import { useEffect, useReducer } from 'react'
import Header from './components/Header'
import Main from './components/main'
import Loader from "./components/Loader"
import Error from "./components/Error"
import StartScreen from './components/startScreen'
import Questions from './components/Questions'
import NextButton from './components/NextButton'
import Progress from './components/Progress'
import FinishScreen from './components/FinishScreen'
import Footer from './components/Footer'
import Timer from './components/Timer'

const initialState = {
  questions: [],
  // 'loading','error', 'ready', 'active','finished'
  status: 'loading',
  index: 0,
  answer: null,
  points: 0,
  highScore: 0,
  secondRemaining:null,
}

const SEC_PER_QUESTIONS = 30

function reducer(state, action) {
  switch (action.type) {
    case "dataRecieved":
      return {
        ...state,
        questions: action.payload,
        status: "ready",
      }
    case "dataFailed":
      return {
        ...state,
        status: "error"
      }
    case "start":
      return {
        ...state,
        status: "active",
        secondRemaining : state.questions.length * SEC_PER_QUESTIONS,
      }
    case "newAnswer":
      const question = state.questions.at(state.index);
      return {
        ...state,
        answer: action.payload,
        points: action.payload === question.correctOption
          ? state.points + question.points
          : state.points,
      }
    case "nextQuestion":
      return {
        ...state,
        index: state.index + 1,
        answer: null,
      }
    case "finish":
      return {
        ...state,
        status: "finish",
        highScore: state.points > state.highScore ? state.points : state.highScore
      }
    case "restart":
      return {
        ...initialState,
        questions: state.questions,
        status: "ready"
      }
    case "tick":
      return{
        ...state, 
        secondRemaining: state.secondRemaining - 1,
        status: state.secondRemaining === 0 ? "finish": state.status,
      }
    default:
      throw new Error("Error");
  }
}

export default function App() {
  const [{ questions, status, index, answer, points, highScore,secondRemaining }, dispatch] = useReducer(reducer, initialState)

  const numQuestions = questions.length;
  const maxPossiblePoints = questions.reduce((prev, cur) => prev + cur.points, 0)

  useEffect(function () {
    fetch("http://localhost:8000/questions")
      .then((res) => res.json())
      .then((data) => dispatch({ type: "dataRecieved", payload: data }))
      .catch((err) => dispatch({ type: "dataFailed" }));
  }, [])


  return <div className="app">
    <Header />
    <Main>
      {status === "loading" && <Loader />}
      {status === "error" && <Error />}
      {status === "ready" && <StartScreen numQuestions={numQuestions} dispatch={dispatch} />}
      {status === "active" &&
        <>
          <Progress
            numQuestions={numQuestions}
            index={index}
            points={points}
            maxPossiblePoints={maxPossiblePoints}
            answer={answer}
          />
          <Questions
            question={questions[index]}
            dispatch={dispatch}
            answer={answer}
          />
          <Footer>
          <Timer dispatch={dispatch} secondRemaining={secondRemaining} />
          <NextButton
            dispatch={dispatch}
            answer={answer}
            index={index}
            numQuestions={numQuestions}
          />
          </Footer>
        </>
      }
      {status === "finish" &&
        <FinishScreen
          points={points}
          maxPossiblePoints={maxPossiblePoints}
          highScore={highScore}
          dispatch={dispatch}
        />
      }
    </Main>
  </div>
}