using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ReleaseManagerAPI.Data;
using ReleaseManagerAPI.Models;

namespace ReleaseManagerAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TeamsController : ControllerBase
{
    private readonly AppDbContext _context;

    public TeamsController(AppDbContext context) => _context = context;

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Team>>> GetAll() => await _context.Teams.OrderByDescending(t => t.CreatedDate).ToListAsync();

    [HttpGet("{id}")]
    public async Task<ActionResult<Team>> GetById(Guid id)
    {
        var team = await _context.Teams.FindAsync(id);
        return team == null ? NotFound() : team;
    }

    [HttpPost]
    public async Task<ActionResult<Team>> Create(Team team)
    {
        team.Id = Guid.NewGuid();
        team.CreatedDate = DateTime.UtcNow;
        team.UpdatedDate = DateTime.UtcNow;
        _context.Teams.Add(team);
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(GetById), new { id = team.Id }, team);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(Guid id, Team team)
    {
        var existing = await _context.Teams.FindAsync(id);
        if (existing == null) return NotFound();

        existing.Name = team.Name;
        existing.Description = team.Description;
        existing.Lead = team.Lead;
        existing.MembersCount = team.MembersCount;
        existing.Color = team.Color;
        existing.UpdatedDate = DateTime.UtcNow;

        await _context.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var team = await _context.Teams.FindAsync(id);
        if (team == null) return NotFound();
        _context.Teams.Remove(team);
        await _context.SaveChangesAsync();
        return NoContent();
    }
}