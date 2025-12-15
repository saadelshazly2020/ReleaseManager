using ReleaseManagerAPI.Models;

namespace ReleaseManagerAPI.Data;

public static class DbSeeder
{
    public static void SeedData(AppDbContext context)
    {
        if (context.Teams.Any()) return; // Already seeded

        // Seed Teams
        var frontendTeam = new Team
        {
            Id = Guid.NewGuid(),
            Name = "Frontend Team",
            Description = "Responsible for UI/UX development",
            Lead = "Sarah Johnson",
            MembersCount = 5,
            Color = "#3B82F6"
        };

        var backendTeam = new Team
        {
            Id = Guid.NewGuid(),
            Name = "Backend Team",
            Description = "API and server-side development",
            Lead = "Michael Chen",
            MembersCount = 4,
            Color = "#10B981"
        };

        var devopsTeam = new Team
        {
            Id = Guid.NewGuid(),
            Name = "DevOps Team",
            Description = "Infrastructure and deployment",
            Lead = "Alex Martinez",
            MembersCount = 3,
            Color = "#8B5CF6"
        };

        var mobileTeam = new Team
        {
            Id = Guid.NewGuid(),
            Name = "Mobile Team",
            Description = "iOS and Android development",
            Lead = "Emily Brown",
            MembersCount = 4,
            Color = "#F59E0B"
        };

        context.Teams.AddRange(frontendTeam, backendTeam, devopsTeam, mobileTeam);

        // Seed Projects
        var customerPortal = new Project
        {
            Id = Guid.NewGuid(),
            Name = "Customer Portal",
            Description = "Web-based customer management system",
            Code = "CP",
            Status = "active",
            TeamId = frontendTeam.Id
        };

        var mobileApp = new Project
        {
            Id = Guid.NewGuid(),
            Name = "Mobile App",
            Description = "Native mobile application for iOS and Android",
            Code = "MA",
            Status = "active",
            TeamId = mobileTeam.Id
        };

        var analyticsPlatform = new Project
        {
            Id = Guid.NewGuid(),
            Name = "Analytics Platform",
            Description = "Data analytics and reporting system",
            Code = "AP",
            Status = "active",
            TeamId = backendTeam.Id
        };

        var apiGateway = new Project
        {
            Id = Guid.NewGuid(),
            Name = "API Gateway",
            Description = "Central API management and routing",
            Code = "AG",
            Status = "on_hold",
            TeamId = devopsTeam.Id
        };

        context.Projects.AddRange(customerPortal, mobileApp, analyticsPlatform, apiGateway);

        // Seed Releases
        var spring2025 = new Release
        {
            Id = Guid.NewGuid(),
            Name = "Spring 2025 Release",
            Version = "3.1.0",
            Status = "in_progress",
            Description = "Major feature updates and performance improvements",
            Priority = "high",
            ScheduledDate = new DateTime(2025, 3, 15),
            ProjectId = customerPortal.Id,
            TeamId = frontendTeam.Id
        };

        var q4Security = new Release
        {
            Id = Guid.NewGuid(),
            Name = "Q4 Security Update",
            Version = "3.0.5",
            Status = "ready_for_deployment",
            Description = "Critical security patches and bug fixes",
            Priority = "critical",
            ScheduledDate = new DateTime(2025, 1, 10),
            ProjectId = apiGateway.Id,
            TeamId = backendTeam.Id
        };

        var mobileV2 = new Release
        {
            Id = Guid.NewGuid(),
            Name = "Mobile v2.0",
            Version = "2.0.0",
            Status = "testing",
            Description = "Complete redesign of mobile experience",
            Priority = "high",
            ScheduledDate = new DateTime(2025, 2, 20),
            ProjectId = mobileApp.Id,
            TeamId = mobileTeam.Id
        };

        var analyticsDashboard = new Release
        {
            Id = Guid.NewGuid(),
            Name = "Analytics Dashboard",
            Version = "1.5.0",
            Status = "deployed",
            Description = "New analytics features and charts",
            Priority = "medium",
            ScheduledDate = new DateTime(2024, 12, 1),
            DeployedDate = new DateTime(2024, 12, 5),
            ProjectId = analyticsPlatform.Id,
            TeamId = backendTeam.Id
        };

        var hotfixDec = new Release
        {
            Id = Guid.NewGuid(),
            Name = "Hotfix Dec 2024",
            Version = "3.0.4",
            Status = "deployed",
            Description = "Emergency bug fixes",
            Priority = "critical",
            ScheduledDate = new DateTime(2024, 11, 28),
            DeployedDate = new DateTime(2024, 11, 29),
            ProjectId = customerPortal.Id,
            TeamId = devopsTeam.Id
        };

        var summerFeatures = new Release
        {
            Id = Guid.NewGuid(),
            Name = "Summer Feature Pack",
            Version = "3.2.0",
            Status = "planning",
            Description = "New features planned for summer",
            Priority = "medium",
            ScheduledDate = new DateTime(2025, 6, 15),
            ProjectId = customerPortal.Id,
            TeamId = frontendTeam.Id
        };

        context.Releases.AddRange(spring2025, q4Security, mobileV2, analyticsDashboard, hotfixDec, summerFeatures);

        // Seed Release Items
        context.ReleaseItems.AddRange(
            new ReleaseItem
            {
                Title = "Add dark mode support",
                Description = "Implement system-wide dark theme with toggle",
                Type = "feature",
                Status = "in_progress",
                TicketNumber = "JIRA-234",
                AssignedTo = "Sarah Johnson",
                ReleaseId = spring2025.Id
            },
            new ReleaseItem
            {
                Title = "Fix login timeout issue",
                Description = "Users getting logged out too frequently",
                Type = "bug_fix",
                Status = "completed",
                TicketNumber = "JIRA-189",
                AssignedTo = "Michael Chen",
                ReleaseId = q4Security.Id
            },
            new ReleaseItem
            {
                Title = "Optimize database queries",
                Description = "Improve query performance for large datasets",
                Type = "improvement",
                Status = "in_progress",
                TicketNumber = "JIRA-245",
                AssignedTo = "Michael Chen",
                ReleaseId = spring2025.Id
            },
            new ReleaseItem
            {
                Title = "Update API authentication method",
                Description = "Migrate from JWT to OAuth 2.0",
                Type = "breaking_change",
                Status = "pending",
                TicketNumber = "JIRA-256",
                AssignedTo = "Alex Martinez",
                ReleaseId = q4Security.Id
            },
            new ReleaseItem
            {
                Title = "Patch SQL injection vulnerability",
                Description = "Fix critical security flaw in user input handling",
                Type = "security",
                Status = "completed",
                TicketNumber = "SEC-012",
                AssignedTo = "Michael Chen",
                ReleaseId = q4Security.Id
            },
            new ReleaseItem
            {
                Title = "Add API usage examples",
                Description = "Create comprehensive API documentation",
                Type = "documentation",
                Status = "completed",
                TicketNumber = "DOC-045",
                AssignedTo = "Emily Brown",
                ReleaseId = analyticsDashboard.Id
            },
            new ReleaseItem
            {
                Title = "Implement push notifications",
                Description = "Add real-time notifications to mobile app",
                Type = "feature",
                Status = "in_progress",
                TicketNumber = "JIRA-267",
                AssignedTo = "Emily Brown",
                ReleaseId = mobileV2.Id
            },
            new ReleaseItem
            {
                Title = "Fix crash on iOS 17",
                Description = "App crashes on latest iOS version",
                Type = "bug_fix",
                Status = "completed",
                TicketNumber = "JIRA-278",
                AssignedTo = "Emily Brown",
                ReleaseId = mobileV2.Id
            },
            new ReleaseItem
            {
                Title = "Add export to CSV feature",
                Description = "Allow users to export data as CSV files",
                Type = "feature",
                Status = "pending",
                TicketNumber = "JIRA-289",
                AssignedTo = "Sarah Johnson",
                ReleaseId = summerFeatures.Id
            },
            new ReleaseItem
            {
                Title = "Improve page load speed",
                Description = "Reduce initial page load time by 40%",
                Type = "improvement",
                Status = "completed",
                TicketNumber = "JIRA-298",
                AssignedTo = "Alex Martinez",
                ReleaseId = hotfixDec.Id
            }
        );

        context.SaveChanges();
    }
}