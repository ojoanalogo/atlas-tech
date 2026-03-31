'use client'

import { useEffect, useRef } from 'react'

type MovementDirection =
  | 'none'
  | 'up'
  | 'down'
  | 'left'
  | 'right'
  | 'up-left'
  | 'up-right'
  | 'down-left'
  | 'down-right'

interface MatrixBackgroundProps {
  highlight?: boolean
  highlightColor?: string
  boxSize?: number
  movementDirection?: MovementDirection
  movementSpeed?: number
}

export function MatrixBackground({
  highlight = true,
  highlightColor = 'rgba(20, 184, 166, 0.3)',
  boxSize = 50,
  movementDirection = 'none',
  movementSpeed = 0.5,
}: MatrixBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const darkEdgeColor = 'rgba(63, 63, 70, 0.3)'
    const lightEdgeColor = 'rgba(200, 200, 200, 0.25)'

    function getEdgeColor() {
      return document.documentElement.classList.contains('dark')
        ? darkEdgeColor
        : lightEdgeColor
    }

    let mouseX = -1000
    let mouseY = -1000
    const offset = { x: 0, y: 0 }
    let animationId: number
    let isRunning = true

    function resize() {
      if (!canvas) return
      const parent = canvas.parentElement
      canvas.width = parent ? parent.offsetWidth : window.innerWidth
      canvas.height = parent ? parent.offsetHeight : window.innerHeight
    }

    function getBoxAtPosition(x: number, y: number) {
      const adjustedX = x - offset.x
      const adjustedY = y - offset.y
      return {
        col: Math.floor(adjustedX / boxSize),
        row: Math.floor(adjustedY / boxSize),
      }
    }

    function draw() {
      if (!isRunning || !canvas || !ctx) return

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const edgeColor = getEdgeColor()

      const startCol = Math.floor(-offset.x / boxSize) - 1
      const endCol = Math.ceil((canvas.width - offset.x) / boxSize) + 1
      const startRow = Math.floor(-offset.y / boxSize) - 1
      const endRow = Math.ceil((canvas.height - offset.y) / boxSize) + 1

      const hoveredBox = getBoxAtPosition(mouseX, mouseY)

      for (let row = startRow; row <= endRow; row++) {
        for (let col = startCol; col <= endCol; col++) {
          const x = col * boxSize + offset.x
          const y = row * boxSize + offset.y

          const isHovered = col === hoveredBox.col && row === hoveredBox.row

          if (highlight && isHovered) {
            ctx.fillStyle = highlightColor!
            ctx.fillRect(x, y, boxSize, boxSize)
          }

          ctx.strokeStyle = edgeColor
          ctx.lineWidth = 1
          ctx.strokeRect(x + 0.5, y + 0.5, boxSize, boxSize)
        }
      }

      if (movementDirection !== 'none') {
        const moveUp = movementDirection.includes('up')
        const moveDown = movementDirection.includes('down')
        const moveLeft = movementDirection.includes('left')
        const moveRight = movementDirection.includes('right')

        if (moveUp) {
          offset.y -= movementSpeed
          if (offset.y <= -boxSize) offset.y += boxSize
        }
        if (moveDown) {
          offset.y += movementSpeed
          if (offset.y >= boxSize) offset.y -= boxSize
        }
        if (moveLeft) {
          offset.x -= movementSpeed
          if (offset.x <= -boxSize) offset.x += boxSize
        }
        if (moveRight) {
          offset.x += movementSpeed
          if (offset.x >= boxSize) offset.x -= boxSize
        }
      }

      animationId = requestAnimationFrame(draw)
    }

    function handleMouseMove(e: MouseEvent) {
      mouseX = e.clientX
      mouseY = e.clientY
    }

    function handleMouseLeave() {
      mouseX = -1000
      mouseY = -1000
    }

    resize()
    window.addEventListener('resize', resize)
    window.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseleave', handleMouseLeave)
    draw()

    return () => {
      isRunning = false
      cancelAnimationFrame(animationId)
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [highlight, highlightColor, boxSize, movementDirection, movementSpeed])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 -z-10 pointer-events-none opacity-50"
      aria-hidden="true"
    />
  )
}
