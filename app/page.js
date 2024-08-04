'use client'

import { useState, useEffect } from 'react'
import { Box, Stack, Typography, Button, Modal, TextField } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import RemoveIcon from '@mui/icons-material/Remove'
import EditIcon from '@mui/icons-material/Edit'
import { firestore } from '@/firebase'
import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  deleteDoc,
  getDoc,
} from 'firebase/firestore'

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: '#F5F5F5', // Modal background
  borderRadius: '8px',
  boxShadow: '0px 4px 6px rgba(0,0,0,0.1)',
  p: 4,
}

const buttonStyle = {
  backgroundColor: '#097969', // Primary button color
  color: '#fff',
  '&:hover': {
    backgroundColor: '#085d52', // Darker green on hover
  },
}

const itemCardStyle = {
  borderRadius: '8px',
  boxShadow: '0px 4px 6px rgba(0,0,0,0.1)',
  bgcolor: '#FFFFFF', // Card background
  padding: 2,
  border: '1px solid #E0E0E0', // Card border
  maxWidth: '100%', // Prevents cards from exceeding container width
}

const backgroundColor = '#AFE1AF' // App background color

export default function Home() {
  const [inventory, setInventory] = useState([])
  const [filteredInventory, setFilteredInventory] = useState([])
  const [openAddModal, setOpenAddModal] = useState(false)
  const [openUpdateModal, setOpenUpdateModal] = useState(false)
  const [itemName, setItemName] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [editingItem, setEditingItem] = useState(null)
  const [newQuantity, setNewQuantity] = useState(0)

  const updateInventory = async () => {
    const snapshot = query(collection(firestore, 'inventory'))
    const docs = await getDocs(snapshot)
    const inventoryList = []
    docs.forEach((doc) => {
      inventoryList.push({ name: doc.id, ...doc.data() })
    })
    setInventory(inventoryList)
    setFilteredInventory(inventoryList)
  }

  useEffect(() => {
    updateInventory()
  }, [])

  useEffect(() => {
    // Filter inventory based on search query
    const results = inventory.filter(({ name }) =>
      name.toLowerCase().includes(searchQuery.toLowerCase())
    )
    setFilteredInventory(results)
  }, [searchQuery, inventory])

  const addItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item)
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      const { quantity } = docSnap.data()
      await setDoc(docRef, { quantity: quantity + 1 })
    } else {
      await setDoc(docRef, { quantity: 1 })
    }
    await updateInventory()
  }

  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item)
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      const { quantity } = docSnap.data()
      if (quantity === 1) {
        await deleteDoc(docRef)
      } else {
        await setDoc(docRef, { quantity: quantity - 1 })
      }
    }
    await updateInventory()
  }

  const updateItem = async (name, quantity) => {
    const docRef = doc(collection(firestore, 'inventory'), name)
    await setDoc(docRef, { quantity })
    await updateInventory()
    handleCloseUpdate()
  }

  const handleOpenAdd = () => setOpenAddModal(true)
  const handleCloseAdd = () => setOpenAddModal(false)
  const handleOpenUpdate = (item) => {
    setEditingItem(item)
    setNewQuantity(item.quantity)
    setOpenUpdateModal(true)
  }
  const handleCloseUpdate = () => setOpenUpdateModal(false)

  return (
    <Box
      width="100vw"
      height="100vh"
      display={'flex'}
      justifyContent={'center'}
      flexDirection={'column'}
      alignItems={'center'}
      gap={2}
      bgcolor={backgroundColor} // App background color
    >
      {/* Add Item Modal */}
      <Modal
        open={openAddModal}
        onClose={handleCloseAdd}
        aria-labelledby="add-item-modal-title"
        aria-describedby="add-item-modal-description"
      >
        <Box sx={modalStyle}>
          <Typography id="add-item-modal-title" variant="h6" component="h2">
            Add Item
          </Typography>
          <Stack width="100%" direction={'row'} spacing={2}>
            <TextField
              id="item-name"
              label="Item"
              variant="outlined"
              fullWidth
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
            />
            <Button
              variant="contained"
              sx={buttonStyle}
              onClick={() => {
                addItem(itemName)
                setItemName('')
                handleCloseAdd()
              }}
            >
              <AddIcon /> Add
            </Button>
          </Stack>
        </Box>
      </Modal>

      {/* Update Item Modal */}
      <Modal
        open={openUpdateModal}
        onClose={handleCloseUpdate}
        aria-labelledby="update-item-modal-title"
        aria-describedby="update-item-modal-description"
      >
        <Box sx={modalStyle}>
          <Typography id="update-item-modal-title" variant="h6" component="h2">
            Update Item
          </Typography>
          <Stack width="100%" direction={'row'} spacing={2}>
            <TextField
              id="new-quantity"
              label="New Quantity"
              type="number"
              variant="outlined"
              fullWidth
              value={newQuantity}
              onChange={(e) => setNewQuantity(Number(e.target.value))}
            />
            <Button
              variant="contained"
              sx={buttonStyle}
              onClick={() => {
                if (editingItem) {
                  updateItem(editingItem.name, newQuantity)
                }
              }}
            >
              Update
            </Button>
          </Stack>
        </Box>
      </Modal>

      <Button
        variant="contained"
        sx={buttonStyle}
        onClick={handleOpenAdd}
      >
        <AddIcon /> Add New Item
      </Button>

      <TextField
        id="search-bar"
        label="Search Items"
        variant="outlined"
        onChange={(e) => setSearchQuery(e.target.value)}
        sx={{ mb: 2, width: '800px' }}
      />

      <Box border={'1px solid #333'} overflowX="auto">
        <Box
          width="800px"
          height="100px"
          bgcolor={'#C8D5B9'} // Light green for the header
          display={'flex'}
          justifyContent={'center'}
          alignItems={'center'}
        >
          <Typography variant={'h4'} color={'#333'} textAlign={'center'}>
            Inventory Items
          </Typography>
        </Box>
        <Stack width="800px" height="300px" spacing={2} overflow="auto">
          {filteredInventory.map(({ name, quantity }) => (
            <Box
              key={name}
              width="100%"
              minHeight="150px"
              sx={itemCardStyle}
              display={'flex'}
              justifyContent={'space-between'}
              alignItems={'center'}
            >
              <Typography variant={'h5'} color={'#333'} textAlign={'center'}>
                {name.charAt(0).toUpperCase() + name.slice(1)}
              </Typography>
              <Typography variant={'h5'} color={'#333'} textAlign={'center'}>
                Quantity: {quantity}
              </Typography>
              <Stack direction="row" spacing={1}>
                <Button
                  variant="contained"
                  sx={buttonStyle}
                  onClick={() => handleOpenUpdate({ name, quantity })}
                >
                  <EditIcon /> Update
                </Button>
                <Button
                  variant="contained"
                  sx={buttonStyle}
                  onClick={() => removeItem(name)}
                >
                  <RemoveIcon /> Remove
                </Button>
              </Stack>
            </Box>
          ))}
        </Stack>
      </Box>
    </Box>
  )
}

