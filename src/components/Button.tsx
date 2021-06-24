import { useState } from "react"

export function Button() {
  // Sempre que quiser alterar o valor do contador, será chamado o setCounter
  const [counter, setCounter] = useState(0)

  function increment() {
    setCounter(counter + 1) // O valor a se r entregue é declarado na propriedade
    console.log(counter)
  }

  return (
    <button onClick={increment}>
      {counter}
    </button>
  )
}
