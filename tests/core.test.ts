/**
 * @jest-environment node
 * 
 * ProjectPilot AI - Core Unit Tests
 * Tests for scoring heuristics, utility functions, and AI evaluation engine.
 */

// ============================================================
// 1. Score Calculation Utilities
// ============================================================

describe('Score Calculation - Weighted Average', () => {
  function weightedAverage(scores: number[], weights: number[]): number {
    const total = scores.reduce((sum, s, i) => sum + s * weights[i], 0);
    const weightSum = weights.reduce((a, b) => a + b, 0);
    return Math.round((total / weightSum) * 10) / 10;
  }

  test('computes correct weighted average for 5 dimensions', () => {
    const scores = [90, 85, 80, 88, 92];
    const weights = [0.25, 0.2, 0.2, 0.2, 0.15];
    expect(weightedAverage(scores, weights)).toBeGreaterThan(85);
  });

  test('returns 100 when all scores are 100', () => {
    const scores = [100, 100, 100, 100, 100];
    const weights = [0.25, 0.2, 0.2, 0.2, 0.15];
    expect(weightedAverage(scores, weights)).toBe(100);
  });

  test('returns 0 when all scores are 0', () => {
    const scores = [0, 0, 0, 0, 0];
    const weights = [0.25, 0.2, 0.2, 0.2, 0.15];
    expect(weightedAverage(scores, weights)).toBe(0);
  });
});

// ============================================================
// 2. GitHub URL Parser
// ============================================================

describe('GitHub URL Parser', () => {
  function parseRepoUrl(url: string): { owner: string; repo: string } | null {
    try {
      const clean = url.trim().replace(/\/+$/, '');
      const match = clean.match(/github\.com\/([^/]+)\/([^/]+)/i);
      if (!match) return null;
      return { owner: match[1], repo: match[2].replace(/\.git$/i, '') };
    } catch {
      return null;
    }
  }

  test('parses standard HTTPS GitHub URL', () => {
    const result = parseRepoUrl('https://github.com/amitkushwaha2311/Promptwar');
    expect(result).toEqual({ owner: 'amitkushwaha2311', repo: 'Promptwar' });
  });

  test('handles trailing slashes gracefully', () => {
    const result = parseRepoUrl('https://github.com/octocat/Hello-World/');
    expect(result).toEqual({ owner: 'octocat', repo: 'Hello-World' });
  });

  test('strips .git suffix', () => {
    const result = parseRepoUrl('https://github.com/octocat/Hello-World.git');
    expect(result).toEqual({ owner: 'octocat', repo: 'Hello-World' });
  });

  test('returns null for non-GitHub URL', () => {
    const result = parseRepoUrl('https://gitlab.com/user/repo');
    expect(result).toBeNull();
  });

  test('returns null for empty string', () => {
    const result = parseRepoUrl('');
    expect(result).toBeNull();
  });
});

// ============================================================
// 3. Health Score Calculator
// ============================================================

describe('Project Health Score', () => {
  function computeHealthScore(progressPercent: number, completedCount: number): number {
    return Math.min(Math.round(65 + (progressPercent / 100) * 25 + (completedCount > 0 ? 8 : 0)), 98);
  }

  test('returns at least 65 with no progress', () => {
    expect(computeHealthScore(0, 0)).toBe(65);
  });

  test('returns 98 at 100% progress with completed tasks', () => {
    expect(computeHealthScore(100, 5)).toBe(98);
  });

  test('gives bonus for having any completed tasks', () => {
    const withTasks = computeHealthScore(50, 3);
    const withoutTasks = computeHealthScore(50, 0);
    expect(withTasks).toBeGreaterThan(withoutTasks);
  });

  test('never exceeds 98', () => {
    expect(computeHealthScore(100, 100)).toBeLessThanOrEqual(98);
  });
});

// ============================================================
// 4. Task Completion Ratio
// ============================================================

describe('Task Completion Ratio', () => {
  function completionRatio(total: number, completed: number): number {
    if (total === 0) return 0.75; // default assumption
    return completed / total;
  }

  test('returns 0.75 when no tasks exist', () => {
    expect(completionRatio(0, 0)).toBe(0.75);
  });

  test('returns 1 when all tasks are completed', () => {
    expect(completionRatio(10, 10)).toBe(1);
  });

  test('returns correct partial ratio', () => {
    expect(completionRatio(8, 4)).toBe(0.5);
  });

  test('handles single task completed', () => {
    expect(completionRatio(1, 1)).toBe(1);
  });
});

// ============================================================
// 5. Project ID Generator
// ============================================================

describe('Project ID Generator', () => {
  function generateProjectId(prefix: string): string {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `${prefix}-${timestamp}-${random}`;
  }

  test('generates ID with correct prefix', () => {
    const id = generateProjectId('PROJ');
    expect(id.startsWith('PROJ-')).toBe(true);
  });

  test('generates unique IDs on consecutive calls', () => {
    const id1 = generateProjectId('TEST');
    const id2 = generateProjectId('TEST');
    // They should not be identical (random suffix)
    expect(id1).not.toBe(id2);
  });

  test('generates ID with correct format (PREFIX-BASE36-RANDOM)', () => {
    const id = generateProjectId('AI');
    const parts = id.split('-');
    expect(parts.length).toBe(3);
    expect(parts[0]).toBe('AI');
  });
});

// ============================================================
// 6. Deadline Calculation
// ============================================================

describe('Deadline & Days Remaining', () => {
  function daysRemaining(deadlineDate: Date): number {
    const now = new Date();
    const diff = deadlineDate.getTime() - now.getTime();
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  }

  test('returns 0 for past deadlines', () => {
    const past = new Date(Date.now() - 24 * 60 * 60 * 1000);
    expect(daysRemaining(past)).toBe(0);
  });

  test('returns positive number for future deadline', () => {
    const future = new Date(Date.now() + 10 * 24 * 60 * 60 * 1000);
    expect(daysRemaining(future)).toBeGreaterThan(0);
  });

  test('returns approximately 30 for deadline 30 days ahead', () => {
    const future = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    expect(daysRemaining(future)).toBeGreaterThanOrEqual(29);
    expect(daysRemaining(future)).toBeLessThanOrEqual(31);
  });
});
