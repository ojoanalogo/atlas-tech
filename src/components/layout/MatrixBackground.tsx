'use client'

import { useEffect, useRef } from 'react'

interface MatrixBackgroundProps {
  movementDirection?: 'up-left' | 'down-right'
  movementSpeed?: number
  highlight?: boolean
}

export function MatrixBackground({
  movementDirection = 'up-left',
  movementSpeed = 0.04,
}: MatrixBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationId: number
    let offsetX = 0
    let offsetY = 0
    const boxSize = 30

    function getLineColor() {
      const isDark = document.documentElement.classList.contains('dark')
      return isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.06)'
    }

    function resize() {
      if (!canvas) return
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }

    function draw() {
      if (!canvas || !ctx) return
      const lineColor = getLineColor()
      const w = canvas.width
      const h = canvas.height

      ctx.clearRect(0, 0, w, h)
      ctx.strokeStyle = lineColor
      ctx.lineWidth = 1

      const startX = (offsetX % boxSize) - boxSize
      const startY = (offsetY % boxSize) - boxSize

      for (let x = startX; x < w + boxSize; x += boxSize) {
        ctx.beginPath()
        ctx.moveTo(x, 0)
        ctx.lineTo(x, h)
        ctx.stroke()
      }
      for (let y = startY; y < h + boxSize; y += boxSize) {
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(w, y)
        ctx.stroke()
      }

      const dx = movementDirection === 'up-left' ? -movementSpeed : movementSpeed
      const dy = movementDirection === 'up-left' ? -movementSpeed : movementSpeed
      offsetX += dx
      offsetY += dy

      animationId = requestAnimationFrame(draw)
    }

    resize()
    draw()
    window.addEventListener('resize', resize)

    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener('resize', resize)
    }
  }, [movementDirection, movementSpeed])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none -z-10"
      aria-hidden="true"
    />
  )
}
