namespace ReleaseManagerAPI.Models;

public class Project
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string? Code { get; set; }
    public string Status { get; set; } = "active"; // active, on_hold, completed, archived
    public Guid? TeamId { get; set; }
    public DateTime CreatedDate { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedDate { get; set; } = DateTime.UtcNow;
    public string? CreatedBy { get; set; }

    // Navigation
    public Team? Team { get; set; }
    public ICollection<Release> Releases { get; set; } = new List<Release>();
}

// Removed ProjectDto from this file to move it to an isolated file.