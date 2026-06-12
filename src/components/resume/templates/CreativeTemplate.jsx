const CreativeTemplate = ({ data }) => {
  const { personalInfo = {}, summary, experience = [], education = [], skills = [], projects = [], certifications = [] } = data || {};
  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', minHeight: '297mm', width: '210mm', background: '#faf5ff' }}>
      {/* Header with gradient */}
      <div style={{ background: 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 50%, #4c1d95 100%)', padding: '32px', color: '#fff' }}>
        <h1 style={{ fontSize: '32px', fontWeight: '800', margin: 0, letterSpacing: '-1px' }}>{personalInfo.fullName || 'Your Name'}</h1>
        {personalInfo.title && (
          <p style={{ fontSize: '14px', color: '#ddd6fe', marginTop: '4px' }}>{personalInfo.title}</p>
        )}
        <div style={{ display: 'flex', gap: '16px', marginTop: '12px', flexWrap: 'wrap' }}>
          {personalInfo.email && <span style={{ fontSize: '11px', color: '#ede9fe', background: 'rgba(255,255,255,0.1)', padding: '2px 8px', borderRadius: '4px' }}>✉ {personalInfo.email}</span>}
          {personalInfo.phone && <span style={{ fontSize: '11px', color: '#ede9fe', background: 'rgba(255,255,255,0.1)', padding: '2px 8px', borderRadius: '4px' }}>📞 {personalInfo.phone}</span>}
          {personalInfo.location && <span style={{ fontSize: '11px', color: '#ede9fe', background: 'rgba(255,255,255,0.1)', padding: '2px 8px', borderRadius: '4px' }}>📍 {personalInfo.location}</span>}
        </div>
      </div>

      <div style={{ padding: '24px', display: 'flex', gap: '20px' }}>
        {/* Left col */}
        <div style={{ flex: 1 }}>
          {summary && (
            <section style={{ marginBottom: '20px' }}>
              <h2 style={{ fontSize: '12px', fontWeight: '700', color: '#7c3aed', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '8px' }}>About Me</h2>
              <p style={{ fontSize: '11px', lineHeight: '1.7', color: '#4b5563' }}>{summary}</p>
            </section>
          )}
          {experience.length > 0 && (
            <section style={{ marginBottom: '20px' }}>
              <h2 style={{ fontSize: '12px', fontWeight: '700', color: '#7c3aed', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '10px' }}>Experience</h2>
              {experience.map((exp) => (
                <div key={exp.id} style={{ marginBottom: '14px', borderLeft: '3px solid #7c3aed', paddingLeft: '10px' }}>
                  <p style={{ fontSize: '13px', fontWeight: '700', color: '#1f2937' }}>{exp.title}</p>
                  <p style={{ fontSize: '11px', color: '#7c3aed' }}>
                    {exp.showLinkInTitle && exp.website ? (
                      <a href={exp.website} target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'underline' }}>{exp.company}</a>
                    ) : exp.company}
                    {" · "}
                    {exp.startDate} — {exp.current ? 'Present' : exp.endDate}
                  </p>
                  {exp.roles && exp.roles.length > 0 ? (
                    <div style={{ marginTop: '6px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
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
          {projects.length > 0 && (
            <section>
              <h2 style={{ fontSize: '12px', fontWeight: '700', color: '#7c3aed', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '10px' }}>Projects</h2>
              {projects.map((proj) => (
                <div key={proj.id} style={{ marginBottom: '10px' }}>
                  <p style={{ fontSize: '12px', fontWeight: '600', color: '#1f2937' }}>
                    {proj.showLinkInTitle && (proj.website || proj.url) ? (
                      <a href={proj.website || proj.url} target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'underline' }}>{proj.name}</a>
                    ) : proj.name}
                  </p>
                  {proj.technologies?.length > 0 && <p style={{ fontSize: '10px', color: '#7c3aed', marginTop: '1px' }}>{proj.technologies.join(' · ')}</p>}
                  {proj.description && <p style={{ fontSize: '11px', color: '#4b5563', marginTop: '3px' }}>{proj.description}</p>}
                </div>
              ))}
            </section>
          )}
        </div>

        {/* Right col */}
        <div style={{ width: '140px', flexShrink: 0 }}>
          {skills.length > 0 && (
            <section style={{ marginBottom: '16px' }}>
              <h2 style={{ fontSize: '12px', fontWeight: '700', color: '#7c3aed', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>Skills</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {skills.map((skill) => (
                  <div key={skill.id} style={{ fontSize: '10px', background: '#ede9fe', color: '#5b21b6', borderRadius: '4px', padding: '3px 6px' }}>{skill.name}</div>
                ))}
              </div>
            </section>
          )}
          {education.length > 0 && (
            <section style={{ marginBottom: '16px' }}>
              <h2 style={{ fontSize: '12px', fontWeight: '700', color: '#7c3aed', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>Education</h2>
              {education.map((edu) => (
                <div key={edu.id} style={{ marginBottom: '8px' }}>
                  <p style={{ fontSize: '11px', fontWeight: '600', color: '#1f2937' }}>{edu.degree}</p>
                  <p style={{ fontSize: '10px', color: '#6b7280' }}>
                    {edu.showLinkInTitle && edu.website ? (
                      <a href={edu.website} target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'underline' }}>{edu.institution}</a>
                    ) : edu.institution}
                  </p>
                  <p style={{ fontSize: '10px', color: '#9ca3af' }}>{edu.endDate}</p>
                </div>
              ))}
            </section>
          )}
          {certifications.length > 0 && (
            <section>
              <h2 style={{ fontSize: '12px', fontWeight: '700', color: '#7c3aed', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>Certs</h2>
              {certifications.map((cert) => (
                <p key={cert.id} style={{ fontSize: '10px', color: '#4b5563', marginBottom: '4px' }}>{cert.name}</p>
              ))}
            </section>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreativeTemplate;
