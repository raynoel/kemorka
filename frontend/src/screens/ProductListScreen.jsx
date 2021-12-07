import React, { useEffect } from 'react'
import { LinkContainer } from 'react-router-bootstrap'
import { Table, Button, Row, Col } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../components/Message.jsx'
import Loader from '../components/Loader.jsx'
import Paginate from '../components/Paginate.jsx'
import { listProducts, deleteProduct, createProduct } from '../actions/productActions'
import { PRODUCT_CREATE_RESET } from '../constants/productConstants'


const ProductListScreen = ({ history, match, location }) => {
  const keyword = match.params.keyword                                            // Keyword ???
  const pageNumber = match.params.pageNumber || 1                                 // page ???

  const dispatch = useDispatch()

  const { userInfo }                               = useSelector((state) => state.userLogin)
  const { loading, error, products, page, pages }  = useSelector((state) => state.productList)
  const { loading: loadingDelete, error: errorDelete, success: successDelete } = useSelector((state) => state.productDelete)
  const { loading: loadingCreate, error: errorCreate, success: successCreate, product: createdProduct } = useSelector((state) => state.productCreate)


  useEffect(() => {
    dispatch({ type: PRODUCT_CREATE_RESET })
    if (!userInfo || !userInfo.isAdmin) {
      history.push('/login')
    } else if (successCreate) {
      history.push(`/admin/product/${createdProduct._id}/edit`)                   // Si le produit vient d'être créé, redirige sur la page pour éditer ses propriétées
    } else {
      dispatch(listProducts(keyword, pageNumber))
    }
  }, [dispatch, history, successDelete, userInfo, successCreate, createdProduct, pageNumber, keyword])


  const deleteHandler = (id) => {
    if (window.confirm('Are you sure')) {
      dispatch(deleteProduct(id))
    }
  }

  const createProductHandler = () => {
    dispatch(createProduct())
  }

  return (
    <>
      <Row className='align-items-center'>
        <Col>
          <h1>Produits</h1>
        </Col>
        <Col className='text-right'>
          <Button className='my-3' onClick={createProductHandler}><i className='fa fa-plus'></i> Ajouter un produit</Button>
        </Col>
      </Row>
      {loadingDelete && <Loader />}
      {errorDelete && <Message variant='danger'>{errorDelete}</Message>}
      {loadingCreate && <Loader />}
      {errorCreate && <Message variant='danger'>{errorCreate}</Message>}
      {loading ? ( <Loader /> ) : error ? ( <Message variant='danger'>{error}</Message> ) : (
        <>
          <Table striped bordered hover responsive className='table-sm'>
            <thead>
              <tr>
                <th>ID</th>
                <th>NOM</th>
                <th>PRIX</th>
                <th>CATEGORIE</th>
                <th>MARQUE</th>
                <th></th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product._id}>
                  <td>{product._id}</td>
                  <td>{product.name}</td>
                  <td>${product.price}</td>
                  <td>{product.category}</td>
                  <td>{product.brand}</td>
                  <td className='text-center'>
                    <LinkContainer to={`/admin/product/${product._id}/edit`}>
                      <Button variant='light' className='btn-sm'><i className='fa fa-edit'></i></Button>
                    </LinkContainer>
                  </td>
                  <td className='text-center'><Button variant='danger' className='btn-sm' onClick={() => deleteHandler(product._id)}><i className='fa fa-trash'></i></Button></td>
                </tr>
              ))}
            </tbody>
          </Table>
          <Paginate pages={pages} page={page} isAdmin={true} />
        </>
      )}
    </>
  )
}

export default ProductListScreen
