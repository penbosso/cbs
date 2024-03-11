import React, { useState } from 'react';
import { Button, Radio, Form, Input, Select, Upload, message, Row, Col } from 'antd';
import { MdOutlineCancel } from 'react-icons/md';
import { useStateContext } from '../contexts/ContextProvider';
import { useAddMarketRecordMutation, useGetMarketRecordByMarketRecordIdQuery, useUpdateMarketRecordMutation } from '../services/marketRecordService';
import { useGetMarketsQuery } from '../services/marketService';
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
    const [updateMarketRecord, { isLoading: editLoading }] = useUpdateMarketRecordMutation();
    const [form] = Form.useForm();
    const { data: marketRecord } = useGetMarketRecordByMarketRecordIdQuery(marketRecordId ? marketRecordId : skipToken);
    const { data: markets } = useGetMarketsQuery();
    const [image_url, setImage_url] = useState('')
    const editing = { allowDeleting: true, allowEditing: true };
    const { Option } = Select;
    console.log("my restaurant", myRestaurant)
    console.log(marketRecord, marketRecordId)

    const handleOk = async (values) => {
        console.log(values)

        if (marketRecordId) {
            try {
                const result = await updateMarketRecord({ id: marketRecord.id, values: { ...values, image: image_url } });
                console.log(result);
                if (result.error) {
                    result.error?.code ? message.error(result.error.code) : message.error(result.error.message)
                } else {
                    message.success("Market Recordupdated")
                }
            } catch (e) {
                message.error(e);
            }

        } else {
            try {
                const item = { ...values, image: image_url, restaurant_id: myRestaurant?.restaurant_id }
                const result = await addMarketRecord(item);
                console.log(result);
                if (result.error) {
                    result.error?.code ? message.error(result.error.code) : message.error(result.error.message)
                } else {
                    message.success("Market Recordadded")
                    form.resetFields();
                }
            } catch (e) {
                message.error(e);
            }
        }
    }
    const handleCancel = () => {
        setIsClicked(initialState)
        form.resetFields();
    }


    const handleCancelPreview = () => setPreviewOpen(false);
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [previewTitle, setPreviewTitle] = useState('');

    const getBase64 = (file) =>
        new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
        });


    return (

        <div className=" flex justify-center items-center overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
            <div className="relative w-auto my-6 mx-auto max-w-3xl">
                {(!marketRecordId || marketRecord) ? <div className="border-2 border-color rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                    <div className="flex items-start justify-between p-5 border-b border-solid border-gray-300 rounded-t ">
                        <h3 className="text-3xl font=semibold">{marketRecordId ? `Editing "${marketRecord?.item_name}"` : 'Add new market record'}</h3>
                        <button
                            style={{ backgroundColor: 'light - gray', color: 'rgb(153, 171, 180)', borderRadius: "50%" }}
                            className="text-2xl p-3 hover:drop-shadow-xl hover:bg-light-gray"
                            onClick={() => setIsClicked(initialState)}
                        >
                            <MdOutlineCancel />
                        </button>
                    </div>

                    <div className="shadow overflow-hidden sm:rounded-md">
                        <div className="px-4 py-5 bg-white sm:p-6">


                            <Form
                                {...layout}
                                layout="horizontal" form={form}
                                onFinish={handleOk}
                                initialValues={{
                                    item_name: marketRecord?.item_name,
                                    cost: marketRecord?.cost,
                                    popular: marketRecord?.popular ? marketRecord?.popular : 'no',
                                    status: marketRecord?.status,
                                    market: marketRecord?.categeory,
                                    description: marketRecord?.description,
                                }}
                            >
                                <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                                    <Col>
                                        <Form.Item
                                            name="component"
                                            label="Component"
                                            rules={[{ required: true, message: 'Please enter an component' }]}
                                        >
                                            <Input />
                                        </Form.Item>

                                        <Form.Item
                                            label="No. places available"
                                            name="cost"
                                            rules={[{ required: true, message: 'Please enter the cost!' }]}
                                        >
                                            <Input
                                                formatter={(value) =>
                                                    `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                                                }
                                                parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                                                step={0.01}
                                                precision={2}
                                            />
                                        </Form.Item>

                                        {/* <Form.Item
                                            name="status"
                                            label="Status"
                                            rules={[{ required: true, message: 'Please select a status' }]}
                                        >
                                            <Select>
                                                <Option value="active">Active</Option>
                                                <Option value="inactive">Inactive</Option>
                                            </Select>
                                        </Form.Item> */}

                                    </Col>
                                    <Col >

                                        <Form.Item
                                            name="market"
                                            label="Market"
                                            rules={[{ required: true, message: 'Please select a market' }]}
                                        >
                                            <Select>
                                                {markets?.map(cat => <Option key={cat.id} value={cat.market_name}>{cat.market_name}</Option>)}
                                            </Select>
                                        </Form.Item>

                                        <Form.Item
                                            label="No. places rented"
                                            name="cost"
                                            rules={[{ required: true, message: 'Please enter the cost!' }]}
                                        >
                                            <Input
                                                formatter={(value) =>
                                                    `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                                                }
                                                parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                                                step={0.01}
                                                precision={2}
                                            />
                                        </Form.Item>

                                        <Form.Item label="Observation" name="observation">
                                            <TextArea placeholder="Brief description" rows={3} />
                                        </Form.Item>
                                    </Col>
                                </Row>
                                <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                                    <Button style={{ color: 'blue' }} type="primary" htmlType="submit" loading={addLoading || editLoading}>
                                        Save
                                    </Button>
                                    <Button htmlType="button" onClick={handleCancel}>
                                        Cancel
                                    </Button>
                                </Form.Item>
                            </Form>
                        </div>
                    </div>
                </div> : <Loading />}
            </div>
        </div>
    )
}

export default MarketRecordModal