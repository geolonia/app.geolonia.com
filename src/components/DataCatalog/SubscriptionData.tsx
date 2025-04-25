import { Button } from '@material-ui/core';
import React, { useState } from 'react';
import subscriptionData from '../../assets/subscription-datas.json'; // JSON データをインポート

const SubscriptionData: React.FC = () => {
  const [openItems, setOpenItems] = useState<{ [key: string]: boolean }>({});

  const toggleItem = (id: string) => {
    setOpenItems((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div>
      {Object.entries(subscriptionData).map(([category, items]) => (
        <div key={category} style={{ marginBottom: '1rem' }}>
          <h2>{category}</h2>
          <ul style={{ listStyleType: 'none', paddingLeft: 0 }}>
            {Object.entries(items as Record<string, { description: string }>).map(([itemName, itemData]) => (
              <li
                key={itemName}
                style={{
                  marginBottom: '0.5rem',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                }}
              >
                <button
                  onClick={() => toggleItem(itemName)}
                  style={{
                    width: '100%',
                    padding: '0.5rem 1rem',
                    textAlign: 'left',
                    background: '#f7f7f7',
                    border: 'none',
                    outline: 'none',
                    cursor: 'pointer',
                    fontSize: '16px',
                  }}
                >
                  {itemName}
                </button>
                {openItems[itemName] && (
                  <div
                    style={{
                      padding: '0.5rem 1rem',
                      background: '#fff',
                      borderTop: '1px solid #ccc',
                    }}
                  >
                    <p>{itemData.description}</p>
                    <Button color="primary">利用開始</Button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default SubscriptionData;
