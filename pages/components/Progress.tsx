import React from 'react'

const formatTime = (ms: number) => {
  var minutes = Math.floor(ms / 60000)
  var seconds = Number(((ms % 60000) / 1000).toFixed(0))
  return minutes + ':' + (seconds < 10 ? '0' : '') + seconds
}

type Props = {
  progress: number
  progressMs: number
  durationMs: number
}

const Progress = ({ progress, progressMs, durationMs }: Props) => (
  <div className="progress-container">
    <div style={{ width: `${progress}%` }} className="progress" />
    <div className="timer">
      <div>{formatTime(progressMs)}</div>
      <div>{formatTime(durationMs)}</div>
    </div>
  </div>
)

export default Progress
