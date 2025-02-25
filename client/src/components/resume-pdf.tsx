import { Document, Page, Text, View, StyleSheet, Font } from "@react-pdf/renderer";
import { ResumeContent } from "@shared/schema";

// Create styles
const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: "Helvetica",
  },
  section: {
    marginBottom: 20,
  },
  header: {
    marginBottom: 20,
  },
  name: {
    fontSize: 24,
    marginBottom: 5,
  },
  contact: {
    fontSize: 10,
    color: "#666666",
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333333",
    textTransform: "uppercase",
  },
  experienceItem: {
    marginBottom: 10,
  },
  jobTitle: {
    fontSize: 12,
    fontWeight: "bold",
  },
  company: {
    fontSize: 10,
    color: "#666666",
  },
  dates: {
    fontSize: 10,
    color: "#666666",
  },
  description: {
    fontSize: 10,
    marginTop: 5,
  },
  skills: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 5,
  },
  skill: {
    fontSize: 10,
    backgroundColor: "#f0f0f0",
    padding: "4 8",
    borderRadius: 4,
  },
});

export function ResumePDF({ content }: { content: ResumeContent }) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.name}>{content.personalDetails.fullName}</Text>
          <Text style={styles.contact}>
            {content.personalDetails.email} • {content.personalDetails.phone} • {content.personalDetails.location}
            {content.personalDetails.linkedin && ` • ${content.personalDetails.linkedin}`}
          </Text>
        </View>

        {/* Work Experience */}
        {content.workExperience.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Work Experience</Text>
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
              <View key={index} style={styles.experienceItem}>
                <Text style={styles.jobTitle}>{edu.degree}</Text>
                <Text style={styles.company}>
                  {edu.institution} • {edu.location}
                </Text>
                <Text style={styles.dates}>{edu.graduationYear}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Skills */}
        {content.skills.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Skills</Text>
            <View style={styles.skills}>
              {content.skills.map((skill, index) => (
                <Text key={index} style={styles.skill}>
                  {skill}
                </Text>
              ))}
            </View>
          </View>
        )}

        {/* Projects */}
        {content.projects.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Projects</Text>
            {content.projects.map((project, index) => (
              <View key={index} style={styles.experienceItem}>
                <Text style={styles.jobTitle}>{project.title}</Text>
                <Text style={styles.description}>{project.description}</Text>
                <Text style={styles.company}>
                  Technologies: {project.technologies.join(", ")}
                </Text>
                {project.link && (
                  <Text style={styles.contact}>Link: {project.link}</Text>
                )}
              </View>
            ))}
          </View>
        )}
      </Page>
    </Document>
  );
}
