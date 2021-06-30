import { useHistory } from 'react-router-dom'
import { FormEvent, useState } from 'react'

import IllustrationImg from '../assets/images/illustration.svg'
import logoImg from '../assets/images/logo.svg'
import googleIconImg from '../assets/images/google-icon.svg'

import { database } from '../services/firebase'

import { Button } from '../components/Button'
import { useAuth } from '../Hoocks/useAuth'

import '../styles/auth.scss'

export function Home() {
  const history = useHistory()
  const { user, signInWithGoogle } = useAuth()
  // um estado para armazenar o código da sala
  const [roomCode, setRoomCode] = useState('')

  // Responsável por definir a rota que o usuário será enviado
  async function handleCreateRoom() {
    // Se o usuário não estiver autenticado, chamar a função de autenticação. 
    if (!user) {
      await signInWithGoogle()
    }
    // Se estiver autenticado, poderá criar a página. 
    history.push('./rooms/new')
  }

  async function handleJoinRoom(event: FormEvent) {
    event.preventDefault()

    // Verifica se o roomCode é vazio. Caso seja, nada será executado. 
    if (roomCode.trim() === '') return

    // Referência a sala criada, dentro do banco de dados. 
    // Acessando via id da sala. o '.get' retorna todos os dados da sala
    const roomRef = await database.ref(`/rooms/${roomCode}`).get()

    // SE não existir o valor repassado denro do database será gerado um alerta
    // informando que a sala não existe. 
    if (!roomRef.exists()) {
      alert('Room does not exists.')
      return
    }

    // Caso exista, será redirecionado para a sala com o id passado. 
    history.push(`/rooms/${roomCode}`)
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
          <button className="create-room" onClick={handleCreateRoom}>
            <img src={googleIconImg} alt="Logo do Google" />
            Crie sua sala com o Google
          </button>
          <div className="separator">ou entre em uma sala</div>
          <form onSubmit={handleJoinRoom}>
            <input
              type="text"
              placeholder="Digite o código da sala"
              onChange={event => setRoomCode(event.target.value)}
              value={roomCode}
            />
            <Button type="submit">
              Entrar na sala
            </Button>
          </form>
        </div>
      </main>
    </div>
  )
}