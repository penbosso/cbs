import React from 'react';
import { Space, Spin } from 'antd';


const Loading = () => {
    return (
        <div className="self-center text-center m-auto" >
            <Space size="middle">
                <Spin size="small" />
                <Spin />
                <Spin size="large" />
            </Space>
        </div>
    )
}

export default Loading