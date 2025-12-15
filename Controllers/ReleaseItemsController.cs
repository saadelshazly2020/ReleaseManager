using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ReleaseManagerAPI.Data;
using ReleaseManagerAPI.Models;

namespace ReleaseManagerAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ReleaseItemsController : ControllerBase
{
    private readonly AppDbContext _context;

    public ReleaseItemsController(AppDbContext context) => _context = context;

    [HttpGet]
    public async Task<ActionResult<IEnumerable<ReleaseItem>>> GetAll() => await _context.ReleaseItems.OrderByDescending(ri => ri.CreatedDate).ToListAsync();

    [HttpGet("{id}")]
    public async Task<ActionResult<ReleaseItem>> GetById(Guid id)
    {
        var item = await _context.ReleaseItems.FindAsync(id);
        return item == null ? NotFound() : item;
    }

    [HttpGet("filter")]
    public async Task<ActionResult<IEnumerable<ReleaseItem>>> Filter([FromQuery] Guid? releaseId)
    {
        var query = _context.ReleaseItems.AsQueryable();
        if (releaseId.HasValue) query = query.Where(ri => ri.ReleaseId == releaseId);
        return await query.ToListAsync();
    }

    [HttpPost]
    public async Task<ActionResult<ReleaseItem>> Create(ReleaseItem item)
    {
        item.Id = Guid.NewGuid();
        item.CreatedDate = DateTime.UtcNow;
        item.UpdatedDate = DateTime.UtcNow;
        _context.ReleaseItems.Add(item);
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(GetById), new { id = item.Id }, item);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(Guid id, ReleaseItem item)
    {
        var existing = await _context.ReleaseItems.FindAsync(id);
        if (existing == null) return NotFound();

        existing.Title = item.Title;
        existing.Description = item.Description;
        existing.Type = item.Type;
        existing.ReleaseId = item.ReleaseId;
        existing.TicketNumber = item.TicketNumber;
        existing.Status = item.Status;
        existing.AssignedTo = item.AssignedTo;
        existing.UpdatedDate = DateTime.UtcNow;

        await _context.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var item = await _context.ReleaseItems.FindAsync(id);
        if (item == null) return NotFound();
        _context.ReleaseItems.Remove(item);
        await _context.SaveChangesAsync();
        return NoContent();
    }
}