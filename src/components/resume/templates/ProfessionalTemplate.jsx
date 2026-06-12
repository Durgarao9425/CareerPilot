const ProfessionalTemplate = ({ data }) => {
  const { personalInfo = {}, summary, experience = [], education = [], skills = [] } = data || {};
  return (
    <div style={{ fontFamily: 'Georgia, serif', minHeight: '297mm', width: '210mm', background: '#fff', color: '#1a1a1a', padding: '32px' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', borderBottom: '2px solid #1a1a1a', paddingBottom: '16px', marginBottom: '20px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 'bold', letterSpacing: '2px', margin: 0 }}>{personalInfo.fullName || 'YOUR NAME'}</h1>
        <p style={{ fontSize: '13px', color: '#555', marginTop: '4px' }}>{personalInfo.title}</p>
        <div style={{ fontSize: '11px', color: '#666', marginTop: '8px', display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
          {personalInfo.email && <span>✉ {personalInfo.email}</span>}
          {personalInfo.phone && <span>📞 {personalInfo.phone}</span>}
          {personalInfo.location && <span>📍 {personalInfo.location}</span>}
          {personalInfo.linkedin && <span>LinkedIn: {personalInfo.linkedin}</span>}
        </div>
      </div>

      {/* Summary */}
      {summary && (
        <section style={{ marginBottom: '16px' }}>
          <h2 style={{ fontSize: '12px', fontWeight: 'bold', letterSpacing: '2px', textTransform: 'uppercase', borderBottom: '1px solid #ccc', paddingBottom: '4px', marginBottom: '8px' }}>Summary</h2>
          <p style={{ fontSize: '11px', lineHeight: '1.6', color: '#333' }}>{summary}</p>
        </section>
      )}

      {/* Experience */}
      {experience.length > 0 && (
        <section style={{ marginBottom: '16px' }}>
          <h2 style={{ fontSize: '12px', fontWeight: 'bold', letterSpacing: '2px', textTransform: 'uppercase', borderBottom: '1px solid #ccc', paddingBottom: '4px', marginBottom: '10px' }}>Professional Experience</h2>
          {experience.map((exp) => (
            <div key={exp.id} style={{ marginBottom: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <p style={{ fontSize: '13px', fontWeight: 'bold' }}>{exp.title}</p>
                  <p style={{ fontSize: '12px', fontStyle: 'italic', color: '#555' }}>
                    {exp.showLinkInTitle && exp.website ? (
                      <a href={exp.website} target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'underline' }}>{exp.company}</a>
                    ) : exp.company}
                    {exp.location && `, ${exp.location}`}
                  </p>
                </div>
                <p style={{ fontSize: '11px', color: '#666', whiteSpace: 'nowrap' }}>{exp.startDate} — {exp.current ? 'Present' : exp.endDate}</p>
              </div>
              
              {exp.roles && exp.roles.length > 0 ? (
                <div style={{ marginTop: '6px', marginLeft: '12px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {exp.roles.map((role) => (
                    <div key={role.id}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                        <p style={{ fontSize: '11px', fontWeight: 'bold' }}>{role.title}</p>
                        <p style={{ fontSize: '10px', color: '#666' }}>{role.period}</p>
                      </div>
                      {role.description && <p style={{ fontSize: '10px', lineHeight: '1.5', color: '#333', marginTop: '2px', whiteSpace: 'pre-line' }}>{role.description}</p>}
                    </div>
                  ))}
                </div>
              ) : (
                exp.description && <p style={{ fontSize: '11px', lineHeight: '1.6', color: '#333', marginTop: '4px', whiteSpace: 'pre-line' }}>{exp.description}</p>
              )}
            </div>
          ))}
        </section>
      )}

      {/* Education */}
      {education.length > 0 && (
        <section style={{ marginBottom: '16px' }}>
          <h2 style={{ fontSize: '12px', fontWeight: 'bold', letterSpacing: '2px', textTransform: 'uppercase', borderBottom: '1px solid #ccc', paddingBottom: '4px', marginBottom: '10px' }}>Education</h2>
          {education.map((edu) => (
            <div key={edu.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <div>
                <p style={{ fontSize: '13px', fontWeight: 'bold' }}>{edu.degree} in {edu.field}</p>
                <p style={{ fontSize: '12px', fontStyle: 'italic', color: '#555' }}>
                  {edu.showLinkInTitle && edu.website ? (
                    <a href={edu.website} target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'underline' }}>{edu.institution}</a>
                  ) : edu.institution}
                </p>
              </div>
              <p style={{ fontSize: '11px', color: '#666' }}>{edu.startDate} — {edu.endDate}</p>
            </div>
          ))}
        </section>
      )}

      {/* Skills */}
      {skills.length > 0 && (
        <section>
          <h2 style={{ fontSize: '12px', fontWeight: 'bold', letterSpacing: '2px', textTransform: 'uppercase', borderBottom: '1px solid #ccc', paddingBottom: '4px', marginBottom: '8px' }}>Skills</h2>
          <p style={{ fontSize: '11px', lineHeight: '1.6', color: '#333' }}>{skills.map((s) => s.name).join(' • ')}</p>
        </section>
      )}
    </div>
  );
};

export default ProfessionalTemplate;
