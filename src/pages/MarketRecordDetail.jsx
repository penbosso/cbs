import React, { useState } from 'react'
import { Header, Loading } from '../components'
import { useStateContext } from '../contexts/ContextProvider'
import { useGetMarketRecordCommentsByMarketRecordIdQuery, useUpdateMarketRecordProgressMutation } from '../services/marketRecordService'
import { skipToken } from '@reduxjs/toolkit/query'
import { MdOutlineCategory, MdOutlineCancel } from 'react-icons/md';
import { Space, Button, message } from 'antd';
import { useSelector } from "react-redux"
import { selectCurrentUser } from '../services/authSlice'

const MarketRecordDetail = () => {
    const currentUser = useSelector(selectCurrentUser)
    const { marketRecord } = useStateContext()

    const { data: comments, isLoading: commentLoading } = useGetMarketRecordCommentsByMarketRecordIdQuery(marketRecord?.id ? marketRecord.id : skipToken)
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            hour12: true,
        });
    };

    const [updateMarketRecordProgress, { isLoading: updateLoading }, error] = useUpdateMarketRecordProgressMutation();

    const [action, setAction] = useState(null)
    const [comment, setComment] = useState('')
    const [selectedViewers, setSelectedViewers] = useState([]);
    const [selectedViewer, setSelectedViewer] = useState('');
    const viewers = ['Viewer 1', 'Viewer 2', 'Viewer 3', 'Viewer 4'];

    const handleSelectChange = (e) => {
        setSelectedViewer(e.target.value);
    };

    const handleAddViewer = () => {
        if (selectedViewer && !selectedViewers.includes(selectedViewer)) {
            setSelectedViewers([...selectedViewers, selectedViewer]);
            setSelectedViewer('');
        }
    };

    const handleRemoveViewer = (viewer) => {
        setSelectedViewers(selectedViewers.filter((v) => v !== viewer));
    };

    const handleAction = async () => {
        try {
            const act = action == 'rollback' ? action : 'approve'
            const result = action == 'forward' ?
                await updateMarketRecordProgress({ id: marketRecord.id, data: { action: act, comment: comment, viewer: selectedViewers } })
                : await updateMarketRecordProgress({ id: marketRecord.id, data: { action: act, comment: comment } });

            console.log(result);
            if (result?.error) {
                message.error(result.error.data.error)
            } else {
                message.success(result.data.message)
            }
            setAction(null)
            setSelectedViewers([])

        } catch (e) {
            message.error(JSON.stringify(e));
        }
    }

    useUpdateMarketRecordProgressMutation()

    return (
        <div className="m-2 md:m-2 mt-2 p-2 md:p-4 bg-white rounded-3xl dark:bg-secondary-dark-bg">
            <div className='flex justify-between items-center' >
                <Header category="Page" title="Market Record Detail" />
            </div>
            <div className="container mx-auto px-4 py-8">
                <div className='grid grid-cols-2 gap-4 mb-8'>
                    <div>
                        <h1 className="text-2xl font-bold mb-4">{marketRecord.market}</h1>
                        <p className="text-lg mb-4">{marketRecord.season} - {marketRecord.year}</p>

                        <h2 className="text-xl font-bold mb-2">Created By:</h2>
                        <p className="mb-4">{marketRecord.created_by ? `${marketRecord.created_by.firstname} ${marketRecord.created_by.lastname}` : 'Unknown'}</p>

                    </div>

                    <div className="mb-8">
                        <h2 className="text-xl font-bold mb-2">Other Details:</h2>
                        <p> <span className='font-bold p-2'>Status:</span> <span className='uppercase' >{marketRecord.status}</span></p>
                        {marketRecord.verified_by ? (
                            <p>
                                <span className='font-bold p-2'>Verified By:</span>
                                {`${marketRecord.verified_by.firstname} ${marketRecord.verified_by.lastname}, ${marketRecord.verified_by.position}`}
                                <span className='text-xs text-blue-400'> ({marketRecord.verified_by.email})</span>
                            </p>
                        ) : (
                            <p>
                                <span className='font-bold p-2'>Verified By:</span> PENDDING
                            </p>
                        )}
                        {marketRecord.approved_by ? (
                            <p>
                                <span className='font-bold p-2'>Approved By:</span>
                                {`${marketRecord.approved_by.firstname} ${marketRecord.approved_by.lastname}, ${marketRecord.approved_by.position}`}
                                <span className='text-xs text-blue-400'> ({marketRecord.approved_by.email})</span>
                            </p>
                        ) : (
                            <p>
                                <span className='font-bold p-2'>Approved By:</span> PENDDING
                            </p>
                        )}
                        {marketRecord.approved_by ? (
                            <p>
                                <span className='font-bold p-2'>Forwarded By:</span>
                                {`${marketRecord.forwarded_by.firstname} ${marketRecord.forwarded_by.lastname}, ${marketRecord.forwarded_by.position}`}
                                <span className='text-xs text-blue-400'> ({marketRecord.forwarded_by.email})</span>
                            </p>
                        ) : (
                            <p>
                                <span className='font-bold p-2'>Forwarded By:</span> PENDDING
                            </p>
                        )}
                    </div>

                </div>
                <h2 className="text-xl font-bold mb-2">Records:</h2>
                <div className="grid grid-cols-2 gap-4 mb-8">
                    {marketRecord?.records?.map((record, index) => (
                        <div key={index} className="bg-gray-100 p-6 rounded-lg shadow-md">
                            <h3 className="text-xl font-semibold mb-2">{record.component_name}</h3>
                            <p className="text-gray-600 mb-2">{record.component_description}</p>
                            <div className="flex flex-wrap mb-2">
                                <div className="w-1/2">
                                    <p className="text-sm text-gray-500">Total Places Available:</p>
                                    <p className="text-lg font-semibold">{record.total_number_places_available}</p>
                                </div>
                                <div className="w-1/2">
                                    <p className="text-sm text-gray-500">Places Rented:</p>
                                    <p className="text-lg font-semibold">{record.number_places_rented}</p>
                                </div>
                            </div>
                            <div className="flex flex-wrap mb-2">
                                <div className="w-1/2">
                                    <p className="text-sm text-gray-500">Occupancy Rate:</p>
                                    <p className="text-lg font-semibold">{record.occupancy_rate}%</p>
                                </div>
                                <div className="w-1/2">
                                    <p className="text-sm text-gray-500">Observation:</p>
                                    <p className="text-lg font-semibold">{record.observation}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                {action && (
                    <div className=" flex justify-center items-center overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
                        <div className="relative w-auto my-6 mx-auto max-w-3xl">
                            <div className="border-2 border-color rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                                <div className="flex items-start justify-between p-5 border-b border-solid border-gray-300 rounded-t ">
                                    <h3 className="text-3xl font=semibold text-center">{action == 'rollback' ? 'Reject' : 'Approve'}</h3>
                                    <button
                                        style={{ backgroundColor: 'light - gray', color: 'rgb(153, 171, 180)', borderRadius: "50%" }}
                                        className="text-2xl p-3 hover:drop-shadow-xl hover:bg-light-gray"
                                        onClick={() => setAction(null)}
                                    >
                                        <MdOutlineCancel />
                                    </button>
                                </div>

                                <div className="shadow overflow-hidden sm:rounded-md">
                                    <div className="px-4 py-5 bg-white sm:p-6">

                                        <h3 className='mb-2'>Are you sure you want to '{action == 'rollback' ? 'Reject' : action}' this report</h3>
                                        <Space align="center" block="true">
                                            <Button type="primary" danger htmlType="button" onClick={handleAction}>
                                                Yes
                                            </Button>
                                            <Button htmlType="button" onClick={() => setAction(null)}>
                                                Cancel
                                            </Button>
                                        </Space>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <div><h2 className="font-bold mt-4 ">Action</h2>
                    {((currentUser.role.toLowerCase() == 'creator') && (marketRecord.status.toLowerCase() == 'rollback')) ?
                        <div className='border-t-1 p-2 border-b-1 items-center text-center'>
                            <div className='flex justify-between mx-4 '>
                                <p>This report has been sent back, kindly read the comment below and make the suggested changes</p>

                                <button
                                    onClick={() => { /* navigate to edit*/ }}
                                    type="button"
                                    style={{ backgroundColor: 'green' }}
                                    className="flex justify-between items-center text-sm opacity-0.9  text-white  hover:drop-shadow-xl rounded-xl p-2"
                                > <span className="h-12 ml-1"> {'Edit >>'} </span></button>
                            </div>
                        </div>
                        :
                        ((currentUser.role.toLowerCase() == 'verifier') && (marketRecord.status.toLowerCase() == 'pendding')) ?
                            <div className='border-t-1 p-2 border-b-1 items-center text-center'>
                                <div className='p-2 mb-1'>Kindly verify or reject this report</div>
                                <div className='flex justify-between mx-4 '>
                                    <button
                                        onClick={() => {
                                            if (!comment || comment.length < 3) {
                                                message.error("Please provide a valid comment for rejection")
                                            } else {
                                                setAction('rollback')
                                            }
                                        }}
                                        type="button"
                                        style={{ backgroundColor: 'orange' }}
                                        className="h-12 flex justify-between items-center text-sm opacity-0.9  text-white  hover:drop-shadow-xl rounded-xl p-2 mr-4"
                                    > <span className=""> {'<< Rejet'} </span>
                                    </button>

                                    <textarea
                                        name="comment"
                                        value={comment}
                                        rows={3}
                                        onChange={(e) => { setComment(e.target.value) }}
                                        placeholder='Comment'
                                        className="min-w-72 mr-1 p-2 border-1 border-blue-500 rounded-md shadow-md focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                    />

                                    <button
                                        onClick={() => { setAction('verify') }}
                                        type="button"
                                        style={{ backgroundColor: 'green' }}
                                        className="h-12 flex justify-between items-center text-sm opacity-0.9  text-white  hover:drop-shadow-xl rounded-xl p-2"
                                    > <span className="ml-1"> {'Proceed >>'} </span></button>
                                </div>
                            </div>
                            :
                            ((currentUser.role.toLowerCase() == 'approver') && (marketRecord.status.toLowerCase() == 'verified')) ?
                                <div className='border-t-1 p-2 border-b-1 items-center text-center'>
                                    <div className='p-2 mb-1'>Kindly approve or reject this report</div>
                                    <div className='flex justify-between mx-4 '>
                                        <button
                                            onClick={() => {
                                                if (!comment || comment.length < 3) {
                                                    message.error("Please provide a valid comment for rejection")
                                                } else {
                                                    setAction('rollback')
                                                }
                                            }}
                                            type="button"
                                            style={{ backgroundColor: 'orange' }}
                                            className="h-12 flex justify-between items-center text-sm opacity-0.9  text-white  hover:drop-shadow-xl rounded-xl p-2 mr-4"
                                        > <span className=""> {'<< Rejet'} </span>
                                        </button>

                                        <textarea
                                            name="comment"
                                            value={comment}
                                            rows={3}
                                            onChange={(e) => { setComment(e.target.value) }}
                                            placeholder='Comment'
                                            className="min-w-72 mr-1 p-2 border-1 border-blue-500 rounded-md shadow-md focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                        />

                                        <button
                                            onClick={() => { setAction('approve') }}
                                            type="button"
                                            style={{ backgroundColor: 'green' }}
                                            className="h-12 flex justify-between items-center text-sm opacity-0.9  text-white  hover:drop-shadow-xl rounded-xl p-2"
                                        > <span className="ml-1"> {'Proceed >>'} </span></button>
                                    </div>
                                </div>
                                :
                                ((currentUser.role.toLowerCase() == 'header') && (marketRecord.status.toLowerCase() == 'approved')) ?
                                    <div className='border-t-1 p-2 border-b-1 items-center text-center'>
                                        <div className='p-2 mb-1'>Kindly forward or reject this report</div>
                                        <div className='flex justify-between mx-4 '>
                                            <button
                                                onClick={() => {
                                                    if (!comment || comment.length < 3) {
                                                        message.error("Please provide a valid comment for rejection")
                                                    } else {
                                                        setAction('rollback')
                                                    }
                                                }}
                                                type="button"
                                                style={{ backgroundColor: 'orange' }}
                                                className="h-12 flex justify-between items-center text-sm opacity-0.9  text-white  hover:drop-shadow-xl rounded-xl p-2 mr-4"
                                            > <span className=""> {'<< Rejet'} </span>
                                            </button>
                                            <div>
                                                <textarea
                                                    name="comment"
                                                    value={comment}
                                                    rows={3}
                                                    onChange={(e) => { setComment(e.target.value) }}
                                                    placeholder='Comment'
                                                    className="min-w-72 mr-1 p-2 border-1 border-blue-500 rounded-md shadow-md focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                                />
                                                <div>
                                                    <select
                                                        value={selectedViewer}
                                                        onChange={handleSelectChange}
                                                        className="mr-2 p-2 border-1 border-blue-500 rounded-md shadow-md focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                                    >
                                                        <option value="">Select Viewer</option>
                                                        {viewers.map((viewer, index) => (
                                                            <option key={index} value={viewer}>{viewer}</option>
                                                        ))}
                                                    </select>
                                                    <button onClick={handleAddViewer} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                                                        Add Viewer
                                                    </button>
                                                    <div className="mt-4 flex">
                                                        {selectedViewers.map((viewer, index) => (
                                                            <div key={index} className="flex items-center mb-2 mr-2">
                                                                <span className="mr-1">{viewer}</span>
                                                                <button onClick={() => handleRemoveViewer(viewer)} className="text-red-500 font-bold px-2 focus:outline-none">X</button>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => {
                                                    if (!comment || comment.length < 3) {
                                                        message.error("Please provide a valid comment for rejection")
                                                    } else if (selectedViewers.length < 1) {
                                                        message.error("Please viewer(s)")
                                                    } else { }
                                                }}
                                                type="button"
                                                style={{ backgroundColor: 'green' }}
                                                className="h-12 flex justify-between items-center text-sm opacity-0.9  text-white  hover:drop-shadow-xl rounded-xl p-2"
                                            > <span className="ml-1"> {'Proceed >>'} </span></button>
                                        </div>
                                    </div>
                                    :
                                    <p className='text-center text-sm'> No action required from you</p>
                    }

                </div>



                <h2 className="font-bold mt-4">Comments</h2>
                {commentLoading && <Loading />}
                {!commentLoading && <div className="flex flex-wrap mb-2">
                    {comments?.length > 0 ? (
                        comments.map((comment, index) => (
                            <div key={index} className="w-full sm:w-1 md:w-1/2 lg:w-1/3 mb-4 p-4">
                                <div className="bg-gray-100 rounded-md p-4 text-sm ">
                                    <p className="text-gray-700 mb-2">
                                        <span className="font-bold">Commented By:</span>{' '}
                                        {`${comment.commented_by.firstname} ${comment.commented_by.lastname}, ${comment.commented_by.position}`}
                                    </p>
                                    <p className="text-gray-700 mb-2"><span className="font-bold">Comment:</span> {comment.comment}</p>
                                    <p className="text-gray-700"><span className="font-bold">Created At:</span> {formatDate(comment.created_at)}</p>
                                </div>
                            </div>
                        ))
                    ) : (comments?.length > 0 && currentUser.role.toLowerCase() == 'minister') ? (
                        comments.filter(comment => comment.commented_by.position === "mayor").map((comment, index) => (
                            <div key={index} className="w-full sm:w-1 md:w-1 lg:w-1/2 mb-4 p-4">
                                <div className="bg-gray-100 rounded-md p-4 text-sm ">
                                    <p className="text-gray-700 mb-2">
                                        <span className="font-bold">Commented By:</span>{' '}
                                        {`${comment.commented_by.firstname} ${comment.commented_by.lastname}, ${comment.commented_by.position}`}
                                    </p>
                                    <p className="text-gray-700 mb-2"><span className="font-bold">Comment:</span> {comment.comment}</p>
                                    <p className="text-gray-700"><span className="font-bold">Created At:</span> {formatDate(comment.created_at)}</p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className='text-sm'>No comments</p>
                    )}
                </div>
                }

            </div>
        </div>
    )
}

export default MarketRecordDetail