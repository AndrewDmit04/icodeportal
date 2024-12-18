import React from 'react'

interface Params{
    first : string,
    last : string,
    img : string,
    uid : string
}

const Account = ({first,last,img,uid} : Params) => {
  return (
    <div>Account</div>
  )
}

export default Account