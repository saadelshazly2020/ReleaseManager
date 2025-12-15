namespace ReleaseManagerAPI.Models;

    public class Release
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public string Name { get; set; } = string.Empty;
        public string Version { get; set; } = string.Empty;
        public string Status { get; set; } = "planning"; // planning, in_progress, testing, ready_for_deployment, deployed, cancelled
        public string? Description { get; set; }
        public Guid? ProjectId { get; set; }
        public Guid? TeamId { get; set; }
        public DateTime? ScheduledDate { get; set; }
        public DateTime? DeployedDate { get; set; }
        public string? ReleaseNotes { get; set; }
        public string Priority { get; set; } = "medium"; // low, medium, high, critical
        public DateTime CreatedDate { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedDate { get; set; } = DateTime.UtcNow;
        public string? CreatedBy { get; set; }

        // Navigation
        public Project? Project { get; set; }
        public Team? Team { get; set; }
        public ICollection<ReleaseItem> ReleaseItems { get; set; } = new List<ReleaseItem>();
    }

