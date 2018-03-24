import React from 'react'
import { css } from 'emotion'

export default function Spinner() {
  return (
    <div
      className={css`
        display: flex;
        aling-items: center;
        @keyframes loading-rotator {
          0% {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(270deg);
          }
        }
        @keyframes loading-dash {
          0% {
            stroke-dashoffset: 187;
          }
          50% {
            stroke-dashoffset: 46.75;
            transform: rotate(135deg);
          }
          to {
            stroke-dashoffset: 187;
            transform: rotate(450deg);
          }
        }
      `}
    >
      <svg
        className={css`
          width: 28px;
          height: 28px;
          animation: loading-rotator 1.4s linear infinite;
        `}
        viewBox="0 0 66 66"
      >
        <circle
          className={css`
            stroke-dasharray: 187;
            stroke-dashoffset: 0;
            transform-origin: center;
            stroke: #3498db;
            animation: loading-dash 1.4s ease-in-out infinite;
          `}
          fill="none"
          strokeWidth={6}
          cx={33}
          cy={33}
          r={30}
        />
      </svg>
    </div>
  )
}
