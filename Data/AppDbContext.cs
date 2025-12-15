using Microsoft.EntityFrameworkCore;
using ReleaseManagerAPI.Models;
using System.Collections.Generic;
using System.Reflection.Emit;

namespace ReleaseManagerAPI.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<Release> Releases => Set<Release>();
    public DbSet<Project> Projects => Set<Project>();
    public DbSet<Team> Teams => Set<Team>();
    public DbSet<ReleaseItem> ReleaseItems => Set<ReleaseItem>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Release>()
            .HasOne(r => r.Project)
            .WithMany(p => p.Releases)
            .HasForeignKey(r => r.ProjectId);

        modelBuilder.Entity<Release>()
            .HasOne(r => r.Team)
            .WithMany(t => t.Releases)
            .HasForeignKey(r => r.TeamId);

        modelBuilder.Entity<ReleaseItem>()
            .HasOne(ri => ri.Release)
            .WithMany(r => r.ReleaseItems)
            .HasForeignKey(ri => ri.ReleaseId);

        modelBuilder.Entity<Project>()
            .HasOne(p => p.Team)
            .WithMany(t => t.Projects)
            .HasForeignKey(p => p.TeamId);
    }
}