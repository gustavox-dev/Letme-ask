import { Link, useHistory } from 'react-router-dom'
import { FormEvent, useState, } from 'react'

import IllustrationImg from '../assets/images/illustration.svg'
import logoImg from '../assets/images/logo.svg'

import { Button } from '../components/Button'
import { database } from '../services/firebase'
import { useAuth } from '../Hoocks/useAuth'

import '../styles/auth.scss'


export function NewRoom() {
  const { user } = useAuth()
  const history = useHistory()
  // Atualizar o valor do estado
  const [newRoom, setNewRoom] = useState('')

  async function handleCreateRoom(event: FormEvent) {
    event.preventDefault()
    // newRoom => Texto digitado pelo usuário
    // trim() => Remove os espaços da esquerda e direita.
    if (newRoom.trim() === '') return

    // Referencia de um registro de um dado do banco de dados
    // Esta se referindo a alguma entidade/dado inserido
    const roomRef = database.ref('rooms')

    // jogando uma informação para dentro de rooms. Jogando uma nova sala 
    const firebaseRoom = await roomRef.push({
      title: newRoom,
      authorId: user?.id,
    })

    // o .key identificada unicamente cada sala
    history.push(`./${firebaseRoom.key}`)
  }

  return (
    <div id="page-auth">
      <aside>
        <img src={IllustrationImg} alt="Ilustração simbolizando perguntas e respostas" />
        <strong>Crie salas de Q&amp;A ao-vivo</strong>
        <p>Tire as duvidas da sua audiência em tempo-real</p>
      </aside>
      <main>
        <div className="main-content">
          <img src={logoImg} alt="" />
          <h2>Criar uma nova sala</h2>
          <form onSubmit={handleCreateRoom}>
            <input
              type="text"
              placeholder="Nome da sala"
              // Sempre que o valor for mudado
              onChange={event => setNewRoom(event.target.value)} // Sempre que o usuário digital algo no input o evento será pego. 
              value={newRoom}
            />
            <Button type="submit">
              Criar sala
            </Button>
          </form>
          <p>
            Quer entrar em uma sala já existente? <Link to="/">clique aqui</Link>
          </p>
        </div>
      </main>
    </div>
  )
}