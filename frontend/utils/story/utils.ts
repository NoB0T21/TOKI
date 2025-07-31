import { StoryElement } from "@/Types/types"

// Update functions for elements
export const updateElementPosition = (
  id: string,
  x: number,
  y: number,
  setElements: React.Dispatch<React.SetStateAction<StoryElement[]>>
) => {
  setElements((prev) =>
    prev.map((el) => (el.id === id ? { ...el, x, y } : el))
  )
}

export const updateElementSize = (
  id: string,
  width: number,
  height: number,
  setElements: React.Dispatch<React.SetStateAction<StoryElement[]>>
) => {
  setElements((prev) =>
    prev.map((el) => (el.id === id ? { ...el, width, height } : el))
  )
}