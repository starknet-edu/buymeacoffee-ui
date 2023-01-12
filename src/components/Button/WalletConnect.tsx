import React, { useState } from 'react'
import { Button } from '@mui/material'
import WalletDialog from '../Dialog/WalletDialog'

const WalletConnect: React.FC = () => {
  const [openDialog, setOpenDialog] = useState(false)
  return (
    <>
      <Button variant="contained" onClick={() => setOpenDialog(true)}>
        Connect Wallet
      </Button>
      <WalletDialog
        isOpen={openDialog}
        handleCloseDialog={() => setOpenDialog(false)}
      />
    </>
  )
}

export default WalletConnect
