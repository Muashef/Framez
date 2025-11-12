export interface User {
  id: string
  email: string
  username: string
  avatar_url: string | null
  bio: string
  created_at: string
}

export interface Post {
  id: string
  user_id: string
  content: string
  image_url: string | null
  created_at: string
  user?: User
}
