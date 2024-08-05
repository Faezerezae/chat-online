import React from 'react'
import { Link } from 'react-router-dom'

export default function HomePage() {
  return (
    <div>
          <Link to={"about"}>about</Link>
          <br/>
      <Link to={"contact"}>contact</Link>
    </div>
  );
}
