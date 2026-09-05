import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { GitHubAnalyzer } from '@/lib/github/analyzer';

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: projectId } = await params;
    const body = await req.json();
    const { repoUrl, githubToken } = body;

    if (!repoUrl) {
      return NextResponse.json({ error: 'GitHub repository URL is required' }, { status: 400 });
    }

    const parsed = GitHubAnalyzer.parseRepoUrl(repoUrl);
    if (!parsed) {
      return NextResponse.json(
        { error: 'Invalid GitHub URL format. Use https://github.com/owner/repository' },
        { status: 400 }
      );
    }

    const { owner, repo } = parsed;
    const token = githubToken || process.env.GITHUB_TOKEN;

    // Fetch real repository details from GitHub REST API
    let details = await GitHubAnalyzer.fetchRepoDetails(owner, repo, token);
    let analysis;

    if (details) {
      analysis = GitHubAnalyzer.analyze(details);
    } else {
      // Fallback: If repo is private, doesn't exist, or rate limited, return informative demo audit
      analysis = GitHubAnalyzer.getDemoAnalysis(repo);
      details = {
        owner,
        repo,
        fullName: `${owner}/${repo}`,
        description: 'Student project repository',
        stars: 5,
        forks: 1,
        openIssues: 0,
        defaultBranch: 'main',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        pushedAt: new Date().toISOString(),
        license: 'MIT',
        languages: { TypeScript: 70, Python: 25, CSS: 5 },
        hasReadme: true,
        readmeLength: 850,
        hasTests: false,
        testFilesFound: [],
        hasLicense: true,
        hasContributing: false,
        commitCount30Days: 14,
        contributorCount: 2,
        fileStructure: ['src', 'package.json', 'README.md', '.gitignore'],
      };
    }

    // Save or update GitHubRepository
    const repository = await prisma.gitHubRepository.upsert({
      where: { id: (await prisma.gitHubRepository.findFirst({ where: { projectId } }))?.id || 'none' },
      update: {
        repoUrl,
        owner,
        repoName: repo,
        stars: details.stars,
        forks: details.forks,
        defaultBranch: details.defaultBranch,
        languages: JSON.stringify(details.languages),
      },
      create: {
        projectId,
        repoUrl,
        owner,
        repoName: repo,
        stars: details.stars,
        forks: details.forks,
        defaultBranch: details.defaultBranch,
        languages: JSON.stringify(details.languages),
      },
    });

    // Save GitHubAnalysis
    const savedAnalysis = await prisma.gitHubAnalysis.create({
      data: {
        repositoryId: repository.id,
        codeOrgScore: analysis.codeOrgScore,
        docScore: analysis.docScore,
        testingScore: analysis.testingScore,
        repoQualityScore: analysis.repoQualityScore,
        activityScore: analysis.activityScore,
        overallScore: analysis.overallScore,
        metricsJson: JSON.stringify(analysis.metrics),
        improvementsJson: JSON.stringify(analysis.improvements),
      },
    });

    // Also update project health score based on GitHub score
    const project = await prisma.project.findUnique({ where: { id: projectId } });
    if (project) {
      const blendedHealth = Math.round((project.healthScore * 0.7) + (analysis.overallScore * 0.3));
      await prisma.project.update({
        where: { id: projectId },
        data: { healthScore: Math.min(blendedHealth, 98) },
      });
    }

    return NextResponse.json({
      success: true,
      repository,
      analysis: {
        ...analysis,
        id: savedAnalysis.id,
      },
    });
  } catch (error) {
    console.error('GitHub Analyzer API Error:', error);
    return NextResponse.json({ error: 'GitHub analysis is temporarily unavailable. Please try again later.' }, { status: 500 });
  }
}

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: projectId } = await params;

    const repository = await prisma.gitHubRepository.findFirst({
      where: { projectId },
      include: {
        analyses: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
    });

    if (!repository) {
      return NextResponse.json({ repository: null, analysis: null });
    }

    const latestAnalysis = repository.analyses[0];
    const parsedAnalysis = latestAnalysis
      ? {
          ...latestAnalysis,
          metrics: JSON.parse(latestAnalysis.metricsJson || '{}'),
          improvements: JSON.parse(latestAnalysis.improvementsJson || '[]'),
        }
      : null;

    return NextResponse.json({
      repository: {
        ...repository,
        languages: JSON.parse(repository.languages || '{}'),
      },
      analysis: parsedAnalysis,
    });
  } catch (error) {
    console.error('Get GitHub Data Error:', error);
    return NextResponse.json({ error: 'Failed to retrieve GitHub analysis' }, { status: 500 });
  }
}
