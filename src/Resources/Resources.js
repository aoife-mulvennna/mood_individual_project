import React, { useState, useEffect } from 'react';
import { variables } from '../Variables';

const Resources = ({ limit }) => {
    const [resources, setResources] = useState([]);

    useEffect(() => {
        fetchResources();
    }, []);

    const fetchResources = () => {
        fetch(`${variables.API_URL}resources?limit=${limit}`, {
            headers: {
                'Authorization': `Bearer ${sessionStorage.getItem('token')}`
            }
        })
            .then(response => response.json())
            .then(data => setResources(data.resources))
            .catch(error => console.error('Error fetching resources:', error));
    };

    return (
        <div className="p-6 theme-secondary-bg rounded-lg shadow">
            <h5 className="text-lg font-semibold mb-4 theme-primary-text flex items-center">Useful Resources</h5>
            <ul className="list-none pl-0">
                {resources.map((resource, index) => (
                    <li key={index} className="mb-4">
                        <a href={resource.resource_link} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                            {resource.resource_name}
                        </a>
                        <div className="text-sm text-gray-500">{new Date(resource.resource_added_date).toLocaleDateString()}</div>
                    </li>
                ))}
            </ul>
            {limit && (
                <div className="flex justify-end">
                    <a href="/resources" className="text-blue-500 hover:underline">View More</a>
                </div>
            )}
        </div>
    );
};

export default Resources;
