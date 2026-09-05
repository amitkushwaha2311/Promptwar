export interface GitHubRepoDetails {
  owner: string;
  repo: string;
  fullName: string;
  description: string;
  stars: number;
  forks: number;
  openIssues: number;
  defaultBranch: string;
  createdAt: string;
  updatedAt: string;
  pushedAt: string;
  license: string | null;
  languages: Record<string, number>;
  hasReadme: boolean;
  readmeLength: number;
  hasTests: boolean;
  testFilesFound: string[];
  hasLicense: boolean;
  hasContributing: boolean;
  commitCount30Days: number;
  contributorCount: number;
  fileStructure: string[];
}

export interface GitHubAnalysisResult {
  codeOrgScore: number; // 0-100
  docScore: number; // 0-100
  testingScore: number; // 0-100
  repoQualityScore: number; // 0-100
  activityScore: number; // 0-100
  overallScore: number; // 0-100
  metrics: {
    languageBreakdown: { name: string; percentage: number }[];
    totalCommitsLastMonth: number;
    contributors: number;
    hasTestCoverage: boolean;
    readmeWordCount: number;
    hasCiWorkflow: boolean;
  };
  improvements: {
    priority: number;
    title: string;
    description: string;
    impact: 'HIGH' | 'MEDIUM' | 'LOW';
    actionableStep: string;
  }[];
}

export class GitHubAnalyzer {
  // Parse owner and repo from URL
  static parseRepoUrl(url: string): { owner: string; repo: string } | null {
    try {
      const clean = url.trim().replace(/\/+$/, '');
      const match = clean.match(/github\.com\/([^/]+)\/([^/]+)/i);
      if (!match) return null;
      return {
        owner: match[1],
        repo: match[2].replace(/\.git$/i, ''),
      };
    } catch {
      return null;
    }
  }

  // Fetch real details using GitHub REST API
  static async fetchRepoDetails(owner: string, repo: string, token?: string): Promise<GitHubRepoDetails | null> {
    const headers: Record<string, string> = {
      Accept: 'application/vnd.github.v3+json',
      'User-Agent': 'ProjectPilot-AI-Scanner',
    };
    if (token) {
      headers['Authorization'] = `token ${token}`;
    }

    try {
      // 1. Repo base details
      const repoRes = await fetch(`https://api.github.com/repos/${owner}/${repo}`, { headers });
      if (!repoRes.ok) return null;
      const repoData = await repoRes.json();

      // 2. Languages
      const langRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/languages`, { headers });
      const languages: Record<string, number> = langRes.ok ? await langRes.json() : {};

      // 3. Root contents
      const contentsRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents`, { headers });
      const contents: { name: string; type: string; path: string }[] = contentsRes.ok ? await contentsRes.json() : [];

      // 4. Commits in last 30 days
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
      const commitsRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/commits?since=${thirtyDaysAgo}&per_page=50`, { headers });
      const commits = commitsRes.ok ? await commitsRes.json() : [];

      // 5. Contributors
      const contribRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/contributors?per_page=10`, { headers });
      const contributors = contribRes.ok ? await contribRes.json() : [];

