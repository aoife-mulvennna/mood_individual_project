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
            .then(data => {
                console.log('Fetched resources in Resources component:', data.resources);
                setResources(data.resources);
            })
            .catch(error => console.error('Error fetching resources:', error));
    };

    return (
        <div className="p-6 theme-secondary-bg rounded-none shadow-sm border theme-border">
            <h5 className="text-lg font-semibold mb-2 theme-primary-text flex items-center border-b theme-border pb-2 justify-center">Useful Resources<p className="mx-2"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
            </svg>
            </p></h5>
            <ul className="list-none pl-0">
                {resources.map((resource, index) => (
                    <li key={index} className="mb-4">

                        <a href={resource.resource_link} target="_blank" rel="noopener noreferrer" className="theme-text-primary hover:underline">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5 inline-block align-middle">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" />
                        </svg>  {resource.resource_name}
                        </a>
                    </li>
                ))}
            </ul>
            {limit && (
                <div className="flex justify-end">
                    <a href="/resources" className="theme-secondary-text hover:underline">View More</a>
                </div>
            )}
        </div>
    );
};

export default Resources;
