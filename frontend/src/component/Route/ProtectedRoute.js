import React, { Fragment } from 'react'
import { useSelector } from 'react-redux'
import { Route, Redirect } from 'react-router-dom'
import Loader from '../layout/Loader/Loader';

const ProtectedRoute = ({component : Component, ...rest}) => {
  const {loading,isAuthenticated,user} = useSelector(state => state.user);
  return (
    <Fragment>
      {loading ? <Loader/> : 
      <Route {...rest} render = {(props)=>{
        if(!isAuthenticated){
          return <Redirect to="/login" />;
        }
        return <Component {...props}/>
      }} />}
    </Fragment>
  )
}

export default ProtectedRoute