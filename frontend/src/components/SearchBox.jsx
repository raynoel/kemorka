import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { Form, Button } from 'react-bootstrap'


const SearchBox = ({ history, location }) => {
  const [keyword, setKeyword] = useState('')
  const { userInfo } = useSelector(state => state.userLogin)                  // Extrait { _id, name, email, token } du store

  const submitHandler = (e) => {
    e.preventDefault()
    if (userInfo.isAdmin && location.pathname.includes('/admin/productlist')) {
      history.push(`/admin/productlist/search/${keyword}`)
    } else if (keyword.trim()) {
      history.push(`/search/${keyword}`)
    } else {
      history.push('/')
    }
  }

  return (
    <Form onSubmit={submitHandler} inline>
      <Form.Control type='text' name='q' onChange={(e) => setKeyword(e.target.value)} placeholder='Recherche de produits...' className='mr-sm-2 ml-sm-5'></Form.Control>
      <Button type='submit' variant='outline-secondary' className='p-2'>Recherche</Button>
    </Form>
  )
}



export default SearchBox