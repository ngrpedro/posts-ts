import React, { useContext } from 'react'
import { useForm } from 'react-hook-form'
import { PostsContext } from '../contexts/PostsContext'
import * as z from 'zod'
import * as Dialog from '@radix-ui/react-dialog'
import { X } from 'phosphor-react'

interface Posts {
  id?: number
  title?: string
  content?: string
}

const newPostFormSchema = z.object({
  title: z.string(),
  content: z.string(),
})

type NewPostFormInputs = z.infer<typeof newPostFormSchema>

const NewPost = ({ id, title, content }: Posts) => {
  const { createPost } = useContext(PostsContext)

  console.log(title, content)

  const { register, handleSubmit, reset } = useForm<NewPostFormInputs>({
    defaultValues: {
      title,
      content,
    },
  })

  const handleCreateNewPost = async (data: NewPostFormInputs) => {
    const { content, title } = data

    await createPost({
      title,
      content,
    })

    reset()
  }

  return (
    <>
      <Dialog.Portal>
        <Dialog.Overlay className='fixed w-screen h-screen inset-0 bg-black opacity-70' />
        <Dialog.Content
          className='bg-zinc-800'
          style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
          }}
        >
          <div className='flex items-center justify-between px-6 pt-6'>
            <Dialog.Title className='text-2xl font-bold'>
              Nova postagem
            </Dialog.Title>

            <Dialog.Close>
              <X size={24} />
            </Dialog.Close>
          </div>

          <form
            onSubmit={handleSubmit(handleCreateNewPost)}
            className=' rounded-md p-6 space-y-4'
          >
            <input
              type='text'
              placeholder='Título'
              {...register('title')}
              required
              className='bg-zinc-900 rounded-md border border-gray-600 px-4 py-2 font-semibold 
                       w-full outline-none focus:border-green-400 transition-all'
            />
            <textarea
              cols={30}
              rows={4}
              placeholder='O que temos para hoje?'
              {...register('content')}
              required
              className='bg-zinc-900 rounded-md border border-gray-600 p-4 font-semibold 
                 w-full outline-none focus:border-green-400 transition-all'
            ></textarea>

            <button
              type='submit'
              title=''
              className='py-3 px-4 rounded-lg font-bold bg-green-700 text-white hover:bg-green-600 
                            transition-all disabled:opacity-25'
            >
              Publicar
            </button>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </>
  )
}

export default NewPost
