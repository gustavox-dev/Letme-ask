import { useState, useEffect } from 'react'

import { database } from '../services/firebase'
import { useAuth } from './useAuth'

type FirebaseQuestions = Record<string, {
  author: {
    name: string
    avatar: string
  }
  content: string
  isAnswered: boolean
  isHighlighted: boolean
  likes: Record<string, {
    authorId: string
  }>
}>

type QuestionType = {
  id: string
  author: {
    name: string
    avatar: string
  }
  content: string
  isAnswered: boolean
  isHighlighted: boolean
  likeCount: number
  likeId: string | undefined
}

export function useRoom(roomId: string) {
  const { user } = useAuth()
  // Definindo a tipagem do array
  const [questions, setQuestions] = useState<QuestionType[]>([])
  const [title, setTitle] = useState('')

    // useEffect dispara um evento sempre que alguma informação mudar . Que ocorre no segundo parâmetro [].

  useEffect(() => {

    //Referencia da sala
    const roomRef = database.ref(`rooms/${roomId}`)

    // Seguindo a Documentação do Firebase
    // Se quer ouvir o evento apenas uma vez é colocado 'on', mais de uma, 'once'.
    // .val() são os dados contidos dentro da Room
    const unsubscribeRoomListener = roomRef.on('value', room => {
      const databaseRoom = room.val()
      // Define o tipo da variável como 'FirebaseQuestions'
      const firebaseQuestions: FirebaseQuestions = databaseRoom.questions ?? {}
      // Retorna um array com cada posição como chave e valor
      //EX: [["name", "Gustavo"], ["idade", 24]]
      const parsedQuestions = Object.entries(firebaseQuestions).map(([key, value]) => {
        return {
          id: key,
          content: value.content,
          author: value.author,
          isHighlighted: value.isHighlighted,
          isAnswered: value.isAnswered,
          likeCount: Object.values(value.likes ?? {}).length,// pega só os valores do objeto
          likeId: Object.entries(value.likes ?? {}).find(([key, like]) => like.authorId === user?.id)?.[0]
       }
      })
      setTitle(databaseRoom.title)
      setQuestions(parsedQuestions)
    })

    // Remove todos os event Listeners
    return () => {
      roomRef.off('value')
    }
  }, [roomId, user?.id]) //Sempre que o ID da sala mudar, o useEffect vai ser disparado novamente


  return { questions,  title}
}