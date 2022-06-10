import React, { FC } from 'react';

const HomePage: FC = () => {
  return (
    <div className="relative h-32 w-32 left-96 ...">
      <div className="absolute h-32 w-64 left-56 top-2.5">
        <h1 className='text-3xl font-bold underline'>Home Page</h1>
      </div>
    </div>
  )
}

export default HomePage;