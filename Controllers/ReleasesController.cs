using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ReleaseManagerAPI.Data;
using ReleaseManagerAPI.Models;

namespace ReleaseManagerAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ReleasesController : ControllerBase
{
    private readonly AppDbContext _context;

    public ReleasesController(AppDbContext context) => _context = context;

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Release>>> GetAll([FromQuery] string? sort = "-created_date")
    {
        var query = _context.Releases.AsQueryable();
        query = sort == "-created_date"
            ? query.OrderByDescending(r => r.CreatedDate)
            : query.OrderBy(r => r.CreatedDate);
        return await query.ToListAsync();
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Release>> GetById(Guid id)
    {
        var release = await _context.Releases.FindAsync(id);
        return release == null ? NotFound() : release;
    }

    [HttpGet("filter")]
    public async Task<ActionResult<IEnumerable<Release>>> Filter([FromQuery] Guid? releaseId, [FromQuery] string? status)
    {
        var query = _context.Releases.AsQueryable();
        if (releaseId.HasValue) query = query.Where(r => r.Id == releaseId);
        if (!string.IsNullOrEmpty(status)) query = query.Where(r => r.Status == status);
        return await query.ToListAsync();
    }

    [HttpPost]
    public async Task<ActionResult<Release>> Create(Release release)
    {
        release.Id = Guid.NewGuid();
        release.CreatedDate = DateTime.UtcNow;
        release.UpdatedDate = DateTime.UtcNow;
        _context.Releases.Add(release);
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(GetById), new { id = release.Id }, release);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(Guid id, Release release)
    {
        var existing = await _context.Releases.FindAsync(id);
        if (existing == null) return NotFound();

        existing.Name = release.Name;
        existing.Version = release.Version;
        existing.Status = release.Status;
        existing.Description = release.Description;
        existing.ProjectId = release.ProjectId;
        existing.TeamId = release.TeamId;
        existing.ScheduledDate = release.ScheduledDate;
        existing.DeployedDate = release.DeployedDate;
        existing.ReleaseNotes = release.ReleaseNotes;
        existing.Priority = release.Priority;
        existing.UpdatedDate = DateTime.UtcNow;

        await _context.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var release = await _context.Releases.FindAsync(id);
        if (release == null) return NotFound();
        _context.Releases.Remove(release);
        await _context.SaveChangesAsync();
        return NoContent();
    }
}
