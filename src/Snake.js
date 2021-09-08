import React from 'react';

const Snake = ({ snakeDots }) => {
    
    return (
        <div>
            {snakeDots.map((dot, index) => {
                return (
                    <div key={index} className="snake-dot" style={{ left: `${dot[0]}%`, top: `${dot[1]}%` }} />
                )
            })}
        </div>
    )
}

export default Snake;