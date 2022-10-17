using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;

namespace ToDo.Models
{
    public partial class ToDoDbContext : DbContext
    {
        public ToDoDbContext()
        {
        }

        public ToDoDbContext(DbContextOptions<ToDoDbContext> options)
            : base(options)
        {
        }

        public virtual DbSet<Activity> Activities { get; set; } = null!;
        public virtual DbSet<User> Users { get; set; } = null!;

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see http://go.microsoft.com/fwlink/?LinkId=723263.
                optionsBuilder.UseMySql("server=localhost;port=3306;user=root;password=root;database=todo", Microsoft.EntityFrameworkCore.ServerVersion.Parse("10.9.2-mariadb"));
            }
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.UseCollation("utf8mb4_general_ci")
                .HasCharSet("utf8mb4");

            modelBuilder.Entity<Activity>(entity =>
            {
                entity.ToTable("activity");

                entity.HasCharSet("utf8mb3")
                    .UseCollation("utf8mb3_general_ci");

                entity.Property(e => e.Id).HasColumnType("int(10) unsigned");

                entity.Property(e => e.Name)
                    .HasMaxLength(50)
                    .UseCollation("utf32_thai_520_w2")
                    .HasCharSet("utf32");

                entity.Property(e => e.When).HasColumnType("datetime");
            });

            modelBuilder.Entity<User>(entity =>
            {
                entity.ToTable("user");

                entity.HasCharSet("utf8mb3")
                    .UseCollation("utf8mb3_general_ci");

                entity.Property(e => e.Id)
                    .HasMaxLength(13)
                    .UseCollation("utf8mb4_thai_520_w2")
                    .HasCharSet("utf8mb4");

                entity.Property(e => e.Password)
                    .HasMaxLength(44)
                    .UseCollation("utf8mb4_thai_520_w2")
                    .HasCharSet("utf8mb4");

                entity.Property(e => e.Salt)
                    .HasMaxLength(24)
                    .UseCollation("utf8mb4_thai_520_w2")
                    .HasCharSet("utf8mb4");
            });

            OnModelCreatingPartial(modelBuilder);
        }

        partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
    }
}
