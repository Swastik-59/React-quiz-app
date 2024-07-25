import React from 'react'

function FinishScreen({ index , points, maxPossiblePoints, highScore, dispatch }) {
    const percent = Math.round((points / maxPossiblePoints) * 100)
    return (
        <>
            <div>
                <p className="result">
                    You scored <strong>{points}</strong> out of {maxPossiblePoints} ({percent}%)
                </p>
                <p className="highscore">(Highscore: {highScore} points)</p>

                <button className="btn btn-ui" onClick={()=> dispatch({type: "restart"})} >Restart</button>
            </div>
        </>
    )
}

export default FinishScreen
