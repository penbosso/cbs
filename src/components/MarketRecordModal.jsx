import React, { useState } from 'react';
import { Button, Radio, Form, Input, InputNumber, message, Row, Col } from 'antd';
import { MdOutlineCancel } from 'react-icons/md';
import { useStateContext } from '../contexts/ContextProvider';
import { useAddMarketRecordMutation, useGetMarketRecordByMarketRecordIdQuery, useUpdateMarketRecordMutation } from '../services/marketRecordService';
import { useGetMarketsQuery, useGetUserLocationMarketsQuery } from '../services/marketService';
import { skipToken } from '@reduxjs/toolkit/dist/query';
import Loading from './Loading';

const { TextArea } = Input;
const layout = {
    labelCol: {
        span: 8,
    },
    wrapperCol: {
        span: 16,
    },
};

const MarketRecordModal = ({ marketRecordId }) => {

    const { setIsClicked, initialState, myRestaurant, } = useStateContext();
    const [addMarketRecord, { isLoading: addLoading }, error] = useAddMarketRecordMutation();
    const [form] = Form.useForm();
    const { data: marketRecord } = useGetMarketRecordByMarketRecordIdQuery(marketRecordId ? marketRecordId : skipToken);
    const { data } = useGetUserLocationMarketsQuery();
    const markets = data?.markets;

    const handleRemoveRecord = (record) => {
        setRecords(records.filter((r) => r.id !== record.id));
    };


    const [records, setRecords] = useState([])

    const handleSubmit = (values) => {
        setRecords([...records, { ...values }])
        form.resetFields();
    }

    const handleOk = async () => {

        if (marketRecordId) {

        } else {
            const newMarketRecord = {
                market: selectMarket, records: records
            }
            console.log(newMarketRecord);
            try {
                const result = await addMarketRecord(newMarketRecord);
                console.log(result);
                if (result.error) {
                    message.error(result.error.data.message)
                } else {
                    message.success(result.data.message)
                    form.resetFields();
                }

            } catch (e) {
                message.error(e);
            }
            setRecords([])
        }
    }
    const handleCancel = () => {
        setIsClicked(initialState)
        form.resetFields();
    }


    const [selectMarket, setSelectMarket] = useState(null);



    return (

        <div className=" flex justify-center items-center overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none max-h-500 ">
            <div className="relative w-auto my-6 mx-auto overflow-y-auto max-h-500 max-w-3xl">
                {(!marketRecordId || marketRecord) ? <div className="border-2 border-color rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                    <div className="flex items-start justify-between p-5 border-b border-solid border-gray-300 rounded-t ">
                        <h3 className="text-3xl font=semibold">{marketRecordId ? `Editing "${marketRecord?.item_name}"` : `Add new ${selectMarket} market record`}</h3>
                        <button
                            style={{ backgroundColor: 'light - gray', color: 'rgb(153, 171, 180)', borderRadius: "50%" }}
                            className="text-2xl p-3 hover:drop-shadow-xl hover:bg-light-gray"
                            onClick={() => setIsClicked(initialState)}
                        >
                            <MdOutlineCancel />
                        </button>
                    </div>

                    {!selectMarket && (
                        <div className='p-16'>

                            <select id="market" name="market" onChange={(e) => setSelectMarket(e.currentTarget.value)}
                                className="block w-full mt-1 py-3 border-blue-400 rounded-md shadow-md focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                            >
                                <option value="" >Select market</option>
                                {markets?.map(cat => <option key={cat.id} value={cat.name}>{cat.name}</option>)}
                            </select>
                        </div>
                    )
                    }

                    {selectMarket &&
                        (<div className="shadow overflow-y-auto max-h-400 sm:rounded-md">


                            {records.length > 0 &&
                                (
                                    <div class="overflow-y-auto max-h-100 ">
                                        <table class="table-auto border-collapse border border-gray-300">
                                            <thead>
                                                <tr>
                                                    <th class="border border-gray-300 px-4 py-2">Component</th>
                                                    <th class="border border-gray-300 px-4 py-2">No. places available</th>
                                                    <th class="border border-gray-300 px-4 py-2">No. places rented</th>
                                                    <th class="border border-gray-300 px-4 py-2">Obseravation</th>
                                                </tr>
                                            </thead>
                                            {records.map(record => {
                                                return (<tr> <td class="border border-gray-300 px-4 py-2">{record.component_name}</td>
                                                    <td class="border border-gray-300 px-4 py-2">{record.total_number_places_available}</td>
                                                    <td class="border border-gray-300 px-4 py-2">{record.number_places_rented}</td>
                                                    <td class="border border-gray-300 px-4 py-2">{record.observation}</td>
                                                    <td class="border border-gray-300 px-4 py-2">
                                                        <button onClick={() => handleRemoveRecord(record)} className="text-red-500 font-bold px-2 focus:outline-none">X</button>
                                                    </td>
                                                </tr>)
                                            })}
                                        </table>

                                        <div className='flex justify-center p-4'>
                                            <button onClick={() => handleOk()} type="button" style={{ backgroundColor: '#078ece' }}
                                                className="flex justify-between items-center text-sm opacity-0.9  text-white  hover:drop-shadow-xl rounded-xl px-4 py-2">
                                                Save
                                            </button>

                                        </div>
                                    </div>
                                )

                            }
                            <div className="px-4 py-5 bg-white sm:p-6">


                                <Form
                                    {...layout}
                                    layout="horizontal" form={form}
                                    onFinish={handleSubmit}
                                    initialValues={{
                                        component_name: marketRecord?.component_name,
                                        total_number_places_available: marketRecord?.total_number_places_available,
                                        number_places_rented: marketRecord?.number_places_rented,
                                        number_places_rented: marketRecord?.number_places_rented,
                                    }}
                                >
                                    <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                                        <Col>
                                            <Form.Item
                                                name="component_name"
                                                label="Component"
                                                rules={[{ required: true, message: 'Please enter an component_name' }]}
                                            >
                                                <Input />
                                            </Form.Item>

                                            <Form.Item
                                                label="No. available"
                                                name="total_number_places_available"
                                                rules={[{ required: true, message: 'Please enter the total number places available!' }]}
                                            >
                                                <InputNumber
                                                />
                                            </Form.Item>

                                        </Col>
                                        <Col >

                                            <Form.Item
                                                label="No. rented"
                                                name="number_places_rented"
                                                rules={[{ required: true, message: 'Please enter the number of places rented!' }]}
                                            >
                                                <InputNumber />
                                            </Form.Item>

                                            <Form.Item label="Observation" name="observation">
                                                <TextArea placeholder="Brief description" rows={3} />
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                    <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                                        <Button style={{ color: 'blue' }} type="primary" htmlType="submit">
                                            Add
                                        </Button>
                                        <Button htmlType="button" onClick={handleCancel}>
                                            Cancel
                                        </Button>
                                    </Form.Item>
                                </Form>
                            </div>
                        </div>)}
                </div> : <Loading />}
            </div>
        </div>
    )
}

export default MarketRecordModal