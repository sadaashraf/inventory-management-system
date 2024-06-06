import React from 'react';
const Item = ({ foodItem ,handleOnClick}) => {
    return (
        
        <li key={foodItem} className="kg-item">
            {foodItem}
            <button className='Button'
            onClick={handleOnClick}>Buy</button>
        </li>
        
    );
};

export default Item;
