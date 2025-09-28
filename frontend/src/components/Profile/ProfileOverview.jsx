import React from 'react';

const Section = ({ title, children }) => (
  <div className="border-t border-neutral-800 pt-4">
    <h2 className="text-lg font-semibold text-neutral-400 mb-3">{title}</h2>
    <div className="text-neutral-300">{children}</div>
  </div>
);

const EducationCard = ({ edu }) => (
  <div className="mb-2">
    <p className="font-semibold text-white">{edu.degree}</p>
    <p className="text-sm text-neutral-400">{edu.institution} - {edu.year}</p>
  </div>
);

export default function ProfileOverview({ profile }) {
  const { bio, skills, experience_years, education } = profile;

  return (
    <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-6 space-y-6">
      <Section title="About Me">
        <p className="whitespace-pre-wrap leading-relaxed">{bio || "No biography provided."}</p>
      </Section>
      
      <Section title="Skills">
        <div className="flex flex-wrap gap-2">
          {skills && skills.length > 0 ? (
            skills.map(skill => (
              <span key={skill} className="bg-neutral-800 text-cyan-400 px-3 py-1 rounded-full text-sm font-medium">
                {skill}
              </span>
            ))
          ) : (
            <p className="text-sm text-neutral-500">No skills listed.</p>
          )}
        </div>
      </Section>
      
      <Section title="Experience">
        <p>{experience_years} {experience_years === 1 ? 'year' : 'years'}</p>
      </Section>
      
      <Section title="Education">
        {education && education.length > 0 ? (
          education.map((edu, index) => <EducationCard key={index} edu={edu} />)
        ) : (
          <p className="text-sm text-neutral-500">No education history provided.</p>
        )}
      </Section>
    </div>
  );
}