// Qualquer conteudo jsx - ReactNode
import { ReactNode } from 'react'
import cx from 'classnames'

import './styles.scss'

type QuestionProps = {
  content: string;
  author: {
    name: string;
    avatar: string
  }
  children?: ReactNode
  isAnswered?: boolean
  isHighlighted?: boolean
}


export function Question({
  content,
  author,
  isAnswered = false,
  isHighlighted = false,
  children,
}: QuestionProps) {
  return (
    <div className={cx(
      'question',
      // A chave é a classe e o valor tem que ser um boolean
      { answered: isAnswered },
      // Só se aplica se estiver destacada e não estiver respondida
      { highlighted: isHighlighted && !isAnswered },

    )} >
      <p>{content}</p>
      <footer>
        <div className="user-info">
          <img src={author.avatar} alt={author.name} />
          <span>{author.name}</span>
        </div>
        <div>
          {children}
        </div>
      </footer>
    </ div>
  )
}