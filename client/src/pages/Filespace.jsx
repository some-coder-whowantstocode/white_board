import React from 'react'

import { FILESPACE } from '../features/filesystem/styles/filespace'
import FileNav from '../features/filesystem/components/FileNav'
import Fileplayground from '../features/filesystem/components/Fileplayground'
import { useFile } from '../features/filesystem/context/FileContext'
import { IconBox } from '../assets/icons'
import Shareplayground from '../features/filesystem/components/Shareplayground'

const Filespace = () => {

  const {selected} = useFile();

  const FileComponent = ()=>{
    switch (selected) {
      case IconBox.FOLDERS.name:
        return(<Fileplayground/>)

      case IconBox.SHARE.name:
        return(<Shareplayground/>)

      default:
        return(<Fileplayground/>)
    }
  }

  return (
    <FILESPACE>
      <FileNav/>
      {
        FileComponent()
      }
    </FILESPACE>
  )
}

export default Filespace
