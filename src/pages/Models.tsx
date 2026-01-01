import React, { useEffect, useState } from 'react'

import { modelsAPI } from '../services/api'
import { Trash2 } from 'lucide-react';

const Models = () => {

    const [Models, setModels] = useState([]);

    useEffect(() => {
        const fetchModels = async () => {
            const response: any = await modelsAPI.getModels();
            setModels(response.data);
        }

        fetchModels();
    }, []);

    const deleteModel = (model: any) => {
        modelsAPI.deleteModel(model._id).then(() => {
            setModels(Models.filter((m: any) => m._id !== model._id));
        });
    }

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Models</h1>
            <table className="w-full border-collapse border border-gray-300">
                <thead className="bg-gray-100">
                    <tr>
                        <th className="border border-gray-300 p-2 text-left">Name</th>
                        <th className="border border-gray-300 p-2 text-left">Accessory Charge</th>
                        <th className="border border-gray-300 p-2 text-center">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {Models.map((model: any) => (
                        <tr key={model._id} className="hover:bg-gray-50">
                            <td className="border border-gray-300 p-2">{model.name}</td>
                            <td className="border border-gray-300 p-2">${model.accessoryCharge}</td>
                            <td className="border border-gray-300 p-2 text-center">
                                <button
                                    onClick={() => deleteModel(model)}
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
export default Models