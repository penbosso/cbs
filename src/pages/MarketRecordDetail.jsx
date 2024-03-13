import React from 'react'
import { Header } from '../components'
import { useStateContext } from '../contexts/ContextProvider'

const MarketRecordDetail = () => {
    const { marketRecord } = useStateContext()
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
                        <p><span className='font-bold p-2' >Verified By:</span>  {marketRecord.verified_by ? marketRecord.verified_by : 'Not verified'}</p>
                        <p><span className='font-bold p-2' >Approved By:</span>  {marketRecord.approved_by ? marketRecord.approved_by : 'Not approved'}</p>
                        <p><span className='font-bold p-2' >Forwarded By:</span>  {marketRecord.forwarded_by ? marketRecord.forwarded_by : 'Not forwarded'}</p>
                        {/* Add other fields here */}
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

                <div className='flex justify-between mx-4 border-t-1 p-2 border-b-1'>
                    <button
                        onClick={() => { }}
                        type="button"
                        style={{ backgroundColor: 'orange' }}
                        className="flex justify-between items-center text-sm opacity-0.9  text-white  hover:drop-shadow-xl rounded-xl p-2 mr-4"
                    > <span className=""> {'<< Rejet'} </span></button>
                    <button
                        onClick={() => { }}
                        type="button"
                        style={{ backgroundColor: 'green' }}
                        className="flex justify-between items-center text-sm opacity-0.9  text-white  hover:drop-shadow-xl rounded-xl p-2"
                    > <span className="ml-1"> {'Approve >>'} </span></button>
                </div>
            </div>
        </div>
    )
}

export default MarketRecordDetail