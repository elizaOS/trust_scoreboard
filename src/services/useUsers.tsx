import { useState, useEffect } from "react"

export const useGetUsers = ({ cursor = 1, limit = 100 }) => {
  const [isLoading, setIsLoading] = useState(true)
  const [users, setUsers] = useState([])

  const getUsers = async () => {
    const response = await fetch(
      `/api/user/getUsers?cursor=${cursor}&limit=${limit}`
    )
    setIsLoading(false)
    const data = await response.json()
    setUsers(data.users)
  }

  useEffect(() => {
    getUsers()
  }, [])

  return { users, isLoading }
}
