namespace ReleaseManagerAPI.Dtos;

public class ProjectDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string? Code { get; set; }
    public string Status { get; set; } = "active"; // active, on_hold, completed, archived
    public Guid? TeamId { get; set; }
    public string? TeamName { get; set; } // Optional: Include team name for convenience
    public DateTime CreatedDate { get; set; }
    public DateTime UpdatedDate { get; set; }
}