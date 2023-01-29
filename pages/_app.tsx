import '@/styles/globals.css'
import '../styles/reset.css';
import { useEffect } from 'react'
import type { AppProps } from 'next/app'
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth, db } from '@/config/firebase'
import Loading from '@/components/Loading'
import Error from '@/components/Error'
import Login from './login'
import { doc, serverTimestamp, setDoc } from 'firebase/firestore'

export default function App({ Component, pageProps }: AppProps) {
  const [loggedInUser, loading, error] = useAuthState(auth)

  useEffect(() => {
    const setUserInDb = async () => {

      try {
        await setDoc(
          doc(db, 'users', loggedInUser?.uid as string,),
          {
            email: loggedInUser?.email,
            lastSeen: serverTimestamp(),
            photoURL: loggedInUser?.photoURL,
          },
          {
            merge: true
          }
        )
      } catch (error) {
        console.log(`Error setting user in DB ${error}`)
      }
    }
    if (loggedInUser) {
      setUserInDb()
    }
  }, [loggedInUser])

  if (loading) return <Loading />

  if (error) return <Error />

  if (!loggedInUser) return <Login />

  return <Component {...pageProps} />
}
