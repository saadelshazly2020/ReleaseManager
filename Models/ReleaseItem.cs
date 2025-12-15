namespace ReleaseManagerAPI.Models;

public class ReleaseItem
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string Type { get; set; } = "feature"; // feature, bug_fix, improvement, breaking_change, security, documentation
    public Guid? ReleaseId { get; set; }
    public string? TicketNumber { get; set; }
    public string Status { get; set; } = "pending"; // pending, in_progress, completed, cancelled
    public string? AssignedTo { get; set; }
    public DateTime CreatedDate { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedDate { get; set; } = DateTime.UtcNow;
    public string? CreatedBy { get; set; }

    // Navigation
    public Release? Release { get; set; }
}