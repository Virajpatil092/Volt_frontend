import React, { useEffect, useState } from 'react'

import { batteriesAPI } from '../services/api'
import { Trash2 } from 'lucide-react';

const Battery = () => {

    const [Battery, setBattery] = useState([]);

    useEffect(() => {
        
        const fetchBatteries = async () => {
            const response: any = await batteriesAPI.getBatteries();
            setBattery(response.data);
        }

        fetchBatteries();
    }, []);

    const deleteBattery = (battery: any) => {
        batteriesAPI.deleteBattery(battery._id).then(() => {
            setBattery(Battery.filter((b: any) => b._id !== battery._id));
        });
    }

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Battery</h1>
            <table className="w-full border-collapse border border-gray-300">
                <thead className="bg-gray-100">
                    <tr>
                        <th className="border border-gray-300 p-2 text-left">Name</th>
                        <th className="border border-gray-300 p-2 text-left">capacity </th>
                        <th className="border border-gray-300 p-2 text-center">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {Battery.map((battery: any) => (
                        <tr key={battery._id} className="hover:bg-gray-50">
                            <td className="border border-gray-300 p-2">{battery.name}</td>
                            <td className="border border-gray-300 p-2">${battery.capacity}</td>
                            <td className="border border-gray-300 p-2 text-center">
                                <button
                                    onClick={() => deleteBattery(battery)}
                                    className="text-red-500 hover:text-red-700"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}
export default Battery;