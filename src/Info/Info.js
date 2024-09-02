import React from 'react';
import './Info.css';

const Info = () => {
  return (
    <div className="max-w-4xl mx-auto mt-4 p-6 theme-primary-bg rounded-none">

      <h1 className="text-3xl font-semibold mb-6 theme-primary-text text-center">Info</h1>
      <div className="theme-secondary-text">
        <p className="mb-4">This application was developed by Aoife Mulvenna for her final project for the degree of MSc Software Development.</p>
        <p className="mb-4">The goal is to help students get the support they deserve both mentally and physically throughout their studies.</p>
        <p className="mb-4">Often, mental wellbeing surveys are completed at the end of a semester or academic year, and therefore are retrospective of how the student was feeling at the time, rather than a record of stats of their real emotions.</p>
        <p className="mb-4">The project is inspired by the OMNI Wellbeing survey completed by QUBSU in 2022 and based on its findings.</p>
      </div>
   
    </div>
  );
}

export default Info;
