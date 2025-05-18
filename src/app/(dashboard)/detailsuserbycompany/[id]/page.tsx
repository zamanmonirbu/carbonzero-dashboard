
import React from 'react'
import Userdetails from '../components/userdetails'

const page = ({params}: {params: {id: string}}) => {

  return (
    <div>
      <Userdetails params={params.id}/>

    </div>
  )
}

export default page
