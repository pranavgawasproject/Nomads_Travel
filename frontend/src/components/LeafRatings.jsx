import React from 'react'

const LeafRatings = ({ratings , height, width, align=""}) => {
  return (
    <div className={`flex ${align || "items-center"}  gap-0`}>
      <div style={{height : height || "100%", width : width || "5rem"}} className='w-20 overflow-hidden'>
        <img src="/images/leaf-left.png" alt="leaf-left" className='h-full w-full object-contain' />
      </div>
      <div className='mt-0'>
        <span>{ratings}</span>
      </div>
      <div style={{height : height || "100%", width : width || "5rem"}} className='h-full w-20 overflow-hidden'>
        <img src="/images/leaf-right.png" alt="leaf-right" className='h-full w-full object-contain' />
      </div>
    </div>
  )
}

export default LeafRatings
