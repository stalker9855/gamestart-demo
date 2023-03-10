import Head from 'next/head'
import Image from 'next/image'
import { Inter } from 'next/font/google'
import styles from '@/styles/Home.module.css'
import AuthComponent from '@/components/Auth'
import Store from '@/store/store'
import { createContext } from 'react'

const inter = Inter({ subsets: ['latin'] })

const store = new Store()

interface State{
  store:Store
}

export const Context = createContext<State>({
  store
})

export default function Home() {
  return (
    <>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Context.Provider value={{
        store
      }}>
      <AuthComponent></AuthComponent>
      </Context.Provider>
    </>
  )
}
