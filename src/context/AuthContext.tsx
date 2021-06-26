import { useEffect, useState, createContext, ReactNode } from "react"
import { auth, firebase } from "../services/firebase"

type User = {
  id: string;
  name: string;
  avatar: string;
}

type AuthContextType = {
  user: User | undefined;
  signInWithGoogle: () => Promise<void> // Função sem retorno = void. SEM PARAMETROS
}

type AuthContextProviderProps = {
  children: ReactNode;
}

// Formato do contexto/valor inicial. String = ''
export const AuthContext = createContext({} as AuthContextType)

export function AuthContextProvider(props: AuthContextProviderProps) {
  // Valor do parametro vazio = unefined
  const [user, setUser] = useState<User>()

  // useEffect(() => {}, [])
  // Primeiro qual função quero executar
  // O segundo parametro = Quando eu quero executar essa função.O valor sempre será um vetor(Array).
  useEffect(() => {
    // Se detectar que o usuário já havia sido logado anteriormente na aplicação, será retornado esse usuário logado. 
    const unsubscribe = auth.onAuthStateChanged(user => {
      // verificar se tem informações
      if (user) {
        const { displayName, photoURL, uid } = user
        // Se não tiver nome ou foto, retornará o erro.
        if (!displayName || !photoURL) {
          throw new Error('Missing information from Google Account.')
        }
        // Se possuir os dados, serão retornados os valores abaixo
        setUser({
          id: uid,
          name: displayName,
          avatar: photoURL
        })
      }

      // 'Descadastra' dos eventos
      return () => {
        unsubscribe()
      }
    })
  }, [])

  // Função de login
  async function signInWithGoogle() {
    //Autenticação do usuário com o GOOGLE
    const provider = new firebase.auth.GoogleAuthProvider()

    // Abre o popup para logar o usuário
    const result = await auth.signInWithPopup(provider)

    // Se retornar um usuário na autenticação
    if (result.user) {
      /*
        displayName = Nome que o usuário deseja deixar visivel
        photoURL = O avatar do usuário
        uid = Identificador único do usuário
        */
      const { displayName, photoURL, uid } = result.user
      // Se não tiver nome ou foto, retornará o erro.
      if (!displayName || !photoURL) {
        throw new Error('Missing information from Google Account.')
      }

      // Se possuir os dados, serão retornados os valores abaixo
      setUser({
        id: uid,
        name: displayName,
        avatar: photoURL
      })
    }
  }

  return (
    <AuthContext.Provider value={{ user, signInWithGoogle }}>
      {props.children}
    </AuthContext.Provider>
  )
}