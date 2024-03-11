import React, { useState } from 'react';
import { useUpdateMarketMutation } from '../services/marketService';
import Loading from './Loading';
import { message } from 'antd';

const DropdownButton = ({ market }) => {
  const [selectedOption, setSelectedOption] = useState(market.status);
  const [updateMarket, { isLoading: updateLoading }] = useUpdateMarketMutation();
  const handleOptionChange = async (option) => {
    console.log(option);
    setSelectedOption(option);
    // update market
    try {
      const result = await updateMarket({
        id: market.id, values: {
          status: option
        }
      });
      console.log(result);
      if (result.error) {
        result.error?.code ? message.error(result.error.code) : message.error(result.error.message)
      } else {
        message.success(`Market status updated -> "${option}"`)
      }
    } catch (e) {
      message.error(e);
    }

  };

  return (
    <div>
      {updateLoading ? <Loading /> :
        <select className="p-1 rounded-md" value={selectedOption} onChange={(e) => handleOptionChange(e.target.value)}>
          <option value="Pending">Pending</option>
          <option value="Confirm">Confirm</option>
          <option value="Preparing">Preparing</option>
          <option value="Delivering">Delivering</option>
          <option value="Done">Done</option>
        </select>
      }
    </div>
  );
};

export default DropdownButton;
