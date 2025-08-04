"""rename_systems_to_clusters_and_machines_to_nodes

Revision ID: 0fe7eefa304a
Revises: 966c3dcc1481
Create Date: 2025-08-03 14:50:43.830232

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '0fe7eefa304a'
down_revision: Union[str, Sequence[str], None] = '966c3dcc1481'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    # Rename tables
    op.rename_table('systems', 'clusters')
    op.rename_table('machines', 'nodes')
    
    # Update foreign key constraint in nodes table
    op.drop_constraint('machines_system_id_fkey', 'nodes', type_='foreignkey')
    op.alter_column('nodes', 'system_id', new_column_name='cluster_id')
    op.create_foreign_key('nodes_cluster_id_fkey', 'nodes', 'clusters', ['cluster_id'], ['id'])


def downgrade() -> None:
    """Downgrade schema."""
    # Revert foreign key constraint in nodes table
    op.drop_constraint('nodes_cluster_id_fkey', 'nodes', type_='foreignkey')
    op.alter_column('nodes', 'cluster_id', new_column_name='system_id')
    op.create_foreign_key('machines_system_id_fkey', 'nodes', 'clusters', ['system_id'], ['id'])
    
    # Rename tables back
    op.rename_table('clusters', 'systems')
    op.rename_table('nodes', 'machines')
