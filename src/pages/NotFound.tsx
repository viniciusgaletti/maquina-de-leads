import { useLocation, Link } from 'react-router-dom'
import { useEffect } from 'react'

export default function NotFound() {
  const location = useLocation()

  useEffect(() => {
    console.error('Erro 404: Tentativa de acesso a rota inexistente:', location.pathname)
  }, [location.pathname])

  return (
    <div className="flex-1 flex items-center justify-center p-6 bg-transparent">
      <div className="text-center space-y-4 animate-fade-in-up">
        <div className="space-y-2">
          <h1 className="text-4xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
            404
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            A página que você está procurando não existe.
          </p>
        </div>
        <div className="pt-2">
          <Link
            to="/"
            className="text-sm text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors underline underline-offset-4 decoration-transparent hover:decoration-zinc-300 dark:hover:decoration-zinc-700"
          >
            Voltar ao início
          </Link>
        </div>
      </div>
    </div>
  )
}
