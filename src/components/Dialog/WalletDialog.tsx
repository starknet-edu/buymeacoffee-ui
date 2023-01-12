import React from 'react'
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Box,
  IconButton,
  Typography,
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import { useConnectors } from '@starknet-react/core'
import Image from 'next/image'
import argentx from '/public/argentx.png'
import braavos from '/public/braavos.png'

interface WalletDialogProps {
  isOpen: boolean
  handleCloseDialog: (close: boolean) => void // eslint-disable-line no-unused-vars
}

const WalletDialog: React.FC<WalletDialogProps> = ({
  isOpen,
  handleCloseDialog,
}) => {
  const handleClose = () => {
    handleCloseDialog(false)
  }
  const wallets = [argentx, braavos]
  const { connect, connectors } = useConnectors()

  return (
    <Dialog open={isOpen} sx={{ padding: '20px' }}>
      <IconButton
        aria-label="close"
        onClick={handleClose}
        sx={{
          position: 'absolute',
          right: 8,
          top: 8,
          color: (theme) => theme.palette.grey[500],
        }}
      >
        <CloseIcon />
      </IconButton>
      <DialogTitle>Wallet Connect</DialogTitle>
      <DialogContent sx={{ minWidth: '350px' }}>
        {connectors.map((connector, index) => (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'start',
              margin: '15px 0',
              padding: '10px',
              width: '100%',
              cursor: 'pointer',
            }}
            key={connector.id()}
            component="button"
            onClick={() => connect(connector)}
            disabled={!connector.available()}
          >
            <Image
              src={wallets[index]}
              width={44}
              height={44}
              alt="wallet image"
            ></Image>
            <Typography variant="h6" sx={{ margin: '0 10px' }}>
              {connector.id()}
            </Typography>
          </Box>
        ))}
        <Typography variant="body1">* Please connect to Testnet 2</Typography>
      </DialogContent>
    </Dialog>
  )
}

export default WalletDialog
