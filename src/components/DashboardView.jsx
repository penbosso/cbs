import React, { useState, useEffect } from 'react'
import LineChart from './Charts/LineChart'
import SparkLine from './Charts/SparkLine'
import { SparklineAreaData } from '../data/dummy'
import { useStateContext } from '../contexts/ContextProvider';
import { useGetMarketOccupancyRateQuery, useGetSeaonOccupancyRateQuery } from '../services/marketRecordService';
import { useGetMarketsQuery } from '../services/marketService';


const DashboardView = () => {
  const { currentColor } = useStateContext();

  const [selectedMarket, setSelectedMarket] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedMarketYear, setSelectedMarketYear] = useState('');
  const [years, setYears] = useState([]);

  const { data: seasonOccupancy } = useGetSeaonOccupancyRateQuery()
  const { data: marketOccupancy, isLoading } = useGetMarketOccupancyRateQuery({'year':selectedMarketYear})
  const { data } = useGetMarketsQuery();
  const markets = data?.markets

  console.log(selectedMarketYear)
  useEffect(() => {
    const currentYear = new Date().getFullYear();
    const yearArray = Array.from({ length: currentYear - 2023 }, (_, i) => 2024 + i);
    setYears(yearArray);
  }, []);

  return (
    <>
      {isLoading ? <p>Loading ... </p> :

        <div className="mt-2">
          <div className="grid grid-cols-3 gap-4">
            <div
              className=" col-span-2 p-4">
              <div className="flex justify-between items-center ">
                <p className="font-semibold text-blue-400 text-2xl">Occupancy Rate by Market</p>
              <div className="flex justify-between items-center ">
                <div className="mr-8">
                  <select
                    value={selectedMarketYear}
                    onChange={ (event) => {setSelectedMarketYear(event.target.value)}}
                    className="p-2 border border-gray-300 rounded-md"
                  >
                    <option value="">All Years</option>
                    {years.map((year) => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                </div>
              </div>
              </div>

              <div className="mt-4 h-56">
                <SparkLine id="market-sparkLine" data={marketOccupancy?.map(m => { return { x: m.market, average_occupancy_rate: Math.round(m.average_occupancy_rate * 10) / 10 } })} />
              </div>
            </div>
            <div className="p-4">
              <div className="flex justify-between items-center ">
                <p className="font-semibold text-blue-400 text-2xl">By season</p>
                <div className="flex space-x-4">
                  <select
                    value={selectedMarket}
                    onChange={(event) => { setSelectedMarket(event.target.value) }}
                    className="p-2 border border-gray-300 rounded-md"
                  >
                    <option value="">All Markets</option>
                    {markets?.map((market) => (
                      <option key={market} value={market}>{market}</option>
                    ))}
                  </select>
                  <select
                    value={selectedYear}
                    onChange={ (event) => {setSelectedYear(event.target.value)}}
                    className="p-2 border border-gray-300 rounded-md"
                  >
                    <option value="">All Years</option>
                    {years.map((year) => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="mt-4 h-56">
                <SparkLine id="season-sparkLine" data={seasonOccupancy.map((m) => ({ x: m.season, average_occupancy_rate: Math.round(m.avg_occupancy_rate * 10) / 10 }))} />
              </div>
            </div>
          </div>
        </div>
      }
    </>
  )
}

export default DashboardView