import React, { useState, useEffect } from 'react'
import LineChart from './Charts/LineChart'
import SparkLine from './Charts/SparkLine'
import { useStateContext } from '../contexts/ContextProvider';
import { useGetMarketOccupancyRateQuery, useGetSeaonOccupancyRateQuery, useGetUserMarketRecordsQuery } from '../services/marketRecordService';
import { useGetMarketsQuery } from '../services/marketService';
import { useSelector } from "react-redux"
import { selectCurrentUser } from '../services/authSlice'


const DashboardView = () => {
  const { currentColor } = useStateContext();
  const currentUser = useSelector(selectCurrentUser)



  const { data, isLoading } = useGetUserMarketRecordsQuery(currentUser);

  const [selectedMarket, setSelectedMarket] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedMarketYear, setSelectedMarketYear] = useState('');
  const [years, setYears] = useState([]);

  const seasonOccupancy = {};
  const marketOccupancy = calculateAverageOccupancyRateByMarket(data ? data?.reports : [], selectedMarketYear)

  useEffect(() => {
    const currentYear = new Date().getFullYear();
    const yearArray = Array.from({ length: currentYear - 2023 }, (_, i) => 2024 + i);
    setYears(yearArray);
  }, []);

  const filteredSeasonOccupancyData = !seasonOccupancy ? [] : calculateAverageOccupancyRateBySeason(data ? data?.reports : [], selectedYear, selectedMarket);

  const markets = getUniqueMarkets(data ? data?.reports : [], selectedMarketYear)

  return (
    <>
      {isLoading ? <p>Loading ... </p> :

        <div className="mt-2">
          <div className="grid xs:grid-span-1 sm:grid-span-1 grid-cols-3 gap-4">
            <div
              className="xs:col-span-1 sm:col-span-1 md:col-span-2 p-4">
              <div className="flex justify-between items-center ">
                <p className="font-semibold text-blue-400 text-2xl">Occupancy Rate by Market</p>
                <div className="flex justify-between items-center ">
                  <div className="mr-8">
                    <select
                      value={selectedMarketYear}
                      onChange={(event) => { setSelectedMarketYear(event.target.value) }}
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
                <SparkLine id="market-sparkLine" data={marketOccupancy?.map(m => { return { x: m.market, averageOccupancyRate: Math.round(m.averageOccupancyRate * 10) / 10 } })} />
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
                    {markets?.map((market, index) => (
                      <option key={index} value={market}>{market}</option>
                    ))}
                  </select>
                  <select
                    value={selectedYear}
                    onChange={(event) => { setSelectedYear(event.target.value) }}
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
                <SparkLine id="season-sparkLine" data={filteredSeasonOccupancyData.map((m) => ({ x: m.season, averageOccupancyRate: Math.round(m.averageOccupancyRate * 10) / 10 }))} />
              </div>
            </div>
          </div>
        </div>
      }
    </>
  )
}

export default DashboardView


function calculateAverageOccupancyRateByMarket(reports, year = '') {
  const occupancyRatesByMarket = {};

  reports.forEach((report) => {
    if (year !== '' && report.year != year) {
      return; // Skip this report if the year doesn't match the provided year
    }

    const { market, records } = report;
    let totalOccupancy = 0;

    records.forEach((record) => {
      totalOccupancy += record.occupancy_rate;
    });

    const averageOccupancyRate = totalOccupancy / records.length;

    if (!occupancyRatesByMarket[market]) {
      occupancyRatesByMarket[market] = [];
    }

    occupancyRatesByMarket[market].push(averageOccupancyRate);
  });

  // Calculate the average occupancy rate for each market
  const averageOccupancyRateByMarket = [];
  for (const market in occupancyRatesByMarket) {
    if (occupancyRatesByMarket.hasOwnProperty(market)) {
      const rates = occupancyRatesByMarket[market];
      const total = rates.reduce((acc, rate) => acc + rate, 0);
      const average = total / rates.length;
      averageOccupancyRateByMarket.push({ market, averageOccupancyRate: average });
    }
  }

  return averageOccupancyRateByMarket;
}

function calculateAverageOccupancyRateBySeason(reports, year = '', smarket = '') {
  const occupancyRatesBySeason = {};

  reports.forEach((report) => {
    if ((year != '' && report.year != year) || (smarket != '' && report.market !== smarket)) {
      return; // Skip this report if the year or market doesn't match the provided year or market
    }

    const { season, records } = report;
    let totalOccupancy = 0;

    records.forEach((record) => {
      totalOccupancy += record.occupancy_rate;
    });

    const averageOccupancyRate = totalOccupancy / records.length;

    if (!occupancyRatesBySeason[season]) {
      occupancyRatesBySeason[season] = [];
    }

    occupancyRatesBySeason[season].push(averageOccupancyRate);
  });

  // Calculate the average occupancy rate for each season
  const averageOccupancyRateBySeason = [];
  for (const season in occupancyRatesBySeason) {
    if (occupancyRatesBySeason.hasOwnProperty(season)) {
      const rates = occupancyRatesBySeason[season];
      const total = rates.reduce((acc, rate) => acc + rate, 0);
      const average = total / rates.length;
      averageOccupancyRateBySeason.push({ season, averageOccupancyRate: average });
    }
  }

  return averageOccupancyRateBySeason;
}

function getUniqueMarkets(reports) {
  const uniqueMarkets = new Set();

  reports.forEach((report) => {
    uniqueMarkets.add(report.market);
  });

  return Array.from(uniqueMarkets);
}