      // 6. Readme
      const readmeRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/readme`, { headers });
      const hasReadme = readmeRes.ok;
      let readmeLength = 0;
      if (hasReadme) {
        const readmeData = await readmeRes.json();
        readmeLength = readmeData.size || 500;
      }

      // Check test files and CI
      const fileNames = Array.isArray(contents) ? contents.map((c) => c.name.toLowerCase()) : [];
      const testFiles = fileNames.filter(
        (f) =>
          f.includes('test') ||
          f.includes('spec') ||
          f.includes('__tests__') ||
          f === 'jest.config.js' ||
          f === 'pytest.ini'
      );

      return {
        owner,
        repo,
        fullName: repoData.full_name,
        description: repoData.description || 'Student project repository',
        stars: repoData.stargazers_count || 0,
        forks: repoData.forks_count || 0,
        openIssues: repoData.open_issues_count || 0,
        defaultBranch: repoData.default_branch || 'main',
        createdAt: repoData.created_at,
        updatedAt: repoData.updated_at,
        pushedAt: repoData.pushed_at,
        license: repoData.license?.spdx_id || null,
        languages,
        hasReadme,
        readmeLength,
        hasTests: testFiles.length > 0,
        testFilesFound: testFiles,
        hasLicense: !!repoData.license,
        hasContributing: fileNames.includes('contributing.md'),
        commitCount30Days: Array.isArray(commits) ? commits.length : 5,
        contributorCount: Array.isArray(contributors) ? contributors.length : 1,
        fileStructure: fileNames,
      };
    } catch (e) {
      console.warn('GitHub API request failed:', e);
      return null;
    }
  }

  // Compute weighted scores and prioritized improvements
  static analyze(details: GitHubRepoDetails): GitHubAnalysisResult {
    // 1. Code Organization Score (0-100)
    let codeOrg = 70;
    const structure = details.fileStructure;
    if (structure.some((f) => f === 'src' || f === 'app' || f === 'lib')) codeOrg += 15;
    if (structure.includes('.gitignore')) codeOrg += 10;
    if (structure.includes('package.json') || structure.includes('requirements.txt') || structure.includes('go.mod')) codeOrg += 5;
    codeOrg = Math.min(codeOrg, 98);

    // 2. Documentation Score (0-100)
    let docScore = 30;
    if (details.hasReadme) {
      docScore += 35;
      if (details.readmeLength > 1500) docScore += 20;
      else if (details.readmeLength > 500) docScore += 10;
    }
    if (details.hasLicense) docScore += 10;
    if (details.hasContributing) docScore += 5;
    docScore = Math.min(docScore, 95);

    // 3. Testing Score (0-100)
    let testingScore = 25;
    if (details.hasTests) {
      testingScore = 75;
      if (details.testFilesFound.length > 2) testingScore = 90;
    }

    // 4. Repository Quality Score (0-100)
    let repoQuality = 65;
    if (details.hasReadme) repoQuality += 10;
    if (details.hasLicense) repoQuality += 10;
    if (details.fileStructure.includes('.github')) repoQuality += 10;
    repoQuality = Math.min(repoQuality, 94);

    // 5. Activity Score (0-100)
    let activityScore = 60;
    if (details.commitCount30Days > 20) activityScore = 95;
    else if (details.commitCount30Days > 8) activityScore = 85;
    else if (details.commitCount30Days > 2) activityScore = 72;
    if (details.contributorCount > 1) activityScore = Math.min(activityScore + 5, 98);

    // Overall Weighted Score
    const overallScore = Math.round(
      codeOrg * 0.25 + docScore * 0.2 + testingScore * 0.2 + repoQuality * 0.2 + activityScore * 0.15
    );

    // Calculate language percentages
    const totalBytes = Object.values(details.languages).reduce((sum, b) => sum + b, 0);
    const languageBreakdown = Object.entries(details.languages)
      .map(([name, bytes]) => ({
        name,
        percentage: totalBytes > 0 ? Math.round((bytes / totalBytes) * 100) : 0,
      }))
      .sort((a, b) => b.percentage - a.percentage);

    // Generate prioritized improvements
    const improvements = [];
    let p = 1;

    if (!details.hasTests) {
      improvements.push({
        priority: p++,
        title: 'Add Automated Unit Tests',
        description: 'No test directory or test suites detected. College examiners check for test coverage to verify code reliability.',
        impact: 'HIGH' as const,
        actionableStep: 'Create a `tests/` directory with Jest/Pytest suites covering core calculation and authentication logic.',
      });
    }

    if (!details.hasReadme || details.readmeLength < 1000) {
      improvements.push({
        priority: p++,
        title: 'Expand README Documentation & Installation Guide',
        description: 'The README is either missing or too brief. A stellar README is the first thing evaluators see.',
        impact: 'HIGH' as const,
        actionableStep: 'Add sections: Project Overview, Architecture Diagram, Step-by-Step Setup, API Endpoints, and Screenshots.',
      });
    }

    if (!details.hasLicense) {
      improvements.push({
        priority: p++,
        title: 'Add Open Source Software License',
        description: 'Repositories without a license have strict copyright limitations. An open license clarifies IP for academic submissions.',
        impact: 'MEDIUM' as const,
        actionableStep: 'Add an MIT or Apache 2.0 LICENSE file to the root directory.',
      });
    }

    if (!details.fileStructure.includes('.github')) {
      improvements.push({
        priority: p++,
        title: 'Configure GitHub Actions CI Workflow',
        description: 'Continuous Integration demonstrates professional DevOps standards to final-year evaluators.',
        impact: 'MEDIUM' as const,
        actionableStep: 'Add `.github/workflows/ci.yml` to automatically run linter and tests on every pull request.',
      });
    }

    improvements.push({
      priority: p++,
      title: 'Maintain Consistent Commit Messages',
      description: 'Keep commit messages descriptive and semantic (e.g. `feat: add ats scoring pipeline`, `fix: handle 500 error on pdf parse`).',
      impact: 'LOW' as const,
      actionableStep: 'Adopt Conventional Commits format to showcase professional software discipline.',
    });

    return {
      codeOrgScore: codeOrg,
      docScore,
      testingScore,
      repoQualityScore: repoQuality,
      activityScore,
      overallScore,
      metrics: {
        languageBreakdown,
        totalCommitsLastMonth: details.commitCount30Days,
        contributors: details.contributorCount,
        hasTestCoverage: details.hasTests,
        readmeWordCount: Math.round(details.readmeLength / 6),
        hasCiWorkflow: details.fileStructure.includes('.github'),
      },
      improvements,
    };
  }

  // Fallback demo analysis if user provides invalid URL or offline repo
  static getDemoAnalysis(repoName = 'ai-resume-analyzer'): GitHubAnalysisResult {
    return {
      codeOrgScore: 82,
      docScore: 68,
      testingScore: 52,
      repoQualityScore: 79,
      activityScore: 85,
      overallScore: 73,
      metrics: {
        languageBreakdown: [
          { name: 'TypeScript', percentage: 64 },
          { name: 'Python', percentage: 28 },
          { name: 'CSS', percentage: 8 },
        ],
        totalCommitsLastMonth: 18,
        contributors: 3,
        hasTestCoverage: true,
        readmeWordCount: 850,
        hasCiWorkflow: false,
      },
      improvements: [
        {
          priority: 1,
          title: 'Add Unit Tests for Core Scoring Functions',
          description: 'Current tests cover only basic API endpoints. The core ATS semantic similarity module requires automated assertion tests.',
          impact: 'HIGH',
          actionableStep: 'Add `tests/scoring.test.ts` verifying cosine similarity calculations against known benchmark resumes.',
        },
        {
          priority: 2,
          title: 'Add System Architecture Diagram in README',
          description: 'Examiners appreciate visual flowcharts showing how the Next.js frontend connects to the Python ML microservice.',
          impact: 'HIGH',
          actionableStep: 'Include a Mermaid or PNG architecture diagram in `README.md`.',
        },
        {
          priority: 3,
          title: 'Setup GitHub Actions CI Workflow',
          description: 'Automate build verification on every commit.',
          impact: 'MEDIUM',
          actionableStep: 'Add `.github/workflows/ci.yml` running `npm run build` and `npm run test`.',
        },
        {
          priority: 4,
          title: 'Add LICENSE File',
          description: 'Repository currently lacks an explicit open-source license.',
          impact: 'LOW',
          actionableStep: 'Create an MIT LICENSE file in the root repository.',
        },
      ],
    };
  }
}
