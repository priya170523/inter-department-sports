
import React from 'react';
import NeuCard from '../components/ui/NeuCard';

// Using a factory to create simple pages for MVP scaffolding
const Page = ({ title }) => (
    <div className="max-w-4xl mx-auto">
        <NeuCard>
            <h2 className="text-2xl font-bold mb-4">{title}</h2>
            <p className="text-gray-500">This feature is coming soon / under development.</p>
        </NeuCard>
    </div>
);

export const Schedule = () => <Page title="Match Schedule" />;
export const Brackets = () => <Page title="Tournament Brackets" />;
export const Results = () => <Page title="Match Results" />;
export const Announcements = () => <Page title="Announcements & Updates" />;
export const Volunteer = () => <Page title="Volunteer Hub" />;

// Keep Exports clean
