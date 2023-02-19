import { createContext, ReactNode, useContext, useEffect } from 'react'
import { useState } from 'react'
import { api } from './../lib/axios'
import { IComments, IPosts } from '../enum/types'
import { AuthContext } from './AuthContext'

interface PostsContextType {
  posts: IPosts[]
  comments: IComments[]
  createPost: (data: CreatePostInput) => Promise<void>
  createComment: (data: CreateCommentInput) => Promise<void>
  deleteComment: (id: number) => Promise<void>
  deletePost: (id: number) => Promise<void>
  editPost: (data: EditPostInput) => Promise<void>
  editComment: (data: EditCommentInput) => Promise<void>
}

interface PostsProviderProps {
  children: ReactNode
}

interface CreatePostInput {
  title: string
  content: string
}

interface EditPostInput {
  id: number
  title: string
  content: string
  userId: number | undefined
}

interface EditCommentInput {
  id: number
  content: string
  postId?: number
  userId?: number | undefined
}

interface CreateCommentInput {
  postId: number
  content: string
}

export const PostsContext = createContext({} as PostsContextType)

export function PostsProvider({ children }: PostsProviderProps) {
  const { user } = useContext(AuthContext)
  const [posts, setPosts] = useState<IPosts[]>([])
  const [comments, setComments] = useState<IComments[]>([])
  let userId: number

  if (user.length !== 0) {
    userId = user[0].id
  }

  console.log(user)

  const fetchPosts = async () => {
    const response = await api.get('posts', {
      params: {
        _sort: 'createdAt',
        _order: 'desc',
      },
    })

    setPosts(response.data)
  }

  const createPost = async (data: CreatePostInput) => {
    const { content, title } = data

    const response = await api.post('posts', {
      title,
      content,
      createdAt: new Date(),
      userId,
    })

    setPosts((state) => [response.data, ...posts])
  }

  const fetchComments = async () => {
    const response = await api.get('comments')

    setComments(response.data)
  }

  const createComment = async (data: CreateCommentInput) => {
    const { content, postId } = data

    const newComment = {
      postId,
      content,
      userId,
      createdAt: new Date(),
    }

    const response = await api.post('comments', newComment)

    setComments((state) => [response.data, ...comments])
  }

  const deleteComment = async (id: number) => {
    const response = await api.delete(`comments/${id}`)

    const commentWithoutDeletedOne = comments.filter((comment) => {
      return comment.id !== id
    })
    setComments(commentWithoutDeletedOne)
  }

  const deletePost = async (id: number) => {
    const response = await api.delete(`posts/${id}`)

    const postWithoutDeletedOne = posts.filter((post) => {
      return post.id !== id
    })
    setPosts(postWithoutDeletedOne)
  }

  const editPost = async ({ id, title, content }: EditPostInput) => {
    const response = await api.put(`posts/${id}`, {
      title,
      content,
      userId,
    })

    const newArray = posts.filter((post) => {
      return post.id !== id
    })

    setPosts((state) => [response.data, ...newArray])
  }

  const editComment = async ({ id, content }: EditCommentInput) => {
    const response = await api.patch(`comments/${id}`, {
      content,
    })

    const newArray = comments.filter((comment) => {
      return comment.id !== id
    })

    setComments((state) => [response.data, ...newArray])
  }

  useEffect(() => {
    fetchPosts()
    fetchComments()
  }, [])

  return (
    <PostsContext.Provider
      value={{
        posts,
        comments,
        createPost,
        createComment,
        deleteComment,
        deletePost,
        editPost,
        editComment,
      }}
    >
      {children}
    </PostsContext.Provider>
  )
}
