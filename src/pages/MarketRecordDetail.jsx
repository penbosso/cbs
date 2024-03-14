import React from 'react'
import { Header, Loading } from '../components'
import { useStateContext } from '../contexts/ContextProvider'
import { useGetUsersQuery } from '../services/userService'
import { useGetMarketRecordCommentsByMarketRecordIdQuery } from '../services/marketRecordService'
import { skipToken } from '@reduxjs/toolkit/query'

const MarketRecordDetail = () => {
    const { marketRecord } = useStateContext()
console.log(marketRecord,'makk')
    const { data: comments } = useGetMarketRecordCommentsByMarketRecordIdQuery(marketRecord?.id ? marketRecord.id : skipToken)
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
                                <span className='font-bold p-2'>Verified By:</span> Not verified
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
                <h2 className="font-bold">Comments</h2>
                <div className="flex flex-wrap">
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
                    ) : (
                        <p>No comments</p>
                    )}
                </div>
                <div className='border-t-1 p-2 border-b-1 items-center text-center'>
                    <span className='p-2 font-bold'>Send for verification</span>
                    <div className='flex justify-between mx-4 '>

                        <button
                            onClick={() => { }}
                            type="button"
                            style={{ backgroundColor: 'orange' }}
                            className="flex justify-between items-center text-sm opacity-0.9  text-white  hover:drop-shadow-xl rounded-xl p-2 mr-4"
                        > <span className=""> {'<< Rejet'} </span></button>

                        
                            <input
                                type="text"
                                name="comment"
                                placeholder='Comment'
                                className="mr-1 p-2 border-1 border-blue-500 rounded-md shadow-md focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                            />

                        <button
                            onClick={() => { }}
                            type="button"
                            style={{ backgroundColor: 'green' }}
                            className="flex justify-between items-center text-sm opacity-0.9  text-white  hover:drop-shadow-xl rounded-xl p-2"
                        > <span className="ml-1"> {'Proceed >>'} </span></button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default MarketRecordDetail