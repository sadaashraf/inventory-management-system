import React from 'react';
const Item = ({ foodItem ,handleOnClick}) => {
    // const handleOnClick=(event)=>{
    //     console.log(event)
    //     console.log(`${foodItem} being bought`)
    // }
    return (
        
        <li key={foodItem} className="kg-item">
            {foodItem}
            <button className='Button'
            onClick={handleOnClick}>Buy</button>
        </li>
        
    );
};

export default Item;
