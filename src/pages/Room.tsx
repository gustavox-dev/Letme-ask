import { FormEvent, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

import logoImg from '../assets/images/logo.svg'
import { Button } from '../components/Button'
import { RoomCode } from '../components/RoomCode'
import { useAuth } from '../Hoocks/useAuth'
import { database } from '../services/firebase'

import '../styles/room.scss'

// Cria um tipo do formato do valor que vai ser retornado. 
type FirebaseQuestions = Record<string, {
  author: {
    name: string
    avatar: string
  }
  content: string
  isAnswered: boolean
  isHighLighted: boolean
}>

type Question = {
  id: string
  author: {
    name: string
    avatar: string
  }
  content: string
  isAnswered: boolean
  isHighLighted: boolean
}

type RoomParms = {
  id: string;
}


export function Room() {
  const { user } = useAuth()
  // Define os parâmetros que a rota vai receber. 
  const params = useParams<RoomParms>()
  const [newQuestion, setNewQuestion] = useState('')
  // Definindo a tipagem do array
  const [questions, setQuestions] = useState<Question[]>([])
  const [title, setTitle] = useState('')

  const roomId = params.id

  // useEffect dispara um evento sempre que alguma informação mudar . Que ocorre no segundo parâmetro [].
  useEffect(() => {

    //Referencia da sala
    const roomRef = database.ref(`rooms/${roomId}`)

    // Seguindo a Documentação do Firebase
    // Se quer ouvir o evento apenas uma vez é colocado 'on', mais de uma, 'once'.
    // .val() são os dados contidos dentro da Room
    roomRef.on('value', room => {
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
          isHighLighted: value.isHighLighted,
          isAnswered: value.isAnswered,
        }
      })
      setTitle(databaseRoom.title)
      setQuestions(parsedQuestions)
    })
  }, [roomId]) //Sempre que o ID da sala mudar, o useEffect vai ser disparado novamente


  async function handleSendQuestion(event: FormEvent) {
    event.preventDefault() // Para não recarregar a tela. 

    // Se houver algum valor vazio, não retorna nada
    if (newQuestion.trim() === '') return

    // Se o usuário não estiver logado. 
    if (!user) {
      throw new Error('You must be logged in')
    }

    //Objeto que possui todas as informações da pergunta
    const question = {
      content: newQuestion,
      author: { // Informações do autor
        name: user.name,
        avatar: user.avatar,
      },
      isHighlighted: false, // Determina que a pergunta está sendo respondida
      isAnswered: false // A pergunta já foi respondida
    }

    await database.ref(`rooms/${roomId}/questions`).push(question)


    // Após ter clicado no botão 'Enviar' o input é substituido por uma string vazia
    setNewQuestion('')
  }

  return (
    <div id="page-room">
      <header>
        <div className="content">
          <img src={logoImg} alt="Letmeask" />
          <RoomCode code={roomId} />
        </div>
      </header>

      <main className="content">
        <div className="room-title">
          <h1>Sala {title}</h1>
          {questions.length > 0 && <span>{questions.length} perguntas</span>}
        </div>

        <form onSubmit={handleSendQuestion}>
          <textarea
            placeholder="O que você quer perguntar?"
            onChange={event => setNewQuestion(event.target.value)}
            value={newQuestion}
          />
          <div className="form-footer">

            {user ? (
              <div className="user-info">
                <img src={user.avatar} alt={user.name} />
                <span>{user.name}</span>
              </div>
            ) : (
              <span>Para enviar uma pergunta, <button>faça seu login</button></span>
            )}
            <Button type="submit" disabled={!user}>Enviar pergunta</Button>
          </div>
        </form>

        {JSON.stringify(questions)}
      </main>
    </div >
  )
}