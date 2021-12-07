import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Form, Button, Row, Col } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../components/Message.jsx'
import Loader from '../components/Loader.jsx'
import FormContainer from '../components/FormContainer.jsx'
import { register } from '../actions/userActions'


const RegisterScreen = ({ location, history }) => {
  const [ name, setName ] = useState('')                                        // Cré un state pour 'name' pour le champ
  const [ email, setEmail ] = useState('')                                      // Cré un state pour 'email' pour le champ
  const [ password, setPassword ] = useState('')                                // Cré un state pour 'password' pour le champ password
  const [ confirmPassword, setConfirmPassword ] = useState('')                  // Cré un state pour 'confirmPassword' pour le champ confirmPassword
  const [ message, setMessage ] = useState(null)

  const dispatch = useDispatch()                                                // pour modifier le store redux
  const { loading, error, userInfo } = useSelector((state) => state.userRegister)  // extrait login, error, userInfo de store

  const redirect = location.search ? location.search.split('=')[1] : '/'

  useEffect(() => {
    if (userInfo) { history.push(redirect) }
  }, [history, userInfo, redirect])

  const submitHandler = (e) => {
    e.preventDefault()
    if (password !== confirmPassword) {
      setMessage('Passwords do not match')
    } else {
      dispatch(register(name, email, password))
    }
  }

  return (
    <FormContainer>
      <h1>Sign Up</h1>
      {message && <Message variant='danger'>{message}</Message>}
      {error && <Message variant='danger'>{error}</Message>}
      {loading && <Loader />}
      <Form onSubmit={submitHandler}>
        <Form.Group controlId='name'>
          <Form.Label>Name</Form.Label>
          <Form.Control type='name' placeholder='Enter name' value={name} onChange={(e) => setName(e.target.value)} ></Form.Control>
        </Form.Group>

        <Form.Group controlId='email'>
          <Form.Label>Email Address</Form.Label>
          <Form.Control type='email' placeholder='Enter email' value={email} onChange={(e) => setEmail(e.target.value)}></Form.Control>
        </Form.Group>

        <Form.Group controlId='password'>
          <Form.Label>Password</Form.Label>
          <Form.Control type='password' placeholder='Enter password' value={password} onChange={(e) => setPassword(e.target.value)}></Form.Control>
        </Form.Group>

        <Form.Group controlId='confirmPassword'>
          <Form.Label>Confirm Password</Form.Label>
          <Form.Control type='password' placeholder='Confirm password' value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}></Form.Control>
        </Form.Group>

        <Button type='submit' variant='primary'>Register</Button>
      </Form>

      <Row className='py-3'>
        <Col>
          Have an Account?{' '} <Link to={redirect ? `/login?redirect=${redirect}` : '/login'}> Login </Link>
        </Col>
      </Row>
    </FormContainer>
  )
}

export default RegisterScreen
