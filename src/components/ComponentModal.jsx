import React from 'react'
import { Button, Form, Select, Input, message, InputNumber } from 'antd';
import { MdOutlineCancel } from 'react-icons/md';
import { useStateContext } from '../contexts/ContextProvider';
import { useAddComponentMutation, useGetComponentByComponentIdQuery, useUpdateComponentMutation } from '../services/componentService';
import Loading from './Loading';
import { useGetMarketsQuery } from '../services/marketService';

const layout = {
    labelCol: {
        span: 12,
    },
    wrapperCol: {
        span: 16,
    },
};
const ComponentModal = ({ component }) => {
    const { Option } = Select;
    const { setIsClicked, initialState } = useStateContext();
    const [addComponent, { isLoading: addLoading }, error] = useAddComponentMutation();
    const [updateComponent, { isLoading: editLoading }] = useUpdateComponentMutation();
    const [form] = Form.useForm();

    const { data } = useGetMarketsQuery();
    const markets = data?.markets

    const handleOk = async (values) => {
        if (component?.id) {
            console.log("updating...")
            try {
                const result = await updateComponent({ id: component.id, values });
                // console.log(result);
                if (result.error) {
                    result.error?.code ? message.error(result.error.code) : message.error(result.error.message)
                } else {
                    message.success("Component updated")
                }
                setIsClicked(initialState)
            } catch (e) {
                message.error(e);
            }

        } else {
            console.log("adding...")
            try {
                const result = await addComponent({ ...values, id: component?.id });
                console.log(result);
                if (result.error) {
                    result.error?.code ? message.error(result.error.code) : message.error(result.error.message)
                } else {
                    message.success("Component added")
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
                {(!component?.id || component) ? <div className="border-2 border-color rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                    <div className="flex items-start justify-between p-5 border-b border-solid border-gray-300 rounded-t ">
                        <h3 className="text-3xl font=semibold">{component?.id ? `Editing "${component?.name}"` : 'Add new component'}</h3>
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
                                    name: component?.name,
                                    total_number_places_available: component?.total_number_places_available,
                                    market: component?.market,
                                }}
                            >
                                <Form.Item label="Name"
                                    name="name"
                                    rules={[{ required: true, message: 'Please input your component name!' }]}>
                                    <Input placeholder="Component name" />
                                </Form.Item>

                                <Form.Item
                                    name="market"
                                    label="Market"
                                    rules={[{ required: true, message: 'Please select a market' }]}
                                >
                                    <Select>
                                        {
                                            markets?.map((market, index) => <Option key={index + 1} value={market.name}>{market.name}</Option>)
                                        }

                                    </Select>
                                </Form.Item>
                                <Form.Item label="No.# places available"
                                    name="total_number_places_available"
                                    rules={[{ required: true, message: 'Please input your component name!' }]}>
                                    <InputNumber
                                        min={1}     
                                    />
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

export default ComponentModal