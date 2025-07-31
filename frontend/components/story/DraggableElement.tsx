'use client'
import { useEffect, useRef } from "react"

export function DraggableElement({
  id,
  isSelected,
  onClick,
  children,
  zIndex,
  position,
  size,
  onDragEnd,
  onResizeEnd,
}: {
  id: string
  isSelected: boolean
  onClick: () => void
  children: React.ReactNode
  zIndex: number
  position: { x: number; y: number }
  size?: { width: number; height: number }
  onDragEnd: (x: number, y: number) => void
  onResizeEnd?: (width: number, height: number) => void
}) {
  const ref = useRef<HTMLDivElement>(null)
  const resizerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    let offsetX = 0
    let offsetY = 0
    let isDragging = false

    const onMouseDown = (e: MouseEvent | TouchEvent) => {
      if (e.target === resizerRef.current) return
      isDragging = true

      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY

      offsetX = clientX - el.offsetLeft
      offsetY = clientY - el.offsetTop

      document.addEventListener('mousemove', onMouseMove)
      document.addEventListener('mouseup', onMouseUp)
      document.addEventListener('touchmove', onMouseMove)
      document.addEventListener('touchend', onMouseUp)
      onClick()
    }

    const onMouseMove = (e: MouseEvent | TouchEvent) => {
      if (!isDragging) return

      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY

      const parent = el.parentElement
      if (!parent) return

      const parentRect = parent.getBoundingClientRect()
      const newX = Math.min(
        Math.max(0, clientX - offsetX),
        parentRect.width - (size?.width || el.offsetWidth)
      )
      const newY = Math.min(
        Math.max(0, clientY - offsetY),
        parentRect.height - (size?.height || el.offsetHeight)
      )

      el.style.left = `${newX}px`
      el.style.top = `${newY}px`
    }

    const onMouseUp = () => {
      isDragging = false
      document.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mouseup', onMouseUp)
      document.removeEventListener('touchmove', onMouseMove)
      document.removeEventListener('touchend', onMouseUp)
      if (ref.current) {
        const parentRect = ref.current.parentElement?.getBoundingClientRect()
        const rect = ref.current.getBoundingClientRect()
        if (parentRect) {
          const relativeX = rect.left - parentRect.left
          const relativeY = rect.top - parentRect.top
          onDragEnd(relativeX, relativeY)
        }
      }
    }

    el.addEventListener('mousedown', onMouseDown as any)
    el.addEventListener('touchstart', onMouseDown as any)
    return () => {
      el.removeEventListener('mousedown', onMouseDown as any)
      el.removeEventListener('touchstart', onMouseDown as any)
    }
  }, [onClick, onDragEnd, size])

  useEffect(() => {
    const el = ref.current
    const resizer = resizerRef.current
    if (!el || !resizer) return

    let startX = 0
    let startY = 0
    let startWidth = 0
    let startHeight = 0
    let isResizing = false

    const onResizeMouseDown = (e: MouseEvent) => {
      e.stopPropagation()
      isResizing = true
      startX = e.clientX
      startY = e.clientY
      startWidth = el.offsetWidth
      startHeight = el.offsetHeight
      document.addEventListener('mousemove', onResizeMouseMove)
      document.addEventListener('mouseup', onResizeMouseUp)
    }

    const onResizeMouseMove = (e: MouseEvent) => {
      if (!isResizing) return
      const newWidth = Math.max(20, startWidth + (e.clientX - startX))
      const newHeight = Math.max(20, startHeight + (e.clientY - startY))
      el.style.width = `${newWidth}px`
      el.style.height = `${newHeight}px`
    }

    const onResizeMouseUp = () => {
      isResizing = false
      document.removeEventListener('mousemove', onResizeMouseMove)
      document.removeEventListener('mouseup', onResizeMouseUp)
      if (onResizeEnd && ref.current) {
        onResizeEnd(ref.current.offsetWidth, ref.current.offsetHeight)
      }
    }

    resizer.addEventListener('mousedown', onResizeMouseDown)
    return () => resizer.removeEventListener('mousedown', onResizeMouseDown)
  }, [onResizeEnd])

  return (
    <div
      ref={ref}
      style={{
        position: 'absolute',
        left: position.x,
        top: position.y,
        width: size?.width || 'auto',
        height: size?.height || 'auto',
        zIndex,
        border: isSelected ? '2px solid #3b82f6' : 'none',
        borderRadius: '6px',
        backgroundColor: 'transparent',
      }}
      className="group cursor-move"
    >
      {children}
      <div
        ref={resizerRef}
        className={`absolute bottom-0 right-0 w-3 h-3 cursor-nwse-resize z-[1000] transition-opacity duration-150 ${
          isSelected ? 'bg-blue-500 opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      />
    </div>
  )
}