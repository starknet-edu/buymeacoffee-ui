import React, { useEffect, useState, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { CoffeeFormInputs } from './model'
import TextField from '@mui/material/TextField'
import {
  Button,
  Box,
  Typography,
  RadioGroup,
  Radio,
  FormControlLabel,
  Stack,
} from '@mui/material'
import WalletConnect from '../Button/WalletConnect'
import { useAccount, useTransactionReceipt } from '@starknet-react/core'
import useBuyMeCoffee from '../../hooks/useBuyMeCoffee'
import useAllowance from '../../hooks/useAllowance'
import useApprove from '../../hooks/useApprove'
import { toast } from 'react-toastify'
import { getReceipt } from '../../utils/helpers'
import { useEvents } from '../../contexts/Events/hooks'

const CoffeeForm: React.FC = () => {
  const { address, status } = useAccount()
  const { events: allEvents, onSetEvents } = useEvents()
  const [selectedPrice, setSelectedPrice] = React.useState<string>('0.001')
  const [events, setEvents] = useState<any>()
  const isApproved = useAllowance()
  const toastId = useRef<number | string>(0)
  const { onApprove, approveData } = useApprove()
  const handleOptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedPrice((event.target as HTMLInputElement).value)
  }

  const { register, handleSubmit, clearErrors, watch, reset } =
    useForm<CoffeeFormInputs>({ shouldFocusError: false })
  const name = watch('name') ?? ''
  const messages = watch('messages') ?? ''
  const { buyMeCoffee, buyMeCoffeeData } = useBuyMeCoffee(
    name,
    messages,
    selectedPrice,
  )
  const { data: transactionReceipt } = useTransactionReceipt({
    hash: buyMeCoffeeData?.transaction_hash,
    watch: true,
  })
  const { data: approveReceipt } = useTransactionReceipt({
    hash: approveData?.transaction_hash,
    watch: true,
  })

  useEffect(() => {
    if (transactionReceipt?.status === 'ACCEPTED_ON_L2') {
      const receipt = transactionReceipt as any
      setEvents(receipt['events'])
      toast.update(toastId.current, {
        render: 'Transaction is accepted',
        type: 'success',
        autoClose: 5000,
        isLoading: false,
      })
      address &&
        allEvents?.unshift({
          name,
          messages,
          account: address,
        })
      onSetEvents(allEvents)
      reset()
    } else if (transactionReceipt?.status === 'RECEIVED') {
      toastId.current = toast.loading('Transaction is loading...')
    }
  }, [
    transactionReceipt,
    address,
    allEvents,
    messages,
    name,
    onSetEvents,
    reset,
  ])

  useEffect(() => {
    if (approveReceipt?.status === 'RECEIVED') {
      toastId.current = toast.loading('Approving the contract...')
    } else if (approveReceipt?.status === 'ACCEPTED_ON_L2') {
      toast.update(toastId.current, {
        render: 'Contract is approved',
        type: 'success',
        autoClose: 5000,
        isLoading: false,
      })
    }
  }, [approveReceipt])

  const submitForm = () => {
    buyMeCoffee()
  }

  const disabledSubmitButton = !(
    isApproved ||
    approveReceipt?.status === 'ACCEPTED_ON_L2' ||
    approveReceipt?.status === 'ACCEPTED_ON_L1'
  )

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(submitForm)}
      sx={{
        display: 'flex',
        alignItems: 'start',
        justifyContent: 'center',
        width: '100%',
        flexDirection: 'column',
      }}
    >
      {status === 'connected' && address && (
        <Typography variant="h5" sx={{ margin: '10px 0' }}>
          Hello! {`${address.slice(0, 6)}...${address.slice(-4)}`}
        </Typography>
      )}
      <TextField
        required
        id="name"
        fullWidth
        label="Name"
        placeholder="Please Enter your name..."
        autoComplete="off"
        onFocus={() => clearErrors && clearErrors('name')}
        {...register('name')}
      />

      <TextField
        required
        id="messages"
        label="Messages"
        fullWidth
        multiline
        autoComplete="off"
        rows={4}
        placeholder="Please Enter your messages..."
        onFocus={() => clearErrors && clearErrors('messages')}
        {...register('messages')}
        sx={{ marginTop: '20px' }}
      />

      <Box>
        <Typography variant="h6" sx={{ margin: '10px 0' }}>
          Choose Price:
        </Typography>
      </Box>
      <RadioGroup
        row
        value={selectedPrice}
        onChange={handleOptionChange}
        sx={{ display: 'flex', alignItems: 'end', justifyContent: 'center' }}
      >
        <Box
          sx={{
            margin: '0 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
          }}
        >
          <Box sx={{ fontSize: '50px' }}>☕️</Box>
          <FormControlLabel
            value="0.001"
            control={<Radio />}
            label="0.001 ETH"
          />
        </Box>
        <Box
          sx={{
            margin: '0 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
          }}
        >
          <Box sx={{ fontSize: '75px' }}>☕️</Box>
          <FormControlLabel
            value="0.002"
            control={<Radio />}
            label="0.002 ETH"
          />
        </Box>
        <Box
          sx={{
            margin: '0 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
          }}
        >
          <Box sx={{ fontSize: '100px' }}>☕️</Box>
          <FormControlLabel
            value="0.003"
            control={<Radio />}
            label="0.003 ETH"
          />
        </Box>
      </RadioGroup>

      <Box
        sx={{
          display: 'flex',
          alignItems: 'start',
          justifyContent: 'start',
          marginTop: '20px',
        }}
      >
        {status === 'connected' && address ? (
          <Stack flexDirection="row">
            <Button
              variant="contained"
              sx={{ marginRight: '10px' }}
              disabled={
                isApproved || approveReceipt?.status === 'ACCEPTED_ON_L2'
              }
              onClick={() => onApprove()}
            >
              Approve
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={disabledSubmitButton}
            >
              Submit
            </Button>
          </Stack>
        ) : (
          <WalletConnect />
        )}
      </Box>

      {events && events.length > 0 && (
        <Box
          sx={{
            border: '1px solid #000',
            borderRadius: '10px',
            padding: '10px',
            marginTop: '20px',
            width: '100%',
          }}
        >
          <Typography variant="h6" sx={{ margin: '10px 0' }}>
            Receipts:
          </Typography>
          <Typography
            variant="body1"
            sx={{ margin: '10px 0', wordBreak: 'break-all' }}
          >
            Accounts: {getReceipt(events)?.accounts}
          </Typography>
          <Typography
            variant="body1"
            sx={{ margin: '10px 0', wordBreak: 'break-all' }}
          >
            Name: {getReceipt(events)?.name}
          </Typography>
          <Typography
            variant="body1"
            sx={{ margin: '10px 0', wordBreak: 'break-word' }}
          >
            Messages: {getReceipt(events)?.messages}
          </Typography>
        </Box>
      )}
    </Box>
  )
}

export default CoffeeForm
