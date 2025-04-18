import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { toast } from 'react-hot-toast'
import { Button } from '../Button'
import { Input } from '../Input'
import { createLink } from '../../services/link'
import type { Link } from '../../types/link'
import { useLinksStore } from '../../store/links'

interface ApiError {
  response?: {
    data?: {
      message?: string
    }
  }
}

const createLinkSchema = z.object({
  originalUrl: z.string().min(1, 'Informe uma url válida').url('Informe uma url válida'),
  shortUrl: z
    .string()
    .min(1, 'Informe uma url minúscula e sem espaço/caracter especial')
    .regex(/^[a-z0-9-]+$/, 'Informe uma url minúscula e sem espaço/caracter especial')
    .optional(),
})

type CreateLinkFormData = z.infer<typeof createLinkSchema>

interface LinkFormProps {
  onSuccess: (link: Link) => void
}

export function LinkForm({ onSuccess }: LinkFormProps) {
  const { isCreating, setIsCreating, addLink } = useLinksStore()
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateLinkFormData>({
    resolver: zodResolver(createLinkSchema),
  })

  async function onSubmit(data: CreateLinkFormData) {
    try {
      setIsCreating(true)
      
      const link = await createLink(data)
      addLink(link)
      onSuccess(link)
      reset()
    } catch (error: unknown) {
      console.error(error)
      const apiError = error as ApiError
      if (apiError?.response?.data?.message === "Short URL already exists.") {
        toast.error("Erro no cadastro: Essa URL encurtada já existe.", {
          id: 'shorturl-error',
        })
      }
    } finally {
      setIsCreating(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-4">
        <div>
          <label htmlFor="originalUrl" className="block text-sm font-medium text-[#4A5568] uppercase mb-1">
            Link original
          </label>
          <input
            id="originalUrl"
            type="text"
            placeholder="www.exemplo.com.br"
            className={`
              w-full px-4 py-3
              rounded-md
              border border-[#E2E8F0]
              text-[#1A202C] placeholder-[#A0AEC0]
              focus:outline-none focus:ring-2 focus:ring-[#2B6CB0] focus:border-transparent
              ${errors.originalUrl ? 'border-red-300 focus:ring-red-500' : ''}
            `}
            {...register('originalUrl')}
          />
          {errors.originalUrl && (
            <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" role="img" aria-labelledby="originalUrlWarning">
                <title id="originalUrlWarning">Ícone de aviso</title>
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {errors.originalUrl.message}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="shortUrl" className="block text-sm font-medium text-[#4A5568] uppercase mb-1">
            Link encurtado
          </label>
          <div className="flex">
            <span className="inline-flex items-center px-4 py-3 rounded-l-md border border-r-0 border-[#E2E8F0] bg-gray-50 text-[#A0AEC0] text-sm">
              brev.ly/
            </span>
            <input
              id="shortUrl"
              type="text"
              placeholder="nome-do-link"
              className={`
                flex-1 px-4 py-3
                rounded-r-md
                border border-[#E2E8F0]
                text-[#1A202C] placeholder-[#A0AEC0]
                focus:outline-none focus:ring-2 focus:ring-[#2B6CB0] focus:border-transparent
                ${errors.shortUrl ? 'border-red-300 focus:ring-red-500' : ''}
              `}
              {...register('shortUrl')}
            />
          </div>
          {errors.shortUrl && (
            <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" role="img" aria-labelledby="shortUrlWarning">
                <title id="shortUrlWarning">Ícone de aviso</title>
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {errors.shortUrl.message}
            </p>
          )}
        </div>
      </div>

      <Button
        type="submit"
        className="w-full bg-[#2B6CB0] hover:bg-[#2C5282] text-white font-medium py-3 rounded-md transition-colors"
        isLoading={isCreating}
      >
        {isCreating ? 'Salvando...' : 'Salvar link'}
      </Button>
    </form>
  )
} 