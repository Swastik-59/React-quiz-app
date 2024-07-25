import Options from "./Options"

function Questions({ question, dispatch, answer }) {
    return (
        <div>
            <h3>{question.question}</h3>
            <Options question={question} dispatch={dispatch} answer={answer} />
        </div>
    )
}

export default Questions
