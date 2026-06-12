/**
 * Modern Resume Template - HTML/CSS preview version
 * Two-column layout with indigo sidebar
 */
const ModernTemplate = ({ data }) => {
  const { personalInfo = {}, summary, experience = [], education = [], skills = [], projects = [], certifications = [], languages = [] } = data || {};

  return (
    <div className="font-sans bg-white text-gray-800 min-h-a4" style={{ fontFamily: 'Inter, sans-serif', minHeight: '297mm', width: '210mm' }}>
      <div className="flex">
        {/* Sidebar */}
        <div className="w-1/3 bg-indigo-700 text-white p-6 min-h-full" style={{ minHeight: '297mm' }}>
          {/* Name */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold leading-tight">{personalInfo.fullName || 'Your Name'}</h1>
            <p className="text-indigo-200 text-sm mt-1">{personalInfo.title || 'Professional Title'}</p>
          </div>

          {/* Contact */}
          <div className="mb-6">
            <h2 className="text-xs font-bold uppercase tracking-widest text-indigo-300 mb-3">Contact</h2>
            <div className="space-y-2 text-xs text-indigo-100">
              {personalInfo.email && <p>✉ {personalInfo.email}</p>}
              {personalInfo.phone && <p>📞 {personalInfo.phone}</p>}
              {personalInfo.location && <p>📍 {personalInfo.location}</p>}
              {personalInfo.website && <p>🌐 {personalInfo.website}</p>}
              {personalInfo.linkedin && <p>in {personalInfo.linkedin}</p>}
              {personalInfo.github && <p>⌥ {personalInfo.github}</p>}
            </div>
          </div>

          {/* Skills */}
          {skills.length > 0 && (
            <div className="mb-6">
              <h2 className="text-xs font-bold uppercase tracking-widest text-indigo-300 mb-3">Skills</h2>
              <div className="space-y-2">
                {skills.map((skill) => (
                  <div key={skill.id}>
                    <div className="flex justify-between text-xs text-indigo-100 mb-1">
                      <span>{skill.name}</span>
                      <span className="text-indigo-300 capitalize">{skill.level}</span>
                    </div>
                    <div className="h-1 bg-indigo-900 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-indigo-300 rounded-full"
                        style={{ width: `${(['beginner', 'intermediate', 'advanced', 'expert'].indexOf(skill.level) + 1) * 25}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Languages */}
          {languages.length > 0 && (
            <div className="mb-6">
              <h2 className="text-xs font-bold uppercase tracking-widest text-indigo-300 mb-3">Languages</h2>
              <div className="space-y-1">
                {languages.map((lang) => (
                  <div key={lang.id} className="flex justify-between text-xs">
                    <span className="text-indigo-100">{lang.name}</span>
                    <span className="text-indigo-300 capitalize">{lang.proficiency}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Certifications */}
          {certifications.length > 0 && (
            <div>
              <h2 className="text-xs font-bold uppercase tracking-widest text-indigo-300 mb-3">Certifications</h2>
              <div className="space-y-2">
                {certifications.map((cert) => (
                  <div key={cert.id} className="text-xs">
                    <p className="text-indigo-100 font-medium">{cert.name}</p>
                    <p className="text-indigo-300">{cert.issuer} {cert.date && `· ${cert.date}`}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6">
          {/* Summary */}
          {summary && (
            <section className="mb-5">
              <h2 className="text-sm font-bold uppercase tracking-widest text-indigo-700 border-b-2 border-indigo-200 pb-1 mb-3">
                Professional Summary
              </h2>
              <p className="text-xs text-gray-600 leading-relaxed">{summary}</p>
            </section>
          )}

          {/* Experience */}
          {experience.length > 0 && (
            <section className="mb-5">
              <h2 className="text-sm font-bold uppercase tracking-widest text-indigo-700 border-b-2 border-indigo-200 pb-1 mb-3">
                Experience
              </h2>
              <div className="space-y-4">
                {experience.map((exp) => (
                  <div key={exp.id}>
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-sm font-bold text-gray-800">{exp.title}</h3>
                        <p className="text-xs text-indigo-600 font-medium">
                          {exp.showLinkInTitle && exp.website ? (
                            <a href={exp.website} target="_blank" rel="noopener noreferrer" className="underline">{exp.company}</a>
                          ) : exp.company}
                        </p>
                      </div>
                      <div className="text-right text-xs text-gray-500">
                        <p>{exp.startDate} — {exp.current ? 'Present' : exp.endDate}</p>
                        {exp.location && <p>{exp.location}</p>}
                      </div>
                    </div>
                    {exp.roles && exp.roles.length > 0 ? (
                      <div className="mt-2 ml-4 space-y-2 border-l border-indigo-100 pl-3">
                        {exp.roles.map((role) => (
                          <div key={role.id}>
                            <div className="flex justify-between items-baseline">
                              <h4 className="text-xs font-bold text-gray-800">{role.title}</h4>
                              <span className="text-[10px] text-gray-500">{role.period}</span>
                            </div>
                            {role.description && (
                              <p className="text-[11px] text-gray-500 mt-0.5 whitespace-pre-line leading-normal">
                                {role.description}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      exp.description && (
                        <div className="mt-1.5 text-xs text-gray-600 leading-relaxed whitespace-pre-line">
                          {exp.description}
                        </div>
                      )
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Education */}
          {education.length > 0 && (
            <section className="mb-5">
              <h2 className="text-sm font-bold uppercase tracking-widest text-indigo-700 border-b-2 border-indigo-200 pb-1 mb-3">
                Education
              </h2>
              <div className="space-y-3">
                {education.map((edu) => (
                  <div key={edu.id} className="flex justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-gray-800">{edu.degree} in {edu.field}</h3>
                      <p className="text-xs text-indigo-600">
                        {edu.showLinkInTitle && edu.website ? (
                          <a href={edu.website} target="_blank" rel="noopener noreferrer" className="underline">{edu.institution}</a>
                        ) : edu.institution}
                      </p>
                      {edu.gpa && <p className="text-xs text-gray-500">GPA: {edu.gpa}</p>}
                    </div>
                    <p className="text-xs text-gray-500">{edu.startDate} — {edu.endDate}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Projects */}
          {projects.length > 0 && (
            <section>
              <h2 className="text-sm font-bold uppercase tracking-widest text-indigo-700 border-b-2 border-indigo-200 pb-1 mb-3">
                Projects
              </h2>
              <div className="space-y-3">
                {projects.map((proj) => (
                  <div key={proj.id}>
                    <div className="flex justify-between">
                      <h3 className="text-sm font-bold text-gray-800">
                        {proj.showLinkInTitle && (proj.website || proj.url) ? (
                          <a href={proj.website || proj.url} target="_blank" rel="noopener noreferrer" className="underline">{proj.name}</a>
                        ) : proj.name}
                      </h3>
                      {(proj.website || proj.url) && <a href={proj.website || proj.url} target="_blank" rel="noopener noreferrer" className="text-xs text-indigo-600 underline">{proj.website || proj.url}</a>}
                    </div>
                    {proj.technologies?.length > 0 && (
                      <p className="text-xs text-gray-500 mt-0.5">{proj.technologies.join(' · ')}</p>
                    )}
                    {proj.description && <p className="text-xs text-gray-600 mt-1 leading-relaxed">{proj.description}</p>}
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
};

export default ModernTemplate;
