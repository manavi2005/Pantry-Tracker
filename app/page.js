'use client'
import React, { useState, useEffect } from "react";
import { Box, Typography, Stack, Modal, TextField, Button } from '@mui/material';
import { collection, addDoc, query, updateDoc, deleteDoc, doc, onSnapshot } from "firebase/firestore"; 
import { firestore } from '@/firebase';

export default function Home() {
  const [inventory, setInventory] = useState([]);
  const [open, setOpen] = useState(false);
  const [newItem, setNewItem] = useState({ name: '', quantity: '' });
  const [editItem, setEditItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch and listen to inventory data
  useEffect(() => {
    const q = query(collection(firestore, 'inventory'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const inventoryList = [];
      querySnapshot.forEach((doc) => {
        inventoryList.push({ id: doc.id, ...doc.data() });
      });
      setInventory(inventoryList);
    });
    return () => unsubscribe();
  }, []);

  // Handle Add/Update Item
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newItem.name !== '' && newItem.quantity !== '') {
      if (editItem) {
        // Update existing item
        await updateDoc(doc(firestore, 'inventory', editItem.id), {
          name: newItem.name.trim(),
          quantity: newItem.quantity,
        });
        setEditItem(null);
      } else {
        // Add new item
        await addDoc(collection(firestore, 'inventory'), {
          name: newItem.name.trim(),
          quantity: newItem.quantity,
        });
      }
      setNewItem({ name: '', quantity: '' });
      handleClose();
    }
  };

  // Open modal and set item for editing
  const startEditing = (item) => {
    setNewItem({ name: item.name, quantity: item.quantity });
    setEditItem(item);
    handleOpen();
  };

  // Delete an item
  const deleteItem = async (id) => {
    try {
      await deleteDoc(doc(firestore, 'inventory', id));
    } catch (error) {
      console.error("Error deleting document:", error);
    }
  };

  // Open/Close Modal
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setNewItem({ name: '', quantity: '' });
    setEditItem(null);
  };

  // Filter items based on search term
  const filteredItems = inventory.filter((item) =>
    item.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box
      width="800px"
      height="100vh"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      gap={2}
    > 
      <Button variant="contained" onClick={handleOpen}>
        {editItem ? 'Edit Item' : 'Add New Item'}
      </Button>
      <TextField
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="my-4 p-3 border w-full bg-white text-black"
        type="text"
        placeholder="Search items..."
      />
      <Modal
        open={open}
        onClose={handleClose}
      >
        <Box 
          position="absolute"
          top="50%"
          left="50%"
          width={400}
          bgcolor="white"
          border="2px solid #000"
          boxShadow={24}
          p={4}
          display="flex"
          flexDirection="column"
          gap={3}
          sx={{
            transform: 'translate(-50%, -50%)',
          }}
        >
          <Typography variant="h6">{editItem ? 'Edit Item' : 'Add Item'}</Typography>
          <Stack width="100%" direction="row" spacing={2}>
            <TextField
              variant='outlined'
              fullWidth
              value={newItem.name}
              onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
              placeholder="Item name"
            />
            <TextField
              variant='outlined'
              fullWidth
              value={newItem.quantity}
              onChange={(e) => setNewItem({ ...newItem, quantity: e.target.value })}
              type="number"
              placeholder="Quantity"
            />
          </Stack>
          <Button
            variant="outlined"
            onClick={handleSubmit}
          >
            {editItem ? 'Update' : 'Add'}
          </Button>
        </Box>
      </Modal>
      <Box border="1px solid #333" width="800px">
        <Box height="100px" bgcolor="#ADD8E6" display="flex" alignItems={"center"} justifyContent={"center"}>
          <Typography variant='h2' color='#333'>Inventory Items</Typography>
        </Box>
        <Stack width="1200px" height="900px"  overflow="auto">
          {filteredItems.map(({ id, name, quantity }) => (
            <Box 
              key={id}
              minWidth="1200px"
              minHeight="25px"
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              bgcolor='#f0f0f0'
              padding={2}
            >
              <Typography 
                variant='h6' color='#333' textAlign="left"
                sx={{ flex: 1, minWidth: '300px'}}
              > 
                {name?.charAt(0).toUpperCase() + name.slice(1)}
              </Typography>
              <Typography 
                variant='h6' color='#333' textAlign="left"
                sx={{ flex: 1, minWidth: '300px' }}
              > 
                {quantity}
              </Typography>
              <Button 
                variant="contained" 
                onClick={() => startEditing({ id, name, quantity })} 
                sx={{ minWidth: '75px' }}
              >
                Edit
              </Button>
              <Button 
                variant="contained" 
                onClick={() => deleteItem(id)} 
                color="error"
                sx={{ minWidth: '75px' }}
              >
                Remove
              </Button>
            </Box>
          ))}
        </Stack>
      </Box>
    </Box>
  );
}
