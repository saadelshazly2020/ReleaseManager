using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ReleaseManagerAPI.Data;
using ReleaseManagerAPI.Models;

namespace ReleaseManagerAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProjectsController : ControllerBase
{
    private readonly AppDbContext _context;

    public ProjectsController(AppDbContext context) => _context = context;

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Project>>> GetAll() => await _context.Projects.OrderByDescending(p => p.CreatedDate).ToListAsync();

    [HttpGet("{id}")]
    public async Task<ActionResult<Project>> GetById(Guid id)
    {
        var project = await _context.Projects.FindAsync(id);
        return project == null ? NotFound() : project;
    }

    [HttpPost]
    public async Task<ActionResult<Project>> Create([FromBody] Project project)
    {
        project.Id = Guid.NewGuid();
        project.CreatedDate = DateTime.UtcNow;
        project.UpdatedDate = DateTime.UtcNow;
        _context.Projects.Add(project);
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(GetById), new { id = project.Id }, project);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(Guid id, Project project)
    {
        var existing = await _context.Projects.FindAsync(id);
        if (existing == null) return NotFound();

        existing.Name = project.Name;
        existing.Description = project.Description;
        existing.Code = project.Code;
        existing.Status = project.Status;
        existing.TeamId = project.TeamId;
        existing.UpdatedDate = DateTime.UtcNow;

        await _context.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var project = await _context.Projects.FindAsync(id);
        if (project == null) return NotFound();
        _context.Projects.Remove(project);
        await _context.SaveChangesAsync();
        return NoContent();
    }
}