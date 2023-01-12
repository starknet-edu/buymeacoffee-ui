import React, { createContext } from 'react'
import { UseQueryResult, useQuery } from 'react-query'
import axios from 'axios'

interface Props {
  children: React.ReactNode
}

type Message = {
  name: string
  account: string
  messages: string
}

interface IEventsContext {
  events: Message[] | undefined
  onSetEvents: (events: Message[] | undefined) => void // eslint-disable-line no-unused-vars
  eventsQuery?: UseQueryResult<Message[] | null, unknown>
}

export const EventsContext = createContext<IEventsContext>({} as IEventsContext)

export const EventsProvider: React.FC<Props> = ({ children }) => {
  const [events, setEvents] = React.useState<Message[] | undefined>()
  const onSetEvents = (events: Message[] | undefined) => setEvents(events)
  const eventsQuery = useQuery(
    'getEvents',
    () =>
      axios
        .get('/api/events')
        .then((res) => {
          if (res.status === 200 && res.data) {
            const results: Message[] = res.data.messages
            const messages = results?.filter((item) => item.name !== '')
            setEvents(messages)
            return messages
          }
          return null
        })
        .catch((err) => {
          console.log('Unable to fetch all events', err.message)
          return null
        }),
    { retry: false },
  )

  return (
    <EventsContext.Provider
      value={{
        events,
        onSetEvents,
        eventsQuery,
      }}
    >
      {children}
    </EventsContext.Provider>
  )
}
