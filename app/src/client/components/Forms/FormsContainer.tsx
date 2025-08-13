import React, { useState } from 'react'
import { Select } from '../../../components/ui/select'
import FormsBar from './FormsBar'
import FormsList from './FormsList'

const FormsContainer = () => {
  const [searchText, setSearchText] = useState("")
  return (
    <div className='max-w-[70rem] m-auto pt-10 px-10'>
      <FormsBar onDebouncedSearch={setSearchText}  />
      <FormsList searchText={searchText} />
    </div>
  )
}

export default FormsContainer
