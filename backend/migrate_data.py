#!/usr/bin/env python3
"""
Migration script to convert existing hosts table to new systems/machines structure.
Run this after creating the new tables with alembic.
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from sqlalchemy import create_engine, text
from app.core.config import settings
from app.models.host import System, Machine
from app.db.session import SessionLocal

def migrate_hosts_to_systems():
    """Migrate existing hosts to a default system with machines."""
    
    # Create database engine
    engine = create_engine(settings.database_url)
    
    # Check if old hosts table exists
    with engine.connect() as conn:
        result = conn.execute(text("""
            SELECT EXISTS (
                SELECT FROM information_schema.tables 
                WHERE table_name = 'hosts'
            );
        """))
        hosts_table_exists = result.scalar()
        
        if not hosts_table_exists:
            print("No existing hosts table found. Migration not needed.")
            return
        
        # Check if new tables exist
        result = conn.execute(text("""
            SELECT EXISTS (
                SELECT FROM information_schema.tables 
                WHERE table_name = 'systems'
            );
        """))
        systems_table_exists = result.scalar()
        
        if not systems_table_exists:
            print("New systems table not found. Please run alembic migrations first.")
            return
    
    # Create a default system
    db = SessionLocal()
    try:
        # Check if default system already exists
        default_system = db.query(System).filter(System.name == "Default System").first()
        if not default_system:
            default_system = System(
                name="Default System",
                description="Migrated from existing hosts"
            )
            db.add(default_system)
            db.commit()
            db.refresh(default_system)
            print(f"Created default system: {default_system.name} (ID: {default_system.id})")
        else:
            print(f"Using existing default system: {default_system.name} (ID: {default_system.id})")
        
        # Migrate hosts to machines
        with engine.connect() as conn:
            # Get all hosts from old table
            result = conn.execute(text("SELECT id, name, address, created_at FROM hosts"))
            hosts = result.fetchall()
            
            migrated_count = 0
            for host in hosts:
                # Check if machine already exists
                existing_machine = db.query(Machine).filter(
                    Machine.ip_address == host.address
                ).first()
                
                if not existing_machine:
                    # Create new machine
                    machine = Machine(
                        name=host.name,
                        ip_address=host.address,
                        system_id=default_system.id,
                        created_at=host.created_at,
                        ssh_port=22,
                        is_alive=False,  # Will be updated on first health check
                        passing_unit_tests=True  # Default to True
                    )
                    db.add(machine)
                    migrated_count += 1
                    print(f"Migrated host: {host.name} ({host.address})")
                else:
                    print(f"Machine already exists for: {host.name} ({host.address})")
            
            db.commit()
            print(f"\nMigration complete! Migrated {migrated_count} hosts to machines.")
            
    except Exception as e:
        print(f"Migration failed: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    print("Starting migration from hosts to systems/machines...")
    migrate_hosts_to_systems()
    print("Migration script completed.") 