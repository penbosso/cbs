import React from 'react'
import { Button, Form, Select, Input, message } from 'antd';
import { MdOutlineCancel } from 'react-icons/md';
import { useStateContext } from '../contexts/ContextProvider';
import { useAddMarketMutation, useGetMarketByMarketIdQuery, useUpdateMarketMutation } from '../services/marketService';
import Loading from './Loading';
import { useGetDistrictsQuery } from '../services/districtService';

const layout = {
    labelCol: {
        span: 8,
    },
    wrapperCol: {
        span: 16,
    },
};
const MarketModal = ({ market }) => {
    const { Option } = Select;
    const { setIsClicked, initialState } = useStateContext();
    const [addMarket, { isLoading: addLoading }, error] = useAddMarketMutation();
    const [updateMarket, { isLoading: editLoading }] = useUpdateMarketMutation();
    const [form] = Form.useForm();

    const { data} = useGetDistrictsQuery();
    const districts = data?.locations

    const handleOk = async (values) => {
        if (market?.id) {
            console.log("updating...")
            try {
                const result = await updateMarket({ id: market.id, values });
                // console.log(result);
                if (result.error) {
                    result.error?.code ? message.error(result.error.code) : message.error(result.error.message)
                } else {
                    message.success("Market updated")
                }
                setIsClicked(initialState)
            } catch (e) {
                message.error(e);
            }

        } else {
            console.log("adding...")
            try {
                const result = await addMarket({ ...values, id: market?.id });
                console.log(result);
                if (result.error) {
                    result.error?.code ? message.error(result.error.code) : message.error(result.error.message)
                } else {
                    message.success("Market added")
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

    return (
        <div className=" flex justify-center items-center overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
            <div className="relative w-auto my-6 mx-auto max-w-3xl">
                {(!market?.id || market) ? <div className="border-2 border-color rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                    <div className="flex items-start justify-between p-5 border-b border-solid border-gray-300 rounded-t ">
                        <h3 className="text-3xl font=semibold">{market?.id ? `Editing "${market?.name}"` : 'Add new market'}</h3>
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
                                    name: market?.name,
                                    location: market?.location,
                                }}
                            >
                                <Form.Item label="Name"
                                    name="name"
                                    rules={[{ required: true, message: 'Please input your market name!' }]}>
                                    <Input placeholder="Market name" />
                                </Form.Item>

                                <Form.Item
                                    name="location"
                                    label="District"
                                    rules={[{ required: true, message: 'Please select a district' }]}
                                >
                                    <Select>
                                        {
                                            districts?.map((distrit, index)=> <Option key={index+1} value={distrit.name}>{distrit.name}</Option> )
                                        }
                                        
                                    </Select>
                                </Form.Item>

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

export default MarketModal