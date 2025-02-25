import { Document, Page, Text, View, StyleSheet, Font, Image } from "@react-pdf/renderer";
import { ResumeContent } from "@shared/schema";

// Create styles
const styles = StyleSheet.create({
  page: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    padding: 30,
    fontFamily: 'Helvetica',
  },
  leftColumn: {
    width: '30%',
    paddingRight: 15,
    borderRight: '1 solid #E5E7EB',
  },
  rightColumn: {
    width: '70%',
    paddingLeft: 15,
  },
  section: {
    marginBottom: 20,
  },
  header: {
    marginBottom: 20,
  },
  profilePicture: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
    alignSelf: 'center',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#111827',
  },
  title: {
    fontSize: 16,
    color: '#4B5563',
    marginBottom: 10,
  },
  contact: {
    fontSize: 10,
    color: '#6B7280',
    marginBottom: 3,
  },
  summary: {
    fontSize: 11,
    color: '#4B5563',
    marginBottom: 15,
    lineHeight: 1.4,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#111827',
    textTransform: 'uppercase',
    paddingBottom: 5,
    borderBottom: '1 solid #E5E7EB',
  },
  skill: {
    fontSize: 10,
    backgroundColor: '#F3F4F6',
    padding: '4 8',
    marginBottom: 5,
    borderRadius: 4,
    color: '#374151',
  },
  experienceItem: {
    marginBottom: 15,
  },
  jobTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#111827',
  },
  company: {
    fontSize: 10,
    color: '#4B5563',
    marginBottom: 2,
  },
  dates: {
    fontSize: 10,
    color: '#6B7280',
    marginBottom: 5,
  },
  description: {
    fontSize: 10,
    color: '#374151',
    lineHeight: 1.4,
  },
  education: {
    marginBottom: 10,
  },
  degree: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#111827',
  },
  institution: {
    fontSize: 10,
    color: '#4B5563',
  },
  projects: {
    marginBottom: 10,
  },
  projectTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#111827',
  },
  technologies: {
    fontSize: 9,
    color: '#6B7280',
    marginTop: 2,
  },
});

export function ResumePDF({ content }: { content: ResumeContent }) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Left Column */}
        <View style={styles.leftColumn}>
          {/* Personal Details */}
          <View style={styles.header}>
            {content.personalDetails.profilePicture && (
              <Image
                src={content.personalDetails.profilePicture}
                style={styles.profilePicture}
              />
            )}
            <Text style={styles.name}>{content.personalDetails.fullName}</Text>
            <Text style={styles.contact}>{content.personalDetails.email}</Text>
            <Text style={styles.contact}>{content.personalDetails.phone}</Text>
            <Text style={styles.contact}>{content.personalDetails.location}</Text>
            {content.personalDetails.linkedin && (
              <Text style={styles.contact}>{content.personalDetails.linkedin}</Text>
            )}
          </View>

          {/* Skills Section */}
          {content.skills.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Skills</Text>
              {content.skills.map((skill, index) => (
                <Text key={index} style={styles.skill}>
                  {skill}
                </Text>
              ))}
            </View>
          )}
        </View>

        {/* Right Column */}
        <View style={styles.rightColumn}>
          {/* Summary */}
          {content.personalDetails.summary && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Professional Summary</Text>
              <Text style={styles.summary}>{content.personalDetails.summary}</Text>
            </View>
          )}

          {/* Work Experience */}
          {content.workExperience.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Professional Experience</Text>
              {content.workExperience.map((exp, index) => (
                <View key={index} style={styles.experienceItem}>
                  <Text style={styles.jobTitle}>{exp.title}</Text>
                  <Text style={styles.company}>
                    {exp.company} • {exp.location}
                  </Text>
                  <Text style={styles.dates}>
                    {exp.startDate} - {exp.endDate}
                  </Text>
                  <Text style={styles.description}>{exp.description}</Text>
                </View>
              ))}
            </View>
          )}

          {/* Education */}
          {content.education.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Education</Text>
              {content.education.map((edu, index) => (
                <View key={index} style={styles.education}>
                  <Text style={styles.degree}>{edu.degree}</Text>
                  <Text style={styles.institution}>
                    {edu.institution} • {edu.location}
                  </Text>
                  <Text style={styles.dates}>{edu.graduationYear}</Text>
                </View>
              ))}
            </View>
          )}

          {/* Projects */}
          {content.projects.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Projects</Text>
              {content.projects.map((project, index) => (
                <View key={index} style={styles.projects}>
                  <Text style={styles.projectTitle}>{project.title}</Text>
                  <Text style={styles.description}>{project.description}</Text>
                  <Text style={styles.technologies}>
                    Technologies: {project.technologies.join(", ")}
                  </Text>
                  {project.link && (
                    <Text style={styles.contact}>Link: {project.link}</Text>
                  )}
                </View>
              ))}
            </View>
          )}
        </View>
      </Page>
    </Document>
  );
}