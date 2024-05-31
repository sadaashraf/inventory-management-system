import React from 'react';
import Item from "./Item";
const FoodItem = ({ items }) => {
    return (
        <ul className="food">
            {items.map((item) => (
                <Item key={item} foodItem={item} />
            ))}
        </ul>
    );
}

export default FoodItem;

