import React from 'react'

import { FILESPACE } from '../features/filesystem/styles/filespace'
import FileNav from '../features/filesystem/components/FileNav'
import Fileplayground from '../features/filesystem/components/Fileplayground'

const Filespace = () => {
  return (
    <FILESPACE>
      <FileNav/>
      <Fileplayground/>
    </FILESPACE>
  )
}

export default Filespace
