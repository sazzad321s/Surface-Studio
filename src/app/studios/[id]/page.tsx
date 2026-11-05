import React from 'react';

const StudioDetailsPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {

    const {id} = await params;

    try {
        const res = await fetch(``)
    } catch (error) {
        
    }
    return (

        <div>
            
        </div>
    );
};

export default StudioDetailsPage;