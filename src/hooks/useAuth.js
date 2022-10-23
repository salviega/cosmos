import React from 'react'
import { useNavigate, Navigate } from 'react-router-dom'

const adminWallets = ['0x70a792ad975aa0977c6e9d55a14f5f2228bbc685', '0xa3542355604cFD6531AAf020DDAB3bDFFf4d1809', '0x91DC541109033C060779Aad8a578E34223e694cb']

const AuthContext = React.createContext()

export function AuthProvider ({ children }) {
  const navigate = useNavigate()

  const initialState = JSON.parse(localStorage.getItem('wallet')) || { walletAddress: 'Connect wallet' }
  const [user, setUser] = React.useState(initialState)

  const login = ({ walletAddress }) => {
    let isAdmin = false
    let adminWallet = adminWallets.find(wallet => wallet.toLowerCase() === walletAddress)
    try {
      adminWallet = adminWallet.toLowerCase()
      if (adminWallet.toLowerCase() === walletAddress) isAdmin = true
      const stringifiedUser = JSON.stringify({ walletAddress, isAdmin })
      localStorage.setItem('wallet', stringifiedUser)
      setUser({ walletAddress, isAdmin })
    } catch {
      const stringifiedUser = JSON.stringify({ walletAddress, isAdmin })
      localStorage.setItem('wallet', stringifiedUser)
      setUser({ walletAddress, isAdmin })
    }
  }

  const logout = () => {
    localStorage.clear()
    setUser({ walletAddress: 'Connect wallet' })
    navigate('/')
  }

  const auth = { user, login, logout }

  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>
}

export function AuthRoute (props) {
  const auth = useAuth()

  if (auth.user.walletAddress === 'Connect wallet') {
    return <Navigate to='/' />
  }

  return props.children
}

export function useAuth () {
  const auth = React.useContext(AuthContext)
  return auth
}
