import React from 'react';
const Item = ({ foodItem }) => {
    const handleOnClick=()=>{
        console.log(`${foodItem} being bought`)
    }
    return (
        
        <li key={foodItem} className="kg-item">
            {foodItem}
            <button className='Button'
            onClick={()=>handleOnClick(foodItem)}>Buy</button>
        </li>
        
    );
};

export default Item;
