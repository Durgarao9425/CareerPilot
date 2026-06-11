import {
  Document, Page, Text, View, StyleSheet, Font, PDFDownloadLink,
} from '@react-pdf/renderer';
import Button from '@components/ui/Button';
import { ArrowDownTrayIcon } from '@heroicons/react/24/outline';

// Register fonts
Font.register({
  family: 'Inter',
  fonts: [
    { src: 'https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiA.woff2', fontWeight: 400 },
    { src: 'https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuGKYAZ9hiA.woff2', fontWeight: 700 },
  ],
});

const styles = StyleSheet.create({
  page: {
    fontFamily: 'Inter',
    fontSize: 10,
    color: '#1a1a1a',
    backgroundColor: '#ffffff',
    padding: 0,
  },
  sidebar: {
    width: '33%',
    backgroundColor: '#4f46e5',
    padding: 20,
    color: '#ffffff',
    minHeight: '100%',
  },
  main: { flex: 1, padding: 24 },
  name: { fontSize: 20, fontWeight: 700, color: '#fff', marginBottom: 2 },
  title: { fontSize: 10, color: '#c7d2fe', marginBottom: 16 },
  sectionTitle: {
    fontSize: 8,
    fontWeight: 700,
    letterSpacing: 2,
    textTransform: 'uppercase',
    color: '#a5b4fc',
    borderBottomWidth: 1,
    borderBottomColor: '#6366f1',
    paddingBottom: 3,
    marginBottom: 8,
  },
  mainSectionTitle: {
    fontSize: 9,
    fontWeight: 700,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    color: '#4f46e5',
    borderBottomWidth: 1.5,
    borderBottomColor: '#c7d2fe',
    paddingBottom: 3,
    marginBottom: 10,
    marginTop: 12,
  },
  contactItem: { fontSize: 9, color: '#e0e7ff', marginBottom: 4 },
  skillRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  skillName: { fontSize: 9, color: '#e0e7ff' },
  skillLevel: { fontSize: 8, color: '#a5b4fc' },
  skillBar: { height: 3, backgroundColor: '#312e81', borderRadius: 2, marginTop: 2, marginBottom: 4 },
  skillFill: { height: 3, backgroundColor: '#a5b4fc', borderRadius: 2 },
  expItem: { marginBottom: 12 },
  expTitle: { fontSize: 11, fontWeight: 700, color: '#1e293b' },
  expCompany: { fontSize: 10, color: '#4f46e5', marginTop: 1 },
  expDate: { fontSize: 9, color: '#64748b' },
  expDesc: { fontSize: 9, color: '#374151', marginTop: 4, lineHeight: 1.6 },
  row: { flexDirection: 'row' },
  summary: { fontSize: 10, color: '#374151', lineHeight: 1.6, marginBottom: 4 },
});

const levelWidths = { beginner: '25%', intermediate: '50%', advanced: '75%', expert: '100%' };

