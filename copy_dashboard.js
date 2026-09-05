const fs = require('fs');
let dash = fs.readFileSync('src/app/dashboard/page.tsx', 'utf8');

// Replace the component signature
dash = dash.replace(
  /export default function DashboardPage\(\) \{/,
  `export default function ProjectOverviewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  const [project, setProject] = useState<any>(null);
  useEffect(() => {
    fetch(\`/api/projects/\${id}\`).then(r => r.json()).then(d => setProject(d.project));
  }, [id]);`
);

// Add React import
dash = dash.replace(
  /import \{ useState, useEffect \} from 'react';/,
  `import React, { useState, useEffect } from 'react';`
);

// Update loading condition
dash = dash.replace(
  /if \(loading\) \{/,
  `if (!project) {`
);

// Dynamic Hero Title
dash = dash.replace(
  /One Step Closer<br \/>to Your <span className="text-cyan-400">Dream Project\.<\/span>/g,
  `{project.title.split(' ').slice(0, 2).join(' ')}<br />{project.title.split(' ').slice(2).join(' ')} <span className="text-cyan-400">Project.</span>`
);

// Dynamic Card Title
dash = dash.replace(
  /AI Resume Analyzer & ATS Optimizer/g,
  `{project.title}`
);

// Dynamic Description
dash = dash.replace(
  /Deep parsing of resumes with semantic analysis and AI-powered suggestions\./g,
  `{project.shortDescription}`
);

// Remove the timeout loading simulation
dash = dash.replace(
  /const timer = setTimeout[^}]+\}\}, \[\]\);/s,
  ``
);

fs.writeFileSync('src/app/project/[id]/page.tsx', dash);
console.log('Successfully updated project page!');
