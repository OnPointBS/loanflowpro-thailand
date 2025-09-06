import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Get workspace analytics overview
export const getWorkspaceAnalytics = query({
  args: { workspaceId: v.id("workspaces") },
  handler: async (ctx, args) => {
    const { workspaceId } = args;

    // Get all data for the workspace
    const [clients, loanFiles, tasks, documents, users, invitations] = await Promise.all([
      ctx.db.query("clients").filter((q) => q.eq(q.field("workspaceId"), workspaceId)).collect(),
      ctx.db.query("loanFiles").filter((q) => q.eq(q.field("workspaceId"), workspaceId)).collect(),
      ctx.db.query("tasks").filter((q) => q.eq(q.field("workspaceId"), workspaceId)).collect(),
      ctx.db.query("documents").filter((q) => q.eq(q.field("workspaceId"), workspaceId)).collect(),
      ctx.db.query("users").filter((q) => q.eq(q.field("workspaceId"), workspaceId)).collect(),
      ctx.db.query("userInvitations").filter((q) => q.eq(q.field("workspaceId"), workspaceId)).collect(),
    ]);

    // Calculate client analytics
    const clientStats = {
      total: clients.length,
      active: clients.filter(c => c.status === "active").length,
      prospects: clients.filter(c => c.status === "prospect").length,
      inactive: clients.filter(c => c.status === "inactive").length,
      bySource: clients.reduce((acc, client) => {
        const source = client.source || "manual";
        acc[source] = (acc[source] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
    };

    // Calculate loan file analytics
    const loanFileStats = {
      total: loanFiles.length,
      byStatus: loanFiles.reduce((acc, file) => {
        acc[file.status] = (acc[file.status] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      byPriority: loanFiles.reduce((acc, file) => {
        acc[file.priority] = (acc[file.priority] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      totalAmount: loanFiles.reduce((sum, file) => sum + (file.amount || 0), 0),
      averageAmount: loanFiles.length > 0 ? loanFiles.reduce((sum, file) => sum + (file.amount || 0), 0) / loanFiles.length : 0,
      averageProgress: loanFiles.length > 0 ? loanFiles.reduce((sum, file) => sum + file.progress, 0) / loanFiles.length : 0,
    };

    // Calculate task analytics
    const taskStats = {
      total: tasks.length,
      byStatus: tasks.reduce((acc, task) => {
        acc[task.status] = (acc[task.status] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      byPriority: tasks.reduce((acc, task) => {
        acc[task.priority] = (acc[task.priority] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      clientTasks: tasks.filter(t => t.isClientTask).length,
      staffTasks: tasks.filter(t => t.isStaffTask).length,
      overdue: tasks.filter(t => t.dueDate && t.dueDate < Date.now() && t.status !== "completed").length,
      completed: tasks.filter(t => t.status === "completed").length,
      completionRate: tasks.length > 0 ? (tasks.filter(t => t.status === "completed").length / tasks.length) * 100 : 0,
    };

    // Calculate document analytics
    const documentStats = {
      total: documents.length,
      byCategory: documents.reduce((acc, doc) => {
        acc[doc.category] = (acc[doc.category] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      totalSize: documents.reduce((sum, doc) => sum + doc.size, 0),
      averageSize: documents.length > 0 ? documents.reduce((sum, doc) => sum + doc.size, 0) / documents.length : 0,
    };

    // Calculate user analytics
    const userStats = {
      total: users.length,
      byRole: users.reduce((acc, user) => {
        acc[user.role] = (acc[user.role] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      byStatus: users.reduce((acc, user) => {
        acc[user.status] = (acc[user.status] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      active: users.filter(u => u.status === "active").length,
    };

    // Calculate invitation analytics
    const invitationStats = {
      total: invitations.length,
      byType: invitations.reduce((acc, inv) => {
        acc[inv.invitationType] = (acc[inv.invitationType] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      byStatus: invitations.reduce((acc, inv) => {
        acc[inv.status] = (acc[inv.status] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      pending: invitations.filter(i => i.status === "pending").length,
      accepted: invitations.filter(i => i.status === "accepted").length,
      acceptanceRate: invitations.length > 0 ? (invitations.filter(i => i.status === "accepted").length / invitations.length) * 100 : 0,
    };

    // Calculate growth metrics (last 30 days)
    const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000);
    const recentClients = clients.filter(c => c.createdAt >= thirtyDaysAgo).length;
    const recentLoanFiles = loanFiles.filter(f => f.createdAt >= thirtyDaysAgo).length;
    const recentTasks = tasks.filter(t => t.createdAt >= thirtyDaysAgo).length;

    return {
      clientStats,
      loanFileStats,
      taskStats,
      documentStats,
      userStats,
      invitationStats,
      growth: {
        clientsLast30Days: recentClients,
        loanFilesLast30Days: recentLoanFiles,
        tasksLast30Days: recentTasks,
      },
      generatedAt: Date.now(),
    };
  },
});

// Get staff performance analytics
export const getStaffPerformance = query({
  args: { workspaceId: v.id("workspaces") },
  handler: async (ctx, args) => {
    const { workspaceId } = args;

    // Get all staff users
    const staffUsers = await ctx.db
      .query("users")
      .filter((q) => q.and(
        q.eq(q.field("workspaceId"), workspaceId),
        q.or(
          q.eq(q.field("role"), "advisor"),
          q.eq(q.field("role"), "staff")
        )
      ))
      .collect();

    // Get tasks assigned to staff
    const staffTasks = await ctx.db
      .query("tasks")
      .filter((q) => q.and(
        q.eq(q.field("workspaceId"), workspaceId),
        q.eq(q.field("isStaffTask"), true)
      ))
      .collect();

    // Calculate performance for each staff member
    const staffPerformance = staffUsers.map(user => {
      const userTasks = staffTasks.filter(task => 
        task.assignedTo === user._id || 
        (typeof task.assignedTo === "string" && task.assignedTo === "staff")
      );

      const completedTasks = userTasks.filter(task => task.status === "completed");
      const overdueTasks = userTasks.filter(task => 
        task.dueDate && task.dueDate < Date.now() && task.status !== "completed"
      );

      return {
        userId: user._id,
        name: user.profile.firstName + " " + user.profile.lastName,
        email: user.email,
        role: user.role,
        totalTasks: userTasks.length,
        completedTasks: completedTasks.length,
        overdueTasks: overdueTasks.length,
        completionRate: userTasks.length > 0 ? (completedTasks.length / userTasks.length) * 100 : 0,
        averageCompletionTime: completedTasks.length > 0 ? 
          completedTasks.reduce((sum, task) => {
            if (task.completedAt && task.createdAt) {
              return sum + (task.completedAt - task.createdAt);
            }
            return sum;
          }, 0) / completedTasks.length : 0,
        lastActive: user.lastActiveAt || user.updatedAt,
      };
    });

    return staffPerformance;
  },
});

// Get loan file pipeline analytics
export const getLoanFilePipeline = query({
  args: { workspaceId: v.id("workspaces") },
  handler: async (ctx, args) => {
    const { workspaceId } = args;

    const loanFiles = await ctx.db
      .query("loanFiles")
      .filter((q) => q.eq(q.field("workspaceId"), workspaceId))
      .collect();

    // Group by status and calculate metrics
    const pipeline = {
      draft: loanFiles.filter(f => f.status === "draft"),
      inProgress: loanFiles.filter(f => f.status === "in_progress"),
      underReview: loanFiles.filter(f => f.status === "under_review"),
      approved: loanFiles.filter(f => f.status === "approved"),
      funded: loanFiles.filter(f => f.status === "funded"),
      declined: loanFiles.filter(f => f.status === "declined"),
      cancelled: loanFiles.filter(f => f.status === "cancelled"),
    };

    // Calculate conversion rates
    const totalProcessed = loanFiles.length - pipeline.draft.length;
    const conversionRates = {
      toInProgress: totalProcessed > 0 ? (pipeline.inProgress.length / totalProcessed) * 100 : 0,
      toUnderReview: totalProcessed > 0 ? (pipeline.underReview.length / totalProcessed) * 100 : 0,
      toApproved: totalProcessed > 0 ? (pipeline.approved.length / totalProcessed) * 100 : 0,
      toFunded: totalProcessed > 0 ? (pipeline.funded.length / totalProcessed) * 100 : 0,
      overall: totalProcessed > 0 ? (pipeline.funded.length / totalProcessed) * 100 : 0,
    };

    // Calculate average time in each stage
    const stageTimes = {
      draftToInProgress: calculateAverageStageTime(pipeline.draft, pipeline.inProgress),
      inProgressToUnderReview: calculateAverageStageTime(pipeline.inProgress, pipeline.underReview),
      underReviewToApproved: calculateAverageStageTime(pipeline.underReview, pipeline.approved),
      approvedToFunded: calculateAverageStageTime(pipeline.approved, pipeline.funded),
    };

    return {
      pipeline,
      conversionRates,
      stageTimes,
      totalFiles: loanFiles.length,
      totalAmount: loanFiles.reduce((sum, f) => sum + (f.amount || 0), 0),
      averageAmount: loanFiles.length > 0 ? loanFiles.reduce((sum, f) => sum + (f.amount || 0), 0) / loanFiles.length : 0,
    };
  },
});

// Get client engagement analytics
export const getClientEngagement = query({
  args: { workspaceId: v.id("workspaces") },
  handler: async (ctx, args) => {
    const { workspaceId } = args;

    const clients = await ctx.db
      .query("clients")
      .filter((q) => q.eq(q.field("workspaceId"), workspaceId))
      .collect();

    const loanFiles = await ctx.db
      .query("loanFiles")
      .filter((q) => q.eq(q.field("workspaceId"), workspaceId))
      .collect();

    const tasks = await ctx.db
      .query("tasks")
      .filter((q) => q.and(
        q.eq(q.field("workspaceId"), workspaceId),
        q.eq(q.field("isClientTask"), true)
      ))
      .collect();

    // Calculate engagement metrics for each client
    const clientEngagement = clients.map(client => {
      const clientLoanFiles = loanFiles.filter(f => f.clientId === client._id);
      const clientTasks = tasks.filter(t => t.clientId === client._id);
      const completedTasks = clientTasks.filter(t => t.status === "completed");

      return {
        clientId: client._id,
        name: client.name,
        email: client.email,
        status: client.status,
        loanFileCount: clientLoanFiles.length,
        taskCount: clientTasks.length,
        completedTaskCount: completedTasks.length,
        taskCompletionRate: clientTasks.length > 0 ? (completedTasks.length / clientTasks.length) * 100 : 0,
        averageLoanAmount: clientLoanFiles.length > 0 ? 
          clientLoanFiles.reduce((sum, f) => sum + (f.amount || 0), 0) / clientLoanFiles.length : 0,
        lastActivity: Math.max(
          client.updatedAt,
          ...clientLoanFiles.map(f => f.updatedAt),
          ...clientTasks.map(t => t.updatedAt)
        ),
        engagementScore: calculateEngagementScore(client, clientLoanFiles, clientTasks),
      };
    });

    // Sort by engagement score
    clientEngagement.sort((a, b) => b.engagementScore - a.engagementScore);

    return {
      clients: clientEngagement,
      averageEngagementScore: clientEngagement.length > 0 ? 
        clientEngagement.reduce((sum, c) => sum + c.engagementScore, 0) / clientEngagement.length : 0,
      highEngagementClients: clientEngagement.filter(c => c.engagementScore >= 70).length,
      lowEngagementClients: clientEngagement.filter(c => c.engagementScore < 30).length,
    };
  },
});

// Helper function to calculate average stage time
function calculateAverageStageTime(fromStage: any[], toStage: any[]): number {
  if (fromStage.length === 0 || toStage.length === 0) return 0;
  
  const times = toStage
    .map(file => {
      const fromFile = fromStage.find(f => f.clientId === file.clientId);
      if (fromFile && file.createdAt > fromFile.createdAt) {
        return file.createdAt - fromFile.createdAt;
      }
      return null;
    })
    .filter(time => time !== null) as number[];

  return times.length > 0 ? times.reduce((sum, time) => sum + time, 0) / times.length : 0;
}

// Helper function to calculate engagement score
function calculateEngagementScore(client: any, loanFiles: any[], tasks: any[]): number {
  let score = 0;
  
  // Base score for client status
  if (client.status === "active") score += 30;
  else if (client.status === "prospect") score += 15;
  
  // Score for loan file activity
  if (loanFiles.length > 0) {
    score += Math.min(loanFiles.length * 10, 30);
    const recentLoanFiles = loanFiles.filter(f => f.updatedAt > Date.now() - (30 * 24 * 60 * 60 * 1000));
    score += recentLoanFiles.length * 5;
  }
  
  // Score for task completion
  if (tasks.length > 0) {
    const completedTasks = tasks.filter(t => t.status === "completed");
    const completionRate = completedTasks.length / tasks.length;
    score += completionRate * 25;
  }
  
  // Score for recent activity
  const lastActivity = Math.max(
    client.updatedAt,
    ...loanFiles.map(f => f.updatedAt),
    ...tasks.map(t => t.updatedAt)
  );
  
  const daysSinceActivity = (Date.now() - lastActivity) / (24 * 60 * 60 * 1000);
  if (daysSinceActivity < 7) score += 15;
  else if (daysSinceActivity < 30) score += 10;
  else if (daysSinceActivity < 90) score += 5;
  
  return Math.min(score, 100);
}
