import React, { useState } from 'react'
import { Header, Loading } from '../components'
import { useStateContext } from '../contexts/ContextProvider'
import { useAddMarketRecordMutation, useGetMarketRecordCommentsByMarketRecordIdQuery, useUpdateMarketRecordMutation, useUpdateMarketRecordProgressMutation } from '../services/marketRecordService'
import { skipToken } from '@reduxjs/toolkit/query'
import { MdOutlineCategory, MdOutlineCancel } from 'react-icons/md';
import { Space, Button, message } from 'antd';
import { useSelector } from "react-redux"
import { selectCurrentUser } from '../services/authSlice'
import { useGetViewersQuery } from '../services/userService';
import { useGetUserLocationMarketsQuery } from '../services/marketService'
import { formatDate } from '../util/helper'
import { useNavigate } from 'react-router-dom'
import { useGetComponentsQuery } from '../services/componentService'

const MarketRecordDetail = () => {
    const currentUser = useSelector(selectCurrentUser)
    const { marketRecord, setMarketRecord, editMarketRecord, setEditMarketRecord } = useStateContext()
    const navigate = useNavigate()
    const { data: comments, isLoading: commentLoading } = useGetMarketRecordCommentsByMarketRecordIdQuery(marketRecord?.id ? marketRecord?.id : skipToken)


    const { data: componentData } = useGetComponentsQuery();
    const components = componentData?.components.filter(component => component.market == marketRecord.market)

    const [updateMarketRecordProgress, { isLoading: updateLoading }, error] = useUpdateMarketRecordProgressMutation();

    const [action, setAction] = useState(null)
    const [comment, setComment] = useState('')
    const [selectedViewerIds, setSelectedViewerIds] = useState([]);
    const [selectedViewer, setSelectedViewer] = useState('');

    const { data } = useGetViewersQuery();
    console.log(data)
    const viewers = data?.users

    const handleSelectChange = (e) => {
        setSelectedViewer(e.target.value);
    };

    const handleAddViewer = () => {
        if (selectedViewer && !selectedViewerIds.includes(selectedViewer)) {
            setSelectedViewerIds([...selectedViewerIds, selectedViewer]);
            setSelectedViewer('');
        }
    };

    const handleRemoveViewer = (viewer) => {
        setSelectedViewerIds(selectedViewerIds.filter((v) => v !== viewer))
    };

    const handleAction = async () => {
        try {
            const act = action == 'rollback' ? action : 'approve'
            const result = action == 'forward' ?
                await updateMarketRecordProgress({ id: marketRecord?.id, data: { action: act, comment: comment, viewers: selectedViewerIds } })
                : await updateMarketRecordProgress({ id: marketRecord?.id, data: { action: act, comment: comment } });

            if (result?.error) {
                message.error(result.error.data.error)
            } else {
                message.success(result.data.message)
                navigate('/market-record')
            }
            setAction(null)
            setSelectedViewerIds([])

        } catch (e) {
            message.error(JSON.stringify(e));
        }
    }
    const dateObj = new Date();
    const yearStr = `${dateObj.getFullYear()}/${dateObj.getFullYear() + 1}`;
    const quaterList = [`Quater 1 ${yearStr}`, `Quater 2 ${yearStr}`, `Quater 3 ${yearStr}`, `Quater 4 ${yearStr}`]

    const handleChange = (e) => {
        const { name, value } = e.target;
        setMarketRecord({ ...marketRecord, [name]: value });
    };

    const handleRecordChange = (index, field, value) => {
        try {
            const updatedRecords = marketRecord.records.map((record, i) => {
                if (i === index) {
                    return { ...record, [field]: value };
                }
                return record;
            });
            setMarketRecord({ ...marketRecord, records: updatedRecords });
        } catch (e) {
            console.log(e, 'caught')
        }
    };
    const handle2RecordChange = (index, field, value, field2, value2) => {
        try {
            const updatedRecords = marketRecord.records.map((record, i) => {
                if (i === index) {
                    return { ...record, [field]: value, [field2]: value2 };
                }
                return record;
            });
            setMarketRecord({ ...marketRecord, records: updatedRecords });
        } catch (e) {
            console.log(e, 'caught')
        }
    };

    const handleAddRecord = () => {

        const hasEmptyComponentName = marketRecord.records.some(record => record.component_name.trim() === '');
        const hasValidNumbers = marketRecord.records.some(record => !record.total_number_places_available > 0 || !record.number_places_rented === '');
        if (hasEmptyComponentName || hasValidNumbers) {
            message.error("Provide data for components, number of places available and rented")
            return;
        }
        if (marketRecord?.market.trim() === '' || marketRecord?.season?.trim() === '') {
            message.error("Make sure to selet a market and season")
            return;
        }

        if (marketRecord.records.some(record => record.total_number_places_available < record.number_places_rented)) {
            message.error("Number of placess available can not be less that places rented")
            return;
        }

        setMarketRecord({
            ...marketRecord,
            records: [...marketRecord.records, {
                component_name: '',
                total_number_places_available: 0,
                number_places_rented: 0,
                observation: ''
            }]
        });
    };

    const handleRemoveRecord = (index) => {
        const updatedRecords = [...marketRecord.records];
        updatedRecords.splice(index, 1);
        setMarketRecord({ ...marketRecord, records: updatedRecords });
    };

    const [addMarketRecord, { isLoading: addLoading }] = useAddMarketRecordMutation();
    const [updateMarketRecord, { isLoading: editLoading }] = useUpdateMarketRecordMutation();
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (editMarketRecord) {
            console.log(marketRecord);
            try {
                delete marketRecord.status
                const result = await updateMarketRecord(marketRecord);
                console.log(result);
                if (result.error) {
                    message.error(result.error.data.message)
                    // setMarketRecord(marketRecord)
                    setEditMarketRecord(false)
                } else {
                    message.success(result.data.message)
                    setMarketRecord(result.data.report)
                    setEditMarketRecord(false)
                }

            } catch (e) {
                message.error(e);
            }
        } else {
            console.log(marketRecord);
            try {
                const result = await addMarketRecord(marketRecord);
                console.log(result);
                if (result.error) {
                    message.error(result.error.data.message)
                    setMarketRecord(marketRecord)
                } else {
                    message.success(result.data.message)
                    setMarketRecord(result.data.report)

                }

            } catch (e) {
                message.error(e);
            }
        }
    };

    const getViewerName = (viewerId) => {
        const viewer = viewers.find(v => v.id == viewerId)
        return `${viewer?.firstname} ${viewer.lastname}`
    }
    const { data: marketRecordList } = useGetUserLocationMarketsQuery();
    const markets = marketRecordList?.markets;


    const totalPlacesAvailable = Math.round(marketRecord?.records.reduce((total, record) => total + record.total_number_places_available, 0) * 10) / 10;
    const totalPlacesRented = Math.round(marketRecord?.records.reduce((total, record) => total + record.number_places_rented, 0) * 10) / 10;
    const totalOccupancyRate = Math.round(totalPlacesRented * 100 / totalPlacesAvailable * 10) / 10;

    return (
        <div className="m-2 md:m-2 mt-2 p-2 md:p-4 bg-white rounded-3xl dark:bg-secondary-dark-bg">
            <div className='flex justify-between items-center' >
                <Header category="Page" title={marketRecord?.market == '' ? "Add Market Record" : !editMarketRecord ? "Market Record Detail" : "Edit Market Record"} />
            </div>
            {(!editMarketRecord && !marketRecord?.id == '') ?
                (<div className="container mx-auto px-4 py-8">
                    <div className='grid grid-cols-2 gap-4 mb-8'>
                        <div>
                            <h1 className="text-2xl font-bold mb-4">{marketRecord?.market}</h1>
                            <p className="text-lg mb-4">{marketRecord?.season} - {marketRecord?.year}</p>

                            <h2 className="text-xl font-bold mb-2">Created By:</h2>
                            <p className="mb-4">{marketRecord?.created_by ? `${marketRecord?.created_by?.firstname} ${marketRecord?.created_by?.lastname}` : 'Unknown'}</p>
                            <p className='text-xs text-blue-500'> <span className='text-gray-700 font-bold'>On: </span> {marketRecord?.created_at ? `${formatDate(marketRecord?.created_at)}` : ''}</p>

                        </div>

                        <div className="mb-8">
                            <h2 className="text-xl font-bold mb-2">Progress Details:</h2>
                            <p> <span className='font-bold p-2'>Status:</span> <span className='uppercase' >{marketRecord?.status}</span></p>
                            {marketRecord?.verified_by ? (
                                <p>
                                    <span className='font-bold p-2'>Verified By:</span>
                                    {`${marketRecord?.verified_by?.firstname} ${marketRecord?.verified_by?.lastname}, ${marketRecord?.verified_by?.position}`}
                                    {marketRecord?.verified_at && <span className='text-xs text-blue-400'> ({marketRecord?.verified_at})</span>}
                                </p>
                            ) : (
                                <p>
                                    <span className='font-bold p-2'>Verified By:</span> PENDING
                                </p>
                            )}
                            {marketRecord?.approved_by ? (
                                <p>
                                    <span className='font-bold p-2'>Approved By:</span>
                                    {`${marketRecord?.approved_by?.firstname} ${marketRecord?.approved_by?.lastname}, ${marketRecord?.approved_by?.position}`}
                                    {marketRecord?.approved_at && <span className='text-xs text-blue-400'> ({marketRecord?.approved_at})</span>}
                                </p>
                            ) : (
                                <p>
                                    <span className='font-bold p-2'>Approved By:</span> PENDING
                                </p>
                            )}
                            {marketRecord?.forwarded_by ? (
                                <p>
                                    <span className='font-bold p-2'>Forwarded By:</span>
                                    {`${marketRecord?.forwarded_by?.firstname} ${marketRecord?.forwarded_by?.lastname}, ${marketRecord?.forwarded_by?.position}`}
                                    {marketRecord?.forwarded_at && <span className='text-xs text-blue-400'> ({marketRecord?.forwarded_at})</span>}
                                </p>
                            ) : (
                                <p>
                                    <span className='font-bold p-2'>Submitted By:</span> PENDING
                                </p>
                            )}
                        </div>

                    </div>
                    <h2 className="text-xl font-bold mb-2">Records:</h2>
                    <div className="max-w-screen-xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                        <table className="w-full divide-y divide-gray-200">
                            <thead>
                                <tr>
                                    <th className="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">Component Name</th>
                                    <th className="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">Total Places Available</th>
                                    <th className="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">Places Rented</th>
                                    <th className="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">Occupancy Rate (%)</th>
                                    <th className="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">Observation</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {marketRecord?.records?.map((record, index) => (
                                    <tr key={index}>
                                        <td className="px-6 py-4 whitespace-no-wrap">{record.component_name}</td>
                                        <td className="px-6 py-4 whitespace-no-wrap">{Math.round(record.total_number_places_available * 10) / 10}</td>
                                        <td className="px-6 py-4 whitespace-no-wrap">{Math.round(record.number_places_rented * 10) / 10}</td>
                                        <td className="px-6 py-4 whitespace-no-wrap">{Math.round(record.occupancy_rate * 10) / 10}</td>
                                        <td className="px-6 py-4 whitespace-no-wrap">{record.observation}</td>
                                    </tr>
                                ))}
                            </tbody>
                            <tfoot>
                                <tr>
                                    <td className="px-6 py-4 font-bold">Total</td>
                                    <td className="px-6 py-4 font-bold">{totalPlacesAvailable}</td>
                                    <td className="px-6 py-4 font-bold">{totalPlacesRented}</td>
                                    <td className="px-6 py-4 font-bold">{totalOccupancyRate}</td>
                                    <td className="px-6 py-4"></td> {/* Empty cell for the 'Observation' column */}
                                </tr>
                            </tfoot>
                        </table>
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
                        {((currentUser.role?.toLowerCase() == 'creator') && (marketRecord?.status?.toLowerCase() == 'rollback')) ?
                            <div className='border-t-1 p-2 border-b-1 items-center text-center'>
                                <div className='flex justify-between mx-4 '>
                                    <p>This report has been sent back, kindly read the comment below and make the suggested changes</p>

                                    <button
                                        onClick={() => {
                                            setEditMarketRecord(true)
                                        }}
                                        type="button"
                                        style={{ backgroundColor: 'green' }}
                                        className="flex justify-between items-center text-sm opacity-0.9  text-white  hover:drop-shadow-xl rounded-xl p-2"
                                    > <span className="h-12 ml-1"> {'Edit >>'} </span></button>
                                </div>
                            </div>
                            :
                            ((currentUser.role?.toLowerCase() == 'verifier') && ((marketRecord?.status?.toLowerCase() == 'pending') || marketRecord?.status?.toLowerCase() == 'rollback_to_be_signed')) ?
                                <div className='border-t-1 p-2 border-b-1 items-center text-center'>
                                    <div className='p-2 mb-1'>Kindly verify or reject this report</div>
                                    <div className='flex justify-between mx-4 '>
                                        <button
                                            onClick={() => {
                                                if (!comment || comment.trim().length < 5) {
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
                                ((currentUser.role?.toLowerCase() == 'approver') && (marketRecord?.status?.toLowerCase() == 'verified')) ?
                                    <div className='border-t-1 p-2 border-b-1 items-center text-center'>
                                        <div className='p-2 mb-1'>Kindly approve or reject this report</div>
                                        <div className='flex justify-between mx-4 '>
                                            <button
                                                onClick={() => {
                                                    if (!comment || comment.trim().length < 5) {
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
                                    ((currentUser.role?.toLowerCase() == 'header') && (marketRecord?.status?.toLowerCase() == 'approved')) ?
                                        <div className='border-t-1 p-2 border-b-1 items-center text-center'>
                                            <div className='p-2 mb-1'>Kindly forward or reject this report</div>
                                            <div className='flex justify-between mx-4 '>
                                                <button
                                                    onClick={() => {
                                                        if (!comment || comment.trim().length < 5) {
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
                                                            {viewers?.map((viewer, index) => (
                                                                <option key={index} value={viewer.id}>{`${viewer.firstname} ${viewer.lastname}`}</option>
                                                            ))}
                                                        </select>
                                                        <button onClick={handleAddViewer} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                                                            Add Viewer
                                                        </button>
                                                        <div className="mt-4 flex">
                                                            {selectedViewerIds.map((viewer, index) => (
                                                                <div key={index} className="flex items-center mb-2 mr-2">
                                                                    <span className="mr-1">{getViewerName(viewer)}</span>
                                                                    <button onClick={() => handleRemoveViewer(viewer)} className="text-red-500 font-bold px-2 focus:outline-none">X</button>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={() => {
                                                        if (!comment || comment.trim().length < 5) {
                                                            message.error("Please provide a valid comment for rejection")
                                                        } else if (selectedViewerIds.length < 1) {
                                                            message.error("Please add viewer(s)")
                                                        } else {
                                                            setAction('forward')
                                                        }
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
                                            {`${comment.commented_by?.firstname} ${comment.commented_by?.lastname}, ${comment.commented_by?.position}`}
                                        </p>
                                        <p className="text-gray-700 mb-2"><span className="font-bold">Comment:</span> {comment.comment}</p>
                                        <p className=" text-xs text-blue-400"><span className="font-bold"></span> {formatDate(comment.created_at)}</p>
                                    </div>
                                </div>
                            ))
                        ) : (comments?.length > 0 && currentUser.role?.toLowerCase() == 'minister') ? (
                            comments.filter(comment => comment.commented_by?.position === "mayor").map((comment, index) => (
                                <div key={index} className="w-full sm:w-1 md:w-1 lg:w-1/2 mb-4 p-4">
                                    <div className="bg-gray-100 rounded-md p-4 text-sm ">
                                        <p className="text-gray-700 mb-2">
                                            <span className="font-bold">Commented By:</span>{' '}
                                            {`${comment.commented_by?.firstname} ${comment.commented_by?.lastname}, ${comment.commented_by?.position}`}
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

                </div>)
                :
                <div className='container mx-auto px-4 py-8'>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4 flex">
                            <div>

                                <label htmlFor="market" className="block text-gray-700 font-bold mb-2">Market</label>


                                <select id="market" name="market" value={marketRecord?.market} onChange={handleChange}
                                    className="appearance-none border rounded py-2 px-8 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                >
                                    <option value="" >Select market</option>
                                    {markets?.map(cat => <option key={cat.id} value={cat.name}>{cat.name}</option>)}
                                </select>
                            </div>
                            <div className='ml-8'>

                                <label htmlFor="season" className="block text-gray-700 font-bold mb-2">Season</label>


                                <select id="season" name="season" value={marketRecord?.season} onChange={handleChange}
                                    className="appearance-none border rounded py-2 px-8 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                >
                                    <option value="" >Select season</option>
                                    {quaterList?.map((quater, index) => <option key={index} value={quater}>{quater}</option>)}
                                </select>
                            </div>
                        </div>
                        {marketRecord.records.map((record, index) => (
                            <div key={index} className="flex flex-wrap items-center mb-4 px-4  py-1 border border-gray-300 justify-between rounded">
                                < label className=" text-gray-700 font-bold mb-2 mr-1">{index + 1}</label>

                                <div>
                                    <label htmlFor={`component_name_${index}`} className="block text-gray-700 text-xs font-bold mr-2">Component Name</label>
                                    <select
                                        name="component_name"
                                        value={record.component_name}
                                        onChange={(e) => {
                                            if (marketRecord.records.some(record => record.component_name === e.target.value))
                                                message.error("component already added")
                                            else
                                                handle2RecordChange(index, 'component_name', e.target.value, 'total_number_places_available', e.target.selectedOptions[0].getAttribute('data-available'))
                                        }}
                                        className="mr-2 mb-2  border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    >
                                        <option value="" data-available="">Select</option>
                                        {components.map(component => <option key={component.id} value={component.name} data-available={component.total_number_places_available}>{component.name}</option>)}
                                    </select>
                                </div>
                                <div className="items-center mb-2">
                                    <label htmlFor={`total_number_places_available_${index}`} className="block text-gray-700 font-bold text-xs mr-2">Total Number of Places Available</label>
                                    <input
                                        type="number"
                                        id={`total_number_places_available_${index}`}
                                        name="total_number_places_available"
                                        readOnly
                                        value={record.total_number_places_available}
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            if (/^\d*$/.test(value) && parseInt(value) >= 0) {
                                                handleRecordChange(index, 'total_number_places_available', parseInt(value));
                                            }
                                        }}
                                        placeholder="Total Number of Places Available"
                                        className="mr-2 appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        step="1"
                                    />
                                </div>
                                <div className="items-center mb-2">
                                    <label htmlFor={`number_places_rented_${index}`} className="block text-gray-700 font-bold text-xs mr-2">Number of Places Rented</label>
                                    <input
                                        type="number"
                                        id={`number_places_rented_${index}`}
                                        name="number_places_rented"
                                        value={record.number_places_rented}
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            if (/^\d*$/.test(value) && parseInt(value) >= 0) {
                                                handleRecordChange(index, 'number_places_rented', parseInt(value));
                                            }
                                        }}
                                        placeholder="Number of Places Rented"
                                        className="mr-2 appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        step="1" // Ensure only whole numbers are accepted
                                    />
                                </div>

                                <div>
                                    <label htmlFor={`observation_${index}`} className="block text-gray-700 text-xs font-bold mr-2">Observation</label>
                                    <textarea
                                        name="observation"
                                        value={record.observation}
                                        onChange={(e) => handleRecordChange(index, 'observation', e.target.value)}
                                        placeholder="Observation"
                                        className="mr-2 mb-2 appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    />
                                </div>
                                <button
                                    type="button"
                                    onClick={() => handleRemoveRecord(index)}
                                    className="flex-shrink-0 bg-red-500 hover:bg-red-700 text-white font-bold text-sm py-2 px-2 rounded focus:outline-none focus:shadow-outline"
                                >
                                    X
                                </button>
                            </div>


                        ))}
                        <div className='flex justify-between mx-8'>
                            <button type="button" onClick={handleAddRecord} className="mb-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Add Record</button>
                            {marketRecord.records.length > 0 ? <button type="submit" className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Submit</button> : ''}
                        </div>
                    </form>
                </div>
            }
        </div>
    )
}

export default MarketRecordDetail