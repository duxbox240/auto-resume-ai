import { ResumeContent } from "@shared/schema";

export function ResumePreview({ content }: { content: ResumeContent }) {
  return (
    <div className="max-w-4xl mx-auto bg-white p-8 shadow-lg">
      {/* Header Section */}
      <div className="mb-8 text-center">
        {content.personalDetails.profilePicture && (
          <img
            src={content.personalDetails.profilePicture}
            alt="Profile"
            className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
          />
        )}
        <h1 className="text-3xl font-bold mb-2">{content.personalDetails.fullName}</h1>
        <div className="text-gray-600 space-y-1">
          <p>{content.personalDetails.email}</p>
          <p>{content.personalDetails.phone}</p>
          <p>{content.personalDetails.location}</p>
          {content.personalDetails.linkedin && (
            <p>{content.personalDetails.linkedin}</p>
          )}
        </div>
      </div>

      {/* Summary Section */}
      {content.personalDetails.summary && (
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-3 pb-2 border-b">Professional Summary</h2>
          <p className="text-gray-700 whitespace-pre-wrap">{content.personalDetails.summary}</p>
        </div>
      )}

      {/* Work Experience Section */}
      {content.workExperience.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-3 pb-2 border-b">Experience</h2>
          <div className="space-y-6">
            {content.workExperience.map((exp, index) => (
              <div key={index}>
                <h3 className="font-bold">{exp.title}</h3>
                <p className="text-gray-600">
                  {exp.company} • {exp.location}
                </p>
                <p className="text-gray-500 text-sm">
                  {exp.startDate} - {exp.endDate}
                </p>
                <p className="mt-2 text-gray-700 whitespace-pre-wrap">{exp.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skills Section */}
      {content.skills.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-3 pb-2 border-b">Skills</h2>
          <div className="flex flex-wrap gap-2">
            {content.skills.map((skill, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-gray-100 rounded-full text-gray-700 text-sm"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Education Section */}
      {content.education.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-3 pb-2 border-b">Education</h2>
          <div className="space-y-4">
            {content.education.map((edu, index) => (
              <div key={index}>
                <h3 className="font-bold">{edu.degree}</h3>
                <p className="text-gray-600">
                  {edu.institution} • {edu.location}
                </p>
                <p className="text-gray-500 text-sm">{edu.graduationYear}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Projects Section */}
      {content.projects.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-3 pb-2 border-b">Projects</h2>
          <div className="space-y-6">
            {content.projects.map((project, index) => (
              <div key={index}>
                <h3 className="font-bold">{project.title}</h3>
                <p className="text-gray-700 mt-1">{project.description}</p>
                <p className="text-gray-600 text-sm mt-1">
                  Technologies: {project.technologies.join(", ")}
                </p>
                {project.link && (
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline text-sm"
                  >
                    View Project
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
