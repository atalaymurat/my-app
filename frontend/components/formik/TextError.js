import React from 'react'

function TextError(props) {
  return (
    <div className="inline-block mb-2 font-light text-red-600 italic">
      {props.children}
    </div>
  )
}

export default TextError