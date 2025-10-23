import axios from 'axios'
import React from 'react'

function TestPay() {

    async function handleclick(){
        let {data} = await axios.get(`http://localhost:9192/api/booking/getKey`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        })

        console.log(data);
    }

  return (
    <div>
        <button onClick={() => handleclick()}>Clickme</button>
    </div>
  )
}

export default TestPay