const PDFDocument = ({ data }) => {
  const { personalInfo = {}, summary, experience = [], education = [], skills = [], projects = [], certifications = [], languages = [] } = data || {};

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.row}>
          {/* Sidebar */}
          <View style={styles.sidebar}>
            <Text style={styles.name}>{personalInfo.fullName || 'Your Name'}</Text>
            <Text style={styles.title}>{personalInfo.title || ''}</Text>

            {/* Contact */}
            <Text style={styles.sectionTitle}>Contact</Text>
            {personalInfo.email && <Text style={styles.contactItem}>✉ {personalInfo.email}</Text>}
            {personalInfo.phone && <Text style={styles.contactItem}>📞 {personalInfo.phone}</Text>}
            {personalInfo.location && <Text style={styles.contactItem}>📍 {personalInfo.location}</Text>}
            {personalInfo.linkedin && <Text style={styles.contactItem}>in {personalInfo.linkedin}</Text>}
            {personalInfo.github && <Text style={styles.contactItem}>⌥ {personalInfo.github}</Text>}

            {/* Skills */}
            {skills.length > 0 && (
              <View style={{ marginTop: 16 }}>
                <Text style={styles.sectionTitle}>Skills</Text>
                {skills.map((skill) => (
                  <View key={skill.id}>
                    <View style={styles.skillRow}>
                      <Text style={styles.skillName}>{skill.name}</Text>
                      <Text style={styles.skillLevel}>{skill.level}</Text>
                    </View>
                    <View style={styles.skillBar}>
                      <View style={[styles.skillFill, { width: levelWidths[skill.level] || '50%' }]} />
                    </View>
                  </View>
                ))}
              </View>
            )}

            {/* Languages */}
            {languages.length > 0 && (
              <View style={{ marginTop: 16 }}>
                <Text style={styles.sectionTitle}>Languages</Text>
                {languages.map((lang) => (
                  <View key={lang.id} style={styles.skillRow}>
                    <Text style={styles.skillName}>{lang.name}</Text>
                    <Text style={styles.skillLevel}>{lang.proficiency}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>

          {/* Main Content */}
          <View style={styles.main}>
            {/* Summary */}
            {summary && (
              <View>
                <Text style={styles.mainSectionTitle}>Summary</Text>
                <Text style={styles.summary}>{summary}</Text>
              </View>
            )}

            {/* Experience */}
            {experience.length > 0 && (
              <View>
                <Text style={styles.mainSectionTitle}>Experience</Text>
                {experience.map((exp) => (
                  <View key={exp.id} style={styles.expItem}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                      <Text style={styles.expTitle}>{exp.title}</Text>
                      <Text style={styles.expDate}>{exp.startDate} — {exp.current ? 'Present' : exp.endDate}</Text>
                    </View>
                    <Text style={styles.expCompany}>{exp.company}{exp.location ? ` · ${exp.location}` : ''}</Text>
                    {exp.description && <Text style={styles.expDesc}>{exp.description}</Text>}
                  </View>
                ))}
              </View>
            )}

            {/* Education */}
            {education.length > 0 && (
              <View>
                <Text style={styles.mainSectionTitle}>Education</Text>
                {education.map((edu) => (
                  <View key={edu.id} style={{ marginBottom: 10 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                      <Text style={styles.expTitle}>{edu.degree} in {edu.field}</Text>
                      <Text style={styles.expDate}>{edu.startDate} — {edu.endDate}</Text>
                    </View>
                    <Text style={styles.expCompany}>{edu.institution}</Text>
                    {edu.gpa && <Text style={styles.expDate}>GPA: {edu.gpa}</Text>}
                  </View>
                ))}
              </View>
            )}

            {/* Projects */}
            {projects.length > 0 && (
              <View>
                <Text style={styles.mainSectionTitle}>Projects</Text>
                {projects.map((proj) => (
                  <View key={proj.id} style={{ marginBottom: 8 }}>
                    <Text style={styles.expTitle}>{proj.name}</Text>
                    {proj.technologies?.length > 0 && (
                      <Text style={styles.expCompany}>{proj.technologies.join(' · ')}</Text>
                    )}
                    {proj.description && <Text style={styles.expDesc}>{proj.description}</Text>}
                  </View>
                ))}
              </View>
            )}

            {/* Certifications */}
            {certifications.length > 0 && (
              <View>
                <Text style={styles.mainSectionTitle}>Certifications</Text>
                {certifications.map((cert) => (
                  <View key={cert.id} style={{ marginBottom: 6 }}>
                    <Text style={styles.expTitle}>{cert.name}</Text>
                    <Text style={styles.expCompany}>{cert.issuer}{cert.date ? ` · ${cert.date}` : ''}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        </View>
      </Page>
    </Document>
  );
};

const PDFExportButton = ({ resumeData, template, fileName }) => (
  <PDFDownloadLink
    document={<PDFDocument data={resumeData} template={template} />}
    fileName={`${fileName || 'resume'}.pdf`}
  >
    {({ loading }) => (
      <Button variant="secondary" size="sm" loading={loading} icon={ArrowDownTrayIcon}>
        {loading ? 'Preparing...' : 'Export PDF'}
      </Button>
    )}
  </PDFDownloadLink>
);

export default PDFExportButton;
export { PDFDocument };
