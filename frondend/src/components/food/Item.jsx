import React from 'react';
const Item = ({ foodItem }) => {
    return (
        <li key={foodItem} className="kg-item">
            {foodItem}
        </li>
    );
};

export default Item;
