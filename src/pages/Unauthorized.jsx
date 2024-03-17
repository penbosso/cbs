import React from 'react'
import { Header } from '../components';

const Unauthorized = () => {
  return (
    
    <div className="m-2 md:m-2 mt-2 p-2 md:p-4 bg-white rounded-3xl">
      <Header category="Page" title="Unauthorized" />
      <p>Your account requires approval. Please reach out to your administrator for account approval</p>
    </div>
  )
}

export default Unauthorized