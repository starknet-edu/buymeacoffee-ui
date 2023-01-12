import { useContext } from 'react'
import { EventsContext } from './EventsProvider'

export const useEvents = () => useContext(EventsContext)
