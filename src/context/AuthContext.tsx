"use client"

import React, { createContext, useState, useEffect, useContext, ReactNode } from "react"

interface User {
    name: string
  email: string
  role: string
  image: string
}

interface AuthContextType {
  user: User | null
  setUser: (user: User | null) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const storedUser =  sessionStorage.getItem("userData")

    if (storedUser) {
      
      setUser({
        name: JSON.parse(storedUser).user.fullName,
        email: JSON.parse(storedUser).user.email, 
        role:JSON.parse(storedUser).role,
        image: JSON.parse(storedUser).user.image,
      })
    }
  }, [])

  const logout = () => {
    // localStorage.removeItem("authToken")
    // localStorage.removeItem("userData")
    sessionStorage.removeItem("authToken")
    sessionStorage.removeItem("userData")
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, setUser, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
