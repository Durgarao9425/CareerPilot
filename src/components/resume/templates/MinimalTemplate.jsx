const MinimalTemplate = ({ data }) => {
  const { personalInfo = {}, summary, experience = [], education = [], skills = [] } = data || {};
  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', minHeight: '297mm', width: '210mm', background: '#fff', color: '#374151', padding: '40px' }}>
      <h1 style={{ fontSize: '30px', fontWeight: '700', color: '#111827', margin: 0 }}>{personalInfo.fullName || 'Your Name'}</h1>
      {personalInfo.title && <p style={{ fontSize: '14px', color: '#6b7280', marginTop: '4px' }}>{personalInfo.title}</p>}
      <div style={{ display: 'flex', gap: '16px', marginTop: '8px', flexWrap: 'wrap' }}>
        {[personalInfo.email, personalInfo.phone, personalInfo.location, personalInfo.website].filter(Boolean).map((item, i) => (
          <span key={i} style={{ fontSize: '11px', color: '#6b7280' }}>{item}</span>
        ))}
      </div>
      <hr style={{ border: 'none', borderTop: '1px solid #e5e7eb', margin: '20px 0' }} />
      {summary && <div style={{ marginBottom: '20px' }}><p style={{ fontSize: '12px', lineHeight: '1.7', color: '#4b5563' }}>{summary}</p></div>}
      {experience.length > 0 && (
        <section style={{ marginBottom: '20px' }}>
          <h2 style={{ fontSize: '11px', fontWeight: '700', letterSpacing: '2px', color: '#9ca3af', textTransform: 'uppercase', marginBottom: '12px' }}>Experience</h2>
          {experience.map((exp) => (
            <div key={exp.id} style={{ marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div>
                  <span style={{ fontSize: '13px', fontWeight: '600', color: '#111827' }}>{exp.title}</span>
                  <span style={{ fontSize: '12px', color: '#6b7280' }}>
                    {" · "}
                    {exp.showLinkInTitle && exp.website ? (
                      <a href={exp.website} target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'underline' }}>{exp.company}</a>
                    ) : exp.company}
                  </span>
                </div>
                <span style={{ fontSize: '11px', color: '#9ca3af' }}>{exp.startDate} — {exp.current ? 'Now' : exp.endDate}</span>
              </div>
              {exp.roles && exp.roles.length > 0 ? (
                <div style={{ marginTop: '6px', marginLeft: '12px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {exp.roles.map((role) => (
                    <div key={role.id}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                        <span style={{ fontSize: '11px', fontWeight: '600', color: '#374151' }}>{role.title}</span>
                        <span style={{ fontSize: '10px', color: '#9ca3af' }}>{role.period}</span>
                      </div>
                      {role.description && <p style={{ fontSize: '10px', color: '#4b5563', marginTop: '2px', lineHeight: '1.5', whiteSpace: 'pre-line' }}>{role.description}</p>}
                    </div>
                  ))}
                </div>
              ) : (
                exp.description && <p style={{ fontSize: '11px', color: '#4b5563', marginTop: '4px', lineHeight: '1.6', whiteSpace: 'pre-line' }}>{exp.description}</p>
              )}
            </div>
          ))}
        </section>
      )}
      {education.length > 0 && (
        <section style={{ marginBottom: '20px' }}>
          <h2 style={{ fontSize: '11px', fontWeight: '700', letterSpacing: '2px', color: '#9ca3af', textTransform: 'uppercase', marginBottom: '12px' }}>Education</h2>
          {education.map((edu) => (
            <div key={edu.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <div>
                <span style={{ fontSize: '13px', fontWeight: '600', color: '#111827' }}>{edu.degree}</span>
                <span style={{ fontSize: '12px', color: '#6b7280' }}>
                  {" — "}
                  {edu.showLinkInTitle && edu.website ? (
                    <a href={edu.website} target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'underline' }}>{edu.institution}</a>
                  ) : edu.institution}
                </span>
              </div>
              <span style={{ fontSize: '11px', color: '#9ca3af' }}>{edu.endDate}</span>
            </div>
          ))}
        </section>
      )}
      {skills.length > 0 && (
        <section>
          <h2 style={{ fontSize: '11px', fontWeight: '700', letterSpacing: '2px', color: '#9ca3af', textTransform: 'uppercase', marginBottom: '8px' }}>Skills</h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {skills.map((skill) => (
              <span key={skill.id} style={{ fontSize: '11px', padding: '2px 10px', background: '#f3f4f6', borderRadius: '9999px', color: '#374151' }}>{skill.name}</span>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default MinimalTemplate